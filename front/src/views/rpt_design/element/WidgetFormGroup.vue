<template>
  <div :style="{height: self.type!='el-row'?'calc(100% - '+border_size+'px)':'','width':'calc(100% - '+border_size+'px)'}"> 
    <template  v-if="context.canDraggable">
    <!--<h1 class="widget-form-group__head"
        v-show="self.label"><i :class="self.icon"
         v-show="self.icon"
         style="margin-right: 10px;"></i>{{self.label}}</h1>
         -->
      <el-row :is="MainComponent" v-if="MainComponent=='el-row'" :gutter="gutter" :style="MainComponent=='el-row'?'margin-bottom: 0px;height: 100%;position: relative;overflow: auto;':''">
        <draggable class="widget-form-group__body" style="overflow:auto"
                  :list="self.children.column"
                  :group="{ name: 'form' }"
                  ghost-class="ghost" handle=".mover"
                  
                  @add="handleWidgetGroupAdd($event, self)"
                  @end="$emit('change')">
            <el-col :is="SubComponent" :key="groupIndex"  v-for="(item, groupIndex) in self.children.column"
                    :md="item.span || 12" :xs="24" :offset="item.offset || 0" :style="{height:(item.height)?item.height:item.style.height}"
                    > 
                <widget-form-item :self="item" :parent="self"  :index="groupIndex"
                      :select.sync="selectWidget"  :depth="0"
                      :params="self.params"></widget-form-item>     
            </el-col>
        </draggable>
      </el-row>
      <component :is="MainComponent" v-else style="height:100%">  
        <draggable class="widget-form-group__body"
                  :list="self.children.column"
                  :group="{ name: 'form' }"
                  ghost-class="ghost" handle=".mover"
                  :animation="200" style="height:100%"
                  @add="handleWidgetGroupAdd($event, self)"
                  @end="$emit('change')">
                <widget-form-item 
                      :key="groupIndex"  v-for="(item, groupIndex) in self.children.column"
                      :self="item" :parent="self"  :index="groupIndex"
                      :select.sync="selectWidget" :depth="0"
                      :params="self.params"></widget-form-item>     
        </draggable>
      </component>
      
    </template>
    <template v-else>   
      
       <component :is="MainComponent" v-if="MainComponent=='el-row'" :gutter="gutter" :style="MainComponent=='el-row'?'margin-bottom: 0px;height: 100%;position: relative;overflow: auto;':''"
       >
            <component :is="SubComponent" :key="groupIndex"  v-for="(item, groupIndex) in self.children.column"
                    :md="item.span || 12" :xs="24" :offset="item.offset || 0"  :style="{height:(item.height)?item.height:item.style.height}"
                    > 
                <widget-form-item :self="item" :parent="self" 
                       :index="groupIndex" :depth="0"
                      :select.sync="selectWidget"
                      :params="self.params"></widget-form-item>     
            </component>
      </component>
      <component :is="MainComponent" v-else style="height:100%">  
          <widget-form-item :key="groupIndex"  v-for="(item, groupIndex) in self.children.column"
              :self="item" :parent="self"  :index="groupIndex"
                :select.sync="selectWidget" :depth="0"
                :params="self.params"></widget-form-item>     
      </component>
    </template>
  
  </div>
</template>
<script>
import mixins from "./mixins"
export default {
  name: 'widget-form-group',
  mixins:[mixins],
  components: {  },
  props:["border_size"],
  updated(){
    let _this=this 
    this.self.children.column.forEach(element => {
      if(element.gridName && element.gridName!="_random_")
        _this.context?.allElementSet?.add(element.gridName)  
    });
    
  },
  data () {
    return {
      my_map:{
        "layout_row_col":{main:"el-row",sub:"el-col"},
        "layout_div":{main:"div",sub:"div"},
      }
    }
  },
  computed:{
    MainComponent(){
      return this.my_map[this.self.type].main
    },
    SubComponent(){
      return this.my_map[this.self.type].sub
    },
    gutter(){
      return 0
      if(this.self.gutter)
        return this.self.gutter
      else
        if(this.context.mode=='design')
                return this.context.report.defaultsetting['gutter']??10
            else
                return this.context.report_result.defaultsetting['gutter']??10
    }
  },
  methods: {
    
    
    handleWidgetGroupAdd (evt) {
      let newIndex = evt.newIndex;
      const item = evt.item;

      if (newIndex == 1 && newIndex > this.self.children.column.length - 1) newIndex = 0
      if (['分组'].includes(item.textContent)) {
        this.self.children.column.splice(newIndex, 1)
        return
      }

      const data = this.deepClone(this.self.children.column[newIndex]);
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      if(data.hasOwnProperty("gridName") && data.gridName=="_random_"){
        data.gridName=data.type.replace(/-/,"_") + Date.now() + '_' + Math.ceil(Math.random() * 99999)
        this.context?.allElementSet?.add(data.gridName)
      }
      
      if (data.span == undefined) data.span = 12
      if (data.height == undefined) data.height = '100%'
      
      this.$set(this.self.children.column, newIndex, { ...data })
      this.selectWidget = this.self.children.column[newIndex]
      if(this.self.children.column.length==1){
        this.self.type="layout_div"
      }
      else{
        this.self.type="layout_row_col"
      }
      //this.$emit("change")
    }
  },
}
</script>