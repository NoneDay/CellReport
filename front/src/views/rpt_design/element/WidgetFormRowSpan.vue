<template>
        <draggable class="widget-form-group__body" style="overflow:auto;display:flex; margin-bottom: 0px;height: 100%;width: 100%;"
                  :list="self.children.column"
                  :group="{ name: 'form' }"
                  ghost-class="ghost" handle=".mover" :style="self.flex"
                  @end="$emit('change')">
            <div :key="groupIndex"  
                v-for="(item, groupIndex) in col_items" 
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
      this.self.children.column.forEach(element => {
          
          if(element.gridName  && element.gridName!="_random_"){
            this.context?.allElementSet.add(element.gridName)  
            if(this.context.mode!='design' && this.context.name_lable_map[this.self.gridName]==undefined)
              this.context.name_lable_map[element.gridName]=element
          }
      });
  },
  computed:{
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
    
  },
  data () {
    return {
      widget_dialogVisible:false
    }
  },
  mounted(){

  },
  methods: {
  }
}
</script>