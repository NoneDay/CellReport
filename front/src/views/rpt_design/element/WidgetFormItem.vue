<template>
  <div class="widget-form-item"   :depth="depth+1"
      :prop="self.prop"
      v-bind="Object.assign({style:Object.assign({},self.style,self.height?{height:self.height}:{})}, self.params)"
      :class="{active: selectWidget.prop == self.prop, 'required': self.required }"
      @click.stop="handleSelectWidget(index)"> 

    <div v-if="context.mode=='design' ||( self.show_title && self.label)"  class="cr_item_title">
     <span> {{self.label}}</span>
    <el-button title="删除" style="    margin-left: 10px;"
                @click.stop="handleWidgetDelete(index)"
                v-if="context.canDraggable " 
                circle
                plain
                size="small"
                type="danger">
      <i class="el-icon-delete"></i>
    </el-button>

    </div>
    <div :style="{width:'100%',height:`calc(100% - ${context.mode=='design' ||( self.show_title && self.label)?25:0}px`}">
    <component draggable=".item" 
               :is="getComponent(self.type, self.component)"
               :self="self" :parent="parent" 
               :select.sync="selectWidget"  :depth="depth+1"
               v-bind="Object.assign(this.deepClone(self), self.params, {content:undefined,___depth:depth,depth:depth+1, size:self.size || 'small' })"
               
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
      this.self.isDelete=true
      let children=this.parent.children?.column??this.parent
      
        //if (children.length - 1 === index) {
        //  if (index === 0) this.selectWidget = {}
        //  else this.handleSelectWidget(index - 1)
        //} else this.handleSelectWidget(index + 1)
        
        //this.parent.children.column[index]
        this.$nextTick(() => {
          children.splice(index, 1)
          if(children!=this.parent){
            children.forEach(x=>{
              x.height=100/children.length +"%"
            })
          }
          this.selectWidget = {prop:'--'}
          this.$emit("change")
        })
      
    },
    handleWidgetClone (index) {
      this.selectWidget = this.self
      console.table(this.self)
      //let cloneData = this.deepClone(this.parent.children.column[index])
      //cloneData.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      //this.parent.children.column.splice(index, 0, cloneData)
      //this.$nextTick(() => {
      //  this.handleSelectWidget(index + 1)
      //  this.$emit("change")
      //})
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
.cr_item_title{
    width: 100%;
    height: 25px;
    border: 1px solid;
    background: bisque;}
</style>