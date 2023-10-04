<template>
  <div style="width:100%;height:100%"  @click.stop="handleSelectWidget()" v-if="cr_init">
    <el-collapse v-model="activeNames"  v-if="MainComponent=='el-collapse'"
    :style="{...(self.style??{}),...{height:'100%','--n':col_items.length,'--scale_y':context.scale.y,'--tab_h':tab_h  }}"  
    :depth="depth+1" v-bind="self.el_param??{}"    
    @change="tab_click" 
    > 
          <el-collapse-item  :key="groupIndex" v-for="(item, groupIndex) in col_items" 
          :name="groupIndex"
          :title="item.label" 
          >
              <widget-form-item :self="item" :parent="self"  :index="groupIndex"  :depth="depth+1" 
                      :select.sync="selectWidget" 
              ></widget-form-item>     
          </el-collapse-item>
    </el-collapse>
    
    <el-carousel v-model="cur_tab"  v-else-if="MainComponent=='el-carousel'"
    :style="{...(self.style??{}),...{height:'100%','--tab_h':tab_h - 40*context.scale.y/100 }}" 
    :class="self.el_param['indicator-position']=='outside' ?'carousel_has_label':''"
    :depth="depth+1" 
    v-bind="{...self.el_param??{},...(context.mode=='design'?{'indicator-position':'outside' }:{})}"
    @change="tab_click" > 
          <el-carousel-item :is="SubComponent"  :key="groupIndex"  
            :style="MainComponent=='el-collapse'?{}:{height:'100%'}" 
                v-for="(item, groupIndex) in col_items"
                  :md="item.span || 12" 
                  :offset="item.offset || 0"
                  :name="groupIndex"
                  :xs="24" 
                  :label="self.show_title?item.label:undefined" 
                  
                  > <!-- self.el_param['indicator-position']=='outside' -->
              <widget-form-item :self="item" :parent="self"  :index="groupIndex"  :depth="depth+1" 
                      :select.sync="selectWidget"  
              ></widget-form-item>     
          </el-carousel-item>
    </el-carousel>
    <el-tabs v-model="cur_tab"  v-else
    :style="{...{height:'calc(100% - '+border_size+'px','--tab_h':tab_h,},...(self.style??{})}" 
    :depth="depth+1" v-bind="{...(self.el_param??{})}"
    @tab-click="tab_click" 
    > 
          <el-tab-pane :key="groupIndex"  :style="{height:'100%' }" 
                v-for="(item, groupIndex) in col_items"
                  :md="item.span || 12" 
                  :offset="item.offset || 0"
                  :name="groupIndex"
                  :xs="24" 
                  :label="item.label" 
                  :title="item.label" 
                  >
              <widget-form-item :self="item" :parent="self"  :index="groupIndex"  :depth="depth+1" 
                      :select.sync="selectWidget"  v-if='groupIndex==cur_tab'
              ></widget-form-item>     
          </el-tab-pane>
    </el-tabs>
    <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" >
    </widgetDialog>
  </div>
</template>
<script>
import mixins from "./mixins"
export default {
  name: 'widget-form-tabs',
  mixins:[mixins],
  props:["border_size"],
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
      return this.page_type[this.context.mode=='design'?"tabs": this.self.el_type??"tabs"].main
    },
    SubComponent(){
      return this.page_type[this.context.mode=='design'?"tabs": this.self.el_type??"tabs"].sub
    },
    col_items(){
      let idx=0
      this.self.children.column?.forEach(x=>{
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
      "Collapse":{'main':'el-collapse','sub':'el-collapse-item'},
      },
      editableTabsValue:"Tab0",
      cur_tab:"-1",
      activeNames:[0],
      tab_h:'100',
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
    if(this.MainComponent=='el-collapse'){
      this.$set(this,'cur_tab',["0" ])
    }
    if(this.self.el_type=='tabs' && !this.self.el_param.type)
      this.self.el_param.type='border-card'
    let _this=this
   
      _this.tab_h=_this.$el.clientHeight
      
      if( _this.self.style){
        let margin=0
         Object.entries(_this.self.style).forEach(x=>{
            if(x[0].search(/margin/i)>=0){
              margin=parseFloat(x[1])
            }
         })
         let padding=0
         Object.entries(_this.self.style).forEach(x=>{
            if(x[0].search(/padding/i)>=0){
              padding=parseFloat(x[1])
            }
         })
         _this.tab_h=_this.tab_h - 2*(margin + padding )
      }
      if(_this.MainComponent=='el-collapse'){
        _this.$set(_this,'cur_tab',["1" ])        
      }
      else
        _this.cur_tab="0" 
    
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
  },
}
</script>
<style>
.el-tabs__header {
    background-color: #F5F7FA;
    border-bottom: 1px solid #E4E7ED;
    margin: 0;
}
.el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    color: #409EFF;
    border-bottom: 3px solid #409EFF;
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #409EFF;
    border-bottom: 3px solid #409EFF;
}
.el-carousel__container{
  height:100% ;
}
.carousel_has_label .el-carousel__container{
  height:calc(100% - 40px);
}
.el-tabs--border-card>.el-tabs__content,.el-tabs__content
{
    height:calc((var(--tab_h) - 40) * 1px); 
    width:100%;
    padding: 2px;
}
.el-collapse-item__content {
  height:calc((var(--tab_h) - var(--n) * 49) *1px);
  padding-bottom: 0px;
}

.el-carousel__item:nth-child(2n) {
  background-color: var(--nth_2n_color,transparent);
}

.el-carousel__item:nth-child(2n+1) {
  background-color: var(--nth_2n_1_color,transparent);
}

</style>