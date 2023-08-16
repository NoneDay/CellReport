<template>
  <div>
    <template v-if="data.el_type=='tabs'">
      <el-form-item label="选项卡所在位置">
            <avue-select v-model="data.el_param['tab-position']"
                        :dic="[
                        { label: 'top', value: 'top' }, { label: 'right', value: 'right' },
                        { label: 'bottom', value: 'bottom' },{ label: 'left', value: 'left' },
                        ]">
            </avue-select>
      </el-form-item>
      <el-form-item label="标签的宽度是否自撑开">
            <avue-radio v-model="data.el_param['stretch']"
                        :dic="[
                        { label: '是', value: true }, { label: '否', value: false },
                        
                        ]">
            </avue-radio>
      </el-form-item>
  </template>
  <template v-else>
    <el-button @click="">添加子组件</el-button>
  </template>
  </div>
</template>
<script>
export default {
  name: "config-cr-tab",
  components: {  },
  inject: ["context"],
  props: ["data"],
  mounted() {
    
  },
  data() {
    return {   
      dialogVisible: false,
    };
  },
  methods: {
   
  },
  computed: {
   
  },
  watch: {
  },
};
</script>