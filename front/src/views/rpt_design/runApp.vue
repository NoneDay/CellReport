<template>
  <div id="report_app"> 
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

    <div ref="form" v-if="!crisMobile && isShow"> 
      <el-form :inline="true" label-position="right" label-width="80px" >
        <input hidden v-for="one in result.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        <div style="display:inline;max-width:100px" v-for="one in result.form.filter(x=>x.hide=='False')" :key="one.name">
          <el-form-item :label="one.prompt">
          <el-input v-if="one.data_type=='string' && one.tagValueList.length==0 && one.canUsedValueFrom!='Query' " v-model="queryForm[one.name]"></el-input>
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom!='Query' && one.tagValueList.length>0" v-model="queryForm[one.name]" 
            collapse-tags  @change="change_param(one.name)"
            :multiple="one.allowMutil=='False'?false:true">
             <el-option
                v-for="item in one.tagValueList"
                :key="item[1]"
                :label="item[0]"
                :value="item[1]">
              </el-option>
          </el-select>  
          
          <el-select v-if="['string','int'].includes(one.data_type) && one.canUsedValueFrom=='Query' && one.parent_valueField_kyz=='' " v-model="queryForm[one.name]" 
            collapse-tags  @change="change_param(one.name)"
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
            <el-form-item style="text-align: center;width: 264px;">
            <el-button type="primary" class='form_query_button' @click="submit">查询</el-button>
            <el-button type="primary" class='form_query_button' @click="export_excel">导出excel</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div  ref="form" v-if="crisMobile && isShow"> 
      <form > 
        <input hidden v-for="one in result.form.filter(x=>x.hide=='True')" :key="one.name" v-model="queryForm[one.name]"/>
        <img src="img/battle_2021.jpg" style="height: 80px;width: 100%;" v-if="result.form.filter(x=>x.hide=='False').length<=1">
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
              @choose="val=>{queryForm[one.name]=`${val[0]}-${val[1]}-${val[2]}`
                submit()
                }"  
            > </nut-datepicker >
           <nut-picker   v-if="['datetime','dateTime'].includes( one.data_type) && queryForm_show[one.name]" 
              :is-visible.sync="queryForm_show[one.name]"
              :list-data="[[(parseInt(queryForm[one.name].substring(0,4))-1).toString(),queryForm[one.name].substring(0,4)],
              ['01','02','03','04','05','06','07','08','09','10','11','12']]"
              :default-value-data="[queryForm[one.name].substring(0,4),queryForm[one.name].substring(4,6)]"
              @close="queryForm_show[one.name]=false" :title="'请选择'+one.prompt" 
              @confirm="val=>{queryForm[one.name]=`${val[0]}${val[1]}`
                submit()
                }"  
            > </nut-picker>

            <nut-buttonroup  v-if=" one.data_type=='string' && one.tagValueList.length>0 && one.allowMutil=='False'">
              <div style="display: inline;    font-size: 14px;   padding-left: 10px; margin-right: 20px;"> <b>{{one.prompt}}</b></div>
              <nut-button  :type="queryForm[one.name]==item[1]?'primary':'lightred'"
               shape="circle"   small  
               v-for="item in one.tagValueList" :key="item[1]"
              @click.prevent=" queryForm[one.name]=item[1]
              submit()"> {{item[0]}}</nut-button>
            </nut-buttonroup>

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
          
      </form>
    </div>
    <div ref="report_pane" class="report_define" v-if="isShow" :style="{color:result.defaultsetting['COLOR'],background:result.defaultsetting['BACKGROUND-COLOR']}">
        <grid-layout-form v-if="layoutType=='gridLayout'" :layout="layout" >
        </grid-layout-form>          
        <widget-form v-else   :data="layout"   
        ></widget-form>
    </div>    
  </div>
</template>

<script>
import widgetForm from './WidgetForm'
import {dateToString} from './utils/resultGrid2HtmlTable.js'
import {run_one} from "./api/report_api"
import {convert_csv_to_json,convert_array_to_json,build_chart_data, deepClone,arrayToTree,seriesLoadScripts,load_css_file } from "./utils/util"
import install_component from './install_component'
export default {
  name: 'App', //CellReportFormDesign
  components:{widgetForm },
  mounted(){    
    let _this=this
    window.onresize=function(){      
      _this.isShow=false
          setTimeout(() => {
              _this.isShow=true
              setTimeout(() => {
                  _this.$nextTick(x=>{
                      let form_h=_this.$refs.form.clientHeight
                      _this.$refs.report_pane.style.height=`calc(100% - ${form_h}px)`
                      document.title = _this.result.data[Object.keys(_this.result.data)[0]].title
                  })
              });
          });
      }
  },
  created() {
    
    Vue.use(install_component)
    let url_arr=window.location.href.split('?')
    
    if(window.location.hash!='')
      this.grpId=window.location.hash.split("?")[0].substring(1)
    if(url_arr.length>0){
      let cs = url_arr[1];                //获取?之后的参数字符串
      this.queryPara=url_arr[1]
      let cs_arr = cs.split('&');                    //参数字符串分割为数组
      cs={};
      for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
        cs[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
      }
      if (cs.reportName){
        this.reportName=cs.reportName
      }
      let _this=this
      function inner_exec(){
        if(_this.reportName)
          run_one(_this,_this.reportName,_this.queryPara)
        else
          _this.$notify({title: '提示',message: '没有提供参数：reportName',type: 'error'});
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
          clickedEle:this.clickedEle,
          allElementSet:this.allElementSet,
          //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
          in_exec_url:this.in_exec_url,
          defaultsetting:this.result.defaultsetting
          
      },   fresh_ele:this.fresh_ele,   

    }
  },  
  data () {
    return { 
        isShow:false,
        grpId:0,
        reportName:"",
        queryPara:"",
        queryForm:{},
        queryForm_show:{},
        exec_log:"",
        result:{form:[]},
        clickedEle:{},
        executed:false,
        last_js_cript:"",
        layout:[],
        fresh_ele:[],
        allElementSet:new Set(),//所有有ID名称的集合
        in_exec_url:{stat:false,run_url:""},
    }
  },
  methods:{
    
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
    init(){
        //this.queryPara=""
        for(let k in this.queryForm)
          delete this.queryForm[k]
        for(let k in this.clickedEle)
          delete this.clickedEle[k]

        this.allElementSet.clear()
        
    },
    submit(){
      run_one(this,this.reportName,this.queryPara,this.queryForm)
    },
    change_param(param_name){
      let _this=this
      if(this.result.param_liandong.includes(param_name)){
        setTimeout(async function(){
          run_one(_this,_this.reportName,_this.queryPara,_this.queryForm,param_name)
        })        
      }
    },
    export_excel(){
      let _this=this
      //如果使用 FileSaver.js 就不要同时使用以下函数
      function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式 
          var tmpa = document.createElement("a");
          tmpa.download = fileName || "下载";
          tmpa.href = URL.createObjectURL(obj); //绑定a标签
          tmpa.click(); //模拟点击实现下载
          setTimeout(function () { //延时释放
              URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
          }, 100);
      }
      function s2ab(s) {
          if (typeof ArrayBuffer !== 'undefined') {
              var buf = new ArrayBuffer(s.length);
              var view = new Uint8Array(buf);
              for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
              return buf;
          } else {
              var buf = new Array(s.length);
              for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
              return buf;
          }
      }
      function _inner_exec(){
        const wb = XLSX.utils.book_new()
        
        let ws ,title,one_obj
        Object.keys( _this.result?.name_lable_map).forEach(one => {
            one_obj=_this.result?.name_lable_map[one]
            if(one_obj.component=="ele-grid"){
              let {valid_data,valid_fileds,real_data}=build_chart_data(one_obj.datasource,{report_result:_this.result,clickedEle:_this.clickedEle,
                  allElementSet:_this.allElementSet,},one_obj.fields)
              //let tableData = convert_array_to_json(valid_data)
              ws= XLSX.utils.aoa_to_sheet(valid_data)
              Object.entries(ws).forEach(([k,cell])=>{
                if(k=="!ref")
                  return
                cell.s = {									//为某个单元格设置单独样式
                  font: {
                    name: '宋体',
                    sz: 24,
                    bold: true,
                    color: { rgb: "red" }
                  },
                  alignment: { horizontal: "center", vertical: "center", wrap_text: true },
                  fill: { bgcolor: { rgb: 'ffff00' } }
                }
              })
              title=one_obj.label??one
            }
            else if(one_obj.component=="luckySheetProxy"){
              if (_this.result.data[one].type== "common"){
                ws= XLSX.utils.aoa_to_sheet(_this.result.data[one].tableData)
                ws['!merges']=[]
                Object.keys( _this.result.data[one].config_merge).forEach(ele_m=>{
                  let m=_this.result.data[one].config_merge[ele_m]
                  ws['!merges'].push({s:{c:m.c,r:m.r},e:{c:m.c+m.cs-1,r:m.r+m.rs-1}})
                                
                })
                title=one_obj.label??one
              }
              if (_this.result.data[one].type== "large"){
                ws= XLSX.utils.aoa_to_sheet(_this.result.data[one].tableData)
                let header_len=_this.result.data[one].tableData.length
                XLSX.utils.sheet_add_json (ws,_this.result.data[one].data, { origin: { r: header_len, c: 0 }})
                title=one_obj.label??one
              }
            }
            if(ws==undefined)
              return
            while(wb.SheetNames.includes(title))
              title=title+one_obj.gridName
            XLSX.utils.book_append_sheet(wb, ws, title.replace(/[\\|/|?|*|\[|\]]/,'_'))
            ws=undefined
        });
        const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };//这里的数据是用来定义导出的格式类型 
        saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}), 
        "这里是下载的文件名" + ".xlsx");
  
      }
      seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js',null,_inner_exec)
      
    }
    
  },
  computed: {
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
html, body, #report_app {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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
}

.CodeMirror { /*不加margin border codemirror的光标会有问题，行尾不出现光标，行内遇到空白会消失 */
  width: 100%;
  margin: 0 0 0 10px;
  border: 1px solid black;
  font-size : 13px;
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
.cr-cell {margin: 0;
  padding: 0 4px;
  white-space: wrap;
  word-wrap: normal;
  overflow: hidden;            
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
      color: rgb(66,185,131);
      font-size: 40px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
</style>
