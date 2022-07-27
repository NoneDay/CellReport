<template>
  <div id="report_app" style="display:flex;flex-direction:column;height:100%" :style="{'overflow':result.defaultsetting.big_screen=='1'?'hidden':''}"> 
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
            <iframe id="printIframe" style="display:none"></iframe>
            <object id="pdf_output" type="application/pdf" style="height: 100%;width: 100%;">
                <p>It appears you don't have PDF support in this web browser. <a href="#" id="download-link">Click here to download the PDF</a>.</p>
            </object>
        </div>

    </el-dialog> 

    <paperSetting :target_obj="paperSetting" @submit="paperSetting_submit"
    :visible.sync="paper_setting_dialogVisible" />
        
    
    <el-popover v-if="false && !crisMobile && isShow" style='position: fixed;z-index: 5;right: 40px;top: 100px;'
      placement="top-start" title="标题" width="200" trigger="hover" >
      <el-button slot="reference" style="background-color: rgb(229 200 200);width: 40px;height: 40px;
          border-radius: 50%;color: #409eff;display: flex;align-items: center;justify-content: center;font-size: 20px;
          box-shadow: 0 0 6px rgb(0 0 0 / 12%);cursor: pointer;" class="el-icon-edit">
      </el-button>
      <div>
        <div v-html="marked(result.tips)" ></div>
        <div v-html="marked(result.notebook)"></div>
      </div>
    </el-popover>

    <div ref="form" v-if="!crisMobile && isShow && result.defaultsetting.big_screen!='1' && result.defaultsetting['show_form']=='true'"> 
      <dyncTemplate :parentCompent="parentCompent" :self="{type:'pc_form',content:result.pc_form,gridName:'pc_form'}"  v-if="result.pc_form">
      </dyncTemplate>
      <el-form :inline="true" v-else label-position="right"  >
        <input hidden v-for="one in result.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        <div style="display:inline;max-width:100px" v-for="one in result.form.filter(x=>x.hide=='False')" :key="one.name">
          <el-form-item :label="one.prompt">
          <el-input v-if="one.data_type=='string' && one.tagValueList.length==0 && one.canUsedValueFrom!='Query' " v-model="queryForm[one.name]"></el-input>
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom!='Query' && one.tagValueList.length>0" v-model="queryForm[one.name]" 
            collapse-tags  @change="change_param(one.name)" clearable filterable 
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in one.tagValueList"
                :key="item[1]"
                :label="item[0]"
                :value="item[1]">
              </el-option>
          </el-select>  
          
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz=='' " v-model="queryForm[one.name]" 
            collapse-tags  @change="change_param(one.name)" clearable filterable 
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in convert_param_array_to_json(result.dataSet[one.dataSetName_kyz][0],one)"
                :key="item[one.valueField_kyz]+''"
                :label="item[one.tagField_kyz]"
                :value="item[one.valueField_kyz]+''">
              </el-option>
          </el-select>  

        <el-cascader v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz!='' " v-model="queryForm[one.name]" 
            collapse-tags clearable  @change="change_param(one.name)"
            :multiple="one.allowMutil=='False'?false:true" :options="convert_param_array_to_tree(result.dataSet[one.dataSetName_kyz][0],one)"
                :props="{checkStrictly:true, emitPath:false,multiple:one.allowMutil=='False'?false:true,value:one.valueField_kyz,label:one.tagField_kyz}"
                >
          </el-cascader>  
          <el-date-picker v-if="one.data_type=='date'" value-format="yyyy-MM-dd" 
                    v-model="queryForm[one.name]"></el-date-picker> 
          <el-date-picker v-if="one.data_type=='datetime'||one.data_type=='dateTime'" :value-format="one.dateTimeFormat" :format="one.dateTimeFormat" 
          :type="['yyyyMM','yyyy-MM'].includes(one.dateTimeFormat)?'month':'datetime'"
                    v-model="queryForm[one.name]"></el-date-picker>
          </el-form-item>
          
           </div>
            <el-form-item style="text-align: center;">
            <el-button type="primary" class='form_query_button' @click="submit">查询</el-button>
            
            <el-dropdown style="margin: 2px;" @command="ExcelCommand($event, node,data)">
              <el-button type="primary" class='form_query_button' >
                导出excel<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exceljs">小数据量（带格式）</el-dropdown-item>
                <el-dropdown-item  command="xlsxjs">大数据量（无格式）</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" class='form_query_button' @click="export_pdf">PDF预览</el-button>            
          </el-form-item>
      </el-form>
    </div>
    <div  ref="form" v-if=" crisMobile && isShow && result.defaultsetting.big_screen!='1' && result.defaultsetting['show_form']=='true'"> 
      <dyncTemplate :parentCompent="parentCompent" :self="{type:'pc_form',content:result.mobile_form,gridName:'pc_form'}" v-if="result.mobile_form">
      </dyncTemplate>
      <form v-else >  <!--img/battle_2021.jpg-->
        <input hidden v-for="one in result.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        <img :src="result._zb_var_.mobile_img_for_less_one_param" style="height: 80px;width: 100%;" 
        v-if="result._zb_var_.mobile_img_for_less_one_param && result.form.filter(x=>x.hide=='False').length<=1">
        
        <div v-for="one in result.form.filter(x=>x.hide=='False')" :key="one.name">
          
          <nut-textinput v-if="one.data_type=='string' && one.tagValueList.length==0" :label="one.prompt"
          v-model="queryForm[one.name]"></nut-textinput>
          
           <nut-cell  v-if="['date','datetime','dateTime'].includes( one.data_type)" 
             @click.native="queryForm_show[one.name] = true">
           <span slot="title"><b>{{one.prompt}}</b>: {{queryForm[one.name]}}</span>             
           </nut-cell>
           <nut-datepicker   v-if="['date'].includes( one.data_type) && queryForm_show[one.name]" 
              :is-visible.sync="queryForm_show[one.name]"
              :default-value="queryForm[one.name]" :type="one.data_type" 
              @close="queryForm_show[one.name]=false" :title="'请选择'+one.prompt" 
              @choose="val=>{queryForm[one.name]=val[0]+'-'+val[1]+'-'+val[2]
                submit()
                }"  
            > </nut-datepicker >
           <nut-picker   v-if="['datetime','dateTime'].includes( one.data_type) && queryForm_show[one.name]" 
              :is-visible.sync="queryForm_show[one.name]"
              :list-data="[[(parseInt(queryForm[one.name].substring(0,4))-1).toString(),queryForm[one.name].substring(0,4)],
              ['01','02','03','04','05','06','07','08','09','10','11','12']]"
              :default-value-data="[queryForm[one.name].substring(0,4),queryForm[one.name].substring(4,6)]"
              @close="queryForm_show[one.name]=false" :title="'请选择'+one.prompt" 
              @confirm="val=>{queryForm[one.name]=val[0]+''+val[1]
                submit()
                }"  
            > </nut-picker>
           
            <div  style="display: flex;flex: 0 0 auto;overflow-x: auto;"  v-if=" one.data_type=='string' && one.tagValueList.length>0 && one.allowMutil=='False'">
              <div style="display: relative; word-break: keep-all; font-size: 14px;   padding-left: 10px; margin-right: 20px;"> <b>{{one.prompt}}</b></div>
              <div style="position:relative;    word-break: keep-all;" v-for="item in one.tagValueList" :key="item[1]">
              <nut-button  :type="queryForm[one.name]==item[1]?'primary':'lightred'"
               shape="circle"   small  style="margin-right: 2px;"
               
              @click.prevent=" queryForm[one.name]=item[1]
              submit()"> {{item[0]}}</nut-button>
              </div>
            </div>

            <nut-cell  v-if="one.data_type=='string' && one.tagValueList.length>0 && one.allowMutil!='False'" 
             @click.native="queryForm_show[one.name] = true">
                <span slot="title"><b>{{one.prompt}}</b>: {{queryForm[one.name]}}</span>      
           </nut-cell>
           <nut-actionsheet  v-if="one.data_type=='string' && one.tagValueList.length>0 && one.allowMutil!='False' && queryForm_show[one.name]" 
              :is-visible.sync="queryForm_show[one.name]"  cancelTxt="取消"
              @close="queryForm_show[one.name]=false; submit()" :title="'请选择'+one.prompt" 
            >
            <div slot="custom" class="custom-wrap">
              请选择{{one.prompt}}
              <nut-checkboxgroup  v-model="queryForm[one.name]"
                :checkBoxData="convert_arr_to_json(one.tagValueList)">
              </nut-checkboxgroup>
            </div>           
            </nut-actionsheet>
           </div>

           <div  style="display: flex;flex: 0 0 auto;overflow-x: auto;" v-for="one_button_arr,idx in mobile_col_button_arr" :key="idx">
           <div style="position:relative;    word-break: keep-all;"  v-for="item,item_idx in one_button_arr.arr" :key="''+idx+'_'+item_idx">
              <nut-button  :type="one_button_arr.selected==item_idx?'red':'lightred'" @click.prevent="click_col_button(idx,item_idx)"
               shape="circle"   small  style="margin-right: 2px;"
              > {{item.txt}}</nut-button>
            </div>
          </div>
      </form>
    </div>
    <div ref="report_pane" class="report_define" v-if="isShow" :style="{'flex-grow': 1,height:'90%',color:result.defaultsetting['COLOR'],background:result.defaultsetting['BACKGROUND-COLOR']}">
        <grid-layout-form v-if="layoutType=='gridLayout'" :layout="layout"  :big_screen_scale="big_screen_scale" :big_screen_scale_x="big_screen_scale_x"
         :big_screen_scale_y="big_screen_scale_y">
        </grid-layout-form>          
        <widget-form v-else   :data="layout"   
        ></widget-form>
    </div>    
  </div>
</template>

<script>
import widgetForm from './WidgetForm'
import {dateToString} from './utils/resultGrid2HtmlTable.js'
import {run_one,get_pdf} from "./api/report_api"
import {convert_array_to_json,arrayToTree,seriesLoadScripts,load_css_file,watermark } from "./utils/util"
import install_component from './install_component'
import dyncTemplate from './element/dyncTemplate.vue'
import paperSetting  from './paperSetting.vue'
import {exceljs_inner_exec,xlsxjs_inner_exec} from './utils/export_excel.js'
export default {
  name: 'App', //CellReportFormDesign
  components:{dyncTemplate,widgetForm,paperSetting},
  mounted(){    
    let _this=this
    window.onresize=this.refresh_layout 
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
      let _this=this
      setInterval(function(){
        if(_this.setTimeout_second==0){
          if(typeof _this.setTimeout_function=="function")
            _this.setTimeout_function(_this)
        }
        _this.setTimeout_second--
        if(_this.setTimeout_second<0)
          _this.setTimeout_second=-1
      },1000)
      function inner_exec(){
        if(_this.reportName)
          _this.submit()
          //run_one(_this,_this.reportName,_this.queryPara)
        else
          _this.$notify({title: '提示',message: '没有提供参数：reportName',type: 'error'});
        //_this.refresh_layout(null,_this)
      }
      if(this.crisMobile && window.nutui==undefined){
        load_css_file("cdn/nutui@2.2.15/nutui.min.css")
        seriesLoadScripts("cdn/nutui@2.2.15/nutui.min.js",null,inner_exec)      
      }
      else
        inner_exec()
    }

  }, 
  provide() {
    return {
      context: {
          all_sheet_windows:[],
          canDraggable:false,
          crisMobile:this.crisMobile,
          report:this.context?.report,
          report_result:this.result,
          mode:'run',
          event:{},
          queryForm:this.queryForm,
          clickedEle:this.clickedEle,
          allElementSet:this.allElementSet,
          //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
          in_exec_url:this.in_exec_url,
          defaultsetting:this.result.defaultsetting,
          rpt_this:this,
          name_lable_map:this.name_lable_map,
      },   fresh_ele:this.fresh_ele,   

    }
  },  
  data () {
    return { 
        name_lable_map:{},
        isShow:false,
        grpId:0,
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
        setTimeout_function:function(){},
        setTimeout_second:10,
        setTimeout_exec_num:0,
        parentComponent: this,
        allElementSet:new Set(),//所有有ID名称的集合
        in_exec_url:{stat:false,run_url:""},
        pdf_output_dialogVisible:false,
        paper_setting_dialogVisible:false,
        big_screen_scale:100,
        big_screen_scale_x:100,
        big_screen_scale_y:100,
        paperSetting:{pageSize_name:'A5',}
    }
  },
  watch:{
  },
  methods:{
    pdf_print(){
      let iframe_print=document.getElementById("printIframe");
      iframe_print.setAttribute("src",document.getElementById("pdf_output").data)
      //兼容谷歌，不兼容ie8，效果可以自己试下（谷歌浏览器推荐使用这种，效果会比较好）
      setTimeout(() => {
        $("#printIframe")[0].contentWindow.print(); 
      },500);
      
    },
    async paperSetting_submit(val){
      let pdf_data=await get_pdf(this.result,val)
      let datauri = URL.createObjectURL(pdf_data)
      document.getElementById("pdf_output").data =datauri
    },
    refresh_layout(ddd,_this){  
      if(_this==undefined)
        _this=this
        _this.$set(_this,'isShow',false)
          setTimeout(() => {
              _this.$set(_this,'isShow',true)
              setTimeout(() => {
                  _this.$nextTick(x=>{
                     let form_h=_this.$refs.form?_this.$refs.form.clientHeight:0
                      //_this.$refs.report_pane.style.height=`calc(100% - ${form_h}px)`//
                      if(_this.result.defaultsetting.big_screen=='1'){
                          _this.big_screen_scale_y=100*_this.$refs.report_pane.clientHeight/parseInt(_this.result.defaultsetting.screen_height)
                          _this.big_screen_scale_x=100*_this.$refs.report_pane.clientWidth/parseInt(_this.result.defaultsetting.screen_width)
                          _this.big_screen_scale=Math.min(_this.big_screen_scale_x,_this.big_screen_scale_y)
                      }
                      document.title = (_this.result.data[Object.keys(_this.result.data)[0]]?.title)   || 'CellReport'
                      if(window.after_show_report_hook){window.after_show_report_hook()}
                  })
              });
          });
      },
    click_col_button(idx,item_idx){
      this.$set(this.mobile_col_button_arr[idx],'selected',item_idx)
      this.mobile_col_button_arr.splice(idx+1)
      if(this.mobile_col_button_arr[idx].arr[item_idx].arr.length>0)
        this.mobile_col_button_arr.push({selected:0,arr:this.mobile_col_button_arr[idx].arr[item_idx].arr })
      this.refresh_layout(null,this.$parent.$parent)
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

    submit(loading_conf=null){
      run_one(this,this.reportName,null,loading_conf)
    },
    change_param(param_name){
      let _this=this
      if(this.result.param_liandong.includes(param_name)){
        setTimeout(async function(){
          run_one(_this,_this.reportName,param_name)
        })        
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
      if(command=="exceljs")
        seriesLoadScripts('cdn/exceljs/exceljs.min.js',null,function (){
          exceljs_inner_exec(_this.result,_this.name_lable_map)
        })
      else if(command=="xlsxjs")
          seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js',null,function (){
            xlsxjs_inner_exec(_this,_this.name_lable_map)
        })
    },
    export_excel(){
       let _this=this
        //seriesLoadScripts('cdn/exceljs/exceljs.min.js',null,function (){
        //  exceljs_inner_exec(_this.result)
        //})
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
  computed: {
    parentCompent(){ return this},
    crisMobile(){
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        // localStorage.setItem('isiphone',flag)
        //localStorage.setItem('ismobile',flag?1:0)
      console.info(flag)
        return flag!=null && flag.length>0;
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
.report_define .el-tabs--border-card .el-tabs__content {
    height: calc(100% - 40px);
    width:100%
}

.CodeMirror { /*不加margin border codemirror的光标会有问题，行尾不出现光标，行内遇到空白会消失 */
  width: 100%;
  margin: 0 0 0 10px;
  border: 1px solid black;
  font-size : 11px;
    line-height : 150%;
    height: 100%!important; 
  }
.el-tabs--border-card>.el-tabs__content {
    padding: 2px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 1px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
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
