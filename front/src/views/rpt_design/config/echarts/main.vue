<!-- 通用配置-->
<template>
  <div>

    
    <!-- 折叠公共配置 -->
    <el-collapse accordion>
      <!-- 标题设置 -->
      <template v-if="vaildProp('titleList')">
        <el-collapse-item title="标题设置">
          <el-form-item label="标题">
            <avue-switch v-model="data.option.titleShow"></avue-switch>
          </el-form-item>
          <el-form-item label="标题">
            <avue-input v-model="data.option.title"></avue-input>
          </el-form-item>
          <el-form-item label="字体颜色">
            <avue-input-color
              v-model="data.option.titleColor"
            ></avue-input-color>
          </el-form-item>
          <el-form-item label="字体大小">
            <avue-input-number
              v-model="data.option.titleFontSize"
            ></avue-input-number>
          </el-form-item>
          <el-form-item label="字体位置">
            <avue-select
              v-model="data.option.titlePostion"
              :dic="dicOption.textAlign"
            >
            </avue-select>
          </el-form-item>
          <el-form-item label="副标题">
            <avue-input v-model="data.option.subtext"></avue-input>
          </el-form-item>
          <el-form-item label="字体颜色">
            <avue-input-color
              v-model="data.option.subTitleColor"
            ></avue-input-color>
          </el-form-item>
          <el-form-item label="字体大小">
            <avue-input-number v-model="data.option.subTitleFontSize">
            </avue-input-number>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 轴设置 -->
      <template v-if="vaildProp('barList')">
        <el-collapse-item title="X轴设置">
          <el-form-item label="名称">
            <avue-input v-model="data.option.xAxisName"> </avue-input>
          </el-form-item>
          <el-form-item label="显示">
            <avue-switch v-model="data.option.xAxisShow"> </avue-switch>
          </el-form-item>
          <el-form-item label="显示箭头">
            <avue-switch v-model="data.option.xAxisLineSymbol"> </avue-switch>
          </el-form-item>
          <el-form-item label="显示网格线">
            <avue-switch v-model="data.option.xAxisSplitLineShow">
            </avue-switch>
          </el-form-item>
          <el-form-item label="标签间距">
            <avue-input-number  v-model="data.option.xAxisinterval" :min='0' :max='4' controls-position=""/>
          </el-form-item>
          <el-form-item label="文字角度">
            <avue-input-number v-model="data.option.xAxisRotate">
            </avue-input-number>
          </el-form-item>
          <el-form-item label="轴反转">
            <avue-switch v-model="data.option.xAxisInverse"> </avue-switch>
          </el-form-item>
          <el-form-item label="字号">
            <avue-input-number v-model="data.option.xNameFontSize">
            </avue-input-number>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="Y轴设置">
          <el-form-item label="显示">
            <avue-switch v-model="data.option.yAxisShow"> </avue-switch>
          </el-form-item>
          <el-form-item label="名称">
            <avue-input v-model="data.option.yAxisName"> </avue-input>
          </el-form-item>
          <el-form-item label="名称位置">
            <avue-select
              v-model="data.option.yAxisNameAlign"
              :dic="dicOption.textAlign"
            >
            </avue-select>
          </el-form-item>
          <el-form-item label="名称颜色">
            <avue-input-color v-model="data.option.yAxisNameColor">
            </avue-input-color>
          </el-form-item>
          <el-form-item label="名称与轴线距离">
            <avue-slider
              v-model="data.option.yAxisNameGap"
              :min="-50"
              :max="50"
            >
            </avue-slider>
          </el-form-item>
          <el-form-item label="名称角度">
            <avue-slider
              v-model="data.option.yAxisNameRotate"
              :min="-180"
              :max="180"
            >
            </avue-slider>
          </el-form-item>
          <el-form-item label="显示坐标轴线">
            <avue-switch v-model="data.option.yAxisLineShow"> </avue-switch>
          </el-form-item>
          <el-form-item label="显示箭头">
            <avue-switch v-model="data.option.yAxisLineSymbol"> </avue-switch>
          </el-form-item>
          <el-form-item label="显示刻度">
            <avue-switch v-model="data.option.yAxisTickShow"> </avue-switch>
          </el-form-item>
          <el-form-item label="轴网格线">
            <avue-switch v-model="data.option.yAxisSplitLineShow">
            </avue-switch>
          </el-form-item>
          <el-form-item label="反转">
            <avue-switch v-model="data.option.yAxisInverse"> </avue-switch>
          </el-form-item>
          <el-form-item label="字号">
            <avue-input-number v-model="data.option.yNameFontSize">
            </avue-input-number>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 数值设置 -->
      <template v-if="vaildProp('labelList')">
        <el-collapse-item title="数值设置">
          <el-form-item label="显示">
            <avue-switch v-model="data.option.labelShow"> </avue-switch>
          </el-form-item>
          <el-form-item label="字体大小">
            <avue-input-number v-model="data.option.labelShowFontSize">
            </avue-input-number>
          </el-form-item>
          <el-form-item label="字体颜色">
            <avue-input-color v-model="data.option.labelShowColor">
            </avue-input-color>
          </el-form-item>
          <el-form-item label="字体粗细">
            <avue-select
              v-model="data.option.labelShowFontWeight"
              :dic="dicOption.fontWeight"
            >
            </avue-select>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 提示语设置  -->
      <template v-if="vaildProp('tipList')">
        <el-collapse-item title="提示语设置">
          <el-form-item label="字体大小">
            <avue-input-number
              v-model="data.option.tipFontSize"
            ></avue-input-number>
          </el-form-item>
          <el-form-item label="字体颜色">
            <avue-input-color v-model="data.option.tipColor"></avue-input-color>
          </el-form-item>
          <el-form-item label="提示语格式">
            <avue-input v-model="data.option.labelFormatter"/>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 轴距离设置 -->
      <template v-if="vaildProp('postionList')">
        <el-collapse-item title="坐标轴边距设置">
          <el-form-item label="左边距(像素)">
            <avue-slider v-model="data.option.gridX" :max="400"></avue-slider>
          </el-form-item>
          <el-form-item label="顶边距(像素)">
            <avue-slider v-model="data.option.gridY" :max="400"></avue-slider>
          </el-form-item>
          <el-form-item label="右边距(像素)">
            <avue-slider v-model="data.option.gridX2" :max="400"></avue-slider>
          </el-form-item>
          <el-form-item label="底边距(像素)">
            <avue-slider v-model="data.option.gridY2" :max="400"></avue-slider>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 图例设置 -->
      <template v-if="vaildProp('legendList')">
        <el-collapse-item title="图例操作">
          <el-form-item label="图例">
            <avue-switch v-model="data.option.legend"></avue-switch>
          </el-form-item>
          <el-form-item label="水平位置">
            <avue-select
              v-model="data.option.legendPostion"
              :dic="dicOption.textAlign"
            >
            </avue-select>
          </el-form-item>
          <el-form-item label="垂直位置">
            <avue-select
              v-model="data.option.legendPostionTop"
              :dic="dicOption.verticalAlign"
            >
            </avue-select>
          </el-form-item>

          <el-form-item label="布局朝向">
            <avue-select
              v-model="data.option.legendOrient"
              :dic="dicOption.orientList"
            >
            </avue-select>
          </el-form-item>
          <el-form-item label="字体颜色">
            <avue-input-color
              v-model="data.option.legendTextColor"
            ></avue-input-color>
          </el-form-item>
          <el-form-item label="字体大小">
            <avue-input-number v-model="data.option.legendFontSize">
            </avue-input-number>
          </el-form-item>
        </el-collapse-item>
      </template>
      <!-- 颜色设置 -->
      <template v-if="vaildProp('colorList')">
        <el-collapse-item title="自定义配色">
          <el-form-item label="文字颜色">
            <avue-input-color v-model="data.option.nameColor">
            </avue-input-color>
          </el-form-item>
          <el-form-item label="轴线颜色">
            <avue-input-color
              v-model="data.option.lineColor"
            ></avue-input-color>
          </el-form-item>
          <avue-crud
            :option="colorOption"
            :data="data.option.barColor"
            @row-save="rowSave"
            @row-del="rowDel"
            style="width: 300px"
            @row-update="rowUpdate"
          ></avue-crud>
        </el-collapse-item>
      </template>
      <!-- 地图设置 -->
      <template v-if="vaildProp('mapList')">
        <el-collapse-item title="地图设置">
          <template v-if="data.option.type === 0">
            <el-form-item label="地图URL">
                <avue-input v-model="data.option.mapData"></avue-input>
            </el-form-item>
            <el-form-item label="地图级别">
              <avue-select
                :dic="[
                  { label: '国家', value: '国家' },
                  { label: '省级', value: '省级' },
                  { label: '市级', value: '市级' },
                ]"
                v-model="data.option.mapLevel"
                @change="changeMapLevel"
                placeholder="请选择地图"
              ></avue-select>
            </el-form-item>
            <el-form-item
              label="选择省份"
              v-if="data.option.mapLevel === '省级'"
            >
              <avue-select
                :dic="regionData"
                v-model="data.option.province"
                @change="changeProvince"
                placeholder="请选择省份"
              ></avue-select>
            </el-form-item>
            <el-form-item
              label="选择城市"
              v-if="data.option.mapLevel === '市级'"
            >
              <el-cascader
                :options="regionData"
                v-model="data.option.city"
                @change="changeCity"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="地图比例">
              <avue-slider
                v-model="data.option.zoom"
                :max="1"
                :step="0.1"
              ></avue-slider>
            </el-form-item>
            <el-form-item label="名称显示">
              <avue-switch v-model="data.option.showGeoLabelName">
              </avue-switch>
            </el-form-item>
            <el-form-item label="字体大小">
              <avue-input-number
                v-model="data.option.fontSize"
              ></avue-input-number>
            </el-form-item>
            <el-form-item label="字体高亮颜色">
              <avue-input-color
                v-model="data.option.empColor"
              ></avue-input-color>
            </el-form-item>
            <el-form-item label="字体颜色">
              <avue-input-color v-model="data.option.color"></avue-input-color>
            </el-form-item>
            <el-form-item label="区域线">
              <avue-input-number
                v-model="data.option.borderWidth"
              ></avue-input-number>
            </el-form-item>
            <el-form-item label="区域颜色">
              <avue-input-color
                v-model="data.option.areaColor"
              ></avue-input-color>
            </el-form-item>
            <el-form-item label="区域高亮颜色">
              <avue-input-color
                v-model="data.option.empAreaColor"
              ></avue-input-color>
            </el-form-item>
            <el-form-item label="边框颜色">
              <avue-input-color
                v-model="data.option.borderColor"
              ></avue-input-color>
            </el-form-item>
          </template>
          <template v-if="data.option.type === 1">
            <el-form-item label="图片地址">
              <avue-input v-model="data.option.img"></avue-input>
            </el-form-item>
            <el-form-item label="地图比例">
              <avue-slider v-model="data.option.scale" :max="300"></avue-slider>
            </el-form-item>
          </template>
        </el-collapse-item>
      </template>
    </el-collapse>
   <!--
    <template v-if="false && VisualDesign&& VisualDesign.content.trim()!=''">
    <span class="guide"  v-if="VisualDesign.helpurl">
        <i class="el-icon-warning-outline" title="查看文档" @click="clickGuide">查看文档</i>
      </span>

      <dyncTemplate :parentCompent="parentCompent" 
              :self="{type:'pc_form',content:VisualDesign.content,gridName:'pc_form'}" 
      >
      </dyncTemplate>
    </template> -->
  </div>
</template>

<script>
import { dicOption, colorOption } from "../config";
// data
import regionData from '../../assets/regionData'

export default {
  props: ["data"],
  components: {    
  },
  mounted() {},
  computed: {
    parentCompent(){return this},
    VisualDesign(){
      if(this.data.component!="echarts")
        return
      this.edit_item=this.data
      let ret= Enumerable.from(window.cr_allWidget.admin_json.visual_design_arr).firstOrDefault(x=>x.type==this.data.type)
      return ret
    },
  },
  data() {
    return {
      dicOption: dicOption,
      colorOption: colorOption,
      backUrl:"https://data.bladex.vip/blade-visual",
      default_map_url: window.cellreport.map_url??'https://geo.datav.aliyun.com/areas_v3/bound',
      regionData: regionData,
      edit_item:{}
    };
  },
  methods: {
    clickGuide(){
      window.open(this.VisualDesign.helpurl,'_blank')
    },
    vaildProp(name, list) {
      if(this.data.option?.vaildProp?.includes(name))
        return true;
      if (list) return list.includes(this.data.type) || this.active.length > 1;
      return dicOption[name].includes(this.data.type);
    },
    rowSave(row, done) {
      this.data.option.barColor.push(row);
      done();
    },
    rowDel(row, index) {
      this.data.option.barColor.splice(index, 1);
    },
    rowUpdate(row, index, done) {
      this.data.option.barColor.splice(index, 1, row);
      done();
    },
    changeMapLevel(p) {
      if (p.value === "国家") {
        this.data.option.mapData = `${this.default_map_url}/100000_full.json`;
      }
    },
    //https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    //https://geo.datav.aliyun.com/areas_v3/bound/410800_full.json
    changeProvince({value}) {
      if (value) {
        this.data.option.mapData = `${this.default_map_url}/${value}_full.json`
        //`${
        //  this.backUrl
        //}/map/data/${value}?name=${this.getLastRegion([value])}`;
      }
    },
    changeCity(arr) {
      if (arr) {
        const name = this.getLastRegion(arr);
        const code = arr[arr.length - 1];
        //this.data.option.mapData = `${this.backUrl}/map/data/${code}?name=${name}`;
        this.data.option.mapData = `${this.default_map_url}/${code}_full.json`
      }
    },
    /**
     * 获取最后一级行政区名称
     * @param arr
     * @returns {string}
     */
    getLastRegion(arr) {
      if (arr instanceof Array) {
        let temp = regionData;
        const length = arr.length;
        for (let i = 0; i < length; i++) {
          const arrItem = arr[i];
          for (const n of temp) {
            if (arrItem === n.value) {
              if (i === length - 1) {
                return n.label;
              } else {
                temp = n.children;
                break;
              }
            }
          }
        }
        console.error("区域code有误");
      }
    },
  },
};
</script>

<style>
</style>