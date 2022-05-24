<!-- 文字配置 -->
<template>
  <div>
    <el-form-item label="文本内容">
      <template slot="label">
        <el-tooltip placement="top">
          <div slot="content"><div v-html="context.templateGuide"/></div>
          <el-button style="color: darkred;">文字<span class="guide">
         <i class="el-icon-warning-outline" title="查看文档"></i>
        </span></el-button>
        </el-tooltip>        
      </template>        
      <avue-input v-model="data.label"></avue-input>
    </el-form-item>
    <el-form-item>
      <template slot="label">
        字体
        <span class="guide">
         <i class="el-icon-warning-outline" title="查看文档" @click="openFontGuide"></i>
        </span>
      </template>
      <avue-input v-model="data.titleOption.fontFamily"></avue-input>
    </el-form-item>
    <el-form-item label="字体大小">
      <avue-input-number v-model="data.titleOption.fontSize"
                         :max="200"></avue-input-number>
    </el-form-item>
    <el-form-item label="X偏移">
      <avue-slider v-model="data.titleOption.margin_left"></avue-slider>
    </el-form-item>
    <el-form-item label="字体间距">
      <avue-slider v-model="data.titleOption.split"></avue-slider>
    </el-form-item>
    <el-form-item label="字体行高">
      <avue-slider v-model="data.titleOption.lineHeight"></avue-slider>
    </el-form-item>
    <el-form-item label="文字粗细">
      <avue-select v-model="data.titleOption.fontWeight"
                   :dic="dicOption.fontWeight">
      </avue-select>
    </el-form-item>
    <el-form-item label="对齐方式">
      <avue-select v-model="data.titleOption.textAlign"
                   :dic="dicOption.textAlign">
      </avue-select>
    </el-form-item>
    
    <el-form-item label="字体颜色" v-if="!data.titleOption.gradient">
      <avue-input-color v-model="data.titleOption.color"></avue-input-color>
    </el-form-item>
    <el-form-item label="字体背景" v-if="!data.titleOption.gradient">
      <avue-input-color v-model="data.titleOption.backgroundColor"></avue-input-color>
    </el-form-item>
    <el-form-item label="阴影颜色" v-if="!data.titleOption.gradient">
      <avue-input-color v-model="data.titleOption.textShadowColor"></avue-input-color>
    </el-form-item>
    <el-form-item label="阴影位置(x y z)" v-if="!data.titleOption.gradient">
      <avue-input-number v-model="data.titleOption.textShadowX"
                         :min="-20" :max="20"></avue-input-number>
      <avue-input-number v-model="data.titleOption.textShadowY"
                         :min="-20" :max="20"></avue-input-number>
      <avue-input-number v-model="data.titleOption.textShadowZ"
                         :max="50"></avue-input-number>
    </el-form-item> <!--
    <el-form-item label="文字渐变">
      <avue-switch v-model="data.titleOption.gradient">
      </avue-switch>
      <template slot="label">
        文字渐变
        <span class="guide">
         <i class="el-icon-warning-outline" title="查看文档" @click="openGradientGuide"></i>
        </span>
      </template>
    </el-form-item>
    <el-form-item label="渐变方式" v-if="data.titleOption.gradient">
      <avue-select v-model="data.titleOption.gradientType"
                   :dic="gradientTypes">
      </avue-select>
    </el-form-item>
    <el-form-item title="仅需填写linear-gradient括号内的内容" label="线性渐变" v-if="data.titleOption.gradientType === 'linear' && data.titleOption.gradient">
      <avue-input v-model="data.titleOption.gradientLinear"></avue-input>
    </el-form-item>
    <el-form-item title="仅需填写radial-gradient括号内的内容" label="径向渐变" v-if="data.titleOption.gradientType === 'radial' && data.titleOption.gradient">
      <avue-input v-model="data.titleOption.gradientRadial"></avue-input>
    </el-form-item>
    <el-collapse accordion>
      <el-collapse-item title="跑马灯设置">
        <el-form-item label="开启">
          <avue-switch v-model="data.titleOption.scroll"></avue-switch>
        </el-form-item>
        <el-form-item label="反向">
          <avue-switch v-model="data.titleOption.scrollReverse"></avue-switch>
        </el-form-item>
        <template v-if="data.titleOption.scroll">
          <el-form-item label="滚动频率(ms)">
            <avue-input-number v-model="data.titleOption.speed"></avue-input-number>
          </el-form-item>
          <el-form-item label="滚动步长(px)">
            <avue-input-number v-model="data.titleOption.step" :step="0.5" :min="0.5" :max="5"></avue-input-number>
          </el-form-item>
        </template>
      </el-collapse-item>
      
      <el-collapse-item title="超链设置">
        <el-form-item label="开启">
          <avue-switch v-model="data.titleOption.link"></avue-switch>
        </el-form-item>
        <template v-if="data.titleOption.link">
          <el-form-item label="打开方式">
            <avue-radio v-model="data.titleOption.linkTarget"
                        :dic="dicOption.target">
            </avue-radio>
          </el-form-item>
          <el-form-item label="超链地址">
            <avue-input v-model="data.titleOption.linkHref"></avue-input>
          </el-form-item>
        </template>
      </el-collapse-item> 
    </el-collapse>-->
  </div>
</template>

<script>
import { dicOption } from './config'
export default {
  inject: ["context"],
  props: ["data"],
  name: "config-text",
  data () {
    return {
      dicOption: dicOption,
      gradientTypes:[{ label: '线性渐变', value: 'linear' }, { label: '径向渐变', value: 'radial' }]
    }
  },
  methods:{
    openGradientGuide(){
      window.open('https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient','_blank')
    },
    openFontGuide(){
      window.open('https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-family','_blank')
    }
  }
}
</script>

<style scoped>
.guide{
  margin-left: 5px;
  cursor: pointer;
}
</style>
