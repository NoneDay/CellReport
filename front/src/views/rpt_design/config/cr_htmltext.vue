<template>
  <div>
      <el-dialog   style="text-align: left;" :inline="true" size="mini"
    :visible.sync="dialogVisible" :title="'编辑内容'" 
        :close-on-click-modal="false"  :modal="false"
          direction="btt" append-to-body   v-draggable 
    >  
    
    <div >
          <codemirror     v-model="data.content" 
              :options="{tabSize: 4, mode: 'text/javascript', 
              styleActiveLine: true,lineWrapping: false,
              theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
         />
    </div>
    </el-dialog>
   <el-button @click="dialogVisible=true" type="primary">编辑模板</el-button>
   <div>
     <span>依赖数据：</span>
<el-select clearable  v-model="data.datasource" placeholder="请选择" @change="change_ds" >
    <el-option
      v-for="item in all_datasource"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
  </div>
  </div>

</template>
<script>

import  codemirror  from '../element/vue-codemirror.vue'
export default {
  name: 'config-html-text',
  components: { codemirror },
   inject: ["context"],
  props: ['data'],
  mounted(){
    console.info("=")
  },
  data() {
    return {
      content:  this.data.content|| "{}",     
      dialogVisible:false 
    }
  },
  methods: {
  },
    computed:{
    all_datasource(){
      let ret=["数据集:示例"]
      this.context.report.dataSets.dataSet.forEach(element=>{
        ret.push(`数据集:${element._name}`)
      });
      //this.context.report.AllGrids.grid.forEach(element=>{
      //    if(element._is_large=="0"){
      //      ret.push(`表格:${element._name}`)
      //    }
      //  });
      return ret;
    },

  },
  watch: {
    'data.content'(val) {
      this.content = this.data.content|| "{}"
    },
    content: function(val) {
        this.$set( this.data,'content' ,val )
    },
  }
}
</script>