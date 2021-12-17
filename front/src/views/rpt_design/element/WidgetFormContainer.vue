<template>
    <el-container :style="self.style" :class="self.class">
      <el-header v-if="self.header_pane">
        <widget-form-item :self="self.header_pane" :parent="self"  
                      :select.sync="selectWidget"
          ></widget-form-item>   
      </el-header>
      <el-aside v-if="self.aside_pane">
        <widget-form-item :self="self.aside_pane" :parent="self"  
                      :select.sync="selectWidget"
         ></widget-form-item>   
      </el-aside>
      <el-main v-if="self.main_pane">

          <widget-form-item :self="self.main_pane" :parent="self"  
                      :select.sync="selectWidget"
            ></widget-form-item>     

      </el-main>
      <el-footer v-if="self.footer_pane">
        <widget-form-item :self="self.footer_pane" :parent="self"  
                      :select.sync="selectWidget"
            ></widget-form-item>   
      </el-footer>
    </el-container>
</template>
<script>
import draggable from 'vuedraggable'
import mixins from "./mixins"
export default {
  name: 'widget-form-container',
   mixins:[mixins],
  components: { draggable },
  mounted(){

  },
  data () {
    return {
     
    }
  },
  methods: {
   
  },
}
</script>