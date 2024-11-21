<template>
<div style="display:flex;flex-direction: column;height:100%">
    <div style="">
    <el-form label-suffix="：" labelPosition="left" :inline="true" 
             labelWidth="100px" size="mini">
        <el-form-item label="报表组">
            <el-select v-model="data.grp" @change="grp_change">
                <el-option
                    v-for="item in rptgrps"
                    :key="item.Id" :label="item.name" :value="item.Id">
                </el-option>
            </el-select>
        </el-form-item>  
        <el-form-item label="数据源连接">
        <el-select v-model="data.datasource" @change="datasource_change">
                <el-option
                    v-for="item in datasource" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </el-form-item> 
        <el-form-item label="表">
            <el-select v-model="data.table" @change="table_change" clearable filterable>
                <el-option v-for="item,idx in tables" :key="idx" :label="item.TABLE_SCHEMA+'.'+item.TABLE_NAME" :value="item.TABLE_CATALOG+'.'+item.TABLE_SCHEMA+'.'+item.TABLE_NAME">
                </el-option>
            </el-select>
        </el-form-item> 
    </el-form> 
    </div>
    <div class="crud" style="height:100%;flex:1">
        <div class="avue-crud__header">
            <div class="avue-crud__left">
                <el-button-group>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="open('table','表格配置')">表格配置</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-s-fold" @click="open('menu','操作配置')">操作配置</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-s-order" @click="open('dialog','弹框配置')">弹框配置</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-magic-stick" @click="open('btn','按钮配置')">按钮配置</el-button>
                    <el-checkbox v-model="as_parent">包含明细表</el-checkbox>
                </el-button-group>
            </div>
            <div class="avue-crud__right">
                
                <el-button type="text" size="mini" icon="el-icon-document" @click="handleAvueDoc">Avue文档</el-button>
                <el-button type="text" size="mini" icon="el-icon-download" @click="handleGenerateJson">生成代码</el-button>
                
            </div>
        </div>
        <avue-crud :option="option" v-model="form" ref="crud" @row-save="rowSave" size="mini" 
                @row-update="rowUpdate" @row-del="rowDel" @sortable-change="sortableChange"
                :data="main_tbl.columns" :before-open="beforeOpen"></avue-crud>
  </div>
  <!-- 配置 -->
  <el-drawer :title="title" show-close append-to-body size="50%" :visible.sync="box" >
      <el-scrollbar height="100%">
        <avue-form :option="tableOption" v-model="tableForm" v-if="type==='table'"></avue-form>
        <avue-form :option="menuOption" v-model="tableForm" v-else-if="type==='menu'"></avue-form>
        <avue-form :option="dialogOption" v-model="tableForm" v-else-if="type==='dialog'"></avue-form>
        <avue-form :option="btnOption" v-model="tableForm" v-else-if="type==='btn'"></avue-form>
      </el-scrollbar>
    </el-drawer>

    <!-- 生成JSON -->
    <el-drawer title="将代码复制到对应报表组报表的模板中"
               append-to-body
               :visible.sync="generateJsonVisible"
               size="100%"
               destroy-on-close> 
<MonacoEditor theme="vs" v-model="widgetFormPreview" 
    language="html"   :options="{}"  ></MonacoEditor>
      <div class="drawer-foot">
        <el-button size="mini"
                   type="primary"
                   @click="handleCopy">复制</el-button>
        <el-button size="mini"
                   type="danger"
                   @click="generateJsonVisible = false">取消</el-button>
      </div>
    </el-drawer>
    <!-- 预览 -->
    <el-drawer title="预览" size="100%" :visible.sync="drawer" v-if="drawer"  append-to-body destroy-on-close>
        xxx<widget-form-item  :self="codeOption"  >
        </widget-form-item>
    </el-drawer>
</div>
</template>
<script>
import {call_server_func } from "./utils/util"
import {rptGrpList} from "./api/report_api"
let dicList = [{label: '输入框',value: 'input'},  
{label: '选择框',value: 'select'},  {label: '密码框',value: 'password'},  
{label: '数字框',value: 'number'},  {label: '上传框',value: 'upload'},  
{label: '颜色选择器',value: 'color'},  {label: '树',value: 'tree'},  
{label: '地图选择器',value: 'map'},  {label: '表格选择器',value: 'table'},  
{label: '图标选择器',value: 'icon'}, {label: '树型下拉框',value: 'tree'}, 
{label: '单选框',value: 'radio'},  {label: '多选',value: 'checkbox'},  
{label: '开关框',value: 'switch'}, {label: '文本框',value: 'textarea'},  
{label: '时间框',value: 'time'},  {label: '时间范围',value: 'timerange'},  
{label: '级联框',value: 'cascader'},  {label: '日期框',value: 'date'},  
{label: '日期时间框',value: 'datetime'},  {label: '日期时间范围',value: 'datetimerange'},  
{label: '多个日期',value: 'dates'},  {label: '月',value: 'month'},  
{label: '周',value: 'week'},  {label: '年',value: 'year'}]
  
let ynList = [{label: '否',value: false},  {label: '是',value: true  }]
let alignList = [{label: '居左',value: 'left'},{label: '居中',value: 'center'},{label: '居右',value: 'right'  }]

  let menuOption = {menuBtn: false,column: [
    {  label: '显示',  prop: 'menu',  type: 'select',  dicData: ynList}, 
    {  label: '宽度',  prop: 'menuWidth'}, 
    {  label: '文案',  prop: 'menuTitle'}, 
    {  label: '对齐方式',  prop: 'menuAlign',  type: 'select',  dicData: alignList}, 
    {  label: '按钮类型',  prop: 'menuType',  type: 'select',  
        dicData: [  {label: '按钮',  value: 'button'}, 
                    {  label: '图标',  value: 'icon'}, 
                    {  label: '文字',  value: 'text'}, 
                    {  label: '下拉菜单',  value: 'menu'  }]
    }]
  }

  let dialogOption = {menuBtn: false,
    column: [{  label: '宽度',  prop: 'dialogWidth'}, 
        {  label: '类型',  prop: 'dialogType',  type: 'select',  
            dicData: [{    label: '弹窗',value: 'dialog'},  {label: '抽屉',value: 'drawer'}]
        }, 
        {  label: '顶部距离',  prop: 'dialogTop'}, 
        {  label: '全屏',  prop: 'dialogFullscreen',  type: 'select',  dicData: ynList}, 
        {  label: 'esc关闭',  prop: 'dialogEscape',  type: 'select',  dicData: ynList}, 
        {  label: '遮罩',  prop: 'dialogModal',  type: 'select',  dicData: ynList}, 
        {  label: '遮罩关闭',  prop: 'dialogClickModal',  type: 'select',  dicData: ynList}, 
        {  label: '关闭按钮',  prop: 'dialogCloseBtn',  type: 'select',  dicData: ynList
    }]
  }

  let btnOption = {menuBtn: false,labelWidth: 100,
    group: [
        {  label: '表格',  prop: 'table',  
                column: [{    label: '新增按钮',prop: 'addBtn',type: 'select',dicData: ynList,value:true}, 
            {label: '新增按钮文案',prop: 'addBtnText'}, 
            {label: '编辑按钮',prop: 'editBtn',type: 'select',dicData: ynList,value:true}, 
            {label: '编辑按钮文案',prop: 'editBtnText'}, 
            {label: '查看按钮',prop: 'viewBtn',type: 'select',dicData: ynList,value:true}, 
            {label: '查看按钮文案',prop: 'viewBtnText'}, 
            {label: '删除按钮',prop: 'delBtn',type: 'select',dicData: ynList,value:true}, 
            {label: '删除按钮文案',prop: 'delBtnText'}]
        }, 
        {  label: '搜索',  prop: 'search',  
            column: [{    label: '搜索按钮',prop: 'searchBtn',type: 'select',dicData: ynList}, 
                {label: '搜索按钮文案',prop: 'searchBtnText'}, 
                {label: '清空按钮',prop: 'searchBtn',type: 'select',dicData: ynList}, 
                {label: '清空按钮文案',prop: 'emptyBtnText'}]}, 
                {  label: '弹窗',  prop: 'dialog',  
                    column: [{    label: '保存按钮',prop: 'saveBtn',type: 'select',dicData: ynList}, 
                        {label: '保存按钮文案',prop: 'saveBtnText'}, 
                        {label: '更新按钮',prop: 'updateBtn',type: 'select',dicData: ynList}, 
                        {label: '更新按钮文案',prop: 'updateBtnText',  }, 
                        {label: '取消按钮',prop: 'cancelBtn',type: 'select',dicData: ynList}, 
                        {label: '取消按钮文案',prop: 'cancelBtnText',  }]
                    }, 
        {  label: '其它',  prop: "default",  
            column: [{label: '日期按钮',prop: 'dateBtn',type: 'select',dicData: ynList}, 
        {label: '打印按钮',prop: 'printBtn',type: 'select',dicData: ynList}, 
        {label: '导出按钮',prop: 'excelBtn',type: 'select',dicData: ynList}, 
        {label: '刷新按钮',prop: 'refreshBtn',type: 'select',dicData: ynList}, 
        {label: '过滤按钮',prop: 'filterBtn',type: 'select',dicData: ynList}, 
        {label: '显隐按钮',prop: 'showColumnBtn',type: 'select',dicData: ynList}]
    }],
  }

let tableOption =   {menuBtn: false,labelWidth: 110,
    column: [{  label: '主键',  prop: 'rowKey'}, 
            {  label: '序号',  prop: 'index',  type: 'select',  dicData: ynList}, 
            {  label: '多选',  prop: 'selection',  type: 'select',  dicData: ynList}, 
            {  label: '提示',  prop: 'tip',  type: 'select',  dicData: ynList}, 
            {  label: '边框',  prop: 'border',  type: 'select',  dicData: ynList}, 
            {  label: '折叠',  prop: 'expand',  type: 'select',  dicData: ynList}, 
            {  label: '表头对其',  prop: 'headerAlign',  type: 'select',  dicData: alignList}, 
            {  label: '对其方式',  prop: 'align',  type: 'select',  dicData: alignList}, 
            {  label: '表单标题宽度',  prop: 'labelWidth'}]
  }
  let option = {dialogType: 'drawer',dialogModal:false,//dialogWidth: 800,labelWidth: 100,
  refreshBtn: false,dragHandler: true,sortable: true,height:'400px',
  group: [{  label: '基本参数',  prop: 'jbcs',  
        column: [  {label: '名称',  prop: 'label', rules: [      { required: true, message: '请输入名称', trigger: 'change' }    ]}, 
                {  label: 'prop值',  prop: 'prop',  rules: [ { required: true, message: '请输入名称', trigger: 'change' }    ]}, 
                {  label: '类型',  prop: 'type',  type: 'select',dicData: dicList,  rules: [      { required: true, message: '请选择类型', trigger: 'change' }    ]  },
                {label:"数据类型",prop:"data_type",editDisabled:true,type:"select"},
                {label:"主键",prop:"is_key",type:"switch" ,dicData:ynList},
                {label:"可Null",prop:"is_nullable",editDisabled:true,type:"select"},
            ]
        }, 
    
    {  label: '位置设置',  prop: 'wzsz',  
        column: [{  label: 'span',prop: 'span'}, 
        {label: 'gutter',prop: 'gutter'}, 
        {label: 'size',prop: 'size'}]}, 

    {  label: '表格属性',  prop: 'bgsx',  
        column: [  {label: '宽度',  prop: 'width',  type: 'number'}, 
        {  label: '最小宽度',  prop: 'minwidth',  type: 'input'}, 
        {  label: '对其方式',  prop: 'align',  type: 'select',  dicData: alignList}, 
        {  label: '冻结',  prop: 'fixed',  type: 'select',  dicData: ynList}, 
        {  label: '隐藏',  prop: 'hide',  type: 'select',  dicData: ynList  },{label: '超出省略',  prop: 'overHidden',  type: 'select',  dicData: ynList}, 
        {  label: '筛选',  prop: 'filter',  type: 'select',  dicData: ynList}, 
        {  label: '搜索',  prop: 'search',  type: 'select',  dicData: ynList  }]}, 
    
    {  label: '表单属性',  prop: 'bdsx',  
        column: [{    label: '辅助语',prop: 'placeholder',  }, 
            {label: '提示语',prop: 'tip',  }, 
            {label: '新增显示',prop: 'addDisplay',type: 'select',dicData: ynList}, 
            {label: '编辑显示',prop: 'editDisplay',type: 'select',dicData: ynList}, 
            {label: '新增禁止',prop: 'addDisabled',type: 'select',dicData: ynList}, 
            {label: '编辑禁止',prop: 'editDisabled',type: 'select',dicData: ynList}, 
            {label: '只读',prop: 'readonly',type: 'select',dicData: ynList}, 
            {label: '最大行',prop: 'maxRows',type: 'input',  }, 
            {label: '最小行',prop: 'minRows',type: 'input',  }, 
            {label: '多选',prop: 'multiple',type: 'select',dicData: ynList,  }, 
            {label: '精度',prop: 'precision',type: 'input',  }, 
            {label: '日期格式化',prop: 'format'}, 
            {label: '日期格式化值',prop: 'valueFormat'}]
            }],
    column: [{    label: '名称',prop: 'label',display: false}, 
        {label: 'prop值',prop: 'prop',display: false}, 
        {label: '类型',prop: 'type',type: 'select',dicData: dicList,display: false},
        {label:"数据类型",prop:"data_type",editDisabled:true,display: false},
        {label:"主键",prop:"is_key",type:"input",display: false},
        {label:"可Null",prop:"is_nullable",editDisabled:true,display: false},
    ],
  }
import { baseUrl } from '@/config/env';   

import MonacoEditor from './element/MonacoEditor';

export default {
    name: "datasetManger2",
    components: {MonacoEditor},
    props: { visible: Boolean},
    inject: ["context"],
    async mounted(){
        let _this=this
        let result=await rptGrpList()
        _this.$set( _this,'rptgrps',result);
        if(_this.rptgrps.length==0){
            this.$message.error('没有你能管理的报表');
            return
        }
    },
    provide() {
        return {
            context: {
                all_sheet_windows: [],
                canDraggable: false,
                crisMobile: false,
                report: {defaultsetting: {'BACKGROUND-COLOR':'#012545','COLOR':'#fff'},},
                report_result: {},
                mode: "design",        
                clickedEle: {},
                allElementSet: {},
                //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
                in_exec_url: false,
                defaultsetting: {'BACKGROUND-COLOR':'#012545','COLOR':'#fff'},
                fresh_ele: [],
                
            }
        };
    },
    data(){
        return {
            as_parent:false,
            rptgrps:[],
            datasource:[],
            tables:[],
            all_tbl:{},
            main_tbl:{},
            cloumn_list:[],
            drawer: false,
            importJsonVisible: false,
            generateJsonVisible: false,
            widgetFormPreview: {},
            title: '',
            box: false,
            tableForm:{"addBtn":true,"editBtn":true,"viewBtn":true,"delBtn":true},
            type: '',
            tableOption: tableOption,
            menuOption: menuOption,
            dialogOption: dialogOption,
            btnOption: btnOption,
            form:{},
            data:{table:{},grp:"",datasource:""},
            option:option,
            codeOption:{type:"ele-grid",'label':'ele_grid',icon: 'icon-table','color':'#fff',display: true, 
                        pageSize:20,
                        gridName:'示例',
                        datasource:"示例",fresh_ds:[],fresh_params:[],
                        fields:[],style:{height:'100%'},content:""
                    },
        }
    },
    computed: {
        codeList () {
            let list = [];
            //const Mock = window.Mock;
            for (let i = 0; i < 10; i++) {
                let obj = {};
                this.cloumn_list.forEach(ele => {
                let result = '';
                if (ele.type == 'number') {
                    result = Mock.mock({
                    "number|1-100": 100
                    })
                } else {
                    result = Mock.mock('@cname');
                }
                obj[ele.prop] = result
                })
                list.push(obj)
            }
            return list
        },
        server_url(){
            //if(baseUrl == `/report5`)
                return `run:${this.data.grp}?reportName=/`
            //else
            //    return `${baseUrl}/run:${this.data.grp}?reportName=/`
        }
  },
    methods:{
        handleAvueDoc () {
            window.open('https://avuejs.com/crud/crud-doc/', '_blank')
        },
        async grp_change (val){
            this.datasource=await call_server_func("AllDataSource",null,this.server_url)
            this.data.datasource=""
            this.tables=[]
            this.cloumn_list=[]
            this.data.table=""
        },
        async datasource_change (val){
            
            let data=await call_server_func(`db_tables`,this.data.datasource,this.server_url)
            if(data.errcode){
                this.$alert(data.message, '提示', {confirmButtonText: '确定',type: 'warning'});
                return
            }
            this.tables=data
            this.data.table=""
            this.cloumn_list=[]
        },
        async table_change(val){
            let tbl=val.split(".")
            this.all_tbl={}
            let main_tbl=await call_server_func(`db_tableinfo`,{datasource:this.data.datasource,table_name:tbl[2],schema_name:tbl[1]},this.server_url)
            this.all_tbl[tbl[2]]=main_tbl
            for(let x in main_tbl.foreign_info)
            {
                let cur=main_tbl.foreign_info[x]
                let one=await call_server_func(`db_tableinfo`,{datasource:this.data.datasource,table_name:cur.table,schema_name:tbl[1]},this.server_url)
                this.all_tbl[cur.table]=one
            }
            Object.keys(this.all_tbl).forEach(a=>{
                let one=this.all_tbl[a]
                if(one.foreign_info.length==0 && one.columns.filter(x=>x.is_key==true).length==1)
                    one.type='字典表'
                else if(one.columns.filter(x=>x.is_key==true && one.foreign_info.filter(f=>f.from== x.prop).length>0).length>0)
                    one.type='子表'
                else
                    one.type='主表'
            })
            this.allDict=[]
            main_tbl.foreign_info.forEach(x=>{
                if(this.all_tbl[x.table].type=='字典表'){
                    let cur_col=main_tbl.columns.filter(y=>y.prop==x.from)[0]
                    cur_col.type='select'
                    cur_col.filterable=true
                    cur_col.m_dictData=x.table
                    this.allDict.push({table:x.table,key:x.to,columns:Enumerable.from(this.all_tbl[x.table].columns).select(x=>x.prop).toArray() })
                }
            })
            
            this.main_tbl=main_tbl
            this.cloumn_list=main_tbl.columns
            this.cloumn_list.forEach(x=>{
                if(x.m_dictData){
                    x.dicData=`<!!>this.allDict['${x.m_dictData}']<!!>`
                    }
            })
        },
        beforeOpen (done) {
            done();
        },
        open (type, title) {
            this.title = title;
            this.type = type;
            this.box = true;
        },
        rowUpdate (row, index, done) {
            this.cloumn_list.splice(index, 1, row);
            done();
        },
        rowDel (row, index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.cloumn_list.splice(index, 1);
            }).catch(() => {

            });
        },
        handleGenerateJson () {
            if(this.data.grp){
                let _this=this
                call_server_func(`buildTemplate` ,
                {
                    ds_link:this.data.datasource,
                    schema:this.data.table.split(".")[1]==""?"":this.data.table.split(".")[1]+".",
                    table:this.data.table.split(".")[2],
                    col_list:Enumerable.from(this.cloumn_list).select(x=>x.prop).toArray(),
                    keys:Enumerable.from(this.cloumn_list).where(x=>x.is_key==true).select(x=>x.prop).toArray(),
                    auto_incr_cols:Enumerable.from(this.cloumn_list).where(x=>x.auto_incr).select(x=>x.prop).toArray(),
                    crud_option:_this.code(),
                    allDict:this.allDict,
                    as_parent:this.as_parent
                },this.server_url)
                .then(x=>{
                    if(x.errcode){
                        _this.$message.error(x.message)
                        return
                    }
                    //console.info(x.最终模板)
                    _this.codeOption=(
                    {type:"ele-grid",'label':'ele_grid',icon: 'icon-table','color':'#fff',display: true, 
                        pageSize:20,
                        gridName:'示例',
                        datasource:"示例",fresh_ds:[],fresh_params:[],
                        fields:[],style:{height:'100%'},content:x.最终模板
                    })
                    _this.widgetFormPreview =x.最终模板
                    _this.generateJsonVisible = true
                })
            }
        },
        
        code () {
            function vaild (option = {}, ele = '') {
                const result = option[ele] + '' || '';
                return !result || ele.includes('$')
            }
            let option = {};
            option = this.deepClone(this.tableForm || {});
            Object.keys(option).forEach(ele => {
                if (vaild(option, ele)) delete option[ele];
            })
            let _this=this
            option.column = this.deepClone(this.cloumn_list || []);
            option.column.forEach(x=>{
                if(x.type=='table'){
                    //delete x.dicData
                    let tmp_column=Enumerable.from(_this.all_tbl[x.m_dictData].columns).select(t=>{return {label:t.label,prop:t.prop};}).toArray();
                    console.info(tmp_column)
                    let key=Enumerable.from(_this.all_tbl[x.m_dictData].columns).first(x=>x.is_key==true).prop
                    x.children= { border: true,column:tmp_column}
                    x.props={value:`${key}`,label:`${_this.all_tbl[x.m_dictData].columns[1].prop}`}
                    x.formatter=`<!!> (row) => {
                if(!row.name) return ''
                return row.name + '-' + row.sex}\n<!!>`
                    x.onLoad=`<!!>({ page, value,data }, callback) => {
    cellreport.call_server_func("TableData_${_this.data.table.split(".")[2]}",{page, value,data,table:'${x.m_dictData}',key:'${key}' },this).then(result=>{
          this.$Log.capsule('TableData', JSON.stringify( result) )   
          if(result['errcode'] ){
            this.$message({message: result.message,type: "error"});
          }
          else {
            callback(result)
          }
      });                        
}<!!>`
              
                }
            })
            if(this.as_parent)
                option.column.push({labelWidth:0,label:'',prop:'_info_',span:24,hide:true,formslot:true,}  )

            option.column.forEach(ele => {
                Object.keys(ele).forEach(key => {
                    if(ele.is_key==false)
                        delete ele.is_key
                    if (vaild(ele, key) || ['data_type','dflt_value','is_nullable','auto_incr','m_dictData',''].includes(key)) 
                        delete ele[key];
                })
            })
            let jsStr = JSON.stringify(option,).replaceAll("},","}\n,").replaceAll('<!!>"',"")
                        .replaceAll('"<!!>',"").replaceAll('"column":[','\n"column":[\n');
            return jsStr.replaceAll(/"(\w+)":/mg,'$1:');
        },        
    }
}
</script> 