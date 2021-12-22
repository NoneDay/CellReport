<template>
  <div style="width:100%;height:100%;overflow: hidden; "  >
    
  
    <div style="position: absolute;right:40px;top:10px;">
    <div v-if="!executed || showLog" style="display:inline-block;">  
      <div v-for="([key,val]) in Object.entries(ds_log)" :key="key" style="display:inline-block;padding-right:20px">
        <el-tag :type="val.color" :style="{'border':key==show_type?'2px darkgreen solid':''}"
         @click="tag_click(key,val)" effect="dark"
        >{{key}}</el-tag>
      </div>
      </div>
      
    <div  style="display:inline-block;padding-right:20px">
    <el-button 
      v-if="executed"
     @click="showLog=!showLog;show_type='______ALL_____';">显示{{showLog?'报表':'日志'}}
     </el-button>
     </div>
  </div>
  <div  v-if="!executed || showLog || result.form==undefined" style="height:100%" >
    <textarea ref="textarea" :style="{height:show_type=='______ALL_____'?'100%':'50%',width:'100%'}" :value="show_content">
    </textarea>
    
    <el-table stripe border  :height="'50%'" v-if="show_type!='______ALL_____' && tableData.length>0" 
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage*pageSize)"  
        style="width: calc(100% -1px)">
        <el-table-column v-for="(one,idx) in Object.keys(tableData[0])" 
        sortable :key="one+idx" :prop="one" :label="one"> </el-table-column>
    </el-table>           
    <el-pagination  v-if="show_type!='______ALL_____' && tableData.length>0"
        :current-page.sync="currentPage"
        :page-sizes="[2, 5, 10, 20]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total.sync="tableData.length">
    </el-pagination>    
  </div>
  <template v-else>
    <div id="report_app" >
    <div> 
      <el-form :inline="true" v-if="previewFormParam.form">
        <input hidden v-for="one in previewFormParam.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        
      
        <div style="display:inline" v-for="one in previewFormParam.form.filter(x=>x.hide=='False')" :key="one.name">
          <el-form-item :label="one.prompt">
          <el-input v-if="one.data_type=='string' && one.tagValueList.length==0 && one.canUsedValueFrom!='Query' " v-model="queryForm[one.name]"></el-input>
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom!='Query' && one.tagValueList.length>0 " v-model="queryForm[one.name]" 
            collapse-tags @change="change_param(one.name)"
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in one.tagValueList"
                :key="item[1]"
                :label="item[0]"
                :value="item[1]">
              </el-option>
          </el-select>  
          
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz=='' " v-model="queryForm[one.name]" 
            collapse-tags @change="change_param(one.name)"
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in convert_param_array_to_json(previewFormParam.dataSet[one.dataSetName_kyz][0],one)"
                :key="item[one.valueField_kyz]+''"
                :label="item[one.tagField_kyz]"
                :value="item[one.valueField_kyz]+''">
              </el-option>
          </el-select>  
        <el-cascader v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz!='' " v-model="queryForm[one.name]" 
            collapse-tags clearable @change="change_param(one.name)"
            :multiple="one.allowMutil=='False'?false:true" :options="convert_param_array_to_tree(previewFormParam.dataSet[one.dataSetName_kyz][0],one)"
                :props="{checkStrictly:true, emitPath:false,multiple:one.allowMutil=='False'?false:true,value:one.valueField_kyz,label:one.tagField_kyz}"
                >
          </el-cascader>  

          <el-date-picker v-if="one.data_type=='date'" value-format="yyyy-MM-dd" 
                    v-model="queryForm[one.name]"></el-date-picker> 
          <el-date-picker v-if="['datetime','dateTime'].includes( one.data_type)" :value-format="one.dateTimeFormat" :format="one.dateTimeFormat" 
          :type="['yyyyMM','yyyy-MM'].includes(one.dateTimeFormat)?'month':'datetime'"
                    v-model="queryForm[one.name]"></el-date-picker>
          </el-form-item>
          
           </div>
            <el-form-item>
            <el-button type="primary"  class='form_query_button'  @click="submit">查询</el-button>
            
          </el-form-item>
      </el-form>
    </div>
    <div style="height:90%;    overflow: auto;">
        <grid-layout-form v-if="layoutType=='gridLayout'" :layout="layout" >
        </grid-layout-form>          
        <widget-form v-else   :data="layout"   
        ></widget-form>
    </div>
    </div>
    </template>
    
  </div>
</template>

<script>
import widgetForm from './WidgetForm'
import {loadFile,deepClone,build_layout,get_signalR_connection,convert_array_to_json,arrayToTree} from './utils/util.js'
import Textarea from './config/textarea.vue'
import {preview_one} from "./api/report_api"
import { number } from 'echarts'
export default {
    name: 'preview',  
    props:["context","grpId"],
    components:{widgetForm },
    async mounted() {
        
        await preview_one(this,true,{})
    }, 
  inject: ["context"],
  provide() {
    return {
      context: {
          all_sheet_windows:[],
          canDraggable:false,
          report:this.context?.report,
          report_result:this.result,
          mode:"preview",
          event:{},
          allElementSet:this.context.allElementSet,
          clickedEle:this.clickedEle,
          //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
          in_exec_url:this.in_exec_url,
          fresh_ele:this.fresh_ele,
      },      

    }
  },  
  data () {
    return {
        preview_dialogVisible:false,
        previewFormParam:{},
        queryForm:{},
        queryForm_show:{},
        exec_log:"",
        result:{},
        clickedEle:{},
        executed:false,
        layout:[],
        showLog:false,
        ds_log:{},
        allElementSet:new Set(),//所有有ID名称的集合
        show_type:"______ALL_____",
        currentPage:1,
        pageSize:20,
        fresh_ele:[],
        in_exec_url:{stat:false},
    }
  },
  watch:{
    executed(){

    }
  },
  computed: {
    tableData(){
      let ret=this.context.report_result?.dataSet[this.show_type]
      if(ret)
        return convert_array_to_json(ret[0])
      else
        return convert_array_to_json([['a']])
    },
    
    show_content(){
      if(this.ds_log[this.show_type])
        return this.ds_log[this.show_type].content.join("\n")
      else 
      return this.exec_log
    },
    parentHeight(){
        return this.$parent.$el.clientHeight
    },
    layoutType(){
      if (Array.isArray(this.layout))
      return 'gridLayout'
      else
      return 'divLayout'
    },
  },
  methods: {
    submit(){
      let _this=this
      _this.exec_log=""
      _this.showLog=true
      _this.executed = false
      setTimeout(async function(){
        await preview_one(_this,false,_this.queryForm)
      })
      
    },
    change_param(param_name){
      let _this=this
      if(this.context.report_result.param_liandong.includes(param_name)){
        console.info(_this.queryForm)
        setTimeout(async function(){
          await preview_one(_this,true,_this.queryForm,param_name)
        })        
      }
    },
    convert_param_array_to_json(data,p2){
      
      return convert_array_to_json(data)
    },
    convert_param_array_to_tree(data,para){
      let aa=convert_array_to_json(data)
      let ret=arrayToTree(aa,{pid:para.parent_valueField_kyz,id:para.valueField_kyz})
      return ret
    },
    tag_click(key,val){
      console.info(val.color); 
      this.show_type=key
    }
  },   
  destroyed(){
    if (window.needResizeFunc)
      delete window.needResizeFunc
  }
}
</script>

<style>
.widget-form-container {
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.report_define .widget-form-container .el-form {
    height: 100%;
}
#report_app {
    height: 100%;
}
</style>