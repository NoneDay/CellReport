<template>
  <div>
    <component :is="MainComponent"  type="border-card" v-model="cur_tab" 
    style="height:100%"  :depth="depth+1"
    @tab-click="tab_click"
    :editable="context.canDraggable" 
    @edit="handleTabsEdit"> 
          <component :is="SubComponent"  :key="groupIndex"  style="height:100%" 
                v-for="(item, groupIndex) in self.children.column"
                  :md="item.span || 12" :name="groupIndex"
                  :xs="24" :label="item.label" 
                  :offset="item.offset || 0">
              <widget-form-item :self="item" :parent="self"  :index="groupIndex"  :depth="depth+1"
                      :select.sync="selectWidget" v-if='groupIndex==cur_tab'
              ></widget-form-item>     
          </component>
    </component>
    <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" >
    </widgetDialog>
  </div>
</template>
<script>
import {widget_div_layout} from '../fieldsConfig'
import mixins from "./mixins"
export default {
  name: 'widget-form-tabs',
  mixins:[mixins],
  components: {  },
  updated(){
      if(this.self.children.column.length>0){
          if(!this.self.children.column.some(element => element.label===this.editableTabsValue))
            this.editableTabsValue = this.self.children.column[0].label;
      }
      this.self.children.column.forEach(element => {
          if(this.context.report_result.name_lable_map==undefined)
              this.context.report_result.name_lable_map={}
          
          if(element.gridName  && element.gridName!="_random_"){
            this.context?.allElementSet.add(element.gridName)  
            if(this.context.report_result.name_lable_map[this.self.gridName]==undefined)
              this.context.report_result.name_lable_map[element.gridName]=element
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
      this.editableTabsValue=data.label
      //this.$emit("change")
    },
    handleTabsEdit(targetName, action) {
        if (action === 'add') {
          this.widget_dialogVisible=true
          return
          let newIndex = (this.self.children.column.length) ;
          let data={...widget_div_layout(), prop : Date.now() + '_' + Math.ceil(Math.random() * 99999) };
          let idx=newIndex
          while(this.self.children.column.find(item=>item.label=='Tab'+idx)){
            idx++
          }
          data.label='Tab'+idx
          this.$set(this.self.children.column, newIndex, { ...data })
          this.editableTabsValue = data.label;
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