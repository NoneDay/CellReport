<template>
  <div class="widget-form-item" style="height: 100%;display: flex;flex-direction: column;"  :depth="depth+1"
      :prop="self.prop" :id="'cr_id_'+self.gridName"
      v-bind="Object.assign({style:Object.assign({},self.style,{height:'100%'} )}, self.params)"
      :class="{active: selectWidget.prop == self.prop, 'required': self.required }"
      @click.stop="handleSelectWidget(index)"> 

    <span v-if="context.mode=='design' && (selectWidget == self || self.type=='luckySheetProxy')"  
    class="mover cr_item_title">
     <span> {{self.label}}</span>
    <el-button title="克隆" style="margin-left: 0px;padding:0px;"
                @click.stop="handleWidgetClone(index)"
                v-if="context.canDraggable " 
                circle
                plain
                size="mini"
                type="danger">
      <i class="el-icon-copy-document"></i>
    </el-button>
    <el-button title="删除" style="margin-left: 0px;padding:0px;"
                @click.stop="handleWidgetDelete(index)"
                v-if="context.canDraggable " 
                circle
                plain
                size="mini"
                type="danger">
      <i class="el-icon-delete"></i>
    </el-button>
    </span>
    <div v-if="(self.show_title && self.label)"  class="cr_run_title">
      <img :src="self.icon" style="width: 20px;height: 20px;vertical-align:middle;">
      <span>  {{self.label}}</span>
    </div>
    <div :style="{width:'100%','flex-grow':1,height:`20px`}">
    <component draggable=".item" v-if="context.mode=='design'"
               :is="getComponent(self.type, self.component)"
               :self="self" :parent="parent" 
               :select.sync="selectWidget"  :depth="depth+1"
               v-bind="Object.assign(this.deepClone(self), self.params, {content:undefined,___depth:depth,depth:depth+1, size:self.size || 'mini' })"
               
               @change="$emit('change')">

      <span v-if="params.html"
            v-html="params.html"></span>
    </component>
    <component  v-else
               :is="getComponent(self.type, self.component)"
               :self="self" :parent="parent" 
               :select.sync="selectWidget"  :depth="depth+1"
               v-bind="Object.assign(this.deepClone(self), self.params, {content:undefined,___depth:depth,depth:depth+1, size:self.size || 'mini' })"
               
               @change="$emit('change')">

      <span v-if="params.html"
            v-html="params.html"></span>
    </component>

    </div>
  </div>
</template>
<script>
import mixins from "./mixins"
export default {
  mixins:[mixins],

  mounted(){
    if(this.context.report_result.name_lable_map==undefined)
      this.context.report_result.name_lable_map={}
    this.context.report_result.name_lable_map[this.self.gridName]=this.self
    if(this.self.icon==undefined)
      this.$set(this.self,'icon',"img/m_pm.png")
  },
  name: 'widget-form-item',
  data () {
    return {
        form: {}
    }
  },
  methods: {
    getComponent (type, component) {
      let KEY_COMPONENT_NAME = 'avue-';
      let result = 'input';
      if (component) return component
      else if (['array', 'img', 'url'].includes(type)) result = 'array';
      else if (type === 'select') result = 'select';
      else if (type === 'radio') result = 'radio';
      else if (type === 'checkbox') result = 'checkbox';
      else if (['time', 'timerange'].includes(type)) result = 'time';
      else if (['dates', 'date', 'datetime', 'datetimerange', 'daterange', 'week', 'month', 'year'].includes(type))
        result = 'date';
      else if (type === 'cascader') result = 'cascader';
      else if (type === 'number') result = 'input-number';
      else if (type === 'password') result = 'input';
      else if (type === 'switch') result = 'switch';
      else if (type === 'rate') result = 'rate';
      else if (type === 'upload') result = 'upload';
      else if (type === 'slider') result = 'slider';
      else if (type === 'dynamic') result = 'dynamic';
      else if (type === 'icon') result = 'input-icon';
      else if (type === 'color') result = 'input-color';
      else if (type === 'map') result = 'input-map';
      return KEY_COMPONENT_NAME + result;
    },
    getPlaceholder (item) {
      const label = item.label;
      if (['select', 'checkbox', 'radio', 'tree', 'color', 'dates', 'date', 'datetime', 'datetimerange', 'daterange', 'week', 'month', 'year', 'map', 'icon'].includes(item.type))
        return `请选择 ${label}`;
      else return `请输入 ${label}`;
    },
    handleSelectWidget (index) {
        this.selectWidget = this.self
    },
    handleWidgetDelete (index) {
      let _this=this
      this.$confirm('此操作将永久删除该组件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

        _this.self.isDelete=true
        let children=_this.parent.children?.column??_this.parent
          _this.$nextTick(() => {
            children.splice(index, 1)
            if(_this.parent.children.column.length==1){
              _this.parent.type="layout_div"
            }
            else{
              _this.parent.type="layout_row_col"
            }
            _this.selectWidget = {prop:'--'}
            _this.$emit("change")
          })
        })
      
    },
    handleWidgetClone (index) {
      this.selectWidget = this.self
      console.table(this.self)
      let cloneData = this.deepClone(this.parent.children.column[index])
      cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      if(cloneData.hasOwnProperty("gridName")){
        cloneData.gridName=cloneData.type.replace(/-/,"_") + Date.now() + '_' + Math.ceil(Math.random() * 99999)
        this.context?.allElementSet?.add(cloneData.gridName)
      }
      this.parent.children.column.splice(index, 0, cloneData)
      if(this.parent.children.column.length==1){
        this.parent.type="layout_div"
      }
      else{
        this.parent.type="layout_row_col"
      }
      this.$nextTick(() => {
        this.handleSelectWidget(index + 1)
        this.$emit("change")
      })
    },
  },
  computed:{
    title(){
      if(this.parent.component=='widget-form-tabs')
        return ""
      if(this.parent.component=='widget-form-group' && this.parent.children.column.length==1 && this.self.component=="luckySheetProxy")
        return ""
      if(this.self.label && this.self.gridName)
        return this.self.label

      return ""
    }
  }
}
</script>

<style scoped>

</style>