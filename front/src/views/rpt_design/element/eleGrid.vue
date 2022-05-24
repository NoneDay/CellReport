<template>
	<div style="width:100%;height:100%"   >
        <el-table stripe border height="calc(100% - 0px)" 
              :data="[]"  v-if="context.mode=='design' && self.datasource!='示例'"
            >
            <el-table-column v-for="(one,idx) in self.fields.filter(x=>x.selected)"
                :key="one+idx" :prop="one['key']" :label="one['label']"> 
            </el-table-column>
        </el-table>
        
        <dyncTemplate v-else :parentCompent="parentCompent" :self="self" >
        </dyncTemplate>
	</div>
</template>
<script>
import {convert_array_to_json,build_chart_data, deepClone } from "../utils/util"


import dyncTemplate from './dyncTemplate.vue'
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins"

export default {
    name:"ele-grid",
    components: { dyncTemplate }, 
    mixins:[mixins,dyncTemplateMinxins],
    mounted(){
        this.buildDisplayData()
    },
    data: () => ({
        currentPage: 1,
        //tableData:[],
        real_data:[]
    }),
    watch:{
        "self":{
            handler(val,oldVal){
                this.refresh();
            },deep:true
        }, 
    },
    computed:{
        parentCompent(){
            return this
        }
    },
    created(){
        
    } ,
    methods: { 
        buildDisplayData(){
            //if(Object.keys(this.context.report_result).length<2 && this.self.datasource!='示例')
            //{
            //    this.$message.warning("先点击预览，才能配置与报表结果有关的元素");
            //    return;
            //}
            //let {__valid_data__,valid_fileds,real_data}=build_chart_data(this.self.datasource,this.context.report_result,this.context.clickedEle,this.self.fields)
            //this.tableData = convert_array_to_json(__valid_data__)
            //this.real_data=convert_array_to_json(real_data)
            //if(this.real_data.length && this.self.gridName!="_random_"){ 
            //    this.$set(this.context.clickedEle,this.self.gridName,{data:this.real_data[0],cell:null,column:null,self:this.self})
            //}
        },
        cell_click(row, column,cell, event){
            //因为有可选列，所以不能直接用row，要按row 找到真正的原始数据
            let cur_data=this.real_data.filter(x=>{
                for(let key in row){
                    if(row[key]!=x[key])
                    {
                        return false
                    }
                }
                return true
            } )
            if(cur_data.length){
                if(this.context.clickedEle[this.self.gridName])
                    this.context.clickedEle[this.self.gridName]={data:deepClone(cur_data[0]),cell:cell.innerText,column,self:this.self}
                else
                    this.$set(this.context.clickedEle,this.self.gridName,{data:deepClone(cur_data[0]),cell:cell.innerText,column,self:this.self})
                this.click_fresh(this.context.clickedEle[this.self.gridName])
            }
            
        }
  },
}
</script>

<style>

</style>