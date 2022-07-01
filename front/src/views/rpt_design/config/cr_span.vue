<template>
  <div>
      <el-form-item label="排列方式">
          <avue-select v-model="data.flex['flex-direction']"
                       :dic="[
                       { label: '从左到右', value: 'row' }, 
                       { label: '从上到下', value: 'column' },
                       ]">
          </avue-select>
        </el-form-item>
      <el-form-item label="超出是否换行">
          <avue-select v-model="data.flex['flex-wrap']"
                       :dic="[
                       { label: '不会换行', value: 'nowrap' }, 
                       { label: '需要时换行', value: 'wrap' },
                       
                       ]">
          </avue-select>
        </el-form-item>        
        <el-form-item label="主轴对齐方式">
          <avue-select v-model="data.flex['justify-content']"
                       :dic="[
                       { label: '开始位置', value: 'flex-start' }, 
                       { label: '结束位置', value: 'flex-end' },
                       { label: '居中', value: 'center' },
                       { label: '两端对齐，项目之间的间隔是相等的', value: 'space-between' },
                       { label: '每个项目两侧的间隔相等', value: 'space-around' },
                       ]">
          </avue-select>
        </el-form-item>    
        <el-form-item label="多行对齐方式" v-if="data.flex['flex-wrap']=='wrap' && data.flex['flex-direction']=='row'">
          <avue-select v-model="data.flex['align-content']"
                       :dic="[
                       { label: '开始位置', value: 'flex-start' }, 
                       { label: '结束位置', value: 'flex-end' },
                       { label: '居中', value: 'center' },
                       { label: '两端对齐，项目之间的间隔是相等的', value: 'space-between' },
                       { label: '每个项目两侧的间隔相等', value: 'space-around' },
                       ]">
          </avue-select>
        </el-form-item>  
        <el-form-item label="侧轴对齐方式">
          <avue-select v-model="data.flex['align-items']"
                       :dic="[
                       { label: '项目将被拉伸以适合容器', value: 'stretch' }, 
                       { label: '开始位置', value: 'flex-start' },
                       { label: '结束位置', value: 'flex-end' },
                       { label: '居中', value: 'center' },
                       { label: '基线对齐', value: 'baseline' },
                       ]">
          </avue-select>
        </el-form-item>     
        <el-form-item label="项目间边距"  >
          <div style="">
            <avue-input-number style="width:100%;"
                             v-model="data['flex-margin']"
                             controls-position="right"
                             placeholder="项目间边距"
                             ></avue-input-number>
          </div>  
          </el-form-item>


  </div>
</template>
<script>
export default {
  name: "config-cr-span",
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