<template>
	<div style="width:100%;height:100%"  v-if="old_content==self.content" >
        <el-table stripe border height="calc(100% - 28px)"  @cell-click="cell_click"
              :data="[]"  v-if="context.mode=='design' && self.datasource!='示例'"
            >
            <el-table-column v-for="(one,idx) in self.fields.filter(x=>x.selected)"
                :key="one+idx" :prop="one['key']" :label="one['label']"> 
            </el-table-column>
        </el-table>
        
        <RuntimeTemplateCompiler v-else :template="self.content" :parent="parentCompent" />

	</div>
</template>
<script>
import {convert_array_to_json,build_chart_data, deepClone } from "../utils/util"


import { RuntimeTemplateCompiler } from 'vue-runtime-template-compiler'
import mixins from "./mixins"
import dyncTemplateMinxins from "./dyncTemplateMinxins"

export default {
    name:"ele-grid",
    components: { RuntimeTemplateCompiler }, 
    mixins:[mixins,dyncTemplateMinxins],
    mounted(){
        this.buildDisplayData()
    },
    data: () => ({
        currentPage: 1,
        tableData:[],
        real_data:[]
    }),
    watch:{
        "self":{
            handler(val,oldVal){
                this.refresh();
            },deep:true
        }, 
        "context.report_result":{
            handler(val,oldVal){
                this.refresh();
            },deep:true
        }, 
    },
    created(){
        
    } ,
    methods: { 
        buildDisplayData(){
            if(Object.keys(this.context.report_result).length<2 && this.self.datasource!='示例')
            {
                this.$message.warning("先点击预览，才能配置与报表结果有关的元素");
                return;
            }
            let {valid_data,valid_fileds,real_data}=build_chart_data(this.self.datasource,this.context,this.self.fields)
            this.tableData = convert_array_to_json(valid_data)
            this.real_data=convert_array_to_json(real_data)
            if(this.real_data.length && this.self.gridName!="_random_"){ 
                this.$set(this.context.clickedEle,this.self.gridName,{data:this.real_data[0],cell:null,column:null,self:this.self})
            }
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
                    this.context.clickedEle[this.self.gridName]={data:deepClone(cur_data[0]),cell:cell.innerText,column,self:_this.self}
                else
                    this.$set(this.context.clickedEle,this.self.gridName,{data:deepClone(cur_data[0]),cell:cell.innerText,column,self:_this.self})
                this.click_fresh(this.context.clickedEle[this.self.gridName])
            }
            
        }
  },
}
</script>

<style>

</style>