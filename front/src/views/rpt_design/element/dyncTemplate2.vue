<template>
	<div :id="'cr_dyn_id_'+context.mode+'_'+id_name" ref='target'
  style="width:100%;height:100%; flex: 1;display:flex;" 
  >
  <div style="width:100%;height:100%; flex: 1;" ></div>
	</div>
</template>

<script>
import {insert_css_to_head,extract_style_txt,extract_script_txt,select_field_data,test_data } from "../utils/util"
let base_tool=require('../utils/util.js')
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins2"
export default {
  name:"dync-template",
  mixins:[mixins,dyncTemplateMinxins],
  data: () => ({
    name: "Mellow", 
  }),
  props:['parentCompent'],
  mounted(){
      this.parse_content()
  },
  beforeDestroy(){
      this.inner_element?.$destroy()
      //console.info(this.self.gridName,'inner_element?.$destroy()')
  },
  methods: {
    
    parse_content(){
      if(this.inner_element?.$destroy){
          this.inner_element?.$destroy(true)
          this.$refs.target.innerHTML = `<div style="width:100%;height:100%; flex: 1;" ></div>`;
      }
      let _this=this 
      let tmp=_this.self.content.replaceAll("dync_script>","script>")                
      let script_txt=extract_script_txt(tmp)
      //https://github.com/JonWatkins/vue-runtime-template-compiler/blob/master/src/components/RuntimeTemplateCompiler.vue
      //script_txt=script_txt.replace(/function\s*(\w+)\s*/img,'_this.$1=_this.$options.methods.$1=function')
      script_txt=script_txt.replace(/export\s+default*/img,'return ')
      
      let style=extract_style_txt(tmp).trim()
      style=style.replace(/([^{]+)\{[\s|\S]*?\}/img,
      function(t1,t2,t3,t4) {
          return t2.trim().split(",").map(x=>'#cr_dyn_id_'+_this.context.mode+'_'+_this.id_name+" "+x).join() + t1.substring( t1.indexOf("{") ) +'\n'
          //console.log(t1,t2,t3,t4)
      }
      )
      if(style!=""){
        const css_node = document.createElement('style');
        //css_node.id = id;
        css_node.type="text/css"
        css_node.appendChild(document.createTextNode(style))
        this.$refs.target.appendChild(css_node)
      } 
      let tool=base_tool
      let t_vue_obj=eval("(function(){\n"+script_txt+"\n})()")
      if(!t_vue_obj)
          t_vue_obj={}
      
      let start_pos=tmp.indexOf("<template>")
      if(start_pos>=0){
          tmp=tmp.substring(
              start_pos+'<template>'.length
              ,tmp.lastIndexOf("</template>")
          )
      }else{
          tmp=tmp.replace(/<script.*?>*?>([\s\S]*?)<\/script>/img,'')
              .replace(/<style.*?>*?>([\s\S]*?)<\/style>/img,'')
      }
      t_vue_obj.template=tmp.replace(/<t>(.*?)<\/t>/img,function(all,one,pos){
          if(_this.self.option && _this.self.option[one]!=undefined){
              if(_this.self.option[one].startsWith('=')){
                  return _this.self.option[one].slice(1)
              }
              else{
                  return "'" + _this.self.option[one] +"'"
              }
          }
          if(_this.self.type=="text" && one=="value"){
              if(_this.self.label.startsWith('=')){
                  return _this.self.label.slice(1)
              }
              else{
                  return "'" + _this.self.label +"'"
              }
          }
          return "undefined"
      })
      
      if(tool.getObjType( t_vue_obj.data)!="function")
      {
          let t=t_vue_obj.data??{}
          t_vue_obj.data=function(){return t}
      }

      t_vue_obj.mixins=[mixins,dyncTemplateMinxins]
      if(tool.getObjType(this.parentCompent)=="object"){
          let parent_mixin={
              data(){
                  if(_this.parentCompent.$data)
                      return _this.parentCompent.$data??{}
                  else if (_this.parentCompent.data){
                      if( tool.getObjType( _this.parentCompent.data)=="function")
                          return _this.parentCompent.data()
                      else
                          return _this.parentCompent.data
                  }
              },
              computed:_this.parentCompent.$options?.computed??_this.parentCompent.computed??{},
              methods:_this.parentCompent.$options?.methods??_this.parentCompent.methods??{},
              watched:_this.parentCompent.$options?.watched??{},
          }
          t_vue_obj.mixins.push(parent_mixin)
      }
      
      t_vue_obj.parent=this
      t_vue_obj.name=this.self.gridName
      // 创建构造器创建实例挂载
      let ElementC = Vue.extend(t_vue_obj)
      this.inner_element = new ElementC()
      Object.assign(this.inner_element.$props,this.$props)
      this.inner_element.inner_element=false
      this.old_content=this.self.content
      this.old_parentCompent=this.parentCompent
      
      this.inner_element.$mount(this.$refs.target.children[0])
      //this.$refs.target.appendChild(this.inner_element.$el)
    },
    refresh(){
        if(this.old_parentCompent!=this.parentCompent || this.old_content!=this.self.content)
        {
            this.parse_content()
        }
    }
  },
  watch: { 
        "self":{
            handler(val,oldVal){
                if(this.context.mode=='design' || this.context.mode=='conf')
                this.parse_content()
            },deep:true
        },         
    },
};
</script>