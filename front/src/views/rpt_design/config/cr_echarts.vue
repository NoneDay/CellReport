<template>
  <div>
    <el-dialog
      v-draggable
      style="text-align: left"
      :inline="true"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :title="'编辑内容'"
      :close-on-click-modal="false"
      :modal="false"
      direction="btt"
      :fullscreen="true"
      append-to-body
    >
    <el-row style="height: 100%"><el-col span="12"  style="height: 100%; border: 1px solid gray">
      
        <codemirror
          v-model="test_content"
          @ready="editor_ready()"
          ref="editor"
          style="height: 100%"
          :options="{
            tabSize: 4,
            mode: 'text/javascript',
            styleActiveLine: true,
            lineWrapping: true,
            theme: 'cobalt',lineNumbers: true,line: true,
            showCursorWhenSelecting: true,
            cursorBlinkRate: 0,
          }"
        />
      
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
    <el-dialog
      v-draggable
      style="text-align: left"
      :inline="true"
      :visible.sync="json_dialogVisible"
      :title="'编辑内容'"
      :close-on-click-modal="false"
      :modal="false"
      direction="btt"
      append-to-body
    >
      <div>
        <codemirror
          v-model="optionData"
          style="height: 100%"
          :options="{
            tabSize: 4,
            mode: 'text/javascript',
            styleActiveLine: true,
            lineWrapping: true,
            theme: 'cobalt',
            showCursorWhenSelecting: true,
            cursorBlinkRate: 0,
          }"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="json_dialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="json_submit" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      v-draggable
      style="text-align: left"
      :inline="true"
      v-if="fieldsetting_dialogVisible"
      :visible.sync="fieldsetting_dialogVisible"
      :title="'编辑字段属性'"
      :close-on-click-modal="false"
      :modal="false"
      direction="btt"
      append-to-body
    >
      <avue-form :option="param_setting_option" v-model="act_item"   @submit="fieldsetting_submit"> </avue-form>      

    </el-dialog>    
    <el-form-item label="模板">
      <el-button @click="reset_contnet();dialogVisible = true" type="primary"
        >编辑模板</el-button
      >
    </el-form-item>

    <el-form-item label="数据来源">
      <div style="display: flex; width: 180px">
        <el-select
          v-model="data.datasource"
          placeholder="请选择"
          clearable size="mini"
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
              <el-button
          v-if="data.datasource == '静态数据'"
          @click="reset_contnet();json_dialogVisible = true"
          type="primary"
          >编辑</el-button>
    </el-form-item>
字段设置：
    <div style="max-height: 200px; overflow: auto;border: 1px solid gray;">
      
      <draggable
        tag="ul"
        :list="data.fields"
        :group="{ name: 'dic' }"
        ghost-class="ghost"
        handle=".drag-item"
      >
        <li
          v-for="(item, index) in data.fields"
          :key="index"
          style="display: flex"
          :style="{
            'background-color': select_action_target == item ? '#c5f3e0' : '',
            cursor: 'pointer',
          }"
        >
          <i
            class="drag-item el-icon-s-operation"
            style="font-size: 16px; margin: 0 5px; cursor: move"
          ></i>

          <div
            @click="select_action_target = item"
            style="display: inline-block; width: calc(100% - 80px)"
          >
            <el-checkbox
              style="margin-right: 5px"
              size="mini"
              v-model="item.selected"
              placeholder="label"
            ></el-checkbox>
            {{ item.key }}
          </div>
          <el-button
            @click="param_setting(item, idx)"
            circle
            plain
            type="danger"
            size="mini"
            icon="el-icon-setting"
            style="padding: 4px; float: right"
          ></el-button>
        </li>
      </draggable>
    </div>
  </div>
</template>
<script>
import codemirror from "../element/vue-codemirror.vue";
import { test_data } from "../utils/util";
import crSetFresh from "./cr_set_fresh.vue";
import echartMain from "./echarts/main.vue";
import { dicOption } from "./config";
export default {
  name: "config-echart",
  components: { codemirror, crSetFresh, echartMain },
  inject: ["context"],
  props: ["data"],
  mounted() {
    
  },
  data() {
    return {
      test_content:"",
      test_cr_data:{},
      select_action_target: null,
      dicOption: dicOption,
      dialogVisible: false,
      json_dialogVisible: false,
      fieldsetting_dialogVisible:false,
      optionData: JSON.stringify(this.data.optionData),
      default_type: "bar",
      act_item:{},
      param_setting_option:{
        emptyBtn:false,
          column: [
            {
              label:'标签',prop:'label',type:'input',dataType:'text',
            },
            {
              label:'宽度',prop:'width',type:'input',dataType:'text',
            },{
              label:'对齐',prop:'align',type:'input',dataType:'text',
              dicData:[{label:'选项1',value:1},]
            },{
              label:'颜色',prop:'color',type:'color',dataType:'color'
            },
          ]
      },
      current_item:null,
    };
  },
  computed: {
    all_datasource() {
      let ret = ["静态数据"];
      this.context.report.dataSets.dataSet.forEach((element) => {
        ret.push(`数据集:${element._name}`);
      });
      this.context.report.AllGrids.grid.forEach((element) => {
        if (element._is_large == "0") {
          ret.push(`表格明细数据:${element._name}`);
          ret.push(`表格汇总数据:${element._name}`);
        }
      });
      Object.keys(this.context.clickedEle)
        .filter((x) => x != this.data.gridName)
        .forEach((element) => {
          ret.push(`元素选中行:${element}`);
        });
      return ret;
    },
  },

  watch: {
    "data.dataType"(val) {
      if (val == 0) {
      }
    },
    data(val) {
      if (this.data.optionData)
        this.optionData = JSON.stringify(this.data.optionData).replaceAll(
          "],[",
          "],\n["
        );
    },
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
    editor_ready() {
      let _this = this;
      setTimeout(() => {
        _this.$refs["editor"].codemirror.setSize("100%", "100%");
      });
    },
    
    param_setting(item) {
      this.current_item=item
      this.act_item=JSON.parse(JSON.stringify(item))
      this.fieldsetting_dialogVisible=true;
    },
    fieldsetting_submit(form,done,loading){
      Object.keys(this.act_item).forEach(x=>
      {
        this.$set(this.current_item,x,this.act_item[x])
      }
      )
      if(done)
            done();
       this.fieldsetting_dialogVisible=false;
    },
    json_submit() {
      try {
        
        this.data.optionData = JSON.parse(this.optionData);
      } catch (ex) {
        this.$alert("JSON不合法");
        return;
      }
      this.json_dialogVisible = false;
    },
    paramDialog_open(row) {
      this.url_param = row;
      this.ExprEditorDialog_visible = true;
    },
    change_ds(ds) {
      let conf = this.data;
      if (conf.fields == undefined) this.$set(conf, "fields", []);
      if (conf.fresh_ds == undefined) this.$set(conf, "fresh_ds", []);
      if (conf.fresh_params == undefined) this.$set(conf, "fresh_params", []);
      if (ds == "") {
        conf.fields = [];
        return;
      }
      if (ds != "静态数据") {
        delete conf.optionData;
      }
      conf.fields.splice(0);
      conf.fresh_params.splice(0);
      this.context.report.params.param
        ?.filter((x) => x._inner == "False")
        .forEach((x) => {
          conf.fresh_params.push({
            name: x._name,
            value: "原始参数:" + x._name,
          });
        });
      let ds_name = ds.split(":");
      ds_name = ds_name.length > 1 ? ds_name[1] : ds_name[0];
      if (ds.startsWith("数据集")) {
        let _fields = this.context.report.dataSets.dataSet.find(
          (x) => x._name == ds_name
        )._fields;
        if (_fields) {
          JSON.parse(_fields).forEach((ele) => {
            conf.fields.push({
              key: ele,
              label: ele,
              selected: true,
              type: this.default_type,
            });
          });
        }
      } else if (ds.startsWith("表格")) {
        JSON.parse(
          this.context.report.AllGrids.grid.filter((x) => x._name == ds_name)[0]
            ._fields
        ).forEach((element) => {
          conf.fields.push({
            key: element,
            label: element,
            selected: true,
            type: this.default_type,
          });
        });
      } else if (ds.startsWith("元素")) {
        let find_grids = this.context.report.AllGrids.grid.filter(
          (x) => x._name == ds_name
        );
        if (find_grids.length > 0) {
          JSON.parse(find_grids[0]._fields).forEach((element) => {
            conf.fields.push({
              key: element,
              label: element,
              selected: true,
              type: this.default_type,
            });
          });
        } else if (this.context.clickedEle) {
          let keys = Object.keys(
            this.context.clickedEle[ds.split(":")[1]].data
          );
          keys.forEach((element) => {
            conf.fields.push({
              key: element,
              label: element,
              selected: true,
              type: this.default_type,
            });
          });
        }
      } else if (ds == "静态数据") {
        if (conf.optionData == undefined)
          conf.optionData = JSON.parse(JSON.stringify(test_data));
        let _fields = conf.optionData[0];
        if (_fields) {
          _fields.forEach((ele) => {
            conf.fields.push({
              key: ele,
              label: ele,
              selected: true,
              type: this.default_type,
            });
          });
        }
      } else {
        if (conf.fields.length > 0) {
          conf.data[0].forEach((element) => {
            conf.fields.push({
              key: element,
              label: element,
              selected: true,
              type: this.default_type,
            });
          });
        } else {
          test_data[0].forEach((element) => {
            conf.fields.push({
              key: element,
              label: element,
              selected: true,
              type: this.default_type,
            });
          });
        }
      }
    },
  },
};
</script>