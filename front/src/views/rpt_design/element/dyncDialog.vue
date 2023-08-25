<template>
  <el-dialog v-draggable v-if="dialogVisible && this.context.mode!='design'" style="text-align: left;" 
            :visible.sync="dialogVisible" 
            :close-on-click-modal="false" direction="btt" append-to-body v-bind="{...{'custom-class':'dync_dialog',title:'信息'},...dync_item.dialog_params||{} }"
        > 
      <div v-bind="{...{style:'height:50vh'},...dync_item.params||{}}">
      <widget-form-item  :self="dync_item"  >  </widget-form-item>
      </div>
  </el-dialog>
</template>

<script>

import mixins from "./mixins"
export default {
  name:"dync-dialog",
  mixins:[mixins],
  props:['dync_item','context'],
  data: () => ({
    dialogVisible: true, 
  }),  
  methods: {

  },
  provide(){
      let ret={
          context: this.context,
          fresh_ele:this.fresh_ele,
          clickedEle:this.clickedEle,
      }
      return ret
  },
};
</script>