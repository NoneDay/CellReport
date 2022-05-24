<template>
  <el-dialog
    v-draggable
    v-if="dialogVisible"
    :visible.sync="dialogVisible"
    title="添加组件"
    :close-on-click-modal="false"
    direction="btt"
    append-to-body 
  >
    <el-tabs
      v-model="tab_value" 
    >
      <el-tab-pane
        v-for="(field, index) in context.fields.concat(t_fields)"
        :key="index"
        :label="field.title"
        :name="field.title"
      >
      <div  style="overflow: auto; max-height: 400px; width: 100%">
        <el-row :gutter="12">
          <el-col
            :span="7"
            v-for="(item, index) in field.list"
            :key="index"
            style="height: 140px; border: 1px solid; margin: 10px;display: flex; flex-direction: column;"
          >
            <div class="cr_run_title">
              <span> {{ item.label }}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="add(item)"
              >添加</el-button>
            </div>
            <div
              style="padding: 4px; flex:1; width: 100%; overflow: hidden"
          :style="{'background-color':context.report.defaultsetting['BACKGROUND-COLOR'],
          'color':context.report.defaultsetting['COLOR'],
          'font-family':context.report.defaultsetting['FONT'],
          'font-size':context.report.defaultsetting['FONT-SIZE']
          }"
            >
              <widget-form-item  style="height: 400px; width: 400px; transform-origin:0 0;transform:scale(0.4, 0.25)"
                v-if="
                  tab_value == field.title &&
                  field.title != '核心元素' &&
                  item.label != '飞线图' &&
                  item.label != '飞线图增强版'
                "
                class="widget-form-list"
                :self="item"
                :index="0"
                :depth="1"
              >
              </widget-form-item>
              <span v-else>{{ item.label }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import codemirror from "./element/vue-codemirror.vue";
import {getAllWidget} from "./api/report_api"
export default {
  name: "widgetDialog",
  components: { codemirror },
  props: ["visible", "action_target"],
  inject: ["context","has_name"],
  async mounted() {
     if(window.cr_allWidget==undefined)
      window.cr_allWidget=await getAllWidget('design_rpt');
    
    this.t_fields=[].concat(window.cr_allWidget.admin_json.fields||[]).concat(window.cr_allWidget.self_json.fields||[])

    this.dialogVisible = true;
  },
  data() {
    return {
      tab_value: "核心元素",
      dialogVisible: false,
      t_fields:[]
    };
  },
  methods: {
    add(item) {
      let data = this.deepClone(item);
      if (!data.prop)
        data.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
      let name_prefix=data.type
      if(name_prefix=="luckySheetProxy")
          name_prefix="report"
      if (data.hasOwnProperty("gridName") && data.gridName == "_random_") {
          do{
            data.gridName =name_prefix.replace(/-/, "_") +"_" + Math.ceil(Math.random() * 999);
          }while(this.has_name(data.gridName));
        this.context?.allElementSet?.add(data.gridName);
      }
      if (data.span == undefined) data.span = 12;
      if (data.h == undefined) data.h = 5;
      if (data.height == undefined) data.height = "100%";
      let cur = this.action_target;
      if (cur == undefined) cur = this.$parent;
      if (cur.self?.children) {
        cur.self.children.column.push(data);
        cur.handleWidgetGroupAdd({
          newIndex: cur.self.children.column.length - 1,
          item: data,
        });
      } else {
        this.action_target.addItem(data);
      }
      this.$emit("submit");
    },
    handleSubmit() {
      //this.$emit("submit");
      this.dialogVisible = false;
    },
  },
  watch: {
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    visible(val) {
      this.dialogVisible = val;
      this.$emit("update:visible", val);
    },
  },
};
</script>

<style>
</style>