<template>
  <div>
      <el-dialog  v-el-drag-dialog style="text-align: left;" :inline="true"
    :visible.sync="dialogVisible" :title="'编辑内容'" 
        :close-on-click-modal="false"  :modal="false"
          direction="btt" append-to-body
    >  
    <div >
          <codemirror     v-model="data.content" style="height:100%"
              :options="{tabSize: 4, mode: 'text/javascript', styleActiveLine:
               true,lineWrapping: true,
              theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
         />
    </div>
    </el-dialog>
   <el-button @click="dialogVisible=true">编辑内容</el-button>
<el-row>
<el-col :span="4">
数据：</el-col>    <el-col :span="20">
<el-select v-model="data.datasource" placeholder="请选择" @change="change_ds" >
    <el-option
      v-for="item in all_datasource"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select> </el-col>
</el-row>
  <el-scrollbar style="height:300px">
          <draggable tag="ul"
                     :list="data.fields"
                     :group="{ name: 'dic' }"
                     ghost-class="ghost"
                     handle=".drag-item">
                     
            <li v-for="(item, index) in data.fields" :key="index" style="display: flex;">
              <i class="drag-item el-icon-s-operation"
                 style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
              <el-checkbox  style="margin-right: 5px;"
                        size="mini"
                        v-model="item.selected"
                        placeholder="label"></el-checkbox>
              {{item.key}}
            </li>
          </draggable>  
  </el-scrollbar> 
  <cr_set_fresh :data="data">

  </cr_set_fresh>

  </div>

</template>
<script>

import  codemirror  from '../element/vue-codemirror.vue'
import cr_set_fresh from "./cr_set_fresh.vue"
import Draggable from 'vuedraggable'
export default {
  name: 'config-echart',
  components: { codemirror,Draggable,cr_set_fresh},
  inject: ["context"],
  props: ['data'],
  mounted(){

  },
  data() {
    return { 
      dialogVisible:false,
      default_type:"bar",
    }
  },
  computed:{
    all_datasource(){
      let ret=["示例"]
      this.context.report.dataSets.dataSet.forEach(element=>{
        ret.push(`数据集:${element._name}`)
      });
      if(this.context?.report_result?.data)
        Object.keys(this.context.report_result.data).forEach(element=>{
          if(this.context.report_result.data[element].type=="common"){
            ret.push(`表格明细数据:${element}`)
            ret.push(`表格汇总数据:${element}`)
          }
        });
      Object.keys(this.context.clickedEle).filter(x=>x!=this.data.gridName).forEach(element=>{
            ret.push(`元素选中行:${element}`)
        });  
      return ret;
    },

  },
  methods: {
     paramDialog_open(row){
            this.url_param=row
            this.ExprEditorDialog_visible=true;
        },
    change_ds(ds){
      let conf=this.data
      conf.fields.splice(0);
      conf.fresh_params.splice(0);
      this.context.report.params.param?.filter(x=>x._inner=='False').forEach(x=>{
        conf.fresh_params.push({"name":x._name,value:"原始参数:"+x._name})
      })
      let ds_name=ds.split(":")
      ds_name=ds_name.length>1?ds_name[1]:ds_name[0]
      if(ds.startsWith("数据集")){
        let _fields=this.context.report.dataSets.dataSet.find(x=>x._name==ds_name)._fields
        if(_fields)
        {
          JSON.parse(_fields).forEach(ele=>{
            conf.fields.push({key:ele,label:ele,selected:true,type:this.default_type})
          })
        };
      }else if(ds.startsWith("表格")){
        if(this.context.report_result){
          this.context.report_result.data[ds_name].columns.forEach(element => {
            conf.fields.push({key:element,label:element,selected:true,type:this.default_type})
          })
        }
      }else if(ds.startsWith("元素")){
        if(this.context.clickedEle){
          let keys=Object.keys(this.context.clickedEle[ds.split(":")[1]].data)
          //this.context.report_result.data[ds.split(":")[1]].columns
          keys.forEach(element => {
            conf.fields.push({key:element,label:element,selected:true,type:this.default_type})
          })
        }
      }else{
        conf.data[0].forEach(element => {
          conf.fields.push({key:element,label:element,selected:true,type:this.default_type})
        });
      }
    }
  }
}
</script>