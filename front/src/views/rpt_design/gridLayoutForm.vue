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
                     :margin="[1, 1]"
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
              <div  style="height:100%" >
                    <widget-form-group class="widget-form-list" 
                        :self="item.element" 
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

                     <span v-if="context.mode=='design'" class="remove" @click="removeItem(item.i)">
                       x 
                       </span>
                </div>
            </grid-item>
        
        </grid-layout>
    </div>
    </draggable>
    <div v-else class="widget-form-container">
        <grid-layout :layout.sync="layout" ref="gridLayout"
                     :col-num="colNum" 
                     :row-height="row_height"
                     :margin="[0, 0]"
                     :is-draggable="context.canDraggable"
                     :is-resizable="context.canDraggable"
                     :vertical-compact="true"
                     :use-css-transforms="true"
                     style="height:100%;width:100%;"
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
              <div  style="height:100%" >
                    <widget-form-group class="widget-form-list" 
                        :self="item.element" 
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
                        v-else-if="isShow  "
                        :select.sync="selectWidget"  :depth="1"
                        >
                    </widget-form-item>

                     <span v-if="context.mode=='design'" class="remove" @click="removeItem(item.i)">
                       x 
                       </span>
                </div>
            </grid-item>
        
        </grid-layout>
    </div>
</template>

<script>
import {GridLayout, GridItem} from "vue-grid-layout"
import {widget_div_layout} from './fieldsConfig.js'
import { deepClone } from './utils/util.js';
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
            tmp_layout:[],
            isShow:false,
            draggable: true,
            resizable: true,
            row_height:30,
            colNum:24,
            newX:0,
            newY:0,
            
        }
    },
    mounted() {
        let _this=this
        this.isShow=false
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
            
            let pan_height=_this.$parent.$el.clientHeight-1-(this.context.crisMobile?1:1)* _this.$parent.$el.children[0].clientHeight
            
            _this.row_height=Math.max(30, parseInt(pan_height/(this.context.crisMobile?one_line_rows:max_rows))-1) 

        }
        
    },
    methods: { 
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
            this.layout.push({x,y,w,h,i: this.gridLayoutIndex,element:widget_div_layout(item) });
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
            const index = this.layout.map(item => item.i).indexOf(val);
            this.setDelateFlagForElement(this.layout[index].element)
            this.layout.splice(index, 1);
            this.selectWidget = {prop:'--'}
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
}
.vue-grid-layout {
    background: #eee;
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background: rgb(255, 254, 254);
    border: 1px solid black;
}
.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
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