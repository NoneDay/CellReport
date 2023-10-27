<template>
  <div>
    <el-dialog
      v-draggable
      style="text-align: left"
      :inline="true"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :title="'编辑内容（html）'"
      :close-on-click-modal="false"
      :modal="false"
      direction="btt"
      :fullscreen="true"
      append-to-body
    >
    <el-row style="height: 100%"><el-col span="12"  style="height: 100%; border: 1px solid gray">
      <MonacoEditor  ref="editor"  theme="vs" v-model="test_content"
              language="html"  style="height:100%;border:solid 1px silver;margin-bottom:5px;"
              :options="{}"  >
        </MonacoEditor>
        
      </el-col>
        <el-col span="12" style="height: 100%; border: 1px solid gray; position: relative"
          :style="{'background-color':context.report.defaultsetting['BACKGROUND-COLOR'],
          'color':context.report.defaultsetting['COLOR'],
          'font-family':context.report.defaultsetting['FONT'],
          'font-size':context.report.defaultsetting['FONT-SIZE']
          }">
          <widget-form-item
            class="widget-form-list"
            :self="test_cr_data"
            :index="0"
            :depth="1"
          >
          </widget-form-item>
          </el-col>
          </el-row>
          <div slot="footer">
          <el-row>  
            <el-col span=4>
              <el-button type='primary' size="mini"  @click="verfiy_vue" >补全vue语法</el-button>
            </el-col>
            <el-col span=4>
            <el-button type='primary' size="mini"  @click="test_cr_data.content=test_content" >运行测试</el-button>
            </el-col>              
            <el-col span=4>
            <el-button type='primary' size="mini"  @click="save_template_content" >保存设置</el-button>
          </el-col>
           <el-col span=4>
            <el-button type='primary' size="mini"  @click="dialogVisible=false" >退出</el-button>
          </el-col>
          </el-row>
          </div>
    </el-dialog>
    <el-form-item label="模板">
    <el-button @click="reset_contnet();dialogVisible = true" type="primary">编辑模板</el-button>
  </el-form-item>
    <div>
      <span>依赖数据：</span>
      <el-select
        clearable
        v-model="data.datasource"
        placeholder="请选择"
        @change="change_ds"
      >
        <el-option
          v-for="item in all_datasource"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import MonacoEditor from '../element/MonacoEditor';
import {extract_style_txt,extract_script_txt } from "../utils/util"
export default {
  name: "config-html-text",
  components: { MonacoEditor },
  inject: ["context"],
  provide() {
    let _this=this
    return {
      context: 
        (function(){
          return Object.assign({}, _this.context,{mode:'conf'})
        })()
    }
  },
  props: ["data"],
  mounted() {
    console.info("=");
  },
  data() {
    return {
      test_content:"",
      test_cr_data:{},
      content: this.data.content || "{}",
      dialogVisible: false,
    };
  },
  methods: {
     
    verfiy_vue(){
      
      let _this=this 
      let template_txt=_this.test_content.replaceAll("dync_script>","script>")                
      let script_txt=extract_script_txt(template_txt).trim()
      let style_txt=extract_style_txt(template_txt).trim()
             
      let start_pos=template_txt.indexOf("<template>")
      if(start_pos>=0){
        template_txt=template_txt.substring(
              start_pos+'<template>'.length
              ,template_txt.lastIndexOf("</template>")
          )
      }else{
        template_txt=template_txt.replace(/<script.*?>*?>([\s\S]*?)<\/script>/img,'')
              .replace(/<style.*?>*?>([\s\S]*?)<\/style>/img,'')
      }
      let export_pos=script_txt.search(/export\s+default\s+\{*/img)
      if(export_pos>=0){

        let t_vue_obj=eval("(function(){\n"+script_txt.replace(/export\s+default*/img,'return ')+"\n})()")
        if(!t_vue_obj)
            t_vue_obj={}
        export_pos=script_txt.substring(export_pos).indexOf("{")+1
        
        if(!t_vue_obj.watched){
          script_txt=script_txt.substring(0,export_pos)+"\n    watched:{\n    },\n" +script_txt.substring(export_pos+1)
        }
        if(!t_vue_obj.computed){
          script_txt=script_txt.substring(0,export_pos)+"\n    computed:{\n    },\n" +script_txt.substring(export_pos+1)
        }
        
        if(!t_vue_obj.methods){
          script_txt=script_txt.substring(0,export_pos)+"\n    methods:{\n    },\n" +script_txt.substring(export_pos+1)
        }
        if(!t_vue_obj.data){
          script_txt=script_txt.substring(0,export_pos)+"\n    data(){\n       return {\n       }\n   },\n" +script_txt.substring(export_pos+1)
        }
      }else{
        script_txt=script_txt+`export default{
        mounted(){
        },
        data(){
          return {
            xx:1
          }
        },
        methods:{
        },
        watched:{
        },
        computed:{
        }
      }`;  
      }
      _this.test_content="<template>\n  "+template_txt+"\n<\/template>\n<script>\n  "+script_txt+"\n<\/script>\n<style>\n  "+style_txt+"\n<\/style>"
    },
    reset_contnet(){
      this.test_content=this.data.content;
      this.test_cr_data=JSON.parse( JSON.stringify(this.data));
      if (this.data.optionData)
          this.optionData = JSON.stringify(this.data.optionData).replaceAll(
            "],[",
            "],\n["
          );
    },
    save_template_content(){
      this.data.content=this.test_content
    },
  },
  computed: {
    all_datasource() {
      let ret = ["数据集:示例"];
      this.context.report.dataSets.dataSet.forEach((element) => {
        ret.push(`数据集:${element._name}`);
      });
      this.context.report.AllGrids.grid.forEach((element) => {
        if (element._is_large == "0") {
          ret.push(`表格明细数据:${element._name}`);
          ret.push(`表格汇总数据:${element._name}`);
          ret.push(`表格明细及汇总数据:${element._name}`);
        }
      });
      //this.context.report.AllGrids.grid.forEach(element=>{
      //    if(element._is_large=="0"){
      //      ret.push(`表格:${element._name}`)
      //    }
      //  });
      return ret;
    },
  },
  watch: {
    "data.content"(val) {
      this.content = this.data.content || "{}";
    },
    content: function (val) {
      this.$set(this.data, "content", val);
    },
  },
};
</script>