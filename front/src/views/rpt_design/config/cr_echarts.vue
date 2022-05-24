<template>
  <div>
    <el-dialog
      v-draggable
      style="text-align: left"
      :inline="true"
      :visible.sync="dialogVisible"
      :title="'编辑内容'"
      :close-on-click-modal="false"
      :modal="false"
      direction="btt"
      append-to-body
    >
      <div>
        <codemirror
          v-model="data.content"
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
      <span slot="footer"
          class="dialog-footer">
          <el-button size="small"
                    @click="json_dialogVisible=false">取 消</el-button>
          <el-button type="primary"
                    @click="json_submit"
                    size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-form-item label="模板">
        <el-button @click="dialogVisible = true" type="primary">编辑模板</el-button>
      </el-form-item>

    
      <el-form-item label="数据类型">
        <avue-radio v-model="data.dataType"
                    :dic="dicOption.dataType"></avue-radio>
      </el-form-item>

    <el-form-item label='数据集' v-if="data.dataType==1">
        <el-select
          v-model="data.datasource"
          placeholder="请选择" clearable
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
    </el-form-item>   
    <el-form-item v-if="data.dataType==0" label="静态数据">
        <el-button @click="json_dialogVisible = true" type="primary">编辑</el-button>
      </el-form-item>
    <div style="height: 200px; overflow: auto" v-if="data.dataType==1">
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
        >
          <i
            class="drag-item el-icon-s-operation"
            style="font-size: 16px; margin: 0 5px; cursor: move"
          ></i>
          <el-checkbox
            style="margin-right: 5px"
            size="mini"
            v-model="item.selected"
            placeholder="label"
          ></el-checkbox>
          {{ item.key }}
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
import { dicOption} from './config'
export default {
  name: "config-echart",
  components: { codemirror, crSetFresh ,echartMain},
  inject: ["context"],
  props: ["data"],
  mounted() {},
  data() {
    return {
      dicOption:dicOption,
      dialogVisible: false,
      json_dialogVisible: false,
      optionData:JSON.stringify(this.data.optionData),
      default_type: "bar",
    };
  },
  computed: {
    all_datasource() {
      let ret = ["示例"];
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
  
  watch:{
    "data.dataType"(val){
      if(val==0){

      }
    },
    "data"(val){
      if(this.data.optionData)
        this.optionData=JSON.stringify(this.data.optionData).replaceAll("],[","],\n[")
    }
  },
  methods: {
    json_submit(){
      this.data.optionData=JSON.parse(this.optionData)
      this.json_dialogVisible=false
    },
    paramDialog_open(row) {
      this.url_param = row;
      this.ExprEditorDialog_visible = true;
    },
    change_ds(ds) {
      let conf = this.data;
      if(ds==""){
        conf.fields=[]
        return
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