import {seriesLoadScripts,load_css_file,load_css_js,insert_css_to_head,build_chart_data,convert_array_to_json
    ,extract_style_txt,extract_script_txt } from "../utils/util"

export default (function(){ return {
    provide(){
        let ret={
            context: this._context,
            fresh_ele:this._fresh_ele,
            clickedEle:this._clickedEle,
            _zb_var_:this._context.report_result?._zb_var_||{}
        }
        
        //if(this._context?.report_result?._zb_var_)
        //    ret={...this._context.report_result._zb_var_,...ret}
        //if(this._context?.report?._zb_var_)
        //    ret={...this._context.report._zb_var_,...ret}
        return ret
    },
    data: () => ({
        real_parentCompent:{}, 
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
        selfHeight(){
            return this.$el.clientHeight
        },
        cur_ds(){
            let ds_name=''
            let ret
            let report_result=this.context.report_result
            if(this.self.datasource){
                let source_arr=this.self.datasource.split(":")
                ds_name=source_arr[1]
                if(source_arr[0]=='数据集'){
                    if(report_result?.dataSet && report_result?.dataSet[ds_name])
                        ret=report_result?.dataSet[ds_name][0]
                    else
                        ret=this.dataset('xxx')
                    return ret
                }else if(source_arr[0].startsWith('表格')){
                    if(report_result.data==undefined  || report_result.data[ds_name]==undefined)
                            return
                        let cur_grid=report_result.data[ds_name]
                        let real_data=[cur_grid.columns]
                        if(this.self.datasource.startsWith('表格明细数据'))
                        {
                            for (let index = cur_grid.extend_lines[0]; index <= cur_grid.extend_lines[1]; index++) 
                            {
                                real_data.push(cur_grid.tableData[index])
                            }
                        }
                        else if(this.self.datasource.startsWith('表格汇总数据')){
                            for (let index = cur_grid.colName_lines[1]+1; index < cur_grid.tableData.length; index++) 
                            {
                                if(index<cur_grid.extend_lines[0] || index > cur_grid.extend_lines[1] ){
                                //if(cur_grid.tableData[index].find(x=>x==null)).length>2) //todo
                                real_data.push(cur_grid.tableData[index])
                                }
                            }
                        } 
                    return real_data
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
                script_txt=script_txt.replace(/export\s+default*/img,'return ')
                
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
                let t_parentCompent=this.parentCompent??{$data:{},$props:{},$options:{computed:{},methods:{},filters:{},components:{}},}
                this.real_parentCompent={
                        _provided:_this._provided,
                        $data:Object.assign({},t_parentCompent.$data,_this.$data),
                        $props :Object.assign({},t_parentCompent.$props,_this.$props ),
                        $options:{computed: Object.assign({},t_parentCompent.$options.computed,_this.$options.computed) ,
                                    methods:Object.assign({},t_parentCompent.$options.methods,_this.$options.methods),
                                    filters:Object.assign({},t_parentCompent.$options.filters,_this.$options.filters),
                                    components :Object.assign({},t_parentCompent.$options.components,_this.$options.components ),
                                watch:_this.$options.watch }
                    }
                //for(let one in _this){
                //    if("function"==getObjType(_this[one])){
                //        _this.real_parentCompent.$options.methods[one]=_this[one]
                //    }
                //}
                if(t_vue_obj?.methods)
                    Object.assign(_this.real_parentCompent.$options.methods,t_vue_obj.methods)
                if(t_vue_obj?.prop)
                    Object.assign(_this.real_parentCompent.$props,t_vue_obj.prop)
                if(t_vue_obj?.data){
                    if(typeof t_vue_obj.data=="function")
                        Object.assign(_this.real_parentCompent.$data,t_vue_obj.data())
                    else
                        Object.assign(_this.real_parentCompent.$data,t_vue_obj.data)
                }
                if(t_vue_obj?.computed )
                    Object.assign(_this.real_parentCompent.$options.computed ,t_vue_obj.computed)
                if(t_vue_obj?.filters  )
                    Object.assign(_this.real_parentCompent.$options.filters  ,t_vue_obj.filters )
                if(t_vue_obj?.watch  )
                    Object.assign(_this.real_parentCompent.$options.watch  ,t_vue_obj.watch )

                if(style!=""){
                    insert_css_to_head(style,_this.id_name+"_css_"+_this.context.mode)
                }
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
                _this.cut_script_css_content=tmp.replace(/<t>(.*?)<\/t>/img,function(all,one,pos){
                    if(_this.self.option[one]!=undefined){
                        if(_this.self.option[one].startsWith('=')){
                            return _this.self.option[one].slice(1)
                        }
                        else{
                            return "'" + _this.self.option[one] +"'"
                        }
                    }
                    return "undefined"
                })
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
                if(this.context.mode=='design' || this.context.mode=='conf')
                this.refresh()
            },deep:true
        }, 
    },
}
}
)()