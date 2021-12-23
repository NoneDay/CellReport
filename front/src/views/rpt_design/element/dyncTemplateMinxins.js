import {seriesLoadScripts,load_css_file } from "../utils/util"
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
        old_content:"" 
    }),
    mounted(){
        let _this=this
        if(this.self.type.startsWith("Data") && window.AVUE==undefined){
            load_css_file("cdn/avue/2.8.1/index.css")
            seriesLoadScripts("cdn/avue/2.8.1/avue.min.js",null,function(){
                _this.old_content=_this.self.content
            })
        }
        else
            this.old_content=this.self.content
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
    },
    methods:{
        refresh(){
            let _this=this
            this.old_content=""
            setTimeout(()=>{
                _this.old_content=_this.self.content
                _this.buildDisplayData()
            })
        },
        dataset(ds_name,where){
            let ds=this.context.report_result.dataSet[ds_name] 
            if(ds==undefined)
                return "没有数据集"+ds_name
            ds=ds[0]
            return ds
        }
    },
    watch: { 
        "self.content"(){
        let _this=this
        setTimeout(function(){
            _this.old_content=_this.self.content            
        })
        }
    },
}