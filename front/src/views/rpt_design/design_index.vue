<template>
  <div  style="height:calc(100% - 30px); border: 1px solid #eee" class="report_define">
    <ExprEditorDialog  :visible.sync="ExprEditorDialog_visible" 
      :target_obj="action_target"
      :prop="action_name" 
      :report="report">
    </ExprEditorDialog>
    <el-dialog v-draggable v-if="preview_dialogVisible" style="text-align: left;" class="report_define"
        :visible.sync="preview_dialogVisible" :title="'预览'" 
            :close-on-click-modal="false"   :fullscreen="true"
              direction="btt" append-to-body  
        > 
        <preview :grpId="grpId"/>
    </el-dialog> 

    <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" 
      :action_target="ref_gridlayout()" >
    </widgetDialog>

    <datasetManger2 v-if="datamanger_dialogVisible"  :grpId="grpId"
      :visible.sync="datamanger_dialogVisible" > 
    </datasetManger2>  

    <templateManger v-if="notebook_dialog_visible" 
      :visible.sync="notebook_dialog_visible" :action_target.sync="report.template" 
      :parent_defaultsetting="report.parent_defaultsetting"
      @submit="refresh_setting"
      > 
    </templateManger>
    <simpleGuide v-if="simpleGuide_dialogVisible"  :visible.sync="simpleGuide_dialogVisible" :sheet_window="sheet_window" > 
    </simpleGuide>  

    <el-drawer :width="leftWidth" title="参数管理" :visible.sync="paramMangerDrawerVisible" :wrapperClosable="true" :modal="false"> 
        <paramManger :report="report" v-if="paramMangerDrawerVisible"/>          
    </el-drawer>

    <el-container class="form-designer">
     
      <el-container style="height: 100%; border: 1px solid #eee">
          <el-header class="widget-container-header" style="height: 33px;border-bottom:solid 1px silver;padding:2px;" >
            <!-- <el-button type='primary' size="mini"  @click="open_report" >打开</el-button>
            <input type="file" id="openFile" @change="beforUpload"> -->            
            <el-dropdown size="mini" split-button  @click="save_report('common')"  @command="save_report"  type="primary" style="padding-right: 10px;">
              保存
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-check" command="common" divided>普通保存</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check" command="important" divided>保存并备份</el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning-outline" command="force" divided>强制保存</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check" command="download" divided>下载到本地</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button type='primary' size="mini"   @click="preview_run" >预览</el-button>
            <el-button type='primary' size="mini"  icon='el-icon-refresh'  @click="layout_mode='';load_report(report.reportName)" >重载</el-button>
            <el-button type='primary' size="mini"    @click="paramMangerDrawerVisible=true" >参数</el-button>
            <el-button type='primary' size="mini"   @click="datamanger_dialogVisible=true" >数据</el-button>
            <el-button type='primary' size="mini"   @click="notebook_dialog_visible=true" >设置</el-button>
            <el-button type='primary' size="mini"   @click="simpleGuide_dialogVisible=true" >向导</el-button>
            <el-button type='primary' size="mini"   @click="widget_dialogVisible=!widget_dialogVisible">组件</el-button>   

              
            <!-- <el-link :href="baseUrl+'/run'+(report.reportName.split(':')[0]=='default'?'':(':'+report.reportName.split(':')[0]))+'?reportName='+report.reportName.split(':')[1]" target="_blank"> -->
            <el-button type='primary' icon="el-icon-view" size="mini" @click="run_report(baseUrl+'/run'+(report.reportName.split(':')[0]=='default'?'':(':'+report.reportName.split(':')[0]))+'?reportName='+report.reportName.split(':')[1])" >运行</el-button>
            <!-- </el-link> -->
            <div style="display: inline-flex;width:240px;margin:0px;">
              <el-select :value="cur_version" placeholder="请选择" @change="cur_version_change">
                <el-option v-for="(item,idx) in report.versions" :label="(idx==0?'❤':'🔒')+item[0]" :value="item[0]"  :key="item[0]">
                  
                  <span style="float: left">
                    {{(idx==0?'❤':'🔒')+ item[0] }}
                </span>
                  <span style="float: right; color: #8492a6; font-size: 13px;">{{item[1] }}</span>
                </el-option>
              </el-select>     
            </div>
            <div style="display: inline-flex;width:120px;margin:0px;float:right;">
              <el-select v-model="layout_mode" placeholder="请选择">
                <el-option label="设计显示页" value="show"></el-option>
                <el-option label="设计隐藏页" value="hidden"></el-option>
              </el-select>
            </div>
           <!-- <div style="display: inline-flex;width:120px;margin:0px;float:left;">
              <widgetDialog 
                    :action_target="ref_gridlayout()" >
                  </widgetDialog>
              </div> -->
          </el-header>
          <!-- 中间主布局 -->
          <el-main  class="widget-container" ref="grid_layout_form" style="overflow: auto;"  :style="{color:report.defaultsetting['COLOR'],
          background: formIsEmpty ? `url(${widgetEmpty}) no-repeat 50%`: report.defaultsetting['BACKGROUND-COLOR']}"
          
          >
               <grid-layout-form v-if="widgetForm!=null && formType=='gridLayout'" ref="gridlayout"
               :layout.sync="widgetForm" 
               :select.sync="selectWidget"
               :scale="scale"
                @change="handleHistoryChange(widgetForm)"
                >
              </grid-layout-form>          
              
            </el-main>
      </el-container>
      <!-- 右侧配置 -->
      <el-aside class="widget-config-container" :width="rightWidth"> 
        <div style="display:flex;height:100%">
         <el-slider v-if="report.defaultsetting.big_screen=='1'" v-model="scale.v" vertical style="align-self:flex-end;margin: 0;width: 10px;height: 200px;" ></el-slider>
        <ul v-if="cur_select_type=='cell'" ghost-class="ghost" style="padding-left: 10px;font-size:12px;">
            <li  style="display: flex;padding-bottom: 10px;" >
              <label style="width:100px;padding-top:5px;" >扩展方向</label>
              <el-select v-model="cur_cell.cr._extendDirection" placeholder="扩展方向">
                <el-option label="行" value="row"></el-option>
                <el-option label="列" value="column"></el-option>
                <el-option label="无" value="none"></el-option>
              </el-select>
            </li>
            <!--
            <li  style="display: flex;padding-bottom: 10px;" >
              <el-tag style="color:black" >格子类型</el-tag>
              <el-select v-model="cur_cell.cr._CELL_TYPE" placeholder="格子类型">
                <el-option label="原始" value=""></el-option>
                <el-option label="图片" value="img"></el-option>
                <el-option label="html" value="htm"></el-option>
              </el-select>
            </li> -->
            <li v-for="item in [{display:'左顶格',val:'_leftHead',disabled:true},
                      {display:'上顶格',val:'_topHead',disabled:true},
                      {display:'文字颜色',val:'_color'},
                      {display:'背景色',val:'_background-color'},
                      //{display:'字体大小',val:'_FONT-SIZE',disabled:true},
                      {display:'链接',val:'_link'},                            
                      {display:'显示值表达式',val:'_displayValueExpr'},
                      {display:'值表达式',val:'_valueExpr'},
                      {display:'加到style中',val:'_append'},
                      //{display:'pdf输出时，单元格行后分页(true)',val:'_row_page_break'},
                    ]"  
                style="display: flex;padding-bottom: 10px;" :key="item.display" >
              <label style="width:120px;padding-top:5px;">{{item.display}}</label>
              
              <span v-if="item.disabled==true" style="color:red;font-weight: 800;flex: 1;text-align: center;"> {{ cur_cell.cr[item.val] }}
                  </span>
              <el-input :placeholder="'请输入内容:'+item.display" v-model="cur_cell.cr[item.val]" v-else>
              </el-input>
                <el-button  @click="expr_edit(cur_cell.cr,item)" v-if="['_calcLevel'].includes(item.val)==false"
                          circle  :type="item.val=='_valueExpr'?'danger': 'success'" size="mini" icon="el-icon-edit"
                          style="padding: 4px;margin-left: 5px;    width: 30px;height: 30px;">
                </el-button>
            </li>
            <li  style="display: flex;padding-bottom: 10px;" >
              <label style="width:100px;padding-top:5px;" >同值合并方式</label>
              <el-select v-model="cur_cell.cr._combin_way" placeholder="同值合并方式">
                <el-option label="行方向" value="row"></el-option>
                <el-option label="列方向" value="col"></el-option>
                <el-option label="无" value=""></el-option>
              </el-select>
            </li>
        </ul>
        <div v-else-if="selectWidget.type=='cr_row' || selectWidget.type=='cr_col'" >
          <ul ghost-class="ghost" style="padding-left: 10px;font-size:12px;">
            <li  style="display: flex;padding-bottom: 10px;" >
              <label style="width:100px;padding-top:5px;" >是否隐藏：</label>
              <el-input placeholder="返回true，隐藏" v-model="colrow_obj._hidden"></el-input>      
              <el-button  @click="expr_edit(colrow_obj,{display:'行列是否显示的表达式',val:'_hidden'})" circle  type="success" size="mini" icon="el-icon-edit"
                              style="padding: 4px;margin-left: 5px;    width: 30px;height: 30px;">
                    </el-button>    
            </li>
            <li  style="display: flex;padding-bottom: 10px;" v-if="selectWidget.type=='cr_row' " >
              <label style="width:100px;padding-top:5px;" >是否行后分页：</label>
              <el-input placeholder="返回true，行后分页:" v-model="colrow_obj._row_page_break"></el-input>      
              <el-button  @click="expr_edit(colrow_obj,{display:'是否行后分页',val:'_row_page_break'})" circle  type="success" size="mini" icon="el-icon-edit"
                              style="padding: 4px;margin-left: 5px;    width: 30px;height: 30px;"> </el-button>    
          </li>
          </ul>
        </div>
        <widget-config  v-else style="flex:1"
          :data="selectWidget" 
          :layout_config="cur_layout_item"
        ></widget-config>
        </div>
      </el-aside>
    </el-container>


  </div>
</template>

<script>
var color = require('onecolor');
import Draggable from 'vuedraggable'
import paramManger from './paramManger.vue'
import datasetManger2 from './datasetManger2'
import ExprEditorDialog from './ExprEditorDialog.vue'
import widgetEmpty from './assets/widget-empty.png'
import WidgetForm from './WidgetForm'
import WidgetConfig from './WidgetConfig'
import fields from './fieldsConfig.js'
import { mapGetters, mapState } from "vuex";
import {widget_div_layout,widget_row_col_layout} from './fieldsConfig.js'
import history from './mixins/history'
import {luckySheet2ReportGrid,loadFile,saveAs,build_layout,get_signalR_connection,getObjType,getRangeByText,numToString} from './utils/util.js'
import {open_one,save_one,report_as_text,grid_range_level,getAllWidget} from "./api/report_api"
import Preview from './preview.vue'
import simpleGuide from './simpleGuide.vue'
import Config from './config'
import install_component from './install_component'
import templateManger from "./templateManger.vue"
import widgetDialog from "./widgetDialog.vue"
import x2js from 'x2js' 
import { report_cache } from '@/config/env'; 
const x2jsone=new x2js(); //实例


if(window.cr_allWidget==undefined){
  getAllWidget('design_rpt').then(data=>{
      window.cr_allWidget=data
  });    
}
window.cellreport.tool=require("./utils/util")
export default {
  name: "FormDesign",
  mixins: [history],
  components: {paramManger,ExprEditorDialog,simpleGuide,widgetDialog,
        Draggable,widgetEmpty,WidgetForm,WidgetConfig,templateManger,
        datasetManger2, Preview, },
  
  async beforeRouteEnter(to, from, next) {
    const reportName = to.query.label 
    if (reportName) {
      await next(async instance => {  
        let obj=report_cache[reportName ]
        if(obj ){
          await instance.load_report(reportName,obj)
          //delete report_cache[reportName ]
          next()
        }
        else
          await instance.load_report(reportName,undefined)          
        })
    } else {
      next(new Error('未指定reportName'))
    }
  },
    // 在同一组件对应的多个路由间切换时触发
  async beforeRouteUpdate(to, from, next) {
    let _this=this
    //console.info(x2jsone.js2xml({report:this.fields}))
    //console.info("prepare cache:"+_this.report.reportName)    
    this.save_fix()
    this.layout_mode=''
    if(_this.cur_version==_this.report.versions[0][0])
    {
      report_cache[_this.report.reportName]={
        report_content:x2jsone.js2xml({report:_this.report}),
        conn_list:_this.report.conn_list,
        range_level:_this.report.range_level,
        defaultsetting:_this.report.defaultsetting,
        versions:_this.report.versions,
        cur_version:_this.report.cur_version,
        parent_defaultsetting:_this.report.parent_defaultsetting
      }
    }
    const reportName = to.query.label || to.meta.id
    if (reportName) {
      let obj=report_cache[reportName ]
      await _this.load_report(reportName,obj)
      next()
    } else {
      next(new Error('未指定reportName'))
    }
  },
    // 离开设计页面时触发
  beforeRouteLeave(to, from, next) {
    let _this=this    
    this.save_fix()
    this.layout_mode=''
    if(_this.cur_version==_this.report.versions[0][0]){
      report_cache[_this.report.reportName]={
        report_content:x2jsone.js2xml({report:_this.report}),
        conn_list:_this.report.conn_list,
        range_level:_this.report.range_level,
        defaultsetting:_this.report.defaultsetting,
        parent_defaultsetting:_this.report.parent_defaultsetting,
        versions:_this.report.versions,
        cur_version:_this.report.cur_version
      }
    }
    next();
  },
  created() {
    Vue.use(Config)
    Vue.use(install_component)
    Vue.component('widgetDialog', widgetDialog);
    //Vue.component('draggable', draggable);
    let url_arr=window.location.href.split('?')
    if(url_arr.length>0){
      let cs = url_arr[1];                //获取?之后的参数字符串
      let cs_arr = cs.split('&');                    //参数字符串分割为数组
      cs={};
      for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
      }
      if (cs.reportName)
        this.load_report(window.location.hash??0,cs.reportName)
    }
  },
  props: {
    options: {
      type: [Object, String],
      default: () => {
        return {
          column: []
        }
      }
    },
    storage: {
      type: Boolean,
      default: false
    },
    asideLeftWidth: {
      type: [String, Number],
      default: '200px'
    },
    asideRightWidth: {
      type: [String, Number],
      default: '310px'
    },
    showGithubStar: {
      type: Boolean,
      default: true
    },
    toolbar: {
      type: Array,
      default: () => {
        return ['import', 'generate', 'preview', 'clear']
      }
    }
  },
  provide() {
    return this.createContext()
  },
  computed: {
    widgetForm_str(){
      return JSON.stringify(this.widgetForm,null,4)
    },
    ...mapGetters([
      "userInfo",
    ]),
    cull_cell_cr(){
      if(this.cur_cell!=undefined && this.cur_cell.cr==undefined )
        this.cur_cell.cr={"_leftHead":"","_topHead":"","_color":"","_background-color":"",
"_link":"","_displayValueExpr":"=@value","_valueExpr":"",
"_calcLevel":"","_FONT-SIZE":"","_text-align":"",}
      if(this.cur_cell.cr)
        return JSON.parse(JSON.stringify(this.cur_cell.cr))
      else
        return JSON.parse('{ }')
    },
    formIsEmpty(){
      return (this.formType=='gridLayout' && this.widgetForm.length == 0) 
           ||(this.formType!='gridLayout' && this.widgetForm?.children?.column?.length == 0)
    },
    formType(){
      if (Array.isArray(this.widgetForm))
      return 'gridLayout'
      else
      return 'divLayout'
    },
    leftWidth() {
      if (typeof this.asideLeftWidth == 'string') {
        return this.asideLeftWidth
      } else {
        return `${this.asideLeftWidth}px`
      }
    },
    rightWidth() {
      if (typeof this.asideRightWidth == 'string') {
        return this.asideRightWidth
      } else {
        return `${this.asideRightWidth}px`
      }
    },
    grpId(){
      return this.report.reportName.split(":")[0]
    },
    allDsName(){
      let ret=new Set()
      this.report.dataSets.dataSet.forEach(x=>{ret.add(x._name)})
      return ret
    }
  },
  data(){
      return {    
        clickedEle:{},//存放点击后的数据，可以被其他元素引用
        cur_version:"",
        report_result:{//报表定义内容
              
          },//报表运行后的结果
        in_exec_url:{stat:false},//当前是否已经在点击后取数
        preview_dialogVisible:false,
        scale:{x:100,y:100,v:100},
        simpleGuide_dialogVisible:false,
        widget_dialogVisible:false,
        datamanger_dialogVisible:false,
        paramDialog_visible:false,
        notebook_dialog_visible:false,
        ExprEditorDialog_visible:false,        
        all_sheet_windows:[],//存放所有的表格windows,为了在save 前保存冻结的行列。
        fresh_ele:[],//存放点击后更新的元素名称
        allElementSet:new Set(),//所有有ID名称的集合
        paramMangerDrawerVisible:false,
        fieldsDrawerVisible:false,
        action_target:{sql:'',dataSource:'',name:'',type:''},
        action_name:{display:'-',val:'-'},
        cur_cell:{"cr":{"_leftHead":"","_topHead":"","_color":"","_background-color":"",
"_link":"","_displayValueExpr":"=@value","_valueExpr":"",
"_calcLevel":"","_FONT-SIZE":"","_text-align":"",}},
        cur_sheet:null,
        sheet_window:null,
        cur_layout_item:null,
        can_watch_cell:false,//因为第一次切换单元格后就会执行update cell ，用他来避免首次更新不必要的计算
        layout_mode:"show",
        cur_select_type:'Acell',
        fields,
        widgetEmpty, 
        canDraggable:true,
        selectWidget: {},
        in_cub:false,
        report:{//报表定义内容
              dataSets:{dataSet:[]}
              ,params:{param:[]}
              ,AllGrids:{HtmlText:[],grid:[]}
              ,reportName:"",defaultsetting:{}
          },
        widgetForm: widget_row_col_layout(),//布局显示
       queryForm:{},
       colrow_obj:{_hidden:'',_row_page_break:''}
      }
  },
  methods:{
    has_name(name){
      if(this.allElementSet.has(name)){
        this.$alert("名字不能重复");
        return true;
      }
      if(this.report.dataSets.dataSet.filter(x=>x._name==name).length>0){
        this.$alert("名字不能和数据集名称重复");
        return true;
      }
      return false
    },
    cur_version_change(new_val){
      if(this.cur_version==this.report.versions[0][0]){
        report_cache[this.report.reportName]={
          report_content:x2jsone.js2xml({report:this.report}),
          conn_list:this.report.conn_list,
          range_level:this.report.range_level,
          defaultsetting:this.report.defaultsetting,
          versions:this.report.versions,
          cur_version:this.cur_version,
          parent_defaultsetting:this.report.parent_defaultsetting
        }
      }
      let obj=report_cache[this.report.reportName ]
      if(obj && new_val==this.report.versions[0][0]){
        this.load_report(this.report.reportName,obj,obj.cur_version)
        delete report_cache[this.report.reportName ]
      }else
        this.load_report(this.report.reportName,undefined,new_val)
      this.cur_version=new_val
    },
    createContext(){
      return {
      context:{
        report_result:this.report_result,
        report:this.report,
        queryForm:this.queryForm,
        canDraggable:this.canDraggable,
        selectChange:this.selectChange,    
        cellUpdateBefore:this.cellUpdateBefore,    
        updated:this.lucky_updated,
        rangePasteBefore:this.rangePasteBefore,
        design:true,
        selectWidget:this.selectWidget,        
        clickedEle:this.clickedEle,
        in_exec_url:this.in_exec_url,
        mode:"design",
        rpt_this:this,
        allElementSet:this.allElementSet,
        all_sheet_windows:this.all_sheet_windows,
        parent_defaultsetting:this.report.parent_defaultsetting,
        fields:this.fields   ,
        scale:this.scale,
        templateGuide:`以等号开始的是公式，如：=cur_ds?cur_ds[1][4]:14<br/>
      cur_ds是指定的依赖数据集的数据，为一个二维数组，第一行是列名，第二行开始是数据。计数是从0开始。
      <br/>也就是说cur_ds[1]就是数据集的第一行数据
      <br/>非等号开始为普通字符串
      <br/>如果这里不能满足复杂需要，可以直接点击上面的编辑模板进行编辑`,    
      }, 
      fresh_ele:this.fresh_ele,
      clickedEle:this.clickedEle,
      has_name:this.has_name
    }
    },
    ref_gridlayout()
    {
      return this.$refs.gridlayout
    },
    onEnd(e,o){
       //if (e.draggedContext?.element?.id == 4) 
       // return true;
       return true;
      
    },
    load_report(reportName,data,cur_version){
      Object.keys(this.report_result).forEach(key=>{
        delete this.report_result[key]
      })
      let _this=this
      let isNew=false;
      if(isNew){
        this.report={
                range_level:[],
                dataSets:{dataSet:[]}
                ,params:{param:[]}
                ,template:{}
                ,AllGrids:{HtmlText:[],grid:[{_name:"main",_title:"main" }]}
            }
        this.widgetForm=widget_div_layout({
                  "type": "luckySheetProxy",
                  "label": "自由格式报表",
                  "display": true,
                  "style": {
                      "height": "100%"
                  },
                  "gridName": "main",
                  "span": 24,
                  "component": "luckySheetProxy",
                  "prop": "1609810549191_18237"
              })
        return
      }
      _this.widgetForm=null
      setTimeout(function(){
        if(data){
          _this.report.layout=undefined
          _this.set_report(reportName,data)
          _this.cur_version=cur_version??_this.report.versions[0][0]
          _this.report.cur_version=_this.cur_version
        }else
        open_one(reportName,cur_version).then(response_data => {      
          if(response_data.errcode)
          {
            _this.$notify({title: '提示',message: response_data.message,type: 'error',duration:0});
            return
          }
          _this.set_report(reportName,response_data)
          
          _this.cur_version=cur_version??_this.report.versions[0][0]
          _this.report.cur_version=_this.cur_version
        }).catch(error=> {
            _this.$notify({title: '提示',message: error.toString(),type: 'error',duration:0});
            if(error.response_data)
              _this.$notify({title: '提示',message: error.response_data,type: 'error',duration:0});          
        })
      })      
    },
    set_report(reportName,response_data){
      let _report=x2jsone.xml2js(response_data.report_content).report
      if(_report.notebook==undefined)
        _report.notebook=""
      _report.versions=response_data.versions
      if(_report._zb_var_){
        this.report_result._zb_var_=JSON.parse(_report._zb_var_)
      }
      if(typeof _report.dataSets.dataSet=="string")
        _report.dataSets.dataSet=[]
      if(typeof _report.params.param=="string")
        _report.params.param=[]
      if(_report.template==undefined || _report.template=='')
        _report.template={}
      if(_report.AllGrids==undefined)
        _report.AllGrids={}
      if(getObjType(_report.grid)=='object'){
        if(_report.grid._name==undefined)
          _report.grid._name="main"
          _report.AllGrids.grid=[_report.grid]
      }
      delete _report.grid
      if(getObjType(_report.AllGrids.grid)=='object')
        _report.AllGrids.grid=[_report.AllGrids.grid]
      if(getObjType(_report.AllGrids.HtmlText)=='object'){
        _report.AllGrids.HtmlText=[_report.AllGrids.HtmlText]
      }
      if(_report.AllGrids.grid==undefined || _report.AllGrids.grid=="")
        _report.AllGrids.grid=[]
      if(_report.AllGrids.LargeDataGrid){
          if(getObjType(_report.AllGrids.LargeDataGrid) =="object"){
            //_report.AllGrids.LargeDataGrid._is_large=1
            _report.AllGrids.grid.push(_report.AllGrids.LargeDataGrid)
          }
          else{
            _report.AllGrids.LargeDataGrid.forEach(ele=>{
                //ele._is_large=1
                _report.AllGrids.grid.push(ele)
            })
          }
        delete _report.AllGrids.LargeDataGrid
      }
      

      this.report.layout=undefined
      this.report.AllGrids={HtmlText:[],grid:[]}
      delete this.report._zb_var_
      Object.assign(this.report,_report)
      this.report.conn_list=response_data.conn_list
      this.report.range_level=response_data.range_level
      this.report.defaultsetting=response_data.defaultsetting
      this.report.parent_defaultsetting=response_data.parent_defaultsetting
      if(this.report.defaultsetting && this.report.defaultsetting['BACKGROUND-COLOR']=="")
        this.report.defaultsetting['BACKGROUND-COLOR']="transparent"
      this.report.reportName=reportName
      
      if(this.report.layout&&this.report.layout!='null'){
        this.widgetForm=JSON.parse(this.report.layout)
          if (!Array.isArray(this.widgetForm))
          this.change_layout()  
      }
      else{// 将没有layout 的老报表转换为有layout
        this.widgetForm=build_layout(this.report.AllGrids)    
        this.change_layout()  
      }
      if(!this.report.layout_hidden || this.report.layout_hidden=="null"){
        this.report.layout_hidden='[]'
      }
      this.layout_mode='show' 
      this.allElementSet.clear()
      _report.AllGrids.grid.forEach(x=>this.allElementSet.add(x._name) )
      
      if(getObjType(this.report.dataSets.dataSet)=="object")
        this.report.dataSets.dataSet=[this.report.dataSets.dataSet]
      if(getObjType(this.report.params.param)=="object")
        this.report.params.param=[this.report.params.param]      
      if(this.report.dataSets.dataSet[0]=="")
        this.report.dataSets.dataSet.splice(0,1)
      this.report.dataSets.dataSet.forEach(element => {
          if(element._fields==undefined){
            element._fields="[]"
          }
      });
      //this.selectWidget={}
      if(this.report.defaultsetting.big_screen=='1'){
        this.scale.y=100*this.$refs.grid_layout_form.$el.clientHeight/parseInt(this.report.defaultsetting.screen_height)
        this.scale.x=100*this.$refs.grid_layout_form.$el.clientWidth/parseInt(this.report.defaultsetting.screen_width)
        this.scale.v=Math.min(this.scale.x,this.scale.y)  
        //this.big_screen_scale_x=this.big_screen_scale_y=this.big_screen_scale_x 
      }
      this.setSelectWidgetForLayout();
    },
    notebook_handleSubmit(){
      this.notebook_dialog_visible=false
    },
    setSelectWidgetForLayout(){
      this.$nextTick(() => {
        this.cur_select_type="Acell"
        this.selectWidget={type:'layout',config:this.report.defaultsetting}
        if(this.selectWidget.config.border_option==undefined)
            this.$set(this.selectWidget.config,'border_option',{color:["#83bff6","#00CED1"]})
      });
    },
    change_layout(){
       if (Array.isArray(this.widgetForm))//gridLayout=>divLayout 更旧的格式
       {
          let children=this.widgetForm
          this.widgetForm=widget_div_layout()
          children.forEach(ele=>{
            if(ele.element.children){
              ele.element.children.column.forEach(one_ele=>{
                one_ele.span=ele.w*2
                this.widgetForm.children.column.push(one_ele)
              })
            }else
              this.widgetForm.children.column.push(ele.element)
          });
      }
      else// divLayout=>gridLayout
      {
        if(this.widgetForm.children?.column){//旧格式
          let children=this.widgetForm.children.column
          this.widgetForm=[]
          children.forEach(ele=>{
            this.gridLayoutAddItem(ele,children.length==1?24:ele.span,10);//10 是新建报表时的缺省高度
          });
        }else{
          let child=this.widgetForm // 现在直接用组件作为layout 的element 
          this.widgetForm=[]
          this.gridLayoutAddItem(child,24,10);//10 是新建报表时的缺省高度
        }
        this.report.layout = JSON.stringify(this.widgetForm)
      }
      
    },
    gridLayoutAddItem(item,p_w,p_h){
        let insert_item=item//widget_div_layout(item)
        let x=0,w=p_w||2,   h=p_h||2,y=0             
        while(true){
            let all_correct=true
            this.widgetForm.forEach(element => {
                if( ((x>= element.x && x< element.x +element.w ) && (y>= element.y && y< element.y +element.h ) ) ||
                    ((element.y>= y && element.y< y +h ) && (element.x>= x && element.x< x +w ) )
                ){
                    all_correct=false
                      return false
                }
            });
              if(all_correct)
                    break;
            x++
            if(x+2>12) //col_num
            {
                x=0
                y++
            }
        }
        let idx=0;
        while(this.widgetForm.find(element => element.i==idx )){
          idx++
        }
        this.widgetForm.push({x,y,w,h,i: idx,element:insert_item });
    },
    findGridInWidgeForm(form,gridName){
      if (Array.isArray(form)){
        for(let i=0;i<form.length;i++){
          let result=this.findGridInWidgeForm(form[i].element,gridName)
          if(result)
            return result
        }
      }else{
        if(form.component=="luckySheetProxy" &&  form.gridName==gridName)
          return form
        if(form.children==undefined)
          return null
        let children=form.children.column
        for(let i=0;i<children.length;i++){
          let result=this.findGridInWidgeForm(children[i],gridName)
          if(result)
            return result
        } 
      }
      return null
    },
        // 加载icon
    
    //-=========================    
  selectChange(sheet,luckysheet_select_save,sheet_window){
        this.cur_sheet=sheet
        this.sheet_window=sheet_window
        let cur_postion=sheet.luckysheet_select_save[0]
        if(cur_postion.row_select && cur_postion.column_select ){
          this.selectWidget=this.findGridInWidgeForm(this.widgetForm,sheet_window.gridName)
          return
        }
        if(cur_postion.row_select ){
          this.selectWidget={prop:'--'}
          let obj=sheet.cr_rows[cur_postion.row_focus]
          Object.keys(this.colrow_obj).forEach(x=>this.colrow_obj[x]='');
          Object.assign(this.colrow_obj, obj)
          this.selectWidget={type:'cr_row',data:obj}
          return
        }
        if(cur_postion.column_select ){
          this.selectWidget={prop:'--'}
          let obj=sheet.cr_columns[cur_postion.column_focus]
          Object.keys(this.colrow_obj).forEach(x=>this.colrow_obj[x]='');
          Object.assign(this.colrow_obj, obj)
          this.selectWidget={type:'cr_col',data:obj}     
          return          
        }
        this.cur_select_type='cell'
        this.selectWidget={prop:'--'}

        
        let cell=sheet.data[cur_postion.row_focus][cur_postion.column_focus]
        if(this.cur_cell!= cell)
          this.can_watch_cell=false//切换单元格后，对cur_cell.cr的第一次监控 ，不需要监控
        let default_cr={"_displayValueExpr":"=@value","_valueExpr":"",'_extendDirection':"none"
                        ,'_FONT':this.report.defaultsetting["FONT"]
                        ,'_FONT-SIZE':this.report.defaultsetting["FONT-SIZE"]
                        ,'_background-color':this.report.defaultsetting["BACKGROUND-COLOR"]
                        ,'_color':this.report.defaultsetting["COLOR"]
                  }
        if(cell){
          cell.cr={...default_cr ,...cell.cr}
          this.cur_cell= cell
        }
        else 
        this.cur_cell={"cr":default_cr}  
    },
    
    expr_edit(cur_cell,prop){
        this.sheet_window.luckysheet.exitEditMode()//退出编辑模式，进入表达式输入对话框，否则对话框中输入的内容将没作用
        this.action_name=prop
        this.action_target=cur_cell
        this.ExprEditorDialog_visible=true
    },
    cellUpdateBefore(r, c, value, isRefresh){
      let cell=this.sheet_window.luckysheet.getSheet(0).data[r][c]
      
      if(cell && cell.ct && cell.ct.t=='inlineStr' ){
        cell.v=cell.m=value
        cell.ct.t='g'
        cell.ct.fa="General"
        delete cell.ct.s
      }
      if(cell && cell.ff==undefined)
        cell.ff=this.report.defaultsetting["FONT"]
      if(cell && cell.fs==undefined)
        cell.fs=this.report.defaultsetting["FONT-SIZE"]
      if(cell && cell.fc==undefined)
        cell.fc=this.report.defaultsetting["COLOR"]
      if(cell && cell.bg==undefined)
        cell.bg=this.report.defaultsetting["BACKGROUND-COLOR"]
    },
    rangePasteBefore(select_save,txtdata,copy_save){
      if(copy_save.copyRange==undefined || select_save.length>1 || copy_save.copyRange.length>1)
        return 
      this.rangePaste_val={column:select_save[0].column_focus- copy_save.copyRange[0].column[0],
          row:select_save[0].row_focus- copy_save.copyRange[0].row[0]}      
      return
    },
    add_del_rc_rebuild_expr(val,cur_expr){
        let regex = new RegExp("\\b[a-z|A-Z]{1,2}\\d{1,2}\\b","igm");          
        let new_expr=[]
        let word
        let expr_pos=0
        if(cur_expr==undefined || cur_expr.startsWith==undefined || cur_expr.startsWith("=")==false)
          return cur_expr
        {
            while (( word = regex.exec(cur_expr)) != null)  {
                new_expr.push( cur_expr.substring( expr_pos,word.index))  
              expr_pos=regex.lastIndex
              if(this.allDsName.has(word[0]) || word[0]<5){
                new_expr.push( word[0])//===== 
                continue
              }
              // 加上对数据集名字的判断
              let pos_rc=getRangeByText(word[0])
              if(  isNaN( pos_rc.r) || pos_rc.c<0 ){
                new_expr.push( word[0])//=====
                continue
              }
              if(val.ctrlValue && val.ctrlValue.rc=='r' && pos_rc.r>=val.ctrlValue.index){
                if("addRC"==val.type)
                  pos_rc.r=pos_rc.r + val.ctrlValue.len
                else
                  pos_rc.r=pos_rc.r - val.ctrlValue.len
              }
              else if(val.ctrlValue && val.ctrlValue.rc=='c' && pos_rc.c>=val.ctrlValue.index){
                if("addRC"==val.type)
                  pos_rc.c=pos_rc.c + val.ctrlValue.len
                else
                  pos_rc.c=pos_rc.c - val.ctrlValue.len
              }else if(val.column!=undefined){
                pos_rc.c=pos_rc.c + val.column
                pos_rc.r=pos_rc.r + val.row
              }
              if(pos_rc.c<0 || pos_rc.r<0 ){
                new_expr.push( word[0])//=====
                continue
              }
              new_expr.push(numToString(pos_rc.c+1) +(pos_rc.r+1) )//=====
            }
            new_expr.push( cur_expr.substring( expr_pos,cur_expr.length)) 
            return new_expr.join("")
        }
    },
    lucky_updated(val,from_cull_cell_cr){
      let _this=this
      // 如果从这里的setCellValue API进入，则不执行，防止递归循环
      if(this.setCellFromAPI){
        return
      }
      this.setCellFromAPI = true;
      function _inner_add_del(cell,val){
        if(cell && cell.mc && cell.mc.rs==undefined){
          delete cell.v
          delete cell.m
          return
        }
        if(cell.cr==undefined){
          _this.$set(cell,'cr',{_displayValueExpr:"=@value"})
        }
        else//luckysheet 的bug，新插入的行列，会将cr属性共享到当前行列
          _this.$set(cell,'cr',JSON.parse(JSON.stringify(cell.cr)))
        cell.cr._valueExpr=cell.m=cell.v= _this.add_del_rc_rebuild_expr(val,cell.v)
        cell.cr['_displayValueExpr']= _this.add_del_rc_rebuild_expr(val,cell.cr['_displayValueExpr'])
        if(cell.cr['_background-color']!=undefined)
        cell.cr['_background-color']= _this.add_del_rc_rebuild_expr(val,cell.cr['_background-color'])
        if(cell.cr['_color']!=undefined)
          cell.cr['_color']= _this.add_del_rc_rebuild_expr(val,cell.cr['_color'])
        if(cell.cr['_leftHead']!=undefined && cell.cr['_leftHead'].trim()!='')
          cell.cr['_leftHead']= _this.add_del_rc_rebuild_expr(val,"="+cell.cr['_leftHead']).substring(1)
        if(cell.cr['_topHead']!=undefined && cell.cr['_topHead'].trim()!='')
          cell.cr['_topHead']= _this.add_del_rc_rebuild_expr(val,"="+cell.cr['_topHead']).substring(1)
      }

      let grid= this.report.AllGrids.grid.find(a=>a._name==_this.sheet_window.gridName)
      function add_rc(val){
        if(_this.sheet_window.luckysheet.is_in_simapleGuid){
          delete _this.sheet_window.luckysheet.is_in_simapleGuid
         return
        }
        //删除被lucky添加的无用单元格
        if("addRC"==val.type){
          _this.cull_cell_cr={}
          let ctrlValue=val.ctrlValue
          //{"index": 8, "len": 1, "direction": "lefttop","rc": "c", "restore": false}
          if(ctrlValue && ctrlValue.rc=='r'){
            if(ctrlValue.direction=="lefttop"){
              for(let row=ctrlValue.index ;row<ctrlValue.index  + ctrlValue.len;row++){
                  for(let col=0  ;col<val.curData[row].length  ;col++){
                      let cell=val.curData[row][col]
                      if(cell?.mc){
                        delete cell.cr
                        continue
                      }
                      else{
                        val.curData[row][col]=null
                      }

                  }
                }
            }else{
              for(let row=ctrlValue.index +1 ;row<=ctrlValue.index  + ctrlValue.len;row++){
                  for(let col=0  ;col<val.curData[row].length  ;col++){
                      let cell=val.curData[row][col]
                      if(cell?.mc){
                        delete cell.cr
                        continue
                      }
                      else{
                        val.curData[row][col]=null
                      }

                  }
                }
            }
          }
          else if(ctrlValue && ctrlValue.rc=='c'){
            if(ctrlValue.direction=="lefttop"){
              for(let row=0;row<val.curData.length;row++){
                  for(let col=ctrlValue.index  ;col<ctrlValue.index  + ctrlValue.len  ;col++){                      
                      let cell=val.curData[row][col]
                      if(cell?.mc){
                        delete cell.cr
                        continue
                      }
                      else{
                        val.curData[row][col]=null
                      }
                  }
                }
            }else{
              for(let row=0;row<val.curData.length;row++){
                  for(let col=ctrlValue.index+1  ;col<=ctrlValue.index  + ctrlValue.len  ;col++){                      
                      let cell=val.curData[row][col]
                      if(cell?.mc){
                        delete cell.cr
                        continue
                      }
                      else{
                        val.curData[row][col]=null
                      }
                  }
                }
            }
          }
        }
      }//end function add_rc
      try{
        add_rc(val)
        if(["addRC","delRC"].includes( val.type)){
          let lucky_sheet=this.sheet_window.luckysheet.getSheet(0)
          let cur_rc=val.ctrlValue.rc=='r' ? lucky_sheet.cr_rows :lucky_sheet.cr_columns
          if(val.type=="delRC"){
              cur_rc.splice(val.ctrlValue.index,val.ctrlValue.len)            
          }
          if(val.type=="addRC"){            
              cur_rc.splice(val.ctrlValue.index + (val.ctrlValue.direction=="lefttop"?0:1), 0, ...Array(val.ctrlValue.len).fill({_hidden:''}));
          }
          
          for(let row=0;row<val.curData.length;row++){
            for(let col=0;col<val.curData[row].length;col++){
              let cell=val.curData[row][col]
              if(cell==null || (cell.mc!=undefined && cell.v==undefined )  )
                continue;
              if(cell.mc!=undefined && val.curConfig['merge'][`${cell.mc.r}_${cell.mc.c}`]==undefined){
                delete cell.mc
              }
              if( cell.mc==undefined && (cell.cr==undefined || JSON.stringify(cell.cr)=="{}")){
                val.curData[row][col]=null
                continue;
              }
              _inner_add_del(cell,val)
            }
          }
        } //*/
        if(this.rangePaste_val){
          let curData=this.sheet_window.luckysheet.getSheet(0).data  
          val.range?.forEach(one_range=>{
            for(let r=one_range.row[0];r<=one_range.row[1];r++){
              for(let c=one_range.column[0];c<=one_range.column[1];c++){
                let cell=curData[r][c]
                if(cell==null  )
                  continue;              
                if (cell.mc!=undefined && cell.v==undefined )
                  continue
                let old_cell=curData[r-this.rangePaste_val.row][c-this.rangePaste_val.column]
                cell.cr=JSON.parse(JSON.stringify(old_cell.cr))
                cell.v=cell.m=cell.cr._valueExpr
                _inner_add_del(cell,this.rangePaste_val)   
              }
            }
          })
          this.rangePaste_val=undefined
        }
        if(!grid || !val || !val.range || val.type=="deleteCell"){
          return false
        }
        
        //range_level
        let cacheCells=[]
        let data=this.sheet_window.luckysheet.getSheet(0).data
        val.range?.forEach(one_range=>{
          for(let r=one_range.row[0];r<=one_range.row[1];r++){
            for(let c=one_range.column[0];c<=one_range.column[1];c++){
              let cell=data[r][c]
              if(cell ){
                if(cell.v==undefined && cell.mc!=undefined && cell.mc.cs==undefined)//不处理合并单元格
                  continue
                if(!cell.cr) cell.cr={"_displayValueExpr":"=@value"}
                if(cell.cr['_displayValueExpr']==undefined)
                  cell.cr['_displayValueExpr']="=@value"
                
                if(cell.bg && !cell.cr['_background-color']?.startsWith("=") && !from_cull_cell_cr) 
                  cell.cr["_background-color"]=cell.bg
                if(cell.fc && !cell.cr['_color']?.startsWith("=") && !from_cull_cell_cr) 
                  cell.cr['_color']=cell.fc

                if(cell.fs) cell.cr['_FONT-SIZE']=cell.fs
                if(cell.ff) cell.cr['_FONT']=cell.ff
                if(cell.bl!=undefined) cell.cr['_BOLD']=(cell?.bl==1?"True":"False")
                cell.cr['_text-align']=(cell.ht=='0'?"center":(cell.ht=='1'?"left":'right'))
                cell.cr['_vertical-align']=(cell.vt=='0'?"middle":(cell.vt=='1'?"top":'bottom'))
                if(cell.it!=undefined) cell.cr['_ITALIC']=cell.it==1 ?"True" :"False"
                if(cell.cl!=undefined) cell.cr['_UNDERLINE']=cell.cl==1 ?"True" :"False"
                if(cell.f &&  cell.f.startsWith("=")) //
                  cell.cr._valueExpr=cell.v=cell.m=cell.f
                else
                  cell.cr._valueExpr=cell.m=cell.v??""
                let v=cell.cr._valueExpr
                if(!cell.cr._extendDirection && typeof v=='string' && v.search("^=.*(select|group)")>=0)
                  cell.cr._extendDirection="row"
                let cellCopy=JSON.parse(JSON.stringify(cell))  //$.extend(true,{},cell)

                if(cell && cell.ct && cell.ct.t=='inlineStr' ){
                  cell.v=cell.m=value
                  cell.ct.t='g'
                  cell.ct.fa="General"
                  delete cell.ct.s
                }
                if(cell && cell.ff==undefined)
                  cell.ff=this.report.defaultsetting["FONT"]
                if(cell && cell.fs==undefined)
                  cell.fs=this.report.defaultsetting["FONT-SIZE"]
                if(cell && cell.fc==undefined)
                  cell.fc=this.report.defaultsetting["COLOR"]
                if(cell && cell.bg==undefined)
                  cell.bg=this.report.defaultsetting["BACKGROUND-COLOR"]
                cacheCells.push({r,c,cellCopy})
              }
            }
          }
        })
        
        //cacheCells.forEach(one=>{
        //  this.sheet_window.luckysheet.setCellValue(one.r,one.c,one.cellCopy);  
        //})
        if(cacheCells.length>0 && val?.type!="datachange"){//数据修改后，已经正确设置了
          this.can_watch_cell=false//切换单元格后，对cur_cell.cr的第一次监控 ，不需要监控
          this.cur_cell=cacheCells[0].cellCopy
        }
      }
      finally{
        this.test_and_refresh()
      }
    },  
    test_and_refresh(){
      let _this=this
      setTimeout(async () => {
          let grid= _this.report.AllGrids.grid.find(a=>a._name==_this.sheet_window.gridName)
          let aaa=luckySheet2ReportGrid( _this.sheet_window,_this.report.defaultsetting)
          
          $.extend(grid,aaa.grid);  
          try{
            _this.setCellFromAPI = true;
            _this.report.range_level=await grid_range_level(_this.report)
          }catch(ex){
             _this.setCellFromAPI = false; //状态重置
            return
          }
            _this.sheet_window.luckysheet.refresh()
            setTimeout(()=>{
              _this.setCellFromAPI = false; //状态重置
            })
        }, 0);
    },
    preview_run(){
      this.save_fix()
      this.preview_dialogVisible=true
      
    },
    save_layout(val){
      if(val=="show"){
        this.report.layout=JSON.stringify( this.widgetForm, null, 4)
      }
      if(val=="hidden"){
        this.report.layout_hidden=JSON.stringify( this.widgetForm, null, 4)
      }
    },
    save_fix(){
      this.save_layout(this.layout_mode)
      this.all_sheet_windows.forEach(one=>{
        if(one._window && one._window.luckysheet){
          let grid=this.report.AllGrids.grid.find(a=>a._name==one.gridName)
          let sheet=one._window.luckysheet.getSheet(0)
          grid._fix_rows=sheet.freezen?.horizontal?.freezenhorizontaldata[1] ||-1
          grid._fix_cols=sheet.freezen?.vertical?.freezenverticaldata[1] ||-1
        }
      })      
    },
    save_report(save_type){
      let _this=this
      _this.save_fix()
      if(save_type=='download'){
          let txt=report_as_text(_this.report)//.replace(/&amp;/g, '&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#39;/g,'\'').replace(/&quot;/g,'\"');
          saveAs(new Blob([txt], { type: "application/octet-stream"}),this.report.reportName.split(":")[1].split("/").slice(-1));
          return;
      }
      if(save_type!='force' && this.cur_version!=this.report.versions[0][0]){
          this.$alert("历史版本不能修改，不能保存！如果需要作为最新版本，请使用强制保存！");
          return;
      }
      
      if(this.cur_version!=this.report.versions[0][0]){
        this.$confirm('此操作将使历史版本提升到最新（并备份当前版本）, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'})
        .then(() => {
          inner_exec();
        }).catch(() => {
          this.$message({type: 'warning',message: '已取消覆盖'});          
        });
      }else
        inner_exec();
      
      function inner_exec(){
        if(_this.report.reportName.split(":")[1].startsWith("大屏/")){
          _this.setSelectWidgetForLayout();
          setTimeout(()=>{
            html2canvas(document.getElementById('cr_gridLayout'), {
              width: _this.report.defaultsetting.screen_width*_this.scale.v/100, // canvas宽度
              height: _this.report.defaultsetting.screen_height*_this.scale.v/100, // canvas高度
              //scale:2,
              //dpi:300,
              foreignObjectRendering: true, // 是否在浏览器支持的情况下使用ForeignObject渲染
              useCORS: true, // 是否尝试使用CORS从服务器加载图像
              async: false, // 是否异步解析和呈现元素
                backgroundColor: null,
              
              }).then(canvas => {
                function dataURLtoFile (dataurl, filename) {
                  var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                  while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                  }
                  return new File([u8arr], filename, { type: mime });
                }
                var file = dataURLtoFile(canvas.toDataURL('image/jpeg', 0.1), new Date().getTime()  + '.jpg');
                save_one({reportName:_this.report.reportName},file)
              })
          },50)
        }
        if(save_type=='common'||save_type=='force'){
          _this.report.cur_version=_this.cur_version
          save_one(_this.report,null,"").then(x=>{
              if(x.errcode!=0){
                _this.$alert(x.message, '提示', {confirmButtonText: '确定',type: 'warning'});
              }else{
                delete report_cache[_this.report.reportName]
                _this.report.versions=x.versions
                _this.report.cur_version=_this.cur_version=x.versions[0][0]
                _this.$message.success(x.message);
              }
            }) 
          return
        }
        //save_type=='important' 
        _this.$DialogForm.show({
          title: '添加说明可以备份当前版本',  width: '30%',  menuPosition:'right',
          option:  {
            submitText: '保存',span:24,
            column: [{label: "说明", labelPosition:'top',type:'textarea',minRows:3,maxRows:5, prop: "desc"  }]
          },
          callback:(res)=>{
            _this.report.cur_version=_this.cur_version
            console.log(_this.cur_version,res.data);
            save_one(_this.report,null,res.data.desc).then(x=>{
              res.done();
              res.close();
              if(x.errcode!=0){
                _this.$alert(x.message, '提示', {confirmButtonText: '确定',type: 'warning'});
              }else{
                delete report_cache[_this.report.reportName]
                _this.report.versions=x.versions
                _this.report.cur_version=_this.cur_version=x.versions[0][0]
                _this.$message.success(x.message);
              }
            }).catch(error=> { 
                _this.$notify({title: '提示',message: error,type: 'error',duration:0});
            })
          }});
        }
    },
    show_versions(){

    },
    async run_report(url){
      if(navigator?.clipboard && navigator.clipboard.writeText)
        await navigator.clipboard.writeText(url)
      let newA = document.createElement('a');
      newA.target = '_blank';
      newA.href = url;
      document.body.appendChild(newA);
      newA.click();
      document.body.removeChild(newA);
      //console.info(x2jsone.js2xml({report:this.report}))
    },
    refresh_setting(){
      let _this=this
      let old_widgetForm=_this.widgetForm
      _this.selectWidget={}
      _this.widgetForm=null
      setTimeout(()=>{
        _this.widgetForm=old_widgetForm
      })
    }
  },
  
  watch: { 
    layout_mode(newVal,oldval){
      this.save_layout(oldval)
      this.widgetForm=null
      this.$nextTick(function(){
        if(newVal=="show" && this.report.layout){
          this.widgetForm=JSON.parse(this.report.layout)
        }
        if(newVal=="hidden"){
          this.widgetForm=JSON.parse(this.report.layout_hidden)
        }
        if(!this.widgetForm)
          this.widgetForm=null
      })
    },
    selectWidget (newVal,oldval) {
      this.cur_layout_item=null
      if(JSON.stringify(this.selectWidget)=='{"prop":"--"}')
        return
      let _this=this
      function find_item(item){
            if(_this.selectWidget.type=='layout_item' && item.i==_this.selectWidget.item_i)
                return true;
            if(item==_this.selectWidget || item.element==_this.selectWidget)
                return true;
            if(item?.element?.children?.column){
                for(let one in item.element.children.column){
                    if(find_item(item.element.children.column[one]))
                        return true;
                }
            }
            return false;
        }
      
      for(let idx=0;idx<this.widgetForm.length;idx++){        
        if(find_item(this.widgetForm[idx])){
          this.cur_layout_item={type:'layout_item',config:this.widgetForm[idx].bg,
          layout_item:this.widgetForm[idx]
          
          }             
          break
        }
      }
      if(this.cur_layout_item==null){
        this.$set(this,'cur_layout_item',{type:'layout',config:this.report.defaultsetting})
      }
      this.cur_select_type='widget'
    },
    "colrow_obj": {
        handler(val,oldVal)
        {
          if(this.selectWidget.type=='cr_row' || this.selectWidget.type=='cr_col'){
            Object.assign(this.selectWidget.data,this.colrow_obj)
            let grid= this.report.AllGrids.grid.find(a=>a._name==this.sheet_window.gridName)
            let aaa=luckySheet2ReportGrid( this.sheet_window,this.report.defaultsetting)
            
            $.extend(grid,aaa.grid);
          }
        },deep:true
    },
//======================

    "cull_cell_cr":{
      handler(newVal,oldVal){        
        if(!this.can_watch_cell)
        {
          this.can_watch_cell=true
          return
        }
        this.sheet_window.luckysheet.exitEditMode()
        let cacheUpdate=[]
        Object.keys(newVal).forEach(k=>{
          if(newVal[k]!=oldVal[k]){
            cacheUpdate.push({k,v:newVal[k]})
          }
        })
        let data=this.sheet_window.luckysheet.getSheet(0).data
        this.cur_sheet.luckysheet_select_save?.forEach(one_range=>{
          for(let r=one_range.row[0];r<=one_range.row[1];r++){
            for(let c=one_range.column[0];c<=one_range.column[1];c++){
              let cell=data[r][c]
              if(cell==null){
                  cell={m:'',v:'',cr:{"_displayValueExpr":"=@value"}}
                  this.sheet_window.luckysheet.setCellValue(r,c,cell);  
              }
              if(cell.v==undefined && cell.mc!=undefined && cell.mc.cs==undefined)//不处理合并单元格
                continue
              if(cell.cr==undefined)
                  cell.cr={"_displayValueExpr":"=@value"}
              cacheUpdate.forEach(one=>{
                cell.cr[one.k]=one.v
              })
              cell.v=cell.m=cell.cr._valueExpr
              if(cell.cr['_color']!=undefined)
                  cell.fc=color(cell.cr['_color']) ? cell.cr['_color'] :this.report.defaultsetting["COLOR"]
              if(cell.cr["_background-color"]!=undefined)
                  cell.bg=color(cell.cr['_background-color']) ? cell.cr["_background-color"] : this.report.defaultsetting['BACKGROUND-COLOR']
            }
          }
        })
        if(cacheUpdate.length>0 && ["_leftHead","_topHead"].includes(cacheUpdate[0].k ))
        {
           this.test_and_refresh()
           return
        }
        if(cacheUpdate.length>0)
          this.lucky_updated({range:this.cur_sheet.luckysheet_select_save,...cacheUpdate },true) 
      },
      deep:true,immediate: true
    }
 },

}
</script>

<style lang="scss">
@import './styles/index.scss';
.cr_icon{height:15px;width:15px}
.widget-config-container .el-slider.is-vertical .el-slider__runway {
     margin: 0;
}
.el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 25px;
    line-height: 25px;
    border-bottom: 2px solid transparent;
    color: #909399;
}
#avue-view .el-dropdown__icon {
    font-size: 11px;
    margin: 0 3px;
}
#avue-view .el-dropdown__caret-button {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
</style>