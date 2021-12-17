<template>
  <div class="widget-config">
    <el-form label-suffix="："
             v-if="this.data && Object.keys(this.data).length > 0"
             labelPosition="left"
             labelWidth="100px"
             size="mini">
      <el-collapse v-model="collapse">
        <el-collapse-item name="1"
                          title="基本属性">
          <el-form-item label="类型"
                        v-if="data.type && !data.component">
            <el-select v-model="data.type"
                       style="width:100%;"
                       placeholder="请选择类型"
                       @change="handleChangeType">
              <el-option-group v-for="group in fields"
                               :key="group.title"
                               :label="group.title">
                <el-option v-for="item in group.list"
                           :key="item.type"
                           :label="item.label"
                           :value="item.type">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="运行时标题">
            <el-switch
              v-model="data.show_title"
              active-text="显示"
              inactive-text="不显示">
            </el-switch>
          </el-form-item>   
          <el-form-item label="标题内容">
            <el-input v-model="data.label"
                      clearable
                      placeholder="标题"></el-input>
          </el-form-item>        
          <el-form-item label="ID">
            <el-button @click="update_name" type="primary">{{data.gridName}}</el-button>
          </el-form-item>   
          <el-form-item label="表单栅格"
                        v-if="!data.subfield && !['group'].includes(data.type)">
            <el-input-number style="width:100%;"
                             v-model="data.span"
                             controls-position="right"
                             placeholder="表单栅格"
                             :min="4"
                             :max="24"></el-input-number>
          </el-form-item>
          <el-form-item label="高度"
                        v-if="!data.subfield && !['group'].includes(data.type)">
            <el-input style="width:100%;"
                             v-model="data.height"
                             controls-position="right"
                             placeholder="高度"
                             ></el-input>
          </el-form-item>

          <component :is="getComponent"  
                     :data="data"></component>
          
        </el-collapse-item>
        
      </el-collapse>
    </el-form> 
  </div>
</template>

<script>
import fields from './fieldsConfig.js'

const dateArr = [
  'year', 'month', 'week', 'date', 'datetime', 'time', 'daterange', 'timerange', 'datetimerange', 'dates'
]

export default {
  name: 'widget-config',
  props: ['data'],
  inject: ["context"],
  computed: {
    getComponent() {
      const prefix = 'config-'
      const { type, component } = this.data
      if ((!type || component) && ! ['html-text','ueditor','echart','dync-template','ele-grid','luckySheetProxy'].includes(type)
      && component!='dync-template'
      )
        return prefix + 'custom'
      let result = 'input'
      
      if ([,'ele-grid', 'echart'].includes(type)) result = 'echart'
      else if (['dync-template', 'html-text'].includes(component)) result = 'html-text'
      else if ("luckySheetProxy"==type)  result = 'report'
      else result = type

      return prefix + result
    }
  },
  data() {
    return {
      fields,
      collapse: "1"
    }
  },
  methods: {
      has_name(name){
        if(this.context.allElementSet.has(name)){
          this.$alert("名字不能重复");
          return true;
        }
        if(this.context.report.dataSets.dataSet.filter(x=>x._name==name).length>0){
          this.$alert("名字不能和数据集名称重复");
          return true;
        }
        return false
      },
      
      update_name(){
          let _this=this
          this.$prompt('请输入组件ID', 'ID', 
          {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern:/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]*$/,
              inputValue:this.data.gridName
          })
          .then( ({ value }) => {
              if(_this.data.gridName==value)
                  return
              if(_this.has_name(value))
                  return
              _this.context.allElementSet.delete(_this.data.gridName)
              _this.data.gridName=value
          }).catch(error=>error) 
      },
    async handleChangeType(type) {
      if (type) {
        const config = await this.getConfigByType(type);
        config.prop = this.data.prop;
        for (let key in config) {
          if (config && Object.prototype.hasOwnProperty.call(config, key) && !['icon', 'label', 'span'].includes(key)) {
            const val = config[key]
            this.$set(this.data, key, val);
          }
        }
      }
    },
    getConfigByType(type) {
      return new Promise((resolve, reject) => {
        fields.forEach(field => {
          field.list.forEach(config => {
            if (config.type == type) resolve(config)
          })
        })
        reject()
      })
    }
  }
}
</script>
<style scoped>
.el-form-item--mini.el-form-item{margin-bottom: 8px;}
</style>