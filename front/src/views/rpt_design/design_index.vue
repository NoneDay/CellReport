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


    <datasetManger2 v-if="datamanger_dialogVisible"  :visible.sync="datamanger_dialogVisible"  > 
    </datasetManger2>  

    <templateManger v-if="notebook_dialog_visible" 
      :visible.sync="notebook_dialog_visible" :action_target.sync="report.template" @submit="refresh_setting"
      > 
    </templateManger>
    <simpleGuide v-if="simpleGuide_dialogVisible"  :visible.sync="simpleGuide_dialogVisible" :sheet_window="sheet_window" > 
    </simpleGuide>  

    <el-drawer :width="leftWidth" title="参数管理" :visible.sync="paramMangerDrawerVisible" :wrapperClosable="true" :modal="false"> 
        <paramManger :report="report" v-if="paramMangerDrawerVisible"/>          
    </el-drawer>

    <el-container class="form-designer">
     
      <el-container style="height: 100%; border: 1px solid #eee">
          <el-header class="widget-container-header" style="height: 40px;" >
           
          
            
            <el-button type='primary' round @click="save_report" >保存</el-button>
            <el-button type='primary' round @click="preview_run" >预览</el-button>
            <el-button type='primary' icon='el-icon-refresh'  round @click="init(report.reportName)" >重载</el-button>
            <el-button type='primary' round @click="paramMangerDrawerVisible=true" >参数</el-button>
            <el-button type='primary' round @click="datamanger_dialogVisible=true" >数据</el-button>
            <el-button type='primary' round @click="notebook_dialog_visible=true" >设置</el-button>
            <el-button type='primary' round @click="simpleGuide_dialogVisible=true" >向导</el-button>
            <el-link :href="baseUrl+'/run'+(report.reportName.split(':')[0]=='default'?'':(':'+report.reportName.split(':')[0]))+'?reportName='+report.reportName.split(':')[1]" target="_blank"><i class="el-icon-view el-icon--right"></i></el-link>
            
          </el-header>
          <!-- 中间主布局 -->
          <el-main  class="widget-container" :style="{color:report.defaultsetting['COLOR'],
          background: formIsEmpty ? `url(${widgetEmpty}) no-repeat 50%`: report.defaultsetting['BACKGROUND-COLOR']}"
          v-if="widgetForm!=null"
          >
               <grid-layout-form v-if="formType=='gridLayout'" 
               :layout="widgetForm" 
               :select.sync="selectWidget"
                
                @change="handleHistoryChange(widgetForm)"
                >
              </grid-layout-form>          
              <widget-form v-else  ref="widgetForm"
                          :data="widgetForm" 
                          :select.sync="selectWidget"
                          style="overflow:auto"
                          @change="handleHistoryChange(widgetForm)"
                          ></widget-form>
            </el-main>
      </el-container>
      <!-- 右侧配置 -->
      <el-aside class="widget-config-container" :width="rightWidth"> 
        <el-tabs type="border-card">
        <el-tab-pane label="属性" >
                <ul v-if="cur_select_type=='cell'" ghost-class="ghost" style="padding-left: 10px;">
                  <li  style="display: flex;padding-bottom: 10px;" >
                    <el-tag style="color:black" >扩展方向</el-tag>
                    <el-select v-model="cur_cell.cr._extendDirection" placeholder="扩展方向">
                      <el-option label="行" value="row"></el-option>
                      <el-option label="列" value="column"></el-option>
                      <el-option label="无" value="none"></el-option>
                    </el-select>
                  </li>
                  <li v-for="item in [{display:'左顶格',val:'_leftHead',disabled:true},
                            {display:'上顶格',val:'_topHead',disabled:true},
                            {display:'文字颜色',val:'_color'},
                            {display:'背景色',val:'_background-color'},
                            //{display:'字体大小',val:'_FONT-SIZE',disabled:true},
                            {display:'链接',val:'_link'},                            
                            {display:'显示值表达式',val:'_displayValueExpr'},
                             {display:'值表达式',val:'_valueExpr'},
                             {display:'加到style中',val:'_append'},
                             ]"  
                      style="display: flex;padding-bottom: 10px;" :key="item.display" >
                    
                    <el-tag style="color:black;width:100px">{{item.display}}</el-tag>
                    <el-input :placeholder="'请输入内容:'+item.display" v-model="cur_cell.cr[item.val]" :disabled="item.disabled==true">
                    </el-input>
                      <el-button  @click="expr_edit(cur_cell.cr,item)" v-if="['_calcLevel'].includes(item.val)==false"
                                circle  :type="item.val=='_valueExpr'?'danger': 'success'" size="mini" icon="el-icon-edit"
                                style="padding: 4px;margin-left: 5px;">
                      </el-button>
                  </li>
                </ul>
        <widget-config  v-else 
          :data="selectWidget" 
        ></widget-config>
        </el-tab-pane>
      <el-tab-pane label="工具箱" >
          
        <div class="fields-list">
          <div v-for="(field, index) in fields" :key="index">
            <div v-if="!field.disabled">
              <div class="field-title">{{field.title}}</div>
              <draggable tag="ul"
                          :list="field.list"
                         @end="onEnd" 
                        @drop="onEnd" 
                        @move="onEnd"                   
                          :group="{ name: 'form', pull: 'clone', put: false }"
                          ghost-class="ghost" 
                          :sort="false">
                <li class="field-label"
                    v-for="(item, index) in field.list"
                    :key="index">
                  <a>
                    <i class="icon iconfont"
                        :class="item.icon"></i>
                    <span>{{item.label}}</span>
                  </a>
                </li>
              </draggable>
            </div>
            <div v-else>
              <div class="field-title">{{field.title}}
                <span class="danger">（开发中）</span>
              </div>
              <ul>
                <li class="field-label-disabled"
                    v-for="(item, index) in field.list"
                    :key="index">
                  <a>
                    <i class="icon iconfont"
                        :class="item.icon"></i>
                    <span>{{item.label}}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>        
      </el-tab-pane>    
  
      </el-tabs>  
      
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
import {luckySheet2ReportGrid,loadFile,deepClone,build_layout,get_signalR_connection,getObjType,getRangeByText,numToString} from './utils/util.js'
import {open_one,save_one,grid_range_level,preview_one} from "./api/report_api"
import Preview from './preview.vue'
import simpleGuide from './simpleGuide.vue'
import Config from './config'
import install_component from './install_component'
import  codemirror  from './element/vue-codemirror.vue'
import templateManger from "./templateManger.vue"
import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
const report_cache={}
export default {
  name: "FormDesign",
  mixins: [history],
  components: {paramManger,ExprEditorDialog,simpleGuide,codemirror,
        Draggable,widgetEmpty,WidgetForm,WidgetConfig,templateManger,
        datasetManger2, Preview, },
  
  async beforeRouteEnter(to, from, next) {
    const reportName = to.query.label 
    if (reportName) {
      await next(async instance => {  
        if(to.query.zb_dict || to.query.zb_param )     
          delete report_cache[reportName ]
        let obj=report_cache[reportName ]
        if(obj ){
          await instance.init(reportName,obj,to.query.zb_dict,to.query.zb_param)
          next()
        }
        else
          await instance.init(reportName,undefined,to.query.zb_dict,to.query.zb_param)
        })
    } else {
      next(new Error('未指定reportName'))
    }
  },
    // 在同一组件对应的多个路由间切换时触发
  async beforeRouteUpdate(to, from, next) {
    let _this=this
    console.info(from.query.label)
    console.info("prepare cache:"+_this.report.reportName)
    this.save_fix()
    report_cache[_this.report.reportName]={
      report_content:x2jsone.js2xml({report:this.report}),
      conn_list:this.report.conn_list,
      range_level:this.report.range_level,
      defaultsetting:this.report.defaultsetting
    }
    const reportName = to.query.label || to.meta.id
    if (reportName) {
      let obj=report_cache[reportName ]
      await this.init(reportName,obj)
      next()
    } else {
      next(new Error('未指定reportName'))
    }
  },
    // 在同一组件对应的多个路由间切换时触发
  beforeRouteLeave(to, from, next) {
    this.save_fix()
    report_cache[this.report.reportName]={
      report_content:x2jsone.js2xml({report:this.report}),
      conn_list:this.report.conn_list,
      range_level:this.report.range_level,
      defaultsetting:this.report.defaultsetting
    }
    next();
  },
  created() {
    Vue.use(Config)
    Vue.use(install_component)
    let url_arr=window.location.href.split('?')
    if(url_arr.length>0){
      let cs = url_arr[1];                //获取?之后的参数字符串
      let cs_arr = cs.split('&');                    //参数字符串分割为数组
      cs={};
      for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
      }
      if (cs.reportName)
        this.init(window.location.hash??0,cs.reportName)
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
        this.cur_cell.cr={}
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
    },
  },
  data(){
      return {    
        clickedEle:{},//存放点击后的数据，可以被其他元素引用
        report_result:{//报表定义内容
              
          },//报表运行后的结果
        in_exec_url:{stat:false},//当前是否已经在点击后取数
        preview_dialogVisible:false,
       
        simpleGuide_dialogVisible:false,
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
        
        can_watch_cell:false,//因为第一次切换单元格后就会执行update cell ，用他来避免首次更新不必要的计算

        cur_select_type:'cell',
        fields,
        widgetEmpty, 
        canDraggable:true,
        selectWidget: {},
        in_cub:false,
        report:{//报表定义内容
              dataSets:{dataSet:[]}
              ,params:{param:[]}
              ,AllGrids:{HtmlText:[],grid:[]}
              ,reportName:""
          },
        widgetForm: widget_row_col_layout(),//布局显示
       
      }
  },
  methods:{
    createContext(){
      return {
      context:{
        report_result:this.report_result,
        report:this.report,
        canDraggable:this.canDraggable,
        selectChange:this.selectChange,    
        cellUpdateBefore:this.cellUpdateBefore,    
        updated:this.lucky_updated,
        rangePasteBefore:this.rangePasteBefore,
        design:true,
        clickedEle:this.clickedEle,
        in_exec_url:this.in_exec_url,
        mode:"design",
        allElementSet:this.allElementSet,
        all_sheet_windows:this.all_sheet_windows,
        defaultsetting:this.report.defaultsetting
      }, 
      fresh_ele:this.fresh_ele,
      clickedEle:this.clickedEle,
    }
    },
    onEnd(e,o){
      console.info() //e.from.__vue__.context.element
    },
    init(reportName,data,zb_dict,zb_param){
      Object.keys(this.report_result).forEach(key=>{
        delete this.report_result[key]
      })
      
      let signalR_connection=get_signalR_connection()
      let _this=this
      let _report
      
      //'2019/2jidu/kb_dangri2.cr'
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
        }else
        open_one(reportName,zb_dict,zb_param).then(response_data => {      
          if(response_data.errcode)
          {
            _this.$notify({title: '提示',message: response_data.message,type: 'error',duration:0});
            return
          }
          if(zb_dict){
            Object.entries(zb_dict).forEach( kv=>{
              if(_this.report_result.dataSet==undefined){
                _this.report_result.dataSet={}
                 _this.report_result.zb_var={}
                 _this.report.zb_var={}
              }
              if(typeof kv[1]=="string" && kv[1].startsWith("{")){
                let one=JSON.parse( kv[1])
                _this.report_result.dataSet[kv[0]]=[[one.columns].concat(one.data)]
              }
              else{
                _this.report_result.zb_var[kv[0]]=kv[1]
                _this.report.zb_var[kv[0]]=kv[1]
              }
            })
            
          }
          _this.set_report(reportName,response_data)
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
      if(_report.zb_var){
        this.report_result.zb_var=JSON.parse(_report.zb_var)
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
      delete this.report.zb_var
      Object.assign(this.report,_report)
      this.report.conn_list=response_data.conn_list
          this.report.range_level=response_data.range_level
          this.report.defaultsetting=response_data.defaultsetting
          if(this.report.defaultsetting && this.report.defaultsetting['BACKGROUND-COLOR']=="")
            this.report.defaultsetting['BACKGROUND-COLOR']="transparent"
          this.report.reportName=reportName
          if(this.report.layout){
            this.widgetForm=JSON.parse(this.report.layout)
             if (!Array.isArray(this.widgetForm))
             this.change_layout()  
          }
          else{
            this.widgetForm=build_layout(this.report.AllGrids)    
            this.change_layout()  
          }
            
          if(getObjType(this.report.dataSets.dataSet)=="object")
            this.report.dataSets.dataSet=[this.report.dataSets.dataSet]
          if(getObjType(this.report.params.param)=="object")
            this.report.params.param=[this.report.params.param]

          console.info(this.report)
          if(this.report.dataSets.dataSet[0]=="")
            this.report.dataSets.dataSet.splice(0,1)
          this.report.dataSets.dataSet.forEach(element => {
              if(element._fields==undefined){
                element._fields="[]"
              }
          });
    },
    notebook_handleSubmit(){
      this.notebook_dialog_visible=false
    },
    change_layout(){
       if (Array.isArray(this.widgetForm))//gridLayout=>divLayout
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
        let children=this.widgetForm.children.column
        this.widgetForm=[]
        children.forEach(ele=>{
          this.gridLayoutAddItem(ele,children.length==1?24:ele.span,15);//15 是新建报表时的缺省高度
        });
      }
      
    },
    gridLayoutAddItem(item,p_w,p_h){
        let insert_item=widget_div_layout(item)
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
        this.cur_select_type='cell'
        this.selectWidget={prop:'--'}
        this.cur_sheet=sheet
        this.sheet_window=sheet_window
        let cur_postion=sheet.luckysheet_select_save[0]
        let cell=sheet.data[cur_postion.row_focus][cur_postion.column_focus]
        if(this.cur_cell!= cell)
          this.can_watch_cell=false//切换单元格后，对cur_cell.cr的第一次监控 ，不需要监控
        this.cur_cell= cell?? {"cr":{"_displayValueExpr":"=@value","_valueExpr":"",'_extendDirection':"none"}}  
        
    },
    
    expr_edit(cur_cell,prop){
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
// 如果从这里的setCellValue API进入，则不执行，防止递归循环
      if(this.setCellFromAPI){
        return
      }
      let grid= this.report.AllGrids.grid.find(a=>a._name==this.sheet_window.gridName)
      
      this.setCellFromAPI = true;
      try{
        
        
        if(["addRC","delRC"].includes( val.type)){
           

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
                if(cell.v==undefined && cell.mc)//不处理合并单元格
                  continue
                if(!cell.cr) cell.cr={"_displayValueExpr":"=@value"}
                if(!cell.cr['_displayValueExpr'])
                  cell.cr['_displayValueExpr']="=@value"
                if(cell.bg && !cell.cr['_background-color']?.startsWith("=") && !from_cull_cell_cr) 
                  cell.cr["_background-color"]=cell.bg
                if(cell.fc && !cell.cr['_color']?.startsWith("=") && !from_cull_cell_cr) 
                  cell.cr['_color']=cell.fc

                if(cell.fs) cell.cr['_FONT-SIZE']=cell.fs
                if(cell.ff) cell.cr['_FONT']=cell.ff
                if(cell.bl!=undefined) cell.cr['_BOLD']=(cell?.bl==1?"True":"False")
                cell.cr['_text-align']=(cell.ht==0?"center":(cell.ht==1?"left":'right'))
                if(cell.it!=undefined) cell.cr['_ITALIC']=cell.it==1 ?"True" :"False"
                if(cell.f &&  cell.f.startsWith("=")) //
                  cell.cr._valueExpr=cell.v=cell.m=cell.f
                else
                  cell.cr._valueExpr=cell.m=cell.v??""
                let v=cell.cr._valueExpr
                if(!cell.cr._extendDirection && typeof v=='string' && v.search("^=.*(select|group)")>=0)
                  cell.cr._extendDirection="row"
                let cellCopy=JSON.parse(JSON.stringify(cell))  //$.extend(true,{},cell)
                cacheCells.push({r,c,cellCopy})
              }
            }
          }
        })
        cacheCells.forEach(one=>{
          this.sheet_window.luckysheet.setCellValue(one.r,one.c,one.cellCopy);  
        })
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
          let grid_setting=_this.findGridInWidgeForm(_this.widgetForm,_this.sheet_window.gridName)
          grid_setting.conditionformat_save=JSON.stringify(_this.sheet_window.luckysheet.getAllSheets()[0].luckysheet_conditionformat_save)
          grid_setting.alternateformat_save_modelCustom=JSON.stringify(_this.sheet_window.luckysheet.getAllSheets()[0].luckysheet_alternateformat_save_modelCustom)
          grid_setting.alternateformat_save=JSON.stringify(_this.sheet_window.luckysheet.getAllSheets()[0].luckysheet_alternateformat_save)
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
      this.report.layout=JSON.stringify( this.widgetForm, null, 4)
      this.preview_dialogVisible=true
      
    },
    save_fix(){
      this.report.layout=JSON.stringify( this.widgetForm, null, 4)
      this.all_sheet_windows.forEach(one=>{
        if(one._window.luckysheet){
          let grid=this.report.AllGrids.grid.find(a=>a._name==one.gridName)
          let sheet=one._window.luckysheet.getSheet(0)
          grid._fix_rows=sheet.freezen?.horizontal?.freezenhorizontaldata[1] ||-1
          grid._fix_cols=sheet.freezen?.vertical?.freezenverticaldata[1] ||-1
        }
      })
      console.info(this.report.AllGrids.grid.length)
    },
    save_report(){
      this.save_fix()
      this.report.layout=JSON.stringify( this.widgetForm, null, 4)
      save_one(this.report)
      //console.info(x2jsone.js2xml({report:this.report}))
    },
    refresh_setting(){
      let _this=this
      let old_widgetForm=_this.widgetForm
      _this.selectWidget={}
      _this.widgetForm=""
      setTimeout(()=>{
        _this.widgetForm=old_widgetForm
      })
    }
  },
  
  watch: { 
    selectWidget (newVal,oldval) {
      if(JSON.stringify(this.selectWidget)=='{"prop":"--"}')
        return
      this.cur_select_type='widget'
    },
//======================

    "cull_cell_cr":{
      handler(newVal,oldVal){        
        if(!this.can_watch_cell)
        {
          this.can_watch_cell=true
          return
        }
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
              if(cell.v==undefined && cell.mc)//不处理合并单元格
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
        this.lucky_updated({range:this.cur_sheet.luckysheet_select_save,...cacheUpdate },true) 
      },
      deep:true,immediate: true
    }
 }
}
</script>

<style lang="scss">
@import './styles/index.scss';
.cr_icon{height:15px;width:15px}
</style>