import {seriesLoadScripts,load_css_js,insert_css_to_head,extract_style_txt,extract_script_txt,load_css_file } from "../utils/util"
export default {
    provide(){
        let ret={
            context: this._context,
            fresh_ele:this._fresh_ele,
            clickedEle:this._clickedEle
        }
        
        if(this._context?.report_result?.zb_var)
            ret={...this._context.report_result.zb_var,...ret}
        if(this._context?.report?.zb_var)
            ret={...this._context.report.zb_var,...ret}
        return ret
    },
    data: () => ({
        parentCompent:this, 
        old_content:"",
        cut_script_css_content:"",
    }),
    mounted(){
        let _this=this
        if(this.self.type.startsWith("Data") && window.AVUE==undefined){
            load_css_file("cdn/avue/2.8.1/index.css")
            seriesLoadScripts("cdn/avue/2.8.1/avue.min.js",null,function(){
                _this.refresh()
            })
        }
        else
            _this.refresh()
    },
    computed: { 
        _context(){
            return this.context
        }, 
        _fresh_ele(){
            return this.fresh_ele
        }, 
        _clickedEle(){
            return this.clickedEle
        }, 
        id_name(){
            return (this.self.gridName!='_random_'? this.self.gridName:this.self.type)
        }
    },
    beforeDestroy(){
        $("#"+this.id_name+"_css_"+this.context.mode).remove()
    },
    methods:{
        refresh(){
            let _this=this 
            let tmp=_this.self.content.replaceAll("dync_script>","script>")
            let script_txt=extract_script_txt(tmp)
            //https://github.com/JonWatkins/vue-runtime-template-compiler/blob/master/src/components/RuntimeTemplateCompiler.vue
            //script_txt=script_txt.replace(/function\s*(\w+)\s*/img,'_this.$1=_this.$options.methods.$1=function')
            let style=extract_style_txt(tmp).trim()
            style=style.replace(/([^{]+)\{[\s|\S]*?\}/img,
            function(t1,t2,t3,t4) {
                return t2.trim().split(",").map(x=>'#cr_dyn_id_'+_this.context.mode+'_'+_this.id_name+" "+x).join() + t1.substring( t1.indexOf("{") ) +'\n'
                //console.log(t1,t2,t3,t4)
            }
            ) 
            let t_vue_obj=eval("(function(){\n"+script_txt+"\n})()")
            if(t_vue_obj?.methods)
                Object.assign(_this.$options.methods,t_vue_obj.methods)
            if(t_vue_obj?.data)
                Object.assign(_this.$data,t_vue_obj.data)
            if(t_vue_obj?.computed )
                Object.assign(_this.$options.computed ,t_vue_obj.computed)
            
            if(style!=""){
                insert_css_to_head(style,_this.id_name+"_css_"+_this.context.mode)
            }
            let start_pos=tmp.indexOf("<template>")
            if(start_pos>=0){
                _this.cut_script_css_content=tmp.substring(
                    start_pos+'<template>'.length
                    ,tmp.indexOf("</template>")
                )
            }else{
                _this.cut_script_css_content=tmp.replace(/<script.*?>*?>([\s\S]*?)<\/script>/img,'')
                    .replace(/<style.*?>*?>([\s\S]*?)<\/style>/img,'')
            }
            _this.old_content=''
            setTimeout(()=>{
                _this.old_content=_this.cut_script_css_content
                //_this.buildDisplayData()
            })
        }
    },
    watch: { 
        "self":{
            handler(val,oldVal){
                this.refresh()
            },deep:true
        }, 
    },
}