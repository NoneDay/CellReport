<template>
  <el-tabs @tab-click="add_catlog"
    v-model="tab_value"
    style="overflow: hidden; height: 100%; width: 100%;margin:3px 3px 0px 3px;"
  >
    <el-tab-pane
      v-for="(field, index) in t_fields"
      :key="index"
      :label="field.title"
      style="overflow: auto; height: 100%; width: 100%"
      :name="field.title"
    >
    <span slot="label">{{field.title}} <i class="el-icon-edit" @click.prevent="tab_edit(field)"></i> </span>
      <el-row :gutter="12" >
        <el-col
          :span="7"
          style="height: 140px; border: 1px solid; margin: 10px"
        >
          <div class="cr_run_title">
            <span> 创建新组件</span>
          </div>
          <div style="display: flex;flex-grow: 1;    height: 90px;
            align-items: center;
            justify-content: center;" @click="click_add(field)">
            <span> 添加 </span>
          </div>
        </el-col>
        <el-col
          :span="7"
          v-for="(item, index) in field.list"
          :key="index"
          style="height: 140px; border: 1px solid; margin: 10px"
        >
          <div class="cr_run_title">
            <span> {{ item.label }}</span>
            <div style="float: right; padding: 3px 0">
              <el-button
                type="text"
                @click="click_edit(item)"
                v-if="field.title != '核心元素'"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="click_delete(field, item, index)"
                v-if="field.title != '核心元素'"
                >删除</el-button
              >
              <el-button
                type="text"
                @click="click_clone(field, item, index)"
                v-if="field.title != '核心元素'"
                >克隆</el-button
              >
            </div>
          </div>
          <div style="padding: 4px; height: 100px; width: 100%; overflow: auto">
            <widget-form-item
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
    </el-tab-pane>
    <el-tab-pane label="新增分类"  name="新增分类">
        <span slot="label"> 新增分类 <i class="el-icon-folder-add"></i> </span>
    </el-tab-pane>
    <el-dialog
      v-draggable
      v-if="dialogVisible"
      style="text-align: left"
      class=""
      :visible.sync="dialogVisible"
      title="组件模板编辑"
      :close-on-click-modal="false"
      :fullscreen="true"
      direction="btt"
      append-to-body
    >
      <el-row style="height: 100%">
        <el-col span="12" style="height: 100%">
          <el-row style="height: 50%">
            <el-col span="24">
            <avue-form ref="form" v-model="edit_item" :option="form_option" >
                <template  slot="component">
                    <el-select v-model="edit_item.component" placeholder="这里是自定的表单">
                        <el-option label='使用类vue模式开发模板' value='dync-template'/>
                        <el-option label='echarts图表' value='echarts'/>
                    </el-select>
                </template>
            </avue-form>
            </el-col>
          </el-row>
          <el-row style="height: 50%">
            <el-col span="24" style="height: 100%;border:1px solid gray">
              <widget-form-item
                class="widget-form-list"
                :self="edit_item"
                :index="0"
                :depth="1"
              >
              </widget-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col span="12" style="height: 100%">
          <codemirror
            ref="editor"
            style="height: 100%"
            v-model="edit_item.content"
            :options="{
              tabSize: 4,
              mode: 'javascript',
              styleActiveLine: true,
              lineWrapping: true,
              theme: 'cobalt',
              showCursorWhenSelecting: true,
              cursorBlinkRate: 0,
            }"
            @ready="editor_ready()"
          />
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
import fields from "./fieldsConfig";
import codemirror from "./element/vue-codemirror.vue";
import { getAllWidget, saveWidget } from "./api/report_api";

export default {
  name: "widgetManager",
  components: { codemirror },
  async mounted() {
    let t_fields = await getAllWidget();
    this.t_fields = eval("(function(){\nreturn " + t_fields.txt + "\n})()");
    if (this.t_fields.length > 0) this.tab_value = this.t_fields[0].title;
  },
  provide() {
    return {
      context: {
        all_sheet_windows: [],
        canDraggable: false,
        crisMobile: false,
        report: {},
        report_result: {},
        mode: "preview",

        clickedEle: {},
        allElementSet: {},
        //不放到这里，会导致动态runtime-template重算，如果是有滚动行的，会每次都重新跑到顶部
        in_exec_url: false,
        defaultsetting: {},
      },
      fresh_ele: [],
    };
  },
  data() {
    return {
      tab_value: "核心元素",
      dialogVisible: false,
      t_fields: [],
      edit_item: {},
      cur_item: {},
      cur_field:[],      
    };
  },
  computed:{      
    form_option(){
        return {
            column: [
                {
                type: 'input',label: '名称',span: 12,display: true,prop: 'type',required: true,
                rules: [{required: true,message: '名称必须填写'}]
                },
                {
                type: 'input',label: '标题',span: 12,display: true,prop: 'label',
                rules: [{required: true,message: '标题必须填写'}],required: true
                },
                {
                type: 'number',label: '高度',controls: false,span: 12,display: true,prop: 'h',detail: false,
                value: '5',minRows: 1,maxRows: 100,step: 1,tip: '（1个高度缺省是20px）',labelTip: '（1个高度缺省是20px）',
                required: true,rules: [{required: true,message: '高度必须填写'}]
                },
                {
                type: 'number',label: '宽度',controls: true,span: 12,display: true,prop: 'span',
                value: '12',tip: '缺省总宽度是24',labelTip: '缺省总宽度是24',
                rules: [{required: true,message: '宽度必须填写'}],
                required: true
                },
                {label: '类型',span: 12,display: true,prop: 'component',formslot:true,},
                {label: 'gridName',span: 12,display: false,prop: 'gridName',value:'_random_'},
                {label: 'icon',span: 12,display: false,prop: 'icon',value: 'icon-table'},
                {
                type: 'textarea',label: 'style',span: 24,display: true,prop: 'style',value: '{height:100%;}',required: true,
                rules: [{required: true,message: 'style必须填写'}]
                }
            ],
            labelPosition: 'left',labelSuffix: '：',labelWidth: 80,gutter: 10,menuBtn: false
        }
    },
  },
  methods: {
    tab_edit(field){
        this.$prompt(`请输入新的名称`, '名称', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue:field.title
            })
            .then(async ({ value }) => { 
                if(this.t_fields.filter(x=>x.title==value && x!=field).length>0){
                     this.$message.error(`已经存在这个名称[${value}]`);
                        return
                }
                field.title=value
                this.tab_value=value
                let resp = await saveWidget(JSON.stringify(this.t_fields, null, 4));
            }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    add_catlog(tab, event){
        if(this.tab_value!='新增分类')
            return
        this.$prompt(`请输入新分类的名称`, '名称', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue:"新分类"
            })
            .then(async ({ value }) => { 
                if(this.t_fields.filter(x=>x.title==value).length>0){
                     this.$message.error(`已经存在这个名称[${value}]`);
                        return
                }
                this.cur_field=[]
                this.tab_value = value
                this.t_fields.push({title:value,list:this.cur_field})
                let resp = await saveWidget(JSON.stringify(this.t_fields, null, 4));
            }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    async editSubmit() {
        let is_new=false
        if(this.cur_item==undefined){
            is_new=true
            this.cur_item={}
        }
        Object.assign(this.cur_item, this.edit_item);
        this.cur_item.style = JSON.parse(this.edit_item.style);
        if(is_new)
            this.cur_field.list.push(this.cur_item)
        let resp = await saveWidget(JSON.stringify(this.t_fields, null, 4));
        console.info(resp);
        this.dialogVisible = false;
    },
    click_add(field){
        this.cur_field=field
        this.cur_item=undefined
        this.edit_item = {
                "type": "装饰1",
                "label": "装饰1",
                "gridName": "_random_",
                "h": 4,
                "span": 6,
                "icon": "icon-table",
                "color": "#fff",
                "display": true,
                "component": "dync-template",
                "style": {
                    "height": "100%"
                },
                "content": "<div style=\"width:100%;height:100%;\" ></div>"
            };
        this.edit_item.style = JSON.stringify(this.edit_item.style);
        this.dialogVisible = true;
    },
    click_edit(item) {
        this.cur_item = item;
        this.edit_item = JSON.parse(JSON.stringify(item));
        this.edit_item.style = JSON.stringify(item.style);
        this.dialogVisible = true;
    },
    click_delete(field, item, index) {
        let _this = this;
        this.$confirm("此操作将永久删除该组件, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
        .then(async () => {
          field.list.splice(index, 1);
          let resp = await saveWidget(JSON.stringify(this.t_fields, null, 4));
          console.info(resp);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async click_clone(field, item, index) {
      this.cur_item = item;
      field.list.push(JSON.parse(JSON.stringify(item)));
      let resp = await saveWidget(JSON.stringify(this.t_fields, null, 4));
      console.info(resp);
    },
    editor_ready() {
      let _this = this;
      setTimeout(() => {
        _this.$refs["editor"].codemirror.setSize("100%", "100%");
      });
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>