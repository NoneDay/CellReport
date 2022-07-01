<template>
        <draggable class="widget-form-group__body" style="overflow:auto;display:flex; margin-bottom: 0px;height: 100%;width: 100%;"
                  :list="self.children.column"
                  :group="{ name: 'form' }"
                  ghost-class="ghost" handle=".mover" :style="self.flex"
                  
                  @add="handleWidgetGroupAdd($event, self)"
                  @end="$emit('change')">
            <div :key="groupIndex"  
                v-for="(item, groupIndex) in self.children.column" 
                class="widget-form-group__item"
                :style="{
                  'flex-shrink':item['flex-shrink'],
                'flex-grow':item['flex-grow'],
                'margin':self['flex-margin']+'px',
                'align-self':item['align-self'],
                 height:`calc(${item.style.height} - ${2*self['flex-margin']}px`,
                 width:`calc(${item.style.width} - ${2*self['flex-margin']}px`,
                 }"
                > 
                <widget-form-item :self="item" :parent="self"  :index="groupIndex"
                      :select.sync="selectWidget"  :depth="0"
                      :params="self.params"></widget-form-item>     
            </div>
            
        <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" >
        </widgetDialog>
        </draggable>
</template>
<script>

import mixins from "./mixins"
export default {
  name: 'widget-form-row-span',
  mixins:[mixins],
  components: {  },
  updated(){
      if(this.self.children.column.length>0){
          if(!this.self.children.column.some(element => element.label===this.editableTabsValue))
            this.editableTabsValue = this.self.children.column[0].label;
      }
      this.self.children.column.forEach(element => {
          
          if(element.gridName  && element.gridName!="_random_"){
            this.context?.allElementSet.add(element.gridName)  
            if(this.context.mode!='design' && this.context.name_lable_map[this.self.gridName]==undefined)
              this.context.name_lable_map[element.gridName]=element
          }
      });
  },
  computed:{
    MainComponent(){
      return this.page_type[ "tabs"].main
    },
    SubComponent(){
      return this.page_type[ "tabs"].sub
    },
    
  },
  watch:{
    editableTabsValue:function(val){
      function resize(node) {
          if(node.self && node.self.type=="echart" ){
            if(node.myChart){
              node.myChart.resize();
            }
          }
          node?.$children?.forEach(ele=>{
            resize(ele)
          })
      }
      this.$nextTick(_ => {
          resize(this)
        })
    }
  },
  data () {
    return {
      page_type:{"tabs":{'main':'el-tabs','sub':'el-tab-pane'},
      "Carousel":{'Carousel':'el-carousel','sub':'el-carousel-item'},
      "collapse":{'main':'el-collapse','sub':'el-collapse-item'},
      },
      editableTabsValue:"Tab0",
      cur_tab:"-1",
      widget_dialogVisible:false
    }
  },
  mounted(){
    let _this=this
    setTimeout(function(){
     _this.cur_tab="0" 
    });
  },
  methods: {
    tab_click(cur_tab){
      if(window.needResizeFunc){
        setTimeout(function(){
          $(window.needResizeFunc).each(function(){this.call()});
        })
      }
    },
    handleWidgetGroupAdd (evt) {
      let newIndex = evt.newIndex;
      const item = evt.item;

      if (newIndex == 1 && newIndex > this.self.children.column.length - 1) newIndex = 0

      const data = this.deepClone(this.self.children.column[newIndex]);
      if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      
      data.span = 24
      this.$set(this.self.children.column, newIndex, { ...data })
      this.selectWidget = this.self.children.column[newIndex]
      
      //this.$emit("change")
    },
    handleTabsEdit(targetName, action) {
        if (action === 'add') {
          this.widget_dialogVisible=true
          return
        }
        if (action === 'remove') {
          let tabs = this.self.children.column;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.label === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.label;
                }
              }
            });
          }
          tabs[targetName].isDelete=true
          this.editableTabsValue = activeName;
          tabs.splice(targetName,1);
        }
      }
  },
}
</script>