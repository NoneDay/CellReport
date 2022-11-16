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
          <el-row>  <el-col span=6>
            <el-button type='primary' size="mini"  @click="test_cr_data.content=test_content" >运行测试</el-button>
            </el-col>              
            <el-col span=6>
            <el-button type='primary' size="mini"  @click="save_template_content" >保存设置</el-button>
          </el-col>
           <el-col span=6>
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