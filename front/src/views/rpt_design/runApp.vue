<template>
  <div id="report_app" style="display:flex;flex-direction:column;height:100%" :style="{'overflow':result.defaultsetting.big_screen=='1'?'hidden':''}"> 
    <iframe v-if="result.defaultsetting.big_screen!='1'" id="printIframe" style="display:none"></iframe>
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
          <el-button type="primary" @click="pdf_print">打印</el-button>     
        </div>
         <div id="pdf_wrapper" class="pure-u-1 pure-u-md-4-5" style="height: 100%;width: 100%;">
            
            <object id="pdf_output" type="application/pdf" style="height: 100%;width: 100%;">
                <p>It appears you don't have PDF support in this web browser. <a href="#" id="download-link">Click here to download the PDF</a>.</p>
            </object>
        </div>

    </el-dialog> 
    <el-dialog v-draggable v-if="dync_item_dialogVisible" style="text-align: left;" 
          :visible.sync="dync_item_dialogVisible" 
          :close-on-click-modal="false" direction="btt" append-to-body v-bind="{...{'custom-class':'dync_dialog'},...dync_item.dialog_params||{} }"
        > 
      <div v-bind="{...{style:'height:50vh'},...dync_item.params||{}}">
        <widget-form-item  :self="dync_item"  >  </widget-form-item>
      </div>
    </el-dialog> 
    <paperSetting :target_obj="paperSetting" @submit="paperSetting_submit"
    :visible.sync="paper_setting_dialogVisible" />
    <el-popover trigger="click" v-if="!crisMobile && isShow && show_tips " style='position:fixed;z-index:5;right:10px;top:10px;'
      placement="top-start" title="提示信息" width="300">
      <el-button slot="reference" style="width: 40px;height: 40px;
          border-radius: 50%;color: #409eff;display: flex;align-items: center;justify-content: center;font-size: 20px;
          box-shadow: 0 0 6px rgb(0 0 0 / 12%);cursor: pointer;" class="el-icon-edit">
      </el-button>
      <div>
        <div v-html="result.tips?.replaceAll('\n','<p>')" ></div>
        <div v-html="result.notebook?.replaceAll('\n','<p>')"></div>
      </div>
    </el-popover>
    <span v-if="crisMobile && isShow && result.defaultsetting.big_screen!='1' && result.defaultsetting['show_form']=='true'"
        style="position: absolute;right: 0px;top: 0px;z-index: 10;width: 30px;height: 30px;background-image: url(img/expand.png)" 
        :style="{'transform':(expand_form?'rotate(-180deg)':'')}"
        @click="expand_form=!expand_form;refresh_layout()">
    </span>

    <div ref="div_form" v-if="!crisMobile && isShow && result.defaultsetting.big_screen!='1' && result.defaultsetting['show_form']=='true'"> 
      <dyncTemplate :parentCompent="parentCompent" :self="{type:'pc_form',content:pc_form_content ,gridName:'pc_form'}">
      </dyncTemplate>
    </div>
    <div  ref="div_form" v-if="expand_form && crisMobile && isShow && result.defaultsetting.big_screen!='1' && result.defaultsetting['show_form']=='true'" > 
      <dyncTemplate :parentCompent="parentCompent" :self="{type:'pc_form',content:mobile_form_content,gridName:'pc_form'}">
      </dyncTemplate>
    </div> 
    <div ref="report_pane" v-if="isShow" class="report_define"  :style="{'flex-grow': 1,height:'90px',color:result.defaultsetting['COLOR'],background:result.defaultsetting['BACKGROUND-COLOR']}">
        <grid-layout-form v-if="report_pane_show && layoutType=='gridLayout'" :layout="layout"  :scale="scale">
        </grid-layout-form>          
        <widget-form v-else-if="report_pane_show && layoutType!='gridLayout'"   :data="layout"   
        ></widget-form> <!--// 老报表只有报表，用这个组件显示-->
    </div>    
  </div>
</template>

<script>
import widgetForm from './WidgetForm'
import {dateToString} from './utils/resultGrid2HtmlTable.js'
import {run_one,get_pdf,run_download} from "./api/report_api"
import {convert_array_to_json,arrayToTree,seriesLoadScripts,load_css_file,watermark,isMobile,loadFile } from "./utils/util"
import install_component from './install_component'
import paperSetting  from './paperSetting.vue'
import {exceljs_inner_exec,xlsxjs_inner_exec,docx_inner_exec} from './utils/export_excel.js'
export default {
  name: 'App', //CellReportFormDesign
  components:{widgetForm,paperSetting},
  mounted(){    
    let _this=this
    window.onresize=this.refresh_layout 
  },
  beforeDestroy() {
    clearInterval(this.intervalId)
  },
  created() {
    Vue.use(install_component)
    let url_arr=window.location.href.split('?')
    
    if(window.location.hash!='')
      this.grpId=window.location.hash.split("?")[0].substring(1)
    if(url_arr.length>0){
      let cs = url_arr[1];                //获取?之后的参数字符串
      this.queryPara=url_arr[1]
      let cs_arr = cs.split('&');                    //参数字符串分割为数组
      cs={};
      for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
      }
      if (cs.reportName){
        this.reportName=cs.reportName
      }
      this.intervalId = setInterval(this.interval_func,1000)
      let _this=this
      function inner_exec(){
        if(_this.reportName)
          _this.submit()
          //run_one(_this,_this.reportName,_this.queryPara)
        else
          _this.$notify({title: '提示',message: '没有提供参数：reportName',type: 'error'});
      }
      if(this.crisMobile && window.nutui==undefined){
        load_css_file("cdn/nutui@2.3.10/nutui.min.css")
        seriesLoadScripts("cdn/nutui@2.3.10/nutui.min.js",null,inner_exec)      
      }
      else
        inner_exec()
    }

  }, 
  provide() {
    return {
      context: this.create_context(),   fresh_ele:this.fresh_ele,   

    }
  },  
  data () {
    return {
        expand_form:window.cellreport["expand_form"]??true,
        name_lable_map:{},
        isShow:false,
        report_pane_show:true,
        grpId:0,
        selectWidget:'{"prop":"--"}',
        reportName:"",
        queryPara:"",
        queryForm:{},
        queryForm_show:{},
        exec_log:"",
        result:{form:[],dataSet:{},data:{},defaultsetting:{big_screen:0}},
        mode:'run',
        clickedEle:{},
        executed:false,
        last_js_cript:"",
        layout:[],
        fresh_ele:[],
        mobile_col_arr:[ ],
        mobile_col_button_arr:[ ],
        setTimeout_function:'',
        setTimeout_second:10,
        setTimeout_exec_num:0,
        parentComponent: this,
        allElementSet:new Set(),//所有有ID名称的集合
        in_exec_url:{stat:false,run_url:""},
        pdf_output_dialogVisible:false,
        paper_setting_dialogVisible:false,
        scale:{x:100,y:100,v:100},
        dync_item_dialogVisible:false,
        dync_item:{},
        paperSetting:{pageSize_name:'A5',}
    }
  },
  watch:{
  },
  methods:{
    interval_func(){
      // 定时器。每间隔一秒调用，调用时判断setTimeout_second 是否为0 ，为0执行，只到小于0，以后就不执行。
      //除非setTimeout_function重新被设置 
      if(this.setTimeout_second==0){
        if(typeof this.setTimeout_function=="function"){
          this.setTimeout_function(this)
          this.setTimeout_function=''// 设置为空，下次不执行，除非在上一次调用的函数里面重置
        }
      }
      this.setTimeout_second--
      if(this.setTimeout_second<0)
      this.setTimeout_second=-1
    },
    async paperSetting_submit(val){
      let pdf_data=await get_pdf(this.result,val)
      let datauri = URL.createObjectURL(pdf_data)
      document.getElementById("pdf_output").data =datauri
    },
    refresh_layout(ddd,that){  
      if(that==undefined)
        that=this
      that.isShow=false
      that.report_pane_show=false
      setTimeout(() => {
          that.isShow=true
          setTimeout(() => {
            that.report_pane_show=true
            if(that.result.defaultsetting.big_screen=='1'){
                that.scale.y=100*that.$refs.report_pane.clientHeight/parseInt(that.result.defaultsetting.screen_height)
                that.scale.x=100*that.$refs.report_pane.clientWidth/parseInt(that.result.defaultsetting.screen_width)
                that.scale.v=Math.min(that.scale.x,that.scale.y)
            }
            let ks=Object.keys(that.result.data)
            if(ks.length>0)
              document.title = (that.result.data[ks[0]]?.title)   || document.title 
            if(window.after_show_report_hook){window.after_show_report_hook()}
          });
      });
    },
    click_col_button(line_idx,col_idx){
      this.$set(this.mobile_col_button_arr[line_idx],'selected',col_idx)
      this.mobile_col_button_arr.splice(line_idx+1)
      let i_col_idx=col_idx
      for(let idx=line_idx;;idx++){
          let cur_item=this.mobile_col_button_arr[idx]
          if( cur_item.arr[i_col_idx].arr.length>0){
            this.mobile_col_button_arr.push({selected:0,arr:cur_item.arr[i_col_idx].arr })
            i_col_idx=0;
          }
          else
              break
      }
      let last_item=this.mobile_col_button_arr[this.mobile_col_button_arr.length-1]
      if(this.mobile_col_button_arr.length>1 && last_item.arr.length==1 && last_item.selected==0 && last_item.arr[0].col_span[0]==last_item.arr[0].col_span[1])
      {
        
        let up_item=this.mobile_col_button_arr[this.mobile_col_button_arr.length-2]
        if(up_item.arr[up_item.selected].txt==last_item.arr[0].txt)
        this.mobile_col_button_arr.splice(-1)
      }
      if(window.cellreport.hook && typeof window.cellreport.hook=='function'){
        window.cellreport.hook("click_col_button", this.mobile_col_button_arr)
      }
      this.report_pane_show=false
      this.$nextTick(() => {
        this.report_pane_show=true
      });
    },
    marked(val){
      //seriesLoadScripts("cdn/editor.md-master/lib/marked.min.js")
      return val;//marked(val??"",{breaks:true})
    },
    convert_arr_to_json(arr){
      let ret=[]
      arr.forEach(x=>{
        ret.push({value:x[1],label:x[0]}) 
      })
      return ret
    },
    convert_param_array_to_json(data,p2){
      
      return convert_array_to_json(data)
    },
    convert_param_array_to_tree(data,para){
      let aa=convert_array_to_json(data)
      let ret=arrayToTree(aa,{pid:para.parent_valueField_kyz,id:para.valueField_kyz})
      return ret
    },
    dateToString:function(val){
      return dateToString(val)
    }, 
    validate_submit(loading_conf=null){
      let _this=this
      if(_this.$refs.form){
      _this.$refs.form.validate((valid) => {
          if (valid) {
            if(window.cellreport.form_validate)
            {
              let result=window.cellreport.form_validate(_this.queryForm)
              if(typeof(result)=="string"){
                _this.$message.error(result);
                return false;
              }
              if(result==false){
                _this.$message.error('校验没通过，请检查参数设置');
                return false;
              }
            }
              run_one(_this,_this.reportName,null,loading_conf)
          } else {
            _this.$message.error('必填项目没填内容!!');
            return false;
          }
        });
      }else{
        run_one(_this,_this.reportName,null,loading_conf)
      }
    },
    submit(loading_conf=null){
      run_one(this,this.reportName,null,loading_conf)
    },
    change_param(param_name){
      let _this=this
      function is_depend(name){
        let cur_dep=_this.result.param_depend_dic[name]
        if(cur_dep){
          if(cur_dep.indexOf(param_name)>=0)  
            return true
          return Enumerable.from(cur_dep).any(x=> is_depend(x))
        }
      } 
      if(this.result.param_liandong.includes(param_name)){
        for(let x in _this.queryForm){
          if(is_depend(x)){
            _this.queryForm[x]=''
            _this.result.dataSet[x]=[[]]
          }
        }
        setTimeout(async function(){
          run_one(_this,_this.reportName,param_name)
        })        
      }
    },
    create_context(){
      return {
          all_sheet_windows:[],
          canDraggable:false,
          crisMobile:this.crisMobile,
          //report:this.context?.report,  //这里要重新检查
          report_result:this.result,
          mode:'run',
          selectWidget:this.selectWidget, 
          event:{},
          queryForm:this.queryForm,
          clickedEle:this.clickedEle,
          allElementSet:this.allElementSet,
          //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
          in_exec_url:this.in_exec_url,
          defaultsetting:this.result.defaultsetting,
          rpt_this:this,
          name_lable_map:this.name_lable_map,
          scale:{x:100,y:100,v:100},
      }
    },
    
    watermark(cfg){
      if(typeof cfg=="string"){
        watermark({"watermark_txt":cfg})
      }else{
        watermark(cfg)
      }
      
    },
    ExcelCommand(command, node,data){
      let _this=this
      let backend_split_page=false
      for(let one of Object.keys( _this.name_lable_map) ){
        if(_this.name_lable_map[one].component=="luckySheetProxy"){
          backend_split_page =(backend_split_page || _this.result.data[one].backend_split_page)
        }
      }
      if(backend_split_page){
        run_download(this,this.result._zb_var_.file_name,'fast_excel')
      }
      else if(command=="exceljs")
        seriesLoadScripts('cdn/exceljs/exceljs.min.js',null,function (){
          let loadingInstance = _this.$loading({ lock: true,
          text: '正在导出',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)' });
          setTimeout(async () => { // 以服务的方式调用的 Loading 需要异步关闭
            await exceljs_inner_exec(_this,_this.name_lable_map)
            if(window.cellreport.cr_export_excel_func)
              window.cellreport.cr_export_excel_func(_this)
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
              if(window.cellreport.cr_export_excel_func)
                window.cellreport.cr_export_excel_func(_this)
              loadingInstance.close();
            },100);            
        })
      else if(command=="backend_fast_excel"){
        run_download(this,this.result._zb_var_.file_name,'fast_excel')
      }        
      else if(command=="docx")
        seriesLoadScripts('cdn/html-to-docx/dist/html-to-docx.umd.js',null,function (){
            docx_inner_exec(_this,_this.name_lable_map)
        })
    },
    pdf_print(){
      let iframe_print=document.getElementById("printIframe");
      iframe_print.setAttribute("src",document.getElementById("pdf_output").data)
      //兼容谷歌，不兼容ie8，效果可以自己试下（谷歌浏览器推荐使用这种，效果会比较好）
      setTimeout(() => {
        $("#printIframe")[0].contentWindow.print(); 
      },500);
      
    },
    async export_pdf(){
      let _this=this
      let pdf_data=await get_pdf(this.result)
      if(!window.cellreport.pdf_print)
          _this.pdf_output_dialogVisible=true
      _this.$nextTick(()=>{
        let datauri = URL.createObjectURL(pdf_data)
        if(!window.cellreport.pdf_print)
         document.getElementById("pdf_output").data =datauri
        else{
          // 创建iframe元素
          let iframe = document.getElementById("printIframe")
          iframe.src = datauri;
          setTimeout(() => {
            iframe.contentWindow.print();           
          },500);
        }
      })          
        

    }
  },
  computed: {
    pc_form_content(){
      return loadFile(this.result?._zb_var_?.form_vue_file?.pc??'pc_form.html')
    },
    mobile_form_content(){
      return loadFile(this.result?._zb_var_?.form_vue_file?.mobile??'mobile_form.html')
    },
    show_tips(){return window.cellreport.show_tips},
    parentCompent(){ return this},
    crisMobile(){
        return isMobile();
    },
    parentHeight(){
        return this.$parent.$el.clientHeight
    },
    layoutType(){
      if (Array.isArray(this.layout))
      return 'gridLayout'
      else
      return 'divLayout'
    }
  },
}
</script>
<style>
.cr_run_title { line-height: 28px;    border-bottom: 1px solid gray;font-weight: 500; margin-bottom: 5px;   }
html, body, #report_app {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    display: flex;
    /* width: 100%; */
    flex-direction: column;
}
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

.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 1px;
}
.el-date-editor:not(.el-range-editor).el-input, .el-date-editor:not(.el-range-editor).el-input__inner {
    width: 174px;
}
.nut-button.circle {
    margin-right: 20px;
}

.el-table{
       width:99.9%!important; 
}
.el-select__tags { overflow: hidden;}
.el-table__body{ width: 99.9%!important}

div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 10px;
  position: absolute;
  background-color: #61cdff;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
          box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  background   : transparent;
  border-radius: 10px;
}

.border-box-content {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative!important;
      width: calc(100% - var(--border_size) * 2px)!important;
      height: calc(100% - var(--border_size) * 2px)!important;
      top: calc(var(--border_size) * 1px);
      left: calc(var(--border_size) * 1px);
    }
    .report_define .el-dialog{
      display: flex;
      flex-direction: column;
    }
    .report_define .el-dialog .el-dialog__body{
      flex: 1;
    padding-bottom: 10px;
    padding-top: 10px;
    }    
    .report_define .el-dialog .el-dialog__header{
    padding-bottom: 0px;
    padding-top: 10px;
    }
</style>
