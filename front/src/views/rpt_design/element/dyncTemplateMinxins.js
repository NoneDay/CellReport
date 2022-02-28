import {seriesLoadScripts,load_css_file,load_css_js,insert_css_to_head,extract_style_txt,extract_script_txt } from "../utils/util"
export default (function(){ return {
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
        parentCompent:{}, 
        old_content:"",
        cut_script_css_content:"",
        t_vue_obj:{},
        
    }),
    beforeCreate(){
        if(this.t_vue_obj?.beforeCreate ){
            this.t_vue_obj?.beforeCreate()
        }
    },
    destroyed(){
        if(this.t_vue_obj?.destroyed ){
            this.t_vue_obj?.destroyed()
        }
    },     
    created(){
        if(this.t_vue_obj?.created ){
            this.t_vue_obj?.created()
        }
    },  
    beforeMount(){
        if(this.t_vue_obj?.beforeMount ){
            this.t_vue_obj?.beforeMount()
        }
    },    
    beforeDestroy(){
        if(this.t_vue_obj?.beforeDestroy ){
            this.t_vue_obj?.beforeDestroy()
        }
    },    
    mounted(){
        if(this.t_vue_obj?.mounted ){
            this.t_vue_obj?.mounted()
        }
        
        let _this=this
        //if(this.self.type.startsWith("Data") && window.AVUE==undefined){
        //    load_css_file("cdn/avue/2.8.1/index.css")
        //    seriesLoadScripts("cdn/avue/2.8.1/avue.min.js",null,function(){
        //        _this.refresh()
        //    })
        //}
        //else
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
        },
        cur_ds(){
            let ds_name=''
            let ret
            if(this.self.datasource){
                let source_arr=this.self.datasource.split(":")
                if(source_arr[0]=='数据集'){
                    ds_name=source_arr[1]
                    
                    if(this.context?.report_result?.dataSet && this.context?.report_result?.dataSet[ds_name])
                        ret=this.context?.report_result?.dataSet[ds_name][0]
                    else
                        ret=this.dataset('xxx')
                    return ret
                }else if(source_arr[0]=='表格'){
                    ret=this.dataset('xxx')
                    return ret
                }
            }
            return this.dataset('xxx')
          },
    },
    beforeDestroy(){
        $("#"+this.id_name+"_css_"+this.context.mode).remove()
    },
    methods:{        
        parse_content(){
            if(this.in_parse_call)
                return
            try{
                this.in_parse_call=true            
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
                let tool=require('../utils/util.js')
                let t_vue_obj=eval("(function(){\n"+script_txt+"\n})()")
                this.t_vue_obj=t_vue_obj
                this.parentCompent={
                    _provided:_this._provided,
                    $data:Object.assign({},_this.$data),
                    $props :Object.assign({},_this.$props ),
                    $options:{computed: Object.assign({},_this.$options.computed) ,
                                methods:Object.assign({},_this.$options.methods),
                                filters:Object.assign({},_this.$options.filters),
                                components :Object.assign({},_this.$options.components ),
                            watch:_this.$options.watch }
                }
                //for(let one in _this){
                //    if("function"==getObjType(_this[one])){
                //        _this.parentCompent.$options.methods[one]=_this[one]
                //    }
                //}
                if(t_vue_obj?.methods)
                    Object.assign(_this.parentCompent.$options.methods,t_vue_obj.methods)
                if(t_vue_obj?.prop)
                    Object.assign(_this.parentCompent.$props,t_vue_obj.prop)
                if(t_vue_obj?.data)
                    Object.assign(_this.parentCompent.$data,t_vue_obj.data)                
                if(t_vue_obj?.computed )
                    Object.assign(_this.parentCompent.$options.computed ,t_vue_obj.computed)
                if(t_vue_obj?.filters  )
                    Object.assign(_this.parentCompent.$options.filters  ,t_vue_obj.filters )

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
                this.in_parse_call=false
            }catch(ex){
                this.in_parse_call=false      
                throw ex
            }
        },
        refresh(){
            let _this=this 
            _this.parse_content()
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
}
)()