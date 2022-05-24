<template>
   <el-dialog v-draggable v-if="dialogVisible" 
            style="text-align: left;" class=""
        :visible.sync="dialogVisible" title="模板编辑" 
            :close-on-click-modal="false"   :fullscreen="true"
              direction="btt" append-to-body
        > 
<el-tabs v-model="tab_value" v-if="data_ready" style="height:100%">
    <el-tab-pane :label="one.label" :name="one.name" v-for="one in temp_props" 
    :key="one.name"  style="height:100%">
        <!-- <edmitormd v-if="tab_value=='notebook' &&  one.name=='notebook' "  v-model="one.val"/> -->
        
        <codemirror v-if="tab_value==one.name  " ref="editor"
            style="height:100%"
            v-model="one.val" 
          :options="{tabSize: 4, mode: one.mode,
           styleActiveLine: true,lineWrapping: true,
            theme: 'cobalt',showCursorWhenSelecting: true, cursorBlinkRate:0 }" 
            @ready="editor_ready(one.name)"
         />
        
    </el-tab-pane>
    <el-tab-pane label='缺省值'>
        <el-form labelPosition="left" label-suffix="：" :label-position="'right'"
             labelWidth="100px">
            <el-row style="height: 60px;">
                <el-col :span="6">
            <el-form-item label="字体">
                <el-input  v-model="tmp_css['FONT']"></el-input>
            </el-form-item>
                </el-col>
                <el-col :span="6">
            <el-form-item label="字体大小">
                <el-input  v-model="tmp_css['FONT-SIZE']"></el-input>
            </el-form-item>
            </el-col>
                <el-col :span="6">
            <el-form-item label="文字颜色">
                <avue-input-color size="medium"  v-model="tmp_css['COLOR']"></avue-input-color>
            </el-form-item>
            </el-col>
                <el-col :span="6">
            <el-form-item label="背景色">
                <avue-input-color size="medium"  v-model="tmp_css['BACKGROUND-COLOR']"></avue-input-color>
            </el-form-item>
            </el-col>
             </el-row>
            <el-row style="height: 60px;">
                <el-col :span="12">
            <el-form-item label="显示form">
                <el-radio v-model="tmp_css['show_form']" label="true">显示form</el-radio>
                <el-radio v-model="tmp_css['show_form']" label="false">隐藏form</el-radio>
            </el-form-item>
            </el-col>
                </el-row>
            <el-row style="height: 60px;">
                <el-col >
            <el-form-item label="布局">
                <el-radio v-model="tmp_css['layout_mode']" label="">高度小于容器高度时自动撑满，大于时保持</el-radio>
                <el-radio v-model="tmp_css['layout_mode']" label="1">保持与设计时一样的高度</el-radio>
                <el-radio v-model="tmp_css['layout_mode']" label="2">强制适配到容器高度</el-radio>
            </el-form-item>
            </el-col>
            </el-row>
            <el-row style="height: 60px;">
                <el-col :span="6">
             <el-form-item label="布局中每行高度">
                <el-input  v-model="tmp_css['layout_row_height']"></el-input>
            </el-form-item>
            </el-col>
                <el-col :span="6">
             <el-form-item label="布局中列数"> 
                <el-input  v-model="tmp_css['layout_colNum']"></el-input>
            </el-form-item>
            </el-col>
                <el-col :span="6">
             <el-form-item label="布局中组件间隔">
                <el-input  v-model="tmp_css['layout_margin']"></el-input>
            </el-form-item>
            </el-col>
                <el-col :span="6">
            <el-form-item label="布局中页面大小">
                <el-input  v-model="tmp_css['layout_pan_height']"></el-input>
            </el-form-item>
            </el-col>
                </el-row>
            <el-row style="height: 60px;">
                <el-col  :span="6">
            <el-form-item label="row_col_gutter">
                <el-input  v-model="tmp_css['row_col_gutter']"></el-input>
            </el-form-item>
            </el-col>
                <el-col :span="6">
            <el-form-item label="边框样式">
                <el-select v-model="tmp_css['border_box']" placeholder="请选择边框样式">
                    <el-option :label="无边框" value="div"></el-option>
                    <el-option :label="'dv-border-Box-'+i" :key="i" v-for="i in 13" :value="'dv-border-Box-'+i"></el-option>
                </el-select>
            </el-form-item>
            </el-col>
                
            </el-row>
            
        </el-form>
        <el-button type="primary" @click="use_parent_css">使用继承设置</el-button>
    </el-tab-pane>
</el-tabs>
        <div slot="footer" class="dialog-footer">
            
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import  codemirror  from './element/vue-codemirror.vue'
import  edmitormd  from './element/edmitormd.vue'
import {test_expr} from "./api/report_api.js"
export default {
    name: "templateManger",
    components: {codemirror,edmitormd},
    props: [ "visible","action_target","parent_defaultsetting"],
    inject: ["context"],
    mounted(){
        this.dialogVisible=true
        this.temp_props.forEach(one => {
            one.val=this.action_target[one.name]??""
        });
        Object.keys(this.tmp_css).forEach(x=>{
            this.copy_prop(this.tmp_css,this.parent_defaultsetting,x)
            this.copy_prop(this.tmp_css,this.action_target,x)
        })
        let _this=this
        setTimeout(() => {
        _this.data_ready=true    
        }, );
        
    },
    data(){
        return {
            data_ready:false,
            //['notebook','before_exec_script','footer2','luckysheet_conditionformat',]
            tab_value:"notebook",
            tmp_css:{'BACKGROUND-COLOR':'#FFF','COLOR':'#000','FONT-SIZE':'11','FONT':'微软雅黑','layout_mode':'','border_box':'div',
            'show_form':'true',layout_row_height:"30",layout_colNum:24,layout_margin:"10",layout_pan_height:"100%",'row_col_gutter':'10'
            
            },
            temp_props:[
                {'name':'notebook','mode':"javascript",'label':'记事本','val':"11"},                
                {'name':'before_exec_script','mode':"javascript",'label':'后端运行前脚本','val':"11"},            
                {'name':'footer2','mode':"javascript",'label':'前端页面css和js脚本','val':"22"},
            ],
            action_name:"",
            dialogVisible:false,
        }
    },watch:{
        dialogVisible(val) {
            this.$emit('update:visible', val)
        },
        visible(val) {
            this.dialogVisible=val
            this.$emit('update:visible', val)
        },
    
    },
    methods:{
        copy_prop(target,source,prop){
            if(source[prop])
                target[prop]=source[prop]
        },
        async handleSubmit(){
            let _this=this
            let test_obj=this.temp_props.filter(x=>x.name=='before_exec_script')[0]
            if(test_obj.val.trim()!=""){
                let resp=await test_expr('{' + test_obj.val +' }')
                if(resp.errcode!=0)
                {
                    this.$message.error(resp.message)
                    return 
                }            
            }
            this.temp_props.forEach(one => {
                this.action_target[one.name]=one.val
            });
        
            if(this.context?.report){
                Object.keys(this.tmp_css).forEach(x=>{
                    this.copy_prop(this.context.report.defaultsetting,this.tmp_css,x)
                })               
            }
            Object.keys(this.tmp_css).forEach(x=>{
                console.info(this.parent_defaultsetting[x],this.tmp_css[x])
                if(this.parent_defaultsetting[x]==this.tmp_css[x])
                    delete this.action_target[x]
                else
                    this.copy_prop(this.action_target,this.tmp_css,x)
            })
            this.$emit("submit");
            this.dialogVisible=false
        },
        use_parent_css(){
            Object.keys(this.tmp_css).forEach(x=>{
                this.copy_prop(this.tmp_css,this.parent_defaultsetting,x)
            })
        
        },
        editor_ready(name){
            let _this=this
            setTimeout(() => {
                _this.$refs["editor"].forEach(x=>{
                    x.codemirror.setSize('100%','100%')     
                })
                
            } );
           
        }, 
    }
}
</script>

<style>

</style>