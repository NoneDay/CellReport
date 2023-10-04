<template>
<div class='build'>
  <imglist ref="imglist" @change="handleSetimg"></imglist>
  <el-tabs type="border-card"  v-model="tab_val" >    
  <el-tab-pane v-if="data.type && !data.type.startsWith('layout')" label="配置" name="0">
  <div class="widget-config" style="height:100%;overflow-y:auto;overflow-x:hidden;font-size:11px">
    <el-form v-if="this.data && Object.keys(this.data).length > 0"
            label-suffix="："
             labelPosition="left"
             labelWidth="100px"
             size="mini">
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
          
          <el-form-item label="显示标题">
            <el-switch
              v-model="data.show_title"
              active-text="显示"
              inactive-text="不显示">
            </el-switch>
          </el-form-item>   
          <el-form-item label="标题内容">
            <div style="display:flex;">
             <img :src="data.icon" style="width: 20px;height: 20px;vertical-align:middle;" @click="update_img_src"/>
              <el-input v-model="data.label"
                      clearable
                      placeholder="标题"></el-input>
            </div>
          </el-form-item>  
              
          <el-form-item label="标识ID">
            <el-button @click="update_name" type="primary">{{data.gridName}}</el-button>
          </el-form-item>   
          <el-form-item label="缺省高度"  >
            <avue-input style="width:100%;"
                             v-model="data.style.height"
                             controls-position="right"
                             placeholder="高度"
                             ></avue-input>
          </el-form-item>
          <el-form-item label="缺省宽度" >
            <avue-input style="width:100%;" 
                             v-model="data.style.width"
                             controls-position="right"
                             placeholder="宽度"
                             ></avue-input>
          </el-form-item>
          <el-form-item label="容器内序号"  v-if="data['idx']!=undefined">
            <avue-input-number style="width:100%;" 
                             v-model="data['idx']"
                             controls-position="right"
                             placeholder="序号"
                             ></avue-input-number>
          </el-form-item>
          <el-form-item label="必要时动态收缩"  v-if="data['flex-shrink']!=undefined">
            <avue-input-number style="width:100%;" 
                             v-model="data['flex-shrink']"
                             controls-position="right"
                             placeholder="宽度"
                             ></avue-input-number>
          </el-form-item>
          <el-form-item label="必要时动态扩大"  v-if="data['flex-grow']!=undefined" >
            <avue-input-number style="width:100%;"
                             v-model="data['flex-grow']"
                             controls-position="right"
                             placeholder="宽度"
                             ></avue-input-number>
          </el-form-item>
          <el-form-item label="对齐方式"  v-if="data['align-self']!=undefined" >
          <avue-select v-model="data['align-self']"
                       :dic="[
                       { label: '拉伸以适合容器', value: 'stretch' }, 
                       { label: '顶', value: 'flex-start' },
                       { label: '底', value: 'flex-end' },
                       { label: '居中', value: 'center' },
                       { label: '基线对齐', value: 'baseline' },
                       ]">
          </avue-select>                             
          </el-form-item>
          
          <component :is="getComponent"    :data="data"></component>
          <config-text  :data="data" v-if="data.type=='text'"/>
          <template  v-if="VisualDesign&& VisualDesign.content.trim()!=''">
            <el-form-item label="在线文档" v-if="!validatenull(VisualDesign.helpurl)">
              <a  v-for="one in VisualDesign.helpurl||[]" :key="one" :href="one" target="_blank">点击查看</a>
            </el-form-item>
          <dyncTemplate :parentCompent="parentCompent" 
            :self="{type:'pc_form',content:VisualDesign.content,gridName:'pc_form'}" 
            >
            </dyncTemplate>
            </template>
            <template  v-if="data.children?.column">
            <div><el-button type="primary" @click="showAddwidget">添加子组件</el-button> 顺序调整：</div>
  
            <div style="height:200px;overflow:auto;border: 1px solid;" >
                  <draggable tag="ul" :list="data.children.column" :group="{ name: 'dic' }" ghost-class="ghost" handle=".drag-item"
                  style="padding-left: 5px;">
                      <li v-for="(item, idx ) in data.children.column" :key="idx" style="display: flex;padding: 5px;">
                          <i class="drag-item el-icon-s-operation" style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                          <div  style="display: inline-block;width:calc(100% - 50px)">
                          {{ item.label }}
                          </div>
                          <el-button circle plain @click="deleteItem(item,idx)" type="danger" size="mini" icon="el-icon-minus"
                          style="padding: 4px;float:right"></el-button>    
                      </li>
                  </draggable>
            </div>  
            <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" :action_target="ref_item">
            </widgetDialog>
          </template>
    </el-form>     
  </div>
  </el-tab-pane>
  <el-tab-pane v-if="layout_config && layout_config.type.startsWith('layout')" label="背景" name="1"> 
    <el-form label-suffix="："
             labelPosition="left"
             labelWidth="100px"
             size="mini">
        <template  v-if="layout_config.type=='layout'">
          <el-form-item label="作为大屏">
            <el-switch  v-model="layout_config.config['big_screen']" active-value='1' inactive-value='0'
             active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
          </el-form-item>   
          <el-form-item label="屏幕宽度" >
            <el-input-number v-model="layout_config.config['screen_width']"></el-input-number>
          </el-form-item>
             
          <el-form-item label="屏幕高度">
            <el-input-number v-model="layout_config.config['screen_height']"></el-input-number>
          </el-form-item>
        </template>
       
            <el-form-item label="背景颜色">
              <avue-input-color v-model="layout_config.config['BACKGROUND-COLOR']"></avue-input-color>
            </el-form-item>
            <el-form-item label="开启旋转">
              <el-switch  v-model="layout_config.config['is_rotate']"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="旋转方向" v-if="layout_config.config['is_rotate']">
              <el-switch  v-model="layout_config.config['rotate_direction']"  active-value="rotation" inactive-value="rotation2"></el-switch>
            </el-form-item>
            <el-form-item label="旋转时间" v-if="layout_config.config['is_rotate']">
              <el-input-number v-model="layout_config.config['rotate_second']" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
            </el-form-item>
            
            <el-form-item label="背景图片">
              <img :src="layout_config.config.backgroundImage==''?'img/bg/bg.png' 
              :layout_config.config.backgroundImage"
                    @click="handleOpenImg('layout_config.config.backgroundImage','background')"
                    alt=""
                    width="100%" />
              <el-input v-model="layout_config.config.backgroundImage">
                <div @click="handleOpenImg('layout_config.config.backgroundImage')" slot="append">
                  <i class="iconfont icon-img">xx</i>
                </div>
              </el-input>
              <i class="el-icon-delete" style="cursor: pointer" 
                  v-if="layout_config.config['backgroundImage'] !== 'static/background/bg.png'" 
                  title="移除背景" 
                  @click="layout_config.config['backgroundImage'] = 'static/background/bg.png'">
              </i>
            </el-form-item>
            <el-form-item label="z-index">
                <avue-input-number placeholder="z-index" v-model="layout_config.config.z_index"></avue-input-number>
              </el-form-item>
            <el-form-item label="边框样式">
              <el-select v-model="layout_config.config.border_box" placeholder="请选择边框样式">
                  <el-option :label="无边框" value=""></el-option>
                  <el-option :label="'dv-border-box-'+i" :key="i" v-for="i in 13" :value="'dv-border-box-'+i"></el-option>
              </el-select>
          </el-form-item>
          <template v-if="layout_config.config.border_box!='div'">
            <el-form-item label="内容与边框间隔">
                <avue-input-number placeholder="间隔" v-model="layout_config.config.border_option.gap">
                </avue-input-number>
              </el-form-item> 
            <!-- 颜色设置 -->
              <el-form-item label="边框主颜色">
                <avue-input-color placeholder="请选择颜色" v-model="layout_config.config.border_option.color[0]">
                </avue-input-color>
              </el-form-item>
              <el-form-item label="边框副颜色">
                <avue-input-color placeholder="请选择颜色" v-model="layout_config.config.border_option.color[1]"></avue-input-color>
              </el-form-item>

              <el-form-item label="翻转"  v-if="['dv-border-box-4','dv-border-box-5','dv-border-box-8',].includes(layout_config.config.border_box)">
                <avue-switch v-model="layout_config.config.border_option.reverse"></avue-switch>
              </el-form-item>
              <el-form-item label="动画时长(秒)" v-if="layout_config.config.border_box === 'dv-border-box-8'">
                <avue-input-number v-model="layout_config.config.border_option.dur"></avue-input-number>
              </el-form-item>
              <!-- 提示语设置  -->
              <template v-if="layout_config.config.border_box === 'dv-border-box-11'">
                <el-form-item label="边框标题">
                  <avue-input v-model="layout_config.config.border_option.title"></avue-input>
                </el-form-item>
                <el-form-item label="标题宽度">
                  <avue-input-number v-model="layout_config.config.border_option.titleWidth"></avue-input-number>
                </el-form-item>
              </template>       
            </template>  
          <el-collapse>
        </el-collapse>
        <template v-if="layout_config.layout_item && context.report.defaultsetting.big_screen=='1'">
          
          <el-form-item label="横向位置">
            <el-input-number v-model="layout_config.layout_item.x" :min="0" :max="5000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="竖向位置">
            <el-input-number v-model="layout_config.layout_item.y" :min="0" :max="5000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="宽度">
            <el-input-number v-model="layout_config.layout_item.w" :min="0" :max="5000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number v-model="layout_config.layout_item.h" :min="0" :max="5000" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="固定位置和大小">
            <el-switch v-model="layout_config.layout_item.static" label="描述文字"></el-switch>
          </el-form-item>          
        </template>
    </el-form> 
    <el-button size="small"  v-if="layout_config.layout_item"
                 type="primary"
                 @click.native.prevent="editStyle"
                 class="login-submit">编辑组件Style</el-button>
  </el-tab-pane>
  <el-tab-pane v-if="getComponent=='config-echart' || getComponent=='config-report'"  label="事件" name="2">
    <el-form label-suffix="："
             labelPosition="left"
             labelWidth="100px"
             size="mini">
    <crSetFresh  :data="data"> </crSetFresh>
    <el-button size="small"  v-if="layout_config.layout_item"
                 type="primary"
                 @click.native.prevent="editClick"
                 class="login-submit">编辑组件Click事件</el-button>
    </el-form> 
  </el-tab-pane>
  <el-tab-pane v-if="getComponent=='config-echart'" label="echart" name="3">
    <el-form label-suffix="："
             labelPosition="left"
             labelWidth="100px"
             size="mini">
    <echart-main :data="data"> </echart-main>
    </el-form> 
  </el-tab-pane>
  
  <!--
  <el-tab-pane label="角色管理">角色管理</el-tab-pane> -->
</el-tabs>
</div>
</template>

<script>
import fields from './fieldsConfig.js'
import imglist from './config/imglist.vue'
import crSetFresh from "./config/cr_set_fresh.vue";
import echartMain from "./config/echarts/main.vue"; 
import {showDialog2,getObjType} from "./utils/util"
export default {
  name: 'widget-config',
  props: ['data','layout_config'],
  inject: ["context"],
  components:{imglist, crSetFresh ,echartMain,},
  mounted(){
    
    
  },
  computed: {
    ref_item(){
        return this
    },
    parentCompent(){return this},
    VisualDesign(){
      //if(this.data.component=="echarts")
      //  return
      this.edit_item=this.data
      let arr=(window.cr_allWidget.admin_json.visual_design_arr||[]).concat(window.cr_allWidget.self_json.visual_design_arr||[])
      let ret= Enumerable.from(arr).firstOrDefault(x=>x.type==this.data.type)
      return ret
    },
    getComponent() {
      this.tab_val=!this.data.type.startsWith('layout')?'0':'1'
      if(this.layout_config && this.layout_config.config.border_option==undefined)
        this.$set(this.layout_config.config,'border_option',{color:["#83bff6","#00CED1"]})
      const prefix = 'config-'
      const { type, component } = this.data
      if(this.data.type.startsWith("flex_span"))
        return prefix + 'cr-span'
      if(this.data.type=="tabs" || this.data.type=="carousel"|| this.data.type=="Collapse")
        return prefix + 'cr-tab'
      //if ((!type || component) && ! ['text','html-text','ueditor','echart','scroll-ranking-board','scroll-board','dv_scroll_ranking_board',
      //'dync-template','ele-grid','luckySheetProxy','bar','line','pie','radar',
      //'gauge','scatter','funnel','map','airBubbleMap'].includes(type)
      //&& component!='dync-template' && component!="echarts" 
      //)
      //  return prefix + 'custom'
      let result = 'input'
      
      if (component=="echarts" || ['dv_scroll_ranking_board','锥形柱图','胶囊柱图','dv_scroll_board', 'ele-grid',
      'echart','bar','line','pie','radar','gauge','scatter','funnel','map','airBubbleMap'].includes(type)) 
      result = 'echart'
      else if (['dync-template', 'html-text'].includes(component)) result = 'html-text'
      else if ("luckySheetProxy"==type)  result = 'report'
      else result = type

      return prefix + result
    }
  },
  watch:{
    //data(){
    //  if(this.data.style==undefined)
    //    this.data.style={}
    //  if(this.data.style.height==undefined){
    //    this.data.style.height="100%"
    //  }
    //  if(this.data.style.height==undefined){
    //    this.data.style.height="100%"
    //  }
    //}
  },
  data() {
    return {
      widget_dialogVisible:false,
      fields,
      collapse: "1",
      edit_item:{},
      tab_val:"0",
      templateGuide:`以等号开始的是公式，如：=cur_ds?cur_ds[1][4]:14<br/>
      cur_ds是指定的依赖数据集的数据，为一个二维数组，第一行是列名，第二行开始是数据。计数是从0开始。
      <br/>也就是说cur_ds[1]就是数据集的第一行数据
      <br/>非等号开始为普通字符串
      <br/>如果这里不能满足复杂需要，可以直接点击上面的编辑模板进行编辑`,
    }
  },
  methods: {
    showAddwidget(){
                this.widget_dialogVisible=true
        },
        addItem(item){
                this.data.children.column.push(JSON.parse(JSON.stringify(item)))
        },
        deleteItem(item,idx){
          let _this=this
          this.$confirm('此操作将永久删除该组件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              _this.data.children.column.splice(idx,1);
            })
                
        },
    editStyle(){
      let  target_tihs=this
      let slot={footer:`<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="json_submit">确定</el-button>
  </span>`};
      let methods={
        json_submit() {
          try {
            let obj=JSON.parse(this.dync_item.optionData)
            if(getObjType(obj)=="object"){
              target_tihs.data.style = obj;
              this.close();
            }
            else
            this.$alert("不是JSON对象形式");
          } catch (ex) {
            this.$alert("JSON不合法",ex);
            return;
          }          
        }
      }
      showDialog2(`<MonacoEditor   theme="vs" v-model="dync_item.optionData"
              language="json"  style="height:100%;border:solid 1px silver;margin-bottom:5px;"
              :options="{}"  >
        </MonacoEditor>`,{optionData:JSON.stringify( this.data.style||{},null,4),methods,slot },this)
    },
    editClick(){
      let  target_tihs=this
      let slot={footer:`<span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="json_submit">确定</el-button>
  </span>`};
      let methods={
        json_submit() {
              target_tihs.data.click = this.dync_item.optionData;
              this.close();
        }
      }
      showDialog2(`<div style="">function(p_data,p_this)//p_data：点击行后传过来的数据，p_this：调用该函数的对象</div>
        <MonacoEditor   theme="vs" v-model="dync_item.optionData"
              language="json"  style="height:100%;border:solid 1px silver;margin-bottom:5px;"
              :options="{}"  >
        </MonacoEditor>`,{optionData:this.data.click||"",methods,slot },this)
    },
    clickGuide(one){
      window.open(one,'_blank')
    },
     //打开图库
    handleOpenImg (item, type) {
      if(this.layout_config.type=='layout')
        this.$refs.imglist.openImg(item, 'background');
      else
        this.$refs.imglist.openImg(item, 'border');
    },
    //图库框回调赋值
    handleSetimg (val, type) {
      eval("this."+type+"='" +val+"'")
      //this.layout_config.config['backgroundImage'] = val;
    },
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
      update_img_src(){
          let _this=this
          this.$prompt('请输入图片地址', '图片地址', 
          {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputValue:this.data.icon
          })
          .then( ({ value }) => {
              _this.$set(_this.data,'icon',value)              
          }).catch(error=>error) 
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
<style >

.el-form-item--mini.el-form-item{margin-bottom: 2px;}
.el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
    line-height: 18px;font-size: 11px;
}
.el-button--mini, .el-button--small {
    font-size: 11px;
}
.el-switch__label * {
    line-height: 1;
    font-size: 11px;
    display: inline-block;
}
.guide{background-color: yellow;}
</style>