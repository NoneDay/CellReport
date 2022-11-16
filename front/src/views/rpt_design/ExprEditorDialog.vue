<template>
    <el-dialog  v-draggable style="text-align: left;" v-if="dialogVisible"
    :visible.sync="dialogVisible" :title="'设置表达式:'+prop.display" 
        :close-on-click-modal="false"  @close="close" 
          direction="btt" append-to-body  
    > 
<div style="height: 500px;;display:flex;flex-direction:column">
         <MonacoEditor  v-if="dialogVisible" ref="editor"  theme="vs" v-model="obj[prop.val]"
              language="javascript"  style="height:100%;border:solid 1px silver;margin-bottom:5px;"
              :options="{folding:false,lineNumbers:'off', minimap: { // 关闭代码缩略图
                      enabled: false // 是否启用预览图
                      },}"  >
                </MonacoEditor>
  <div style="height:67%">

    <div style="height:100%;width:100%;display:flex;justify-content: space-between;">
      <div  style="height:100%;width:33%">
        <div class="cr_title">数据集</div>
          <div style="width:100%;height:calc(50% - 30px);border: 1px solid #cbc8c8;overflow:auto">
            <div v-for="(ds,ds_idx) in report.dataSets.dataSet" :key="ds+ds_idx" 
            @click="cur_ds=ds"
            :style="{'background-color':cur_ds==ds?'#c5f3e0':'#fff'}"> <!-- https://www.iconfont.cn -->
                <img v-if="ds._type=='csv'" class="cr_icon" src="img/CSV图标.svg"/>
                <img v-if="ds._type!='csv' && ds._type!='cr'" class="cr_icon" src="img/数据库.svg"/>
                <img v-if="ds._type=='cr'" class="cr_icon" src="img/引用.svg"/>
                  {{ds._name}} 
            </div> 
            <div 
            @click="cur_ds=param_ds"
            :style="{'background-color':cur_ds==param_ds?'#c5f3e0':'#fff'}"> <!-- https://www.iconfont.cn -->
                <img class="cr_icon" src="img/引用.svg"/>
                param
            </div> 
          </div>
          <div class="cr_title">字段：</div>
        <div style="border: 1px solid #cbc8c8;width:100%;height:50%;overflow:auto">     
          
          <div v-for="(one,idx) in JSON.parse(cur_ds._fields)" 
              :key="one+idx" 
              :style="{'background-color':( cur_field==one)?'#c5f3e0':'#fff','cursor': 'pointer'}"        
              @click="choose_field(cur_ds,one)"
              @dblclick="insert_field(cur_ds,one)">       
              {{ one }}
          </div>
        </div>
      </div>
      <div style="width:66%;height:100%">
        <el-row>
      <el-col :span="12" style="">
        <el-scrollbar style="height: 200px;border: 1px solid #cbc8c8;margin-right: 1px;">
        <el-tree :data="func_xml" :props="{children:'catalogy',label:'_name'}" node-key="_name" accordion 
          @node-click="(data)=>catalogy=data">
            <span class="custom-tree-node" slot-scope="{ node, data }" >
                <span v-if="!node.isLeaf" type="text" size="mini" class="el-icon-folder custom-tree-node-label" 
                style="font-weight:700;" >
                    {{ data.name }}
                </span>
                <span  v-else type="text" size="mini" class="el-icon-bell custom-tree-node-label" 
                  >
                    {{ data._name }}
                </span>
            </span>
        </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="12" style="border: 1px solid #cbc8c8;">
      <div style="height:200px;overflow:auto">
       <div v-for="(one,idx) in catalogy.function" 
              :key="one+idx" 
              :style="{'background-color':( cur_func==one)?'#c5f3e0':'#fff','cursor': 'pointer'}"
              @click="change_func_xml('cur_func',one)"  
              @dblclick="insert_func(one._name)">       
              {{ one._name }}
          </div>
        </div>
      </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
        <el-input type="textarea" :rows="7" :value="cur_func.__text??''"></el-input>    
      </el-col>  
      </el-row>
      </div>
    </div>    

  </div>

</div>
 
          <div slot="footer" class="dialog-footer">
            <el-button @click="create_url_expr">生成url链接</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>      

</template>

<script>
import {loadFile} from './utils/util.js'
import {test_expr} from "./api/report_api.js"
import MonacoEditor from './element/MonacoEditor';
//import MonacoEditor from 'vue-monaco'
import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
export default {
    components: {MonacoEditor},
    
    mounted() {
      this.func_xml=x2jsone.xml2js(loadFile('func.xml'))["functions"]["catalogy"]
      //console.info(this.func_xml)
      
    },
    name: "ExprEditorDialog",
    props: { visible: Boolean, target_obj: Object,prop:Object,report:Object},
    data() {
        return {
        dialogVisible:false,
        obj:{sql:''},
        func_xml:"",
        catalogy:[],
        cur_func:"",
        cur_ds:{_fields:"[]"},
        cur_field:"",
        }
    }, 
  watch: {
    dialogVisible(val) {
      if(val){
        this.cur_func=""
        this.cur_ds={_fields:"[]"}
        this.cur_field=""
      }
      this.$emit('update:visible', val)
    },
    oldFormInput(val){
      this.obj=this.deepClone(val)
    },
    visible(val) {
      this.obj=this.deepClone(this.target_obj)
      if(val && this.obj[this.prop.val]==undefined)
        this.$set(this.obj,this.prop.val,'')
      this.dialogVisible=val
      this.$emit('update:visible', val)
    }
  },
  methods: {
    create_url_expr(){
      let expr="='?reportName=' + param.reportName"
      this.report.params?.param?.forEach(x => {
        if(x._inner=="False")
          expr=expr+`\n + "&${x._name}=" + param.${x._name}`
      });
      this.$refs.editor.value=expr
    },
   async handleSubmit(){
     if(this.prop.val=="_leftHead" || this.prop.val=="_topHead" ){
       if(this.obj[this.prop.val]!='' && this.obj[this.prop.val]!='`0' && false==(/^[a-zA-Z]{1,2}\d{1,2}$/i).test(this.obj[this.prop.val])){
          this.$message.error('格式只能是`0或字母数字组合')
          return 
       }
     }
     else if( this.obj[this.prop.val].startsWith("=")){
        let resp=await test_expr(this.obj[this.prop.val])
        if(resp.errcode!=0)
        {
          this.$message.error(resp.message)
          return 
        }
      }
        this.$emit('update:visible', false)
        this.$set(this.target_obj,this.prop.val,this.obj[this.prop.val])
        //this.target_obj[this.prop]=this.obj[this.prop]
        this.$emit("submit",{newVal:this.obj,old_Val:this.target_obj})        
    },
    close(){
      this.$emit('update:visible', false)      
    },
    
    change_func_xml(prop,data){
      this[prop]=data
    },
    choose_func(name){
      alert(name)
    },
    insertContent (text) {
      let editor=this.$refs.editor.editor
      if (editor) {
        editor.focus()
        let selection = editor.getSelection()
        let range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn)
        let id = { major: 1, minor: 1 }
        let op = {identifier: id, range: range, text: text, forceMoveMarkers: true}
        editor.executeEdits(this.root, [op])
        selection.selectionStartColumn=(selection.positionColumn+=text.indexOf("(")+1)
        
        editor.setSelection(selection)
        editor.focus()
      }
    },
    insert_func(name){
      let prefix=''
      if(!this.$refs.editor.value)
        prefix="="
      if(this.$refs.editor.value && this.$refs.editor.value.trim()=="")
        prefix="="
      let insrt_str
      if(this.catalogy._name=="数据集"){
        //let arg=name.replace("()",`(${this.cur_ds._name}.${this.cur_field})`)
        if(this.cur_ds._name==undefined){
          this.$message.error("数据集函数需要先选择数据集")
          return 
        }
        insrt_str=`${prefix}${this.cur_ds._name}.${name}`
      }
      else
        insrt_str=`${prefix}${name}`
      this.insertContent(insrt_str)
      console.info('xx')
      //let pos1 = this.editor.getCursor();
      //let pos2 = {};
      //pos2.line = pos1.line;
      //pos2.ch = pos1.ch-(insrt_str.length-insrt_str.indexOf("(") - 1);
      //this.editor.setCursor(pos2);
      
    },
    choose_field(ds,field){
      this.cur_ds=ds
      this.cur_field=field      
    },
    insert_field(ds,field){
      this.cur_ds=ds
      this.cur_field=field
      if(this.$refs.editor.value && this.$refs.editor.value.trim()!="")
        this.insertContent(ds._name+"."+field)
      else
        this.insertContent("="+ds._name+"."+field)
    }
  },
  computed:{
    param_ds(){
      let param_fields=[]
      this.report.params?.param?.forEach(x => {
        param_fields.push(x._name)
      });
      return {_name:"param", _fields: JSON.stringify( param_fields)}
    }
  }
}
</script>
<style lang="less" scoped>
.my_active{ color: red;}
.el-table__body tr.current-row>td {
    background-color: rgb(197, 243, 224);
}
</style>