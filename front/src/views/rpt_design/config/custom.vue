<template>
  <div>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;">自定义属性：</label>
      <div >
          <codemirror     v-model="params" 
              :options="{tabSize: 4, mode: 'text/javascript', styleActiveLine: true,lineWrapping: true,
              theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
              
         />
        <!--<monaco-editor v-model="params"
                       height="300"
                       :keyIndex="data.prop"
                       :options="options"></monaco-editor>
                       -->
      </div>
    </div>
    <div class="el-form-item el-form-item--small el-form--label-top">
      <label class="el-form-item__label"
             style="padding: 0;">自定义事件：</label>
      <div>
        <codemirror    v-model="event"  :keyIndex="data.prop"
              :options="{tabSize: 4, mode: 'text/javascript', styleActiveLine: true,lineWrapping: true,
              theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
              /><!--
        <monaco-editor v-model="event"
                       height="300"
                       :keyIndex="data.prop"
                       :options="options"></monaco-editor> -->
      </div>
    </div>
    <el-form-item label="是否禁用">
      <el-switch v-model="data.disabled"></el-switch>
    </el-form-item>
    <el-form-item label="是否可见">
      <el-switch v-model="data.display"></el-switch>
    </el-form-item>
  </div>
</template>
<script>

import  codemirror  from '../element/vue-codemirror.vue'
export default {
  name: 'config-custom',
  components: { codemirror },
  props: ['data'],
  mounted(){
    console.info("=")
  },
  data() {
    return {
      params:  this.data.params ? JSON.stringify(this.data.params,null,4):  "{}",
      event:  this.data.event ? JSON.stringify(this.data.event,null,4):  "{}",
      options: {
        minimap: {
          enabled: false,
        },
      },
    }
  },
  methods: {
  },
  watch: {
    'data.params'(val) {
      this.params = val ? JSON.stringify(val,null,4): "{}"
    },
    'data.event'(val) {
      this.event =  val ? JSON.stringify(val,null,4): "{}"
    },
    params(val) {
      try {
        this.data.params = eval("(" + val + ")")
      } catch (e) {
        // console.error(e)
      }
    },
    event(val) {
      try {
        this.data.event = eval("(" + val + ")")
      } catch (e) {
        // console.error(e)
      }
    }
  }
}
</script>