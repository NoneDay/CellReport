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
    <el-tab-pane label='css缺省值'>
        <el-form labelPosition="left" label-suffix="："
             labelWidth="100px">
            <el-form-item label="字体">
                <el-input  v-model="tmp_css['FONT']"></el-input>
            </el-form-item>
            <el-form-item label="字体大小">
                <el-input  v-model="tmp_css['FONT-SIZE']"></el-input>
            </el-form-item>
            <el-form-item label="文字颜色">
                <el-color-picker size="medium"  v-model="tmp_css['COLOR']"></el-color-picker>
            </el-form-item>
            <el-form-item label="文字背景色">
                <el-color-picker size="medium"  v-model="tmp_css['BACKGROUND-COLOR']"></el-color-picker>
            </el-form-item>
        
        </el-form>
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
    props: [ "visible","action_target"],
    inject: ["context"],
    mounted(){
        this.dialogVisible=true
        this.temp_props.forEach(one => {
            one.val=this.action_target[one.name]??""
        });
        this.tmp_css['BACKGROUND-COLOR']=this.action_target['BACKGROUND-COLOR']??'#FFF'
        this.tmp_css['COLOR']=this.action_target['COLOR']??'#000'
        this.tmp_css['FONT']=this.action_target['FONT']??'微软雅黑'
        this.tmp_css['FONT-SIZE']=this.action_target['FONT-SIZE']??'11'
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
            tmp_css:{'BACKGROUND-COLOR':'','COLOR':'','FONT-SIZE':'','FONT':'',},
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
        async handleSubmit(){
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
            this.action_target['BACKGROUND-COLOR']=this.tmp_css['BACKGROUND-COLOR']
            this.action_target['COLOR']=this.tmp_css['COLOR']
            this.action_target['FONT']=this.tmp_css['FONT']
            this.action_target['FONT-SIZE']=this.tmp_css['FONT-SIZE']
            this.$emit("submit");
            this.dialogVisible=false
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