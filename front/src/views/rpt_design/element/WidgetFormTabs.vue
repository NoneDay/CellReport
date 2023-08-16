<template>
  <div style="width:100%;height:100%"  @click.stop="handleSelectWidget()" v-if="cr_init">
    <component :is="MainComponent"  type="border-card" v-model="cur_tab" 
    style="height:100%"  :depth="depth+1" v-bind="self.el_param??{}"
    @tab-click="tab_click" 
    :editable="context.canDraggable" 
    @edit="handleTabsEdit"> 
          <component :is="SubComponent"  :key="groupIndex"  style="height:100%" 
                v-for="(item, groupIndex) in col_items"
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
import mixins from "./mixins"
export default {
  name: 'widget-form-tabs',
  mixins:[mixins],
  inject:["has_name"],
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
      return this.page_type[ this.self.el_type??"tabs"].main
    },
    SubComponent(){
      return this.page_type[ this.self.el_type??"tabs"].sub
    },
    col_items(){
      let idx=0
      this.self.children.column?.forEach(x=>{
        if(x.idx==undefined)
          x.idx=idx
        idx++;
      })
      this.self.children.column?.sort((obj1, obj2) => obj1.idx - obj2.idx)
      return this.self.children.column
    }
  },
  watch:{
    "self.el_param":{
            handler(val,oldVal){
                this.cr_init=false
                let _this=this
                setTimeout(() => {
                  _this.cr_init=true
                });
            },deep:true
        },
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
      "carousel":{'main':'el-carousel','sub':'el-carousel-item'},
      "collapse":{'main':'el-collapse','sub':'el-collapse-item'},
      },
      editableTabsValue:"Tab0",
      cur_tab:"-1",
      widget_dialogVisible:false,
      cr_init:true
    }
  },
  mounted(){
    if(this.self.el_param==undefined){
      this.self.el_param={}
    }
    if(this.self.el_type==undefined){
      this.self.el_type='tabs'
      this.self.el_param['stretch']=false   
      this.self.el_param['tab-position']='top'      
    }
    let _this=this
    setTimeout(function(){
     _this.cur_tab="0" 
    });
  },
  methods: {
    handleSelectWidget () {
      if(this.context.mode=="design")
          this.selectWidget = this.self
    },
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
      data.idx=newIndex
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