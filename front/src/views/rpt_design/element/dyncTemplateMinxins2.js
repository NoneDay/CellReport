import {insert_css_to_head,extract_style_txt,extract_script_txt,select_field_data,test_data } from "../utils/util"
import { baseUrl } from '@/config/env'; 

let dyn_mixin=(function(){ return {
    data: () => ({
        baseUrl, 
        
    }),
    
    computed: { 
        id_name(){
            return (this.self.gridName!='_random_'? this.self.gridName:this.self.type)
        },
        selfHeight(){
            return this.$el.clientHeight
        },
        _zb_var_(){
          return  this._context.report_result?._zb_var_||{}
        },
        cur_ds(){
            let ds_name=''
            let ret
            let report_result=this.context.report_result
            let real_data
            
            if(this.self.datasource){// &&(this.self.dataType==1 || this.self.dataType==undefined)
                
                let source_arr=this.self.datasource.split(":")
                ds_name=source_arr[1]
                if(this.self.datasource=='静态数据'){
                    real_data= this.self.optionData
                }else if(source_arr[0]=='数据集'){
                    if(report_result?.dataSet && report_result?.dataSet[ds_name])
                        real_data=report_result?.dataSet[ds_name][0]
                    else{
                        real_data=JSON.parse(JSON.stringify(test_data)) 
                        if(this.self.fields)
                            real_data[0]=Enumerable.from(this.self.fields).where(x=>x.selected).select(x=>x.key).toArray()
                    }
                   
                }else if(source_arr[0].startsWith('表格')){
                    if(report_result.data==undefined  || report_result.data[ds_name]==undefined)
                            return
                        let cur_grid=report_result.data[ds_name]
                        real_data=[cur_grid.columns]
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
                        else if(this.self.datasource.startsWith('表格明细及汇总数据')){
                            for (let index = cur_grid.colName_lines[1]+1; index < cur_grid.tableData.length; index++) 
                            {
                                for (let index = cur_grid.extend_lines[0]; index <= cur_grid.extend_lines[1]; index++) 
                                {
                                    real_data.push(cur_grid.tableData[index])
                                }
                                if(index<cur_grid.extend_lines[0] || index > cur_grid.extend_lines[1] ){
                                //if(cur_grid.tableData[index].find(x=>x==null)).length>2) //todo
                                real_data.push(cur_grid.tableData[index])
                                }
                            }
                        } 
                    //return real_data
                }
                else if(source_arr[0].startsWith('元素')){
                    let cur_grid=report_result.data[ds_name]
                    let clickedData=clickedEle[datasource.split(":")[1]]
                    if(clickedData){
                        if(!Array.isArray(real_data))
                        {
                            let keys=Object.keys(real_data)
                            let values=Object.values(real_data)
                            if(keys.length==0){
                                keys=cur_grid.columns
                                values= cur_grid.tableData[cur_grid.extend_lines[0]]
                            }
                            real_data=JSON.parse(JSON.stringify([keys,values]))
                        }
                        
                    }
                }
            }
            if(real_data){
                return select_field_data(real_data,this.self.fields)
            }
            return this.dataset('xxx')
          },
    },
    
    methods:{
        sayHi() {
            //console.info(this.context.clickedEle['test'])
            console.log("Hi");
          },
        conf_field_prop_arr(prop){
            if(!this.self.fields)
                return [];
            return  Enumerable.from(this.self.fields).where(x=>x.selected && x[prop]).select(x=>x[prop]).toArray()
        },
    },

}
})()
export default dyn_mixin