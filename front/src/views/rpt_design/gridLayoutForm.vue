<template>

<draggable  v-if="context.mode=='design'"
                  :list="tmp_layout" style="height:100%;width:100%"
                  :group="{ name: 'form' }"
                  ghost-class="ghost" 
                  :animation="200"
                  @end="onEnd" 
                  @drop="onEnd" 
                  @move="onEnd"
                  @add="handleWidgetGroupAdd($event)">

    <div  class="widget-form-container">
        <grid-layout :layout.sync="layout" ref="gridLayout"
                     :col-num="colNum" 
                     :row-height="row_height"
                     :margin="[margin, margin]"
                     :is-draggable="context.canDraggable"
                     :is-resizable="context.canDraggable"
                     :vertical-compact="true"
                     :use-css-transforms="true"
                     style="height:100%;width:100%"
                    @layout-ready="layoutUpdatedEvent"
        >
        

            <grid-item v-for="(item,groupIndex) in layout"
                       :static="item.static" :key="item.i"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
            >
            <component v-if="isShow" :is="item.border_box?item.border_box:'div'" style="width:100%;height:100%">
              
                    <widget-form-group class="widget-form-list" 
                        :self="item.element" :border_size="calc_item_border_size(item.border_box)"
                        :parent="layout" :index="groupIndex"
                        v-if="isShow && item.element.component=='widget-form-group'"
                        :select.sync="selectWidget"  :depth="1"
                        >
                    </widget-form-group>
                    <widget-form-tabs class="widget-form-list" 
                        :self="item.element" 
                        :parent="layout" :index="groupIndex"
                        v-else-if="isShow && item.element.component=='widget-form-tabs'"
                        :select.sync="selectWidget"  :depth="1"
                        >
                    </widget-form-tabs>
                    <widget-form-item class="widget-form-list" 
                        :self="item.element" 
                        :parent="layout" :index="groupIndex"
                        v-else-if="isShow  "  :depth="1"
                        :select.sync="selectWidget"
                        >
                    </widget-form-item>

                     <span class="remove" @click="removeItem(item.i)">
                       <i class="el-icon-delete"></i>
                       </span>
                       <span  class="setting" @click="settingItem(item.i)">
                       <i class="el-icon-setting"></i>
                       </span>
                
            </component>
            </grid-item>
        
        </grid-layout>
    </div>
        <el-dialog  v-draggable style="text-align: left;" v-if="dialogVisible"
            :visible.sync="dialogVisible" title="布局和当前条目设置" 
                :close-on-click-modal="false"  @close="close" 
                direction="btt" append-to-body  
            > 
            <el-container style="height: 500px; border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="活动名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="边框样式">
                            <el-select v-model="form.border_box" placeholder="请选择边框样式">
                                <el-option :label="无边框" value="div"></el-option>
                                <el-option :label="'dv-border-Box-'+i" :key="i" v-for="i in 13" :value="'dv-border-Box-'+i"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="背景色">
                            <el-color-picker v-model="backgroundColor"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="主色">
                            <el-color-picker v-model="color1"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="副色">
                            <el-color-picker v-model="color2"></el-color-picker>
                        </el-form-item>
                    </el-form>
                </el-aside>
                <el-container>
                    <el-header style="text-align: right; font-size: 12px">
                        演示
                    </el-header>
                    <el-main style=" height: 300px;   padding: 30px!important;;    overflow: hidden;    box-sizing: border-box;    background-color: #282c34;">
                        <component :is="form.border_box" >
                            {{ form.border_box }}
                        </component>
                        
                    </el-main>
                </el-container>
            </el-container>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSubmit(form.idx)">确 定</el-button>
            </span>
        </el-dialog>
    </draggable>
    <div v-else class="widget-form-container">
        <grid-layout :layout.sync="layout" ref="gridLayout"
                     :col-num="colNum" 
                     :row-height="row_height"
                     :margin="[margin, margin]"
                     :is-draggable="context.canDraggable"
                     :is-resizable="context.canDraggable"
                     :vertical-compact="true" v-if="showGridLayout"
                     :use-css-transforms="true"
                     :style="{'height':'100%','width':'100%'}"
                    @layout-ready="layoutUpdatedEvent"
        >
        

            <grid-item v-for="(item,groupIndex) in layout"
                       :static="item.static" :key="item.i"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h"
                       :i="item.i"
            >
               <component v-if="isShow" :is="item.border_box?item.border_box:'div'" style="width:100%;height:100%">
              
                  
                    <widget-form-group class="widget-form-list" 
                        :self="item.element" :border_size="calc_item_border_size(item.border_box)"
                        :parent="layout" :index="groupIndex"  :depth="1"
                        v-if="isShow && item.element.component=='widget-form-group'"
                        :select.sync="selectWidget"
                        >
                    </widget-form-group>
                    <widget-form-tabs class="widget-form-list" 
                        :self="item.element"  :depth="1"
                        :parent="layout" :index="groupIndex"
                        v-else-if="isShow && item.element.component=='widget-form-tabs'"
                        :select.sync="selectWidget"
                        >
                    </widget-form-tabs>
                    <widget-form-item class="widget-form-list" 
                        :self="item.element" 
                        :parent="layout" :index="groupIndex"
                        v-else-if="isShow"
                        :select.sync="selectWidget"  :depth="1"
                        >
                    </widget-form-item>
               </component>
            </grid-item>
        
        </grid-layout>
    </div>
</template>

<script>
import {GridLayout, GridItem} from "vue-grid-layout"
import {widget_div_layout} from './fieldsConfig.js'
import { deepClone,load_css_js } from './utils/util.js';
import mixins from "./element/mixins"
export default {
    name: "gridLayoutForm",
    mixins: [history,mixins],
    components: {
        GridLayout,GridItem,
    },
    props:['layout'],
    data() {
        return { 
            form: {
                idx:-1,
                name: '',
                border_box: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            tmp_layout:[],
            isShow:false,
            showGridLayout:false,
            draggable: true,
            resizable: true,
            row_height:30,
            colNum:24,
            newX:0,
            newY:0,
            margin:0,
            pan_height:"100%",
            dialogVisible:false,
        }
    },
    mounted() {
        let _this=this
        this.isShow=false
        this.showGridLayout=false
        // this.$gridlayout.load();
        this.gridLayoutIndex = this.layout.length;
        let max_rows=0
        let one_line_rows=0

        if(this.context.mode!='design'){
            let idx=0
            this.layout.forEach(element => {
                element.i=idx
                idx=idx+1;
                if(max_rows < element.y+element.h)
                    max_rows = element.y+element.h
                if(one_line_rows < element.h)
                    one_line_rows = element.h
            });
            //这时候当前组件还没高度，所以要间接计算。 没有-1 滚动条会闪烁 ，-1.5 倍是为了避免form 如果是多行，当前pane 会撑破页面
            
            _this.pan_height=_this.$parent.$el.clientHeight-1-(this.context.crisMobile?1:1)* _this.$parent.$el.children[0].clientHeight - 1 * _this.margin            
            _this.row_height=Math.max(30,parseInt(_this.pan_height/(this.context.crisMobile?one_line_rows:max_rows))) -_this.margin            
            setTimeout(() => {
                _this.showGridLayout=true
            });
            
            load_css_js(`<style>
            .remove {
        color:${_this.context.report.defaultsetting['COLOR']};
}
.setting {
    color:${_this.context.report.defaultsetting['COLOR']};
}
.vue-grid-layout {
    background-color: ${_this.context.report.defaultsetting['BACKGROUND-COLOR']};
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background-color: ${_this.context.report.defaultsetting['BACKGROUND-COLOR']};
    color: ${_this.context.report.defaultsetting['COLOR']};
    border: 0px solid ${_this.context.report.defaultsetting['COLOR']};
    
}
</style>
`,"layout_css")
        }else{
            load_css_js(`<style>
            .remove {
        color:${_this.context.report.defaultsetting['COLOR']};
}
.setting {
    color:${_this.context.report.defaultsetting['COLOR']};
}
.vue-grid-layout {
    background-color: ${_this.context.report.defaultsetting['BACKGROUND-COLOR']};
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background-color: ${_this.context.report.defaultsetting['BACKGROUND-COLOR']};
    color: ${_this.context.report.defaultsetting['COLOR']};
    border: 1px solid ${_this.context.report.defaultsetting['COLOR']};
    
}
</style>
`,"layout_css")
        }
        
    },
    methods: { 
        calc_item_border_size(border_type){
            console.info("border_type:"+border_type)
            if(border_type ==undefined || ['','div'].includes(border_type) )
                return 0;
            else {
                return 40;
            }
        },
        handleWidgetGroupAdd (evt) {
            let newIndex = evt.newIndex;
            const item = evt.item;
            const data = this.deepClone( this.tmp_layout[0] )
            this.tmp_layout.splice(0,1)
            this.addItem(data)
            if (!data.prop) data.prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
                if(data.hasOwnProperty("gridName") && data.gridName=="_random_"){
                    data.gridName=data.type.replace(/-/,"_") + Date.now() + '_' + Math.ceil(Math.random() * 99999)
                    this.context?.allElementSet?.add(data.gridName)
            }
            delete data.icon
            if (data.span == undefined) data.span = 12
            if (data.height == undefined) data.height = '100%'
            //this.selectWidget = data
            
        },
        layoutUpdatedEvent: function(newLayout){
            this.isShow=true
        },
        addItem: function (item) {
            // Add a new item. It must have a unique key!
            let x=0,w=item.span??6,   h=item.h??10,y=0             
            while(true){
                let all_correct=true
                this.layout.forEach(element => {
                    if( ((x>= element.x && x< element.x +element.w ) && (y>= element.y && y< element.y +element.h ) ) ||
                        ((element.y>= y && element.y< y +h ) && (element.x>= x && element.x< x +w ) )
                    ){
                        all_correct=false
                         return false
                    }
                });
                 if(all_correct)
                        break;
                x++
                if(x+w>this.colNum)
                {
                    x=0
                    y++
                }
            }
            let idx=0
            this.layout.forEach(element => {
                element.i=idx
                idx=idx+1;
            })
            this.layout.push({x,y,w,h,i: this.gridLayoutIndex,element:widget_div_layout(item),border_box:this.context.report.defaultsetting.border_box });
            // Increment the counter to ensure key is always unique.
            this.gridLayoutIndex++;
            let _this=this
            setTimeout(() => {
            //_this.$refs.gridLayout.layoutUpdate()
            _this.$refs.gridLayout.dragEvent('dragend', _this.gridLayoutIndex-1, x,y,h,w);
            } ,10);
            
            //this.$refs.gridLayout.layoutUpdatedEvent(this.layout);
        },
        setDelateFlagForElement(ele){
            ele.isDelete=true
            if(ele.children?.column){
                ele.children.column.forEach(one=>{
                    this.setDelateFlagForElement(one)
                });
            }
        },
        removeItem: function (val) {
            let _this=this
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const index = this.layout.map(item => item.i).indexOf(val);
                this.setDelateFlagForElement(this.layout[index].element)
                this.layout.splice(index, 1);
                this.selectWidget = {prop:'--'}
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });

        },
        settingItem: function (val) {
            
            const index = this.layout.map(item => item.i).indexOf(val);
            this.form.idx=index
            this.dialogVisible=true
        },
        dialogSubmit:function () {
            this.$set(this.layout[this.form.idx],'border_box',this.form.border_box)
            this.dialogVisible=false
        },
    }
}
</script>

<style>
.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}
.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}
/*************************************/
.remove {
    position: absolute;
    right: 2px;
    top: 0;
    cursor: pointer;
        color:black;
    font-size: 11px;
    font-weight: bold;
}
.setting {
    position: absolute;
    right: 20px;
    top: 0;
    cursor: pointer;
    color:black;
    font-size: 11px;
    font-weight: bold;
}
.vue-grid-layout {
    background-color: #282c34;
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background-color: #282c34;
    color: #303133;
    border: 1px solid #282c34;
    
}
.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
} 
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
.vue-grid-item .minMax {
    font-size: 12px;
}
.vue-grid-item .add {
    cursor: pointer;
}
.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}
</style>