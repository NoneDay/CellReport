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
   <el-button @click="dialogVisible=true" type="primary">编辑内容</el-button>
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