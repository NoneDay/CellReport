<template>
    <div  v-if="true" @click.prevent="click_layout"
        class="widget-form-container gridLayout" ref='content' 
        :style="context.mode=='design'&&defaultsetting.big_screen=='1'?`position: relative;    width: 5000px;    height: 3000px;
    background: url(https://img.alicdn.com/tfs/TB184VLcPfguuRjSspkXXXchpXa-14-14.png) repeat;flex: 1;overflow: auto;`
    :'position: relative; width: 100%;height: 100%'"
>
        <grid-layout :layout.sync="layout" ref="gridLayout"  id="cr_gridLayout"
                     :col-num="colNum" 
                     :row-height="row_height"
                     :margin="[margin, margin]"
                     :is-draggable="context.canDraggable"
                     :is-resizable="context.canDraggable"
                     :vertical-compact="defaultsetting.big_screen!='1'"
                     :use-css-transforms="false"
                     :responsive="context.mode!='design' && context.crisMobile"
                     :force-absolute="defaultsetting.big_screen=='1'"
                     :style="{ 
                         width:defaultsetting.big_screen=='1'?defaultsetting.screen_width+'px':'100%',
                        height:defaultsetting.big_screen=='1'?defaultsetting.screen_height+'px':'100%',
                        transform:defaultsetting.big_screen=='1'?`scale(${(context.mode=='design'?big_screen_scale:big_screen_scale_x)/100},${(context.mode=='design'?big_screen_scale:big_screen_scale_y)/100})`:'scale(1)',
                        'transform-origin': '0 0',
                        'background': 'no-repeat url('+defaultsetting.backgroundImage+')  0% 0% / 100% 100% '+defaultsetting['BACKGROUND-COLOR']                        
                        ,'background-color':defaultsetting['BACKGROUND-COLOR'],
                        'color':defaultsetting['COLOR'],
                        'font-family':defaultsetting['FONT'],
                        'font-size':defaultsetting['FONT-SIZE']
                        }"
                     :transformScale="defaultsetting.big_screen=='1'?big_screen_scale/100:1"
                    @layout-ready="layoutReady"
        ><!--  -->
            <grid-item v-for="(item,groupIndex) in layout"
                       :static="item.static" :key="item.i"
                       :x="item.x"
                       :y="item.y"
                       :w="item.w"
                       :h="item.h" 
                       :i="item.i" @resized="resizedEvent" 
                       :style="{'z-index':item.bg?item.bg.z_index:0}"
                       :class="find_item(item)?'vue-grid-item-cur':''"
                       drag-ignore-from=".mover"  
            >
            <!-- drag-allow-from=".draggable-handle"  
                       
                       -->
            <component @mouseenter="mouseEnter_func(item)" @mouseleave="mouseOver_func(item)" 
             v-if="isShow && item.show" class="no-drag widget-form-list" :ref="'border_box'+item.i" :is="item.bg && item.bg.border_box?item.bg.border_box:'div'" 
             style="width:100%;height:100%"
             v-bind="Object.assign({}, (item.bg.border_box && item.bg.border_box!='div')?deepClone(item.bg.border_option):{} )"
             >
                <div :style="{ 'height':'100%','width':'100%',
                transform: item.bg.is_rotate?'rotate(360deg)':'',
                animation: item.bg.is_rotate?item.bg.rotate_second+'s linear 0s infinite normal none running '+(item.bg.rotate_direction||'rotation'):'',
                'background-repeat': 'no-repeat','background': 'url('+item.bg.backgroundImage+')  0% 0% / 100% 100% '+item.bg['BACKGROUND-COLOR']}"
                style="position:absolute;top:0px;left:0px;z-index:-1">
                </div>
                <widget-form-group 
                    :self="item.element" :border_size="calc_item_border_size(item)"
                    :parent="layout" :index="groupIndex" :ref="'item_'+item.i"
                    v-if="item.element.component=='widget-form-group'"
                    :select.sync="selectWidget"  :depth="1"
                    >
                </widget-form-group>
                <widget-form-tabs  :border_size="calc_item_border_size(item)"
                    :self="item.element" 
                    :parent="layout" :index="groupIndex" :ref="'item_'+item.i"
                    v-else-if="item.element.component=='widget-form-tabs'"
                    :select.sync="selectWidget"  :depth="1"
                    >
                </widget-form-tabs>
                <widget-form-item  :border_size="calc_item_border_size(item)"
                    :self="item.element"  
                    :parent="layout" :index="groupIndex" :ref="'item_'+item.i"
                    v-else  :depth="1"
                    :select.sync="selectWidget"                     
                    >
                </widget-form-item>

                
            </component>
                <div v-if="context.mode=='design' && (find_item(item) || mouseover_item==item)" style="z-index:-1;position: absolute;left: -1px;top: -1px; right:-1px;bottom:-1px;background-color: rgba(115,170,229,0.5);" >
                </div>                
                <div v-if="context.mode=='design' && find_item(item)" style="position: absolute;right: 2px;top: 0;display:flex;height:18px" >
                    <!-- <el-tooltip class="item" effect="dark" content="在本grid格子中添加新组件" placement="top-start">
                        <div  style=" cursor: pointer;color:black;background:#fff;"  @click.stop="call_widget_dialog(item)"><img src="img/add.png"></div> 
                        </el-tooltip>
-->
                    <el-tooltip class="item" effect="dark" content="克隆本格子" placement="top-start">
                        <div style="cursor: pointer;color:black;background:#fff;" @click.stop="cloneItem(item)"><img src="img/add.png"></div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除本格子" placement="top-start">
                        <div style="cursor: pointer;color:black;background:#fff;" @click.stop="removeItem(item.i)"><img src="img/delete.png"></div>
                    </el-tooltip>
                </div>
            </grid-item>
            <widgetDialog v-if="widget_dialogVisible" :visible.sync="widget_dialogVisible" :action_target="ref_item">
            </widgetDialog>            
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
    inject:["has_name"],
    components: {
        GridLayout,GridItem
    },
    props:['layout','big_screen_scale','big_screen_scale_x','big_screen_scale_y'],
    data() {
        return { 
            mouseover_item:null,
            scale:0.5,
            widget_dialogVisible:false,
            tmp_layout:[],
            isShow:false,
            showGridLayout:false,
            draggable: true,
            resizable: true,
            newX:0,
            newY:0,
            row_height:20,
            colNum:24,
            margin:10,
            pan_height:"100%",            
            call_item:-1,
        }
    },
    mounted() {
        let _this=this
        this.isShow=false
        this.showGridLayout=false
        if(_this.defaultsetting.height==undefined){
            _this.defaultsetting.screen_height=1080
            _this.defaultsetting.screen_width=1920
        }
        function defaultSetting(prop){
            if(_this.context.mode=='design')
                return _this.defaultsetting[prop]
            else
                return _this.defaultsetting[prop]
        }
        
        this.row_height=isNaN(parseInt(defaultSetting('layout_row_height')))?30:parseInt(defaultSetting('layout_row_height')) 
        this.colNum=isNaN(parseInt(defaultSetting('layout_colNum')))?24:parseInt(defaultSetting('layout_colNum')) 
        this.margin=isNaN(parseInt(defaultSetting('layout_margin')))?10:parseInt(defaultSetting('layout_margin')) 
        this.pan_height=defaultSetting('layout_pan_height')
        this.gridLayoutIndex = this.layout.length;
        let max_rows=0
        let one_line_rows=0
        this.layout.forEach(element => {
            this.$set(element,'show',true)
            if(element.bg==undefined){
                element.bg={backgroundImage:'','BACKGROUND-COLOR':'','border_box':'div',border_option:{color:["#83bff6","#00CED1"]}}
            }
        })
        if(this.defaultsetting.big_screen!='1' && this.context.mode!='design'){
            let idx=0
            let max_row_element=0
            this.layout.forEach(element => {
                element.i=idx
                idx=idx+1;
                if(max_rows < element.y+element.h){
                    max_rows = element.y+element.h
                    max_row_element=element
                }
                if(one_line_rows < element.h)
                    one_line_rows = element.h
            });
            //这时候当前组件还没高度，所以要间接计算。 没有-1 滚动条会闪烁 ，-1.5 倍是为了避免form 如果是多行，当前pane 会撑破页面
            let {x,y,w,h}={...max_row_element}
            _this.pan_height=_this.$parent.$el.clientHeight-1-
                (_this.$parent.$el.children.length==1?0:(this.context.crisMobile?1:1)* _this.$parent.$el.children[0].clientHeight)
            let last_top =Math.round(_this.row_height * y + (y + 1) * _this.margin)
            let last_height= h === Infinity ? h : Math.round(_this.row_height * h + Math.max(0, h - 1) * _this.margin)
            let layout_mode=this.context.report_result?.defaultsetting?.layout_mode
            if(layout_mode=="" && last_top+last_height < _this.pan_height)
            {
                _this.row_height=Math.round((_this.pan_height - Math.max(0, h - 1) * _this.margin - (y + 1) * _this.margin)/(y+h))
                console.info( _this.row_height)
            }
            if(layout_mode=="2")
            {
                _this.row_height=Math.round((_this.pan_height - Math.max(0, h - 1) * _this.margin - (y + 1) * _this.margin)/(y+h))
                console.info( _this.row_height)
            }
            //if(this.context.report_result?.defaultsetting?.layout_mode=='')//高度小于容器高度时自动撑满，大于时保持
            //    _this.row_height=Math.max(
            //        isNaN(parseInt(defaultSetting('layout_row_height')))?30:parseInt(defaultSetting('layout_row_height')) 
            //        ,parseInt(_this.pan_height/(this.context.crisMobile?one_line_rows:max_rows))) -_this.margin            
            //if(_this.row_height<10)
            //    _this.row_height=isNaN(parseInt(defaultSetting('layout_row_height')))?30:parseInt(defaultSetting('layout_row_height'))
            setTimeout(() => {
                _this.showGridLayout=true
            });
        }
        this.reset_css()
    },
    watch: { 
        "context.selectWidget":{
            handler(val,oldVal){
                  console.info(val)
            },deep:false
        }, 
        "context.report.defaultsetting":{
            handler(val,oldVal){
                if(!this.context.report.template)
                    this.context.report.template={}
                Object.assign(this.context.report.template,val)
                this.reset_css()
        },deep:true
        }
    },
    computed:{
        ref_item(){
            return this.$refs["item_"+this.call_item][0]
        }
    },
    methods: { 
        mouseEnter_func(item){
            this.mouseover_item=item
        },
        mouseOver_func(item){
            this.mouseover_item=null
        },
        reset_css(){
            let _this=this
                load_css_js(`<style>
                    .remove {
                        color:${_this.defaultsetting['COLOR']};
                    }
                    .setting {
                        color:${_this.defaultsetting['COLOR']};
                    }
                    .vue-grid-layout {
                        background-color: transparent;
                    }
                    .vue-grid-item:not(.vue-grid-placeholder) {
                        background-color: transparent;
                        color: ${_this.defaultsetting['COLOR']};
                    }
                    .vue-grid-item-cur>.vue-resizable-handle{
background:url("data:image/svg+xml;utf8,<svg t='1641536477492' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='6325' width='16' height='16'><path d='M903.68 949.76H92.16c-26.624 0-48.64-22.016-48.64-48.64s22.016-48.64 48.64-48.64h762.88v-762.88c0-26.624 22.016-48.64 48.64-48.64s48.64 22.016 48.64 48.64V901.12c0 26.624-22.016 48.64-48.64 48.64z' p-id='6326' fill='${_this.defaultsetting['COLOR'].replace('#','%23')}'></path></svg>") no-repeat;
}
                    </style>
                    `,"layout_css_run")
            
        },
        
        find_item(item){
            if(this.context.mode!='design' || this.selectWidget.type=='layout')
                return false;
            if(this.selectWidget.type=='layout_item' && item.i==this.selectWidget.item_i)
            {
                return true;
            }
            if(item==this.selectWidget || item.element==this.selectWidget)
            {
                return true;
            }
            let children=item.element?.children?.column || item.children?.column
            if(children)
            {
                for(let one in children){
                    let in_child=this.find_item(children[one])
                    if(in_child)
                    {
                        return true;
                    }
                }
            }        
            return false;
        },
        call_widget_dialog(item){
            this.call_item=item.i
            this.widget_dialogVisible=true
        },
        calc_item_border_size(item){
            let border_type=item.bg.border_box||item.border_box
            if(border_type ==undefined || ['','div'].includes(border_type) )
                return 0;
            else {
                return {'dv-border-box-13':40}[border_type]??20;
            }
        },
        handleWidgetGroupAdd (evt) {
            let newIndex = evt.newIndex;
            const item = evt.item;
            const data = this.deepClone( this.tmp_layout[0] )
            this.tmp_layout.splice(0,1)
            this.layout = this.layout.filter(obj => obj.i !== 'drop');
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
        layoutReady:function(newLayout){
            this.isShow=true
        },
        layoutUpdatedEvent: function(newLayout){
         
        },
         resizedEvent: function(i, newH, newW, newHPx, newWPx){
            //this.$refs['border_box'+i].initWH(newHPx, newWPx)
            let _this=this
            this.layout.forEach(element => {
                if(element.i==i && JSON.stringify( element.element).indexOf("luckySheetProxy")<0){
                    _this.$set(element,'show',false)
                    setTimeout(() => {
                        _this.$set(element,'show',true)
                    } );
                }
            })
            //console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
        },
        addItem: function (item) {
            // Add a new item. It must have a unique key!
            let x=0,w=item.span??6,   h=item.h??10,y=0   
            w=this.defaultsetting.layout_colNum/24*w
            h=20/this.defaultsetting.layout_row_height*h
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
            if(this.defaultsetting.big_screen=='1')
                x=y=0;
            while(Enumerable.from(this.layout).where(x=>x.i==this.gridLayoutIndex).toArray().length>0){
                this.gridLayoutIndex++
            }
            this.mouseover_item={x,y,w,h,i: this.gridLayoutIndex,element:(item) //widget_div_layout
                        ,show:true,border_box:this.defaultsetting.border_box ,
                            bg:{backgroundImage:'','BACKGROUND-COLOR':'',border_box:'div'}
                        }
            this.layout.push(this.mouseover_item);
            this.gridLayoutIndex++;
            this.selectWidget=item
        },
        setDelateFlagForElement(ele){
            ele.isDelete=true
            if(ele.children?.column){
                ele.children.column.forEach(one=>{
                    this.setDelateFlagForElement(one)
                });
            }
        },
        cloneItem: function (item) {
            function deepSetName(one){
                let name_prefix=one.type
                if(name_prefix=="luckySheetProxy")
                    name_prefix="report"
                let gridName
                do{
                    gridName =name_prefix.replace(/-/, "_") +"_" + Math.ceil(Math.random() * 999);
                }while(_this.has_name(gridName));                
                one.gridName=gridName 
                _this.context.allElementSet?.add(gridName)

                if(one.children?.column){
                    one.children.column.forEach(x=>{
                        deepSetName(x)
                    })
                }
            }
            let _this=this
            let new_item=JSON.parse(JSON.stringify(item))
            deepSetName(new_item.element)
            this.mouseover_item=new_item
            while(Enumerable.from(this.layout).where(x=>x.i==this.gridLayoutIndex).toArray().length>0){
                this.gridLayoutIndex++
            }
            new_item.i=this.gridLayoutIndex            
            this.layout.push(new_item);
        },
        removeItem: function (val) {
            let _this=this
            this.$confirm('此操作将永久删除该组件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const index = this.layout.map(item => item.i).indexOf(val);
                this.setDelateFlagForElement(this.layout[index].element)
                this.layout.splice(index, 1);
                this.click_layout();
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
        click_layout(){
            this.mouseover_item=null;
            this.selectWidget={type:'layout',config:this.defaultsetting}
            if(this.selectWidget.config.border_option==undefined)
                this.$set(this.selectWidget.config,'border_option',{color:["#83bff6","#00CED1"]})
        }
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
.vue-grid-item>.vue-resizable-handle{
    background:"";
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

@-webkit-keyframes rotation{
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}
@-webkit-keyframes rotation2{
    from {-webkit-transform: rotate(360deg);}
    to {-webkit-transform: rotate(0deg);}
}
</style>