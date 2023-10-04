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
            <avue-radio v-model="data.el_param['stretch']" :dic="[{ label: '是', value: true }, { label: '否', value: false },]">
            </avue-radio>
      </el-form-item>
      <el-form-item label="风格类型">
            <avue-radio v-model="data.el_param['type']" :dic="[{ label: 'border-card', value: 'border-card' }, { label: 'card', value: 'card' },]">
            </avue-radio>
    </el-form-item>

  </template>
  <template v-else-if="data.el_type=='Collapse'">
    
  </template>
  <template v-else-if="data.el_type=='carousel'">
    <el-form-item label="走马灯展示的方向">
            <avue-radio v-model="data.el_param['direction']" :dic="[{ label: '水平', value: 'horizontal' }, { label: '垂直', value: 'vertical' },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="指示器的位置">
            <avue-radio v-model="data.el_param['indicator-position']" :dic="[{ label: 'outside', value: 'outside' }, { label: 'none', value: 'none' },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="指示器的触发方式">
            <avue-radio v-model="data.el_param['trigger']" :dic="[{ label: 'click', value: 'click' }, { label: '—', value: '—' },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="切换箭头的显示时机">
            <avue-radio v-model="data.el_param['arrow']" :dic="[{ label: 'always', value: 'always' }, { label: 'hover', value: 'hover' }, { label: 'never', value: 'never' },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="是否循环显示">
            <avue-radio v-model="data.el_param['loop']" :dic="[{ label: '是', value: true }, { label: '否', value: false },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="是否自动切换">
            <avue-radio v-model="data.el_param['autoplay']" :dic="[{ label: '是', value: true }, { label: '否', value: false },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="走马灯的类型">
            <avue-radio v-model="data.el_param['type']" :dic="[{ label: 'card', value: 'card' }, { label: '—', value: '—' },]">
            </avue-radio>
    </el-form-item>
    <el-form-item label="自动切换的时间间隔，单位为毫秒">
            <avue-input-number v-model="data.el_param['interval']" >
            </avue-input-number>
    </el-form-item>
    <el-form-item label="偶数背景色">
        <avue-input-color v-model="data.style['--nth_2n_color']"></avue-input-color>
    </el-form-item>
    <el-form-item label="奇数背景色">
        <avue-input-color v-model="data.style['--nth_2n_1_color']"></avue-input-color>
    </el-form-item>
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