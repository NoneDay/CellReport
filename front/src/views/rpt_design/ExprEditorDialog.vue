<template>
    <el-dialog  v-draggable style="text-align: left;" v-if="dialogVisible"
    :visible.sync="dialogVisible" :title="'设置表达式:'+prop.display" 
        :close-on-click-modal="false"  @close="close" 
          direction="btt" append-to-body  
    > 
<div style="height: 500px;">
  <div style="height: 150px;">
   
    <form>
      <codemirror v-if='dialogVisible' ref="editor"    v-model="obj[prop.val]" 
          :options="{tabSize: 4, mode: 'text/javascript', styleActiveLine: true,lineWrapping: true,
            theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
            @ready="editor_ready"
         />
      </form>
  </div>
  <div style="padding:10px 20px;height:calc(100% - 150px)">

<div style="height:100%;width:100%;display:flex">
  <div  style="height:100%;width:33%">
    <div class="cr_title">数据集</div>
      <div style="width:100%;height:calc(50% - 30px);border: 1px dotted;overflow:auto">
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
     <div style="width:100%;height:50%;border: 1px dotted;overflow:auto">     
       
      <div v-for="(one,idx) in JSON.parse(cur_ds._fields)" 
          :key="one+idx" 
          :style="{'background-color':( cur_field==one)?'#c5f3e0':'#fff','cursor': 'pointer'}"        
          @click="choose_field(cur_ds,one)"
          @dblclick="insert_field(cur_ds,one)">       
          {{ one }}
      </div>
     </div>
  </div>
  <div style="width:67%;height:100%">
    <el-row>
  <el-col :span="12">
    <el-scrollbar style="height:250px">
     <el-tree :data="func_xml" :props="{children:'catalogy',label:'_name'}" node-key="_name" accordion >
             <span class="custom-tree-node" slot-scope="{ node, data }" >
                    <span v-if="!node.isLeaf" type="text" size="mini" class="el-icon-folder custom-tree-node-label" 
                    style="font-weight:700;" >
                        {{ data.name }}
                    </span>
                    <span  v-else type="text" size="mini" class="el-icon-bell custom-tree-node-label" 
                    @click="change_func_xml('catalogy',data,node)" >
                        {{ data._name }}
                    </span>
                </span>
    </el-tree>
    </el-scrollbar>
  </el-col>
  <el-col :span="12">
    <el-scrollbar style="height:250px">
    <el-table :show-header='false' max-height="250"
     :data="catalogy.function" highlight-current-row style="width: 100%">
        <el-table-column label="姓名" width="180">
          <template slot-scope="scope">
              <div @click="change_func_xml('cur_func',scope.row.__text)"  @dblclick="insert_func(scope.row._name)">
                  {{ scope.row._name }}
              </div>
            </template>
        </el-table-column>
    </el-table>
    </el-scrollbar>

  </el-col>
  </el-row>
  <el-row>
    <el-col :span="24">
    <el-input type="textarea" :rows="6" v-model="cur_func"></el-input>    
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
import  codemirror  from './element/vue-codemirror.vue'

//import MonacoEditor from 'vue-monaco'
import x2js from 'x2js' 
const x2jsone=new x2js(); //实例
export default {
    components: {codemirror},
    
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
      if( this.obj[this.prop.val].startsWith("=")){
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
    onCmReady(cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus(cm) {
      console.log('the editor is focused!', cm)
    },
    onCmCodeChange(newCode) {
      console.log('this is new code', newCode)
      this.obj = newCode
    },    
    change_func_xml(prop,data){
      this[prop]=data
    },
    choose_func(name){
      alert(name)
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
        insrt_str=`${prefix}${this.cur_ds._name}.${name}`
      }
      else
        insrt_str=`${prefix}${name}`
      this.$refs.editor.codemirror.replaceSelection(insrt_str)
      
      this.$refs.editor.codemirror.focus();
      let pos1 = this.$refs.editor.codemirror.getCursor();
      let pos2 = {};
      pos2.line = pos1.line;
      pos2.ch = pos1.ch-(insrt_str.length-insrt_str.indexOf("(") - 1);
      this.$refs.editor.codemirror.setCursor(pos2);
      
    },
    choose_field(ds,field){
      this.cur_ds=ds
      this.cur_field=field      
    },
    insert_field(ds,field){
      this.cur_ds=ds
      this.cur_field=field
      if(this.$refs.editor.value && this.$refs.editor.value.trim()!="")
        this.$refs.editor.codemirror.replaceSelection(ds._name+"."+field)
      else
        this.$refs.editor.codemirror.replaceSelection("="+ds._name+"."+field)
      this.$refs.editor.codemirror.focus();
    },
    editor_ready(){
      this.$refs.editor.codemirror.setSize('auto','150px')
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
</style>