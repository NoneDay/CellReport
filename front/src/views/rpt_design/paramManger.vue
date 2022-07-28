<template>
    <div >
            <div style="height:200px;overflow:auto">
            <draggable tag="ul"
                            :list="report.params.param"
                            :group="{ name: 'dic' }"
                            ghost-class="ghost"
                            handle=".drag-item" style="padding-left: 5px;">
                    <li v-for="(item,idx ) in report.params.param" :key="idx" 
                        style="display: flex;padding: 5px;"
                        :style="{'background-color':action_target==item?'#c5f3e0':'#fff','cursor': 'pointer'}">
                    <i class="drag-item el-icon-s-operation"
                        style="font-size: 16px; margin: 0 5px; cursor: move;"></i>                        
                        <div @click="select_action_target(item)"  style="display: inline-block;width:calc(100% - 50px)">
                            {{item._name}} 
                        </div>
                        <el-button @click="param_delete(item,idx)"
                                circle
                                plain
                                type="danger"
                                size="mini"
                                icon="el-icon-minus"
                                style="padding: 4px;float:right"></el-button>
                        
                    </li>
            </draggable>
            </div>
        
        <el-row>
            <el-col  :offset="1" :span="6">
                <el-button type="primary"  @click="new_nameDialogShow">添加参数</el-button>
            </el-col>
            <el-col :span="6">
                <el-button type="primary"  @click="load_usedParam">装入使用的参数</el-button>
            </el-col>
            <el-col :offset="2" :span="6">
                
            </el-col>
        </el-row> 
        <el-divider></el-divider>
        <el-form :inline="true" class="demo-form-inline" v-if="action_target">
            <el-row><el-col :span="8">
            <el-button type="primary" @click="update_name">{{action_target._name}} </el-button> </el-col>
            <el-col :span="8"><el-form-item label="提示"><el-input v-model="action_target._prompt" placeholder="请输入名字："></el-input></el-form-item></el-col>
            <el-col :span="8">
                <el-form-item label="类型">
                    <el-select v-model="action_target._data_type" placeholder="类型">
                        <el-option label="字符串" value="string"></el-option>
                        <el-option label="日期" value="date"></el-option>
                        <el-option label="时间" value="dateTime"></el-option>
                        <el-option label="数字" value="number"></el-option>
                        <el-option label="日期范围" value="daterange"></el-option>
                        <el-option label="月范围" value="monthrange"></el-option>
                        <el-option label="时间范围" value="datetimerange"></el-option>
                        <el-option label="多个日期" value="dates"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row v-if="['dateTime','datetimerange'].includes(action_target._data_type)">
                <el-col :span="12">
                    <el-form-item  label="时间格式"><el-input  v-model="action_target._dateTimeFormat" placeholder="日期格式"></el-input></el-form-item>
                </el-col>
                <el-col :span="8"><span> 例：yyyy-MM-dd HH:mm</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="6"><el-form-item ><el-checkbox label="隐藏" true-label="True" border  false-label="False"  v-model="action_target._hide"></el-checkbox></el-form-item></el-col>
                <el-col :span="6"><el-form-item ><el-checkbox label="内部" true-label="True" border false-label="False" v-model="action_target._inner"></el-checkbox></el-form-item></el-col>
                <el-col :span="6"><el-form-item ><el-checkbox label="允许空白" true-label="True" border false-label="False" v-model="action_target._allowSpace" ></el-checkbox></el-form-item></el-col>
                <el-col :span="6" v-if="['string','number'].includes(action_target._data_type)"><el-form-item ><el-checkbox label="允许多选" true-label="True" border false-label="False" v-model="action_target._allowMutil" ></el-checkbox></el-form-item></el-col>                
            </el-row>
            
            <el-divider></el-divider>
            <div>
               缺省值：<el-input v-model="action_target._default_value" style="width:75%" 
                        placeholder="请输入名字："></el-input>
                <el-button @click="ExprEditorDialog_visible=true"
                            circle
                            type="success"
                            size="mini"
                            icon="el-icon-edit"
                            style="padding: 4px;margin-left: 5px"></el-button>
            </div>
            <el-divider></el-divider>
            <el-row v-if="action_target._hide=='False' && action_target._inner=='False' && ['string','number'].includes(action_target._data_type)"><el-col :span="24">
                <el-tabs v-model="action_target._canUsedValueFrom"
                        stretch
                        @tab-click="handleTabClick">
                    <el-tab-pane label="静态数据" name="noneQuery">
                        <div style="margin-left: 22px;">
                        <el-button type="text"
                                @click="handleAddFields">添加行
                        </el-button>
                    </div> 
                        <div style="height:200px;overflow:auto">
                            <draggable tag="ul" v-if='action_target.tagValue!=null'
                                        :list="action_target.tagValue"
                                        :group="{ name: 'dic' }"
                                        ghost-class="ghost" style="padding: 5px;"
                                        handle=".drag-item">
                                <li v-for="(item, index) in action_target.tagValue" :key="index" style="display: flex;">
                                    <i class="drag-item el-icon-s-operation"
                                        style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                                    <el-input style="margin-right: 5px;"
                                                size="mini"
                                                v-model="item._tag"
                                                placeholder="label"></el-input>
                                    <el-input size="mini"
                                                v-model="item._value"
                                                placeholder="value"></el-input>
                                    <el-button @click="handleRemoveFields(index)"
                                            circle
                                            plain
                                            type="danger"
                                            size="mini"
                                            icon="el-icon-minus"
                                            style="padding: 4px;margin-left: 5px;"></el-button>
                                </li>
                            </draggable>
                        
                    
                    </div>         
                    </el-tab-pane>

                    <el-tab-pane label="数据集" name="Query">
                         
                         <el-form-item label="来自" label-width="50px">
                         <el-select clearable  v-model="action_target._dataSetName_kyz">
                            <el-option v-for="(ds,idx) in report.dataSets.dataSet" :key="ds+idx"
                            :label="ds._name" :value="ds._name"></el-option>
                        </el-select>
                        </el-form-item>
                        <template v-if="action_target._dataSetName_kyz &&  report.dataSets.dataSet.find(x=>x._name==[action_target._dataSetName_kyz])._fields">
                            <el-form-item label="值" label-width="50px">
                            <el-select v-model="action_target._valueField_kyz" clearable>
                                <el-option v-for="(ds,idx) in JSON.parse(report.dataSets.dataSet.find(x=>x._name==[action_target._dataSetName_kyz])._fields)" 
                                    :key="ds+idx" :label="ds" :value="ds"></el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="显示" label-width="50px" clearable>
                            <el-select v-model="action_target._tagField_kyz" >
                                <el-option v-for="(ds,idx) in JSON.parse(report.dataSets.dataSet.find(x=>x._name==[action_target._dataSetName_kyz])._fields)" 
                                    :key="ds+idx" :label="ds" :value="ds"></el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="上级" label-width="50px">
                            <el-select v-model="action_target._parent_valueField_kyz" clearable >
                                <el-option v-for="(ds,idx) in JSON.parse(report.dataSets.dataSet.find(x=>x._name==[action_target._dataSetName_kyz])._fields)" 
                                    :key="ds+idx" :label="ds" :value="ds"></el-option>
                            </el-select>
                            </el-form-item>
                        </template>
                        
                    </el-tab-pane>
                </el-tabs>
                
                </el-col>
            </el-row>
        </el-form>
 
        <ExprEditorDialog  :visible.sync="ExprEditorDialog_visible" 
            :target_obj="action_target" 
            :prop="{display:'参数缺省值',val:'_default_value'}"
            :report="report">
        </ExprEditorDialog>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import {parseParam} from "./utils/util"
import ExprEditorDialog from './ExprEditorDialog.vue'
export default {
    components: {ExprEditorDialog,Draggable},
    name: "paramManger",
    props: {report:Object},
    data() {
        return {
            paramDialog_visible:false,
            action_target:null,
            action_name:"",
            new_nameDialogVisible:false,
            ExprEditorDialog_visible:false,
            new_name:'',

        }
    },
    computed:{
        dicOption:function() {
         return "static"   
        },
    },
    methods:{
        select_action_target(item){
            this.action_target=item
            if(!this.report.dataSets.dataSet.find(x=>x._name==[this.action_target._dataSetName_kyz])){
                this.action_target._dataSetName_kyz=''
            }
            if (item._canUsedValueFrom=="" && (item._defaultValueFrom=='noneQuery' || item._defaultValueFrom=='Query'))
                item._canUsedValueFrom=item._defaultValueFrom
        },
        has_name(name){
            if(this.report.params.param==undefined){
                this.report.params={param:[]}
            }
          let has=this.report.params.param.filter(x=>x._name==name).length 
          if(has>0|| name=="reportName"){
            this.$alert("名字不能重复");
            return true;
          }
          return false
        },
        update_name(){
            let _this=this
            this.$prompt('请输入参数名字', '名字', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]*$/,
                inputValue:this.action_target._name
            })
            .then( ({ value }) => {
                if(_this.action_target._name==value)
                    return
                if(_this.has_name(value))
                    return
                _this.action_target._name=value
            }).catch(error=>error) 
        },
        new_nameDialogShow(){
            let _this=this
            this.$prompt('请输入参数名字', '名字', 
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_0-9\u4e00-\u9fa5]*$/,
                inputValue:""
            })
            .then( ({ value }) => {
                if(_this.has_name(value))
                    return
                _this.action_target=_this.new_param(value)
                _this.report.params.param.push(_this.action_target )
            }).catch(error=>error)
        },
        new_param(new_name){
            return {_name:new_name,_prompt:new_name,_data_type:'string',_width:'',
                _lines:'',_value:'',_dateTimeFormat:'',_hide:'False',
                _allowNull:'False',_inner:'False',_allowSpace:'False',_allowMutil:'False',
                _canUsedValueFrom:'noneQuery',_dataSetName_kyz:'',_valueField_kyz:'',_parent_valueField_kyz:'',
                _tagField_kyz:'',_tagValueList:'',_defaultValueFrom:'',
                _dataSetName_default:'',_valueField_default:'',_default_value:''
            }
        },
        
        param_delete(item,idx){
            let len=this.report.params.param.length
            this.report.params.param.splice(idx, 1)
            if(len==1){
                this.action_target=null
            }
            else if(idx==len-1){
                this.action_target=this.report.params.param[len-2]
            }else{
                this.action_target=this.report.params.param[idx]
            }
        },

        load_usedParam(){
            if(this.report.params.param==undefined)
                this.report.params.param=[]
            this.report.dataSets.dataSet.forEach(one_ds => {
                parseParam(one_ds.__text).forEach(ele=>{
                    if(this.report.params.param.find(x=>x._name==ele)==null){
                        this.report.params.param.push(this.new_param(ele))
                    }
                })                
            });
        },
        close(){
            this.$emit('update:visible', false)      
        },
        handleTabClick(tabs){

        },
        handleRemoveFields(index) {
            this.action_target.tagValue.splice(index, 1)
        },
        handleAddFields() {
            const i = Math.ceil(Math.random() * 99999)
            if(this.action_target.tagValue==undefined)
                this.$set(this.action_target,'tagValue',[])      
            this.action_target.tagValue.push({ _tag: `字段${i}`, _value: `col_${i}` })
        },
    }
}
</script>

<style>

</style>