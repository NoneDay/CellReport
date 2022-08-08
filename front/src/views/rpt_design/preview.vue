<template>
  <div style="width:100%;height:100%;overflow: hidden; "  >
       <paperSetting :target_obj="result.paperSetting" @submit="paperSetting_submit"  :visible.sync="paper_setting_dialogVisible" />

      <el-dialog v-draggable v-if="pdf_output_dialogVisible" style="text-align: left;" class="report_define"
        :visible.sync="pdf_output_dialogVisible" :title="'PDF导出和打印预览'" 
            :close-on-click-modal="false"   :fullscreen="true"
              direction="btt" append-to-body  
        > 
        <div slot="title" class="dialog-footer">
          PDF导出和打印预览
          <el-button @click="paper_setting_dialogVisible = true">页面设置</el-button>
          <el-button @click="pdf_output_dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="pdf_output_dialogVisible = false">确 定</el-button>
         <!-- <el-button type="primary"  @click="pdf_print">打印</el-button> -->
        </div>
         <div id="pdf_wrapper" class="pure-u-1 pure-u-md-4-5" style="height: 100%;width: 100%;">
            <iframe id="printIframe" style="display:none"></iframe>
            <object id="pdf_output" type="application/pdf" style="height: 100%;width: 100%;">
                <p>It appears you don't have PDF support in this web browser. <a href="#" id="download-link">Click here to download the PDF</a>.</p>
            </object>
        </div>

    </el-dialog> 
    <div style="position: absolute;right:40px;top:10px;">
    <div v-if="!executed || showLog" style="display:inline-block;">  
      <div v-for="([key,val]) in Object.entries(ds_log)" :key="key" style="display:inline-block;padding-right:20px">
        <el-tag :type="val.color" :style="{'border':key==show_type?'2px red solid':''}"
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
  <div  v-if="!executed || showLog || result.form==undefined" style="height:100%;height: 100%;display: flex;flex-direction: column;" >
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
    <div id="report_app" style="display:flex;flex-direction:column;height:100%" >
    <div ref="div_form"> 
      <el-form ref="form" inline  v-if="previewFormParam.form" :model="queryForm">
        <input hidden v-for="one in previewFormParam.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        <el-form-item :label="one.prompt" v-for="one in previewFormParam.form.filter(x=>x.hide=='False')" :key="one.name"
           :prop="one.name" :rules="result.defaultsetting.cr_front_validate=='true' && one.allowSpace=='False'? {required: true, message: '请选择', trigger: 'change' } :null">
          <el-input v-if="one.data_type=='string' && one.tagValueList.length==0 && one.canUsedValueFrom!='Query' " v-model="queryForm[one.name]"></el-input>
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom!='Query' && one.tagValueList.length>0 " v-model="queryForm[one.name]" 
            collapse-tags @change="change_param(one.name)" clearable filterable  
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in one.tagValueList"
                :key="item[1]"
                :label="item[0]"
                :value="item[1]">
              </el-option>
          </el-select>  
          
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz=='' " v-model="queryForm[one.name]" 
            collapse-tags @change="change_param(one.name)" clearable filterable
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
          <el-date-picker v-if="['dates'].includes( one.data_type)" value-format="yyyy-MM-dd" 
          :type="'dates'" v-model="queryForm[one.name]"></el-date-picker>

          <el-date-picker v-if="['daterange'].includes( one.data_type)" value-format="yyyy-MM-dd" 
          :type="'daterange'" v-model="queryForm[one.name]"></el-date-picker>
          
          <el-date-picker v-if="['monthrange'].includes( one.data_type)" value-format="yyyy-MM" 
          :type="'monthrange'" v-model="queryForm[one.name]"></el-date-picker>
          
          <el-date-picker v-if="['datetimerange'].includes( one.data_type)" :value-format="one.dateTimeFormat" :format="one.dateTimeFormat" 
          :type="'datetimerange'" v-model="queryForm[one.name]"></el-date-picker>
          </el-form-item>

          
            <el-form-item>
            <el-button type="primary"  class='form_query_button'  @click="submit">查询</el-button>
                   
            <el-dropdown style="margin: 2px;" v-if='Object.keys(result.data)!=0' @command="ExcelCommand($event, node,data)">
              <el-button type="primary" class='form_query_button' >
                导出excel<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exceljs">小数据量（带格式）</el-dropdown-item>
                <el-dropdown-item  command="xlsxjs">大数据量（无格式）</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button type="primary" v-if='Object.keys(result.data)!=0' class='form_query_button' @click="export_pdf">PDF预览</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div ref="report_pane" :style="{    'flex-grow': 1,height:'90%',overflow: 'auto',color:result.defaultsetting['COLOR'],background:result.defaultsetting['BACKGROUND-COLOR']}">
        <grid-layout-form v-if="layoutType=='gridLayout'" :layout="layout" :big_screen_scale="big_screen_scale" :big_screen_scale_x="big_screen_scale_x"
         :big_screen_scale_y="big_screen_scale_y"
        >
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
import {convert_array_to_json,arrayToTree,seriesLoadScripts} from './utils/util.js'
import {preview_one,get_pdf} from "./api/report_api"
import {exceljs_inner_exec,xlsxjs_inner_exec} from './utils/export_excel.js'
import paperSetting  from './paperSetting.vue'
import { Loading } from 'element-ui';
export default {
    name: 'preview',  
    props:["grpId"],
    components:{widgetForm,paperSetting },
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
          grpId:this.grpId,
          event:{},
          queryForm:this.queryForm,
          allElementSet:this.context.allElementSet,
          clickedEle:this.clickedEle,
          //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
          in_exec_url:this.in_exec_url,
          fresh_ele:this.fresh_ele,
          defaultsetting:this.result.defaultsetting,
          name_lable_map:this.name_lable_map
      },      

    }
  },  
  data () {
    return {
        name_lable_map:{},
        paper_setting_dialogVisible:false,
        pdf_output_dialogVisible:false,
        preview_dialogVisible:false,
        previewFormParam:{},
        queryForm:{},
        queryForm_show:{},
        exec_log:"",
        result:{},
        mode:"preview",
        last_js_cript:"",
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
        big_screen_scale:70,
        big_screen_scale_x:70,
        big_screen_scale_y:70,
    }
  },
  watch:{
    showLog(newVal,oldVal){
      let _this=this
      if(newVal==false){
        setTimeout(() => {
            _this.$nextTick(x=>{
                let form_h=_this.$refs.div_form.clientHeight+4
                _this.$refs.report_pane.style.height=`calc(100%)`// - ${form_h}px
                if(_this.result.defaultsetting.big_screen=='1'){
                  _this.big_screen_scale_y=100*_this.$refs.report_pane.clientHeight/parseInt(_this.result.defaultsetting.screen_height)
                  _this.big_screen_scale_x=100*_this.$refs.report_pane.clientWidth/parseInt(_this.result.defaultsetting.screen_width)
                  _this.big_screen_scale=Math.min(_this.big_screen_scale_x,_this.big_screen_scale_y)
                }
            })    
        });
      }
    },
  },
  computed: {
    cr_front_validate(){
      return window.cr_front_validate
    },
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
    async paperSetting_submit(val){
      let pdf_data=await get_pdf(this.result,val)
      let datauri = URL.createObjectURL(pdf_data)
      document.getElementById("pdf_output").data =datauri
    },
    submit(){
      let _this=this
      _this.$refs.form.validate((valid) => {
          if (valid) {
            _this.exec_log=""
            _this.showLog=true
            _this.executed = false
            setTimeout(async function(){
              await preview_one(_this,false)
            })
          } else {
            _this.$message.error('必填项目没填内容!!');
            return false;
          }
        });
    },
    change_param(param_name){
      let _this=this
      if(this.context.report_result.param_liandong?.includes(param_name)){
        console.info(_this.queryForm)
        setTimeout(async function(){
          await preview_one(_this,true,param_name)
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
    },
    ExcelCommand(command, node,data){
      let _this=this
      if(command=="exceljs")
        seriesLoadScripts('cdn/exceljs/exceljs.min.js',null,function (){
          let loadingInstance = _this.$loading({ lock: true,
          text: '正在导出',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)' });
          setTimeout(async () => { // 以服务的方式调用的 Loading 需要异步关闭
            await exceljs_inner_exec(_this,_this.name_lable_map)
            loadingInstance.close();
          },100);
          
        })
      else if(command=="xlsxjs")
          seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js',null,function (){
            let loadingInstance = _this.$loading({ lock: true,
          text: '正在导出',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)' });
            setTimeout(() => { // 以服务的方式调用的 Loading 需要异步关闭
              xlsxjs_inner_exec(_this,_this.name_lable_map)
              loadingInstance.close();
            },100);
        })
    },
    export_excel(){
       let _this=this
       //seriesLoadScripts('cdn/exceljs/exceljs.min.js',null,function (){
       //   exceljs_inner_exec(_this.result)
       //   })
       seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js',null,function (){
            xlsxjs_inner_exec(_this,_this.name_lable_map)
        })
    },
    async export_pdf(){
      let _this=this
      let pdf_data=await get_pdf(this.result)
       _this.pdf_output_dialogVisible=true
       let datauri = URL.createObjectURL(pdf_data)
      _this.$nextTick(()=>{
        document.getElementById("pdf_output").data =datauri
      }) 
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