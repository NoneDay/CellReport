<template>
    <el-dialog   style="text-align: left;"
    :visible.sync="visible" title="简单报表向导" 
        :close-on-click-modal="false"  @close="close" 
          direction="btt" append-to-body  fullscreen
    >
  <div style="height:100%;width:100%">
        <div style="height:50%;width:100%;display: flex;">
          <div style="width:33%;border: 1px dotted">
              <div class="cr_title">数据集</div>
                <el-row v-for="(ds,ds_idx) in context.report.dataSets.dataSet" :key="ds+ds_idx" :style="{'background-color':cur_ds==ds?'#c5f3e0':'#fff'}"> <!-- https://www.iconfont.cn -->
                <img v-if="ds._type=='csv'" class="cr_icon" src="img/CSV图标.svg"/>
                <img v-if="ds._type!='csv' && ds._type!='cr'" class="cr_icon" src="img/数据库.svg"/>
                <img v-if="ds._type=='cr'" class="cr_icon" src="img/引用.svg"/>
                <div @click="cur_ds=ds"  style="display: inline-block;width:calc(100% - 50px)">{{ds._name}} </div>
            </el-row> 
          </div>

       
        <div style="width:calc(23% + 35px);height:100%;border: 1px dotted">
            多数据集是否合并<br>
            <el-switch   v-model="col_union_chk"  active-text="合并到一个单元格"   inactive-text="竖排展开"></el-switch>
            <el-switch   v-model="row_union_chk"  active-text="合并到一个单元格"   inactive-text="并排展开"></el-switch>
        </div>

        <div style="width:35px;height:100%">
            <el-button type="primary" @click="del_col_grp"  icon="el-icon-arrow-left" circle></el-button><br>
            <el-button type="success" @click="add_col_grp" icon="el-icon-arrow-right" circle></el-button>
        </div>
        <div style="width:23%;height:100%;border: 1px dotted">
            <div class="cr_title">列分组</div>
            <div style="height:calc(100% - 30px);overflow: auto;">
                <draggable tag="ul" style="padding-left: 5px;"
                            :list="col_grp_fields"
                            :group="{ name: 'dic' }"
                            ghost-class="ghost"
                            handle=".drag-item">
                            
                    <li v-for="(item, index) in col_grp_fields" :key="index" 
                            style="display: flex;">
                    <i class="drag-item el-icon-s-operation"
                        style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                    <el-checkbox  style="display: inline-block;width:calc(100% - 60px);margin-right: 5px;"
                                size="mini"
                                v-model="item.selected" :label="item.key"
                                placeholder="label"></el-checkbox>
                    <el-popover style="float:right;"
                        placement="right"
                        trigger="click">
                        <el-button @click="item.op='select'">无</el-button>
                        <el-button @click="item.op='group'">group</el-button>
                        <el-button slot="reference" style="padding: 0px;">{{item.op?item.op:"选择"}}</el-button>
                    </el-popover>                            
                    </li>
                </draggable>  
            </div>
        </div>
        

      </div>
      <div style="height:50%;width:100%;display: flex;">
          <div style="width:33%;height:100%;border: 1px dotted">
              <div class="cr_title">数据集字段</div>
              <el-checkbox-group v-model="cur_ds_fields"  style="height:calc(100% - 30px)">
              <div style="height:100%;overflow: auto;">
                    <div v-for="one in JSON.parse( this.cur_ds._fields)" :key="one">
                        <el-checkbox :label="one"></el-checkbox>
                    </div>
                </div>
            </el-checkbox-group>
          </div>
          <div style="width:35px;height:100%">
<el-button type="primary" @click="del_row_grp"  icon="el-icon-arrow-left" circle></el-button><br>
  <el-button type="success" @click="add_row_grp" icon="el-icon-arrow-right" circle></el-button>
            </div>
            <div style="width:23%;height:100%;border: 1px dotted">
              <div class="cr_title">行分组</div>
              <div style="height:calc(100% - 30px);overflow: auto;">
                        <draggable tag="ul" style="padding-left: 5px;"
                                    :list="row_grp_fields"
                                    :group="{ name: 'dic' }"
                                    ghost-class="ghost"
                                    handle=".drag-item">
                                    
                            <li v-for="(item, index) in row_grp_fields" :key="index" 
                                 style="display: flex;">
                            <i class="drag-item el-icon-s-operation"
                                style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                            <el-checkbox  style="display: inline-block;width:calc(100% - 60px);margin-right: 5px;"
                                        size="mini"
                                        v-model="item.selected" :label="item.key"
                                        placeholder="label"></el-checkbox>
                            <el-popover style="float:right;"
                                placement="right"
                                trigger="click">
                                <el-button @click="item.op='select'">无</el-button>
                                <el-button @click="item.op='group'">group</el-button>
                                <el-button slot="reference" style="padding: 0px;">{{item.op?item.op:"选择"}}</el-button>
                            </el-popover>                            
                            </li>
                        </draggable>  
                    </div>
          </div>
           <div style="width:35px;height:100%">
<el-button type="primary"  @click="del_detail" icon="el-icon-arrow-left" circle></el-button><br>
<el-button type="primary" @click="del_all_detail" icon="el-icon-d-arrow-left" circle></el-button><br>
  <el-button type="success" @click="add_detail" icon="el-icon-arrow-right" circle></el-button><br>
  <el-button type="success"  @click="add_all_detail" icon="el-icon-d-arrow-right" circle></el-button>
            </div>
            <div style="width:23%;height:100%;border: 1px dotted">
              <div class="cr_title">明细</div> 
                    <div style="height:calc(100% - 30px);overflow: auto;">
                        <draggable tag="ul" style="padding-left: 5px;"
                                    :list="detail_fields"
                                    :group="{ name: 'dic' }"
                                    ghost-class="ghost"
                                    handle=".drag-item">
                                    
                            <li v-for="(item, index) in detail_fields" :key="index" 
                                 style="display: flex;">
                            <i class="drag-item el-icon-s-operation"
                                style="font-size: 16px; margin: 0 5px; cursor: move;"></i>
                            <el-checkbox  style="display: inline-block;width:calc(100% - 60px);margin-right: 5px;"
                                        size="mini"
                                        v-model="item.selected" :label="item.key"
                                        placeholder="label"></el-checkbox>
                            <el-popover style="float:right;"
                                placement="right"
                                trigger="click">
                                <el-button @click="item.op=''">无</el-button>
                                <el-button @click="item.op='sum'">sum</el-button>
                                <el-button slot="reference" style="padding: 0px;">{{item.op?item.op:"选择"}}</el-button>
                            </el-popover>                            
                            </li>
                        </draggable>  
                    </div>
          </div>
          
      </div>
  </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

export default {
    components: {},
    name:'simpleGuide',
    props: [ "visible","sheet_window"],
    inject: ["context"],
    created(){
        console.info("simple guid create")
    },
    data() {
        return {
            col_union_chk:false,
            row_union_chk:false,
            cur_ds:{_fields:"[]"},
            cur_ds_fields:[],
            detail_fields:[],
            row_grp_fields:[],
            col_grp_fields:[],
        }
    }, 
    watch: {
        cur_ds(){
            this.cur_ds_fields=[]
        },
        visible(val) {
            this.$emit('update:visible', val)
        },
    },
    methods: {
        add_col_grp(){
            this.cur_ds_fields.forEach(one => {
                if(this.col_grp_fields.filter(x=>x.key==this.cur_ds._name+"."+one).length==0)
                this.col_grp_fields.push({key:this.cur_ds._name+"."+one,ds:this.cur_ds._name,field:one, selected:false,op:""})    
            });
            this.cur_ds_fields=[]
        },
        del_col_grp(){
            JSON.parse(JSON.stringify(this.col_grp_fields)).filter(x=>x.selected).forEach(one=>{
                let idx=this.col_grp_fields.findIndex(x=>x.key==one.key)
                this.col_grp_fields.splice(idx,1)
            })
        },
        add_row_grp(){
            this.cur_ds_fields.forEach(one => {
                if(this.row_grp_fields.filter(x=>x.key==this.cur_ds._name+"."+one).length==0)
                this.row_grp_fields.push({key:this.cur_ds._name+"."+one,ds:this.cur_ds._name,field:one, selected:false,op:""})    
            });
            this.cur_ds_fields=[]
        },
        del_row_grp(){
            JSON.parse(JSON.stringify(this.row_grp_fields)).filter(x=>x.selected).forEach(one=>{
                let idx=this.row_grp_fields.findIndex(x=>x.key==one.key)
                this.row_grp_fields.splice(idx,1)
            })
        },
        add_all_detail(){
            JSON.parse( this.cur_ds._fields).forEach(one => {
                if(this.detail_fields.filter(x=>x.key==this.cur_ds._name+"."+one).length==0)
                    this.detail_fields.push({key:this.cur_ds._name+"."+one,ds:this.cur_ds._name,field:one, selected:false,op:""})    
            });
            this.cur_ds_fields=[]
        },
        add_detail(){
            this.cur_ds_fields.forEach(one => {
                if(this.detail_fields.filter(x=>x.key==this.cur_ds._name+"."+one).length==0)
                    this.detail_fields.push({key:this.cur_ds._name+"."+one,ds:this.cur_ds._name,field:one, selected:false,op:""})    
            });
            this.cur_ds_fields=[]
        },
        del_detail(){
            JSON.parse(JSON.stringify(this.detail_fields)).filter(x=>x.selected).forEach(one=>{
                let idx=this.detail_fields.findIndex(x=>x.key==one.key)
                this.detail_fields.splice(idx,1)
            })
        },
        del_all_detail(){
            this.detail_fields=[]
        },
        handleSubmit(){
            //行分组的个数
            let rowsGroupCount = this.row_grp_fields.length
            //列分组的个数
            let colsGroupCount = this.col_grp_fields.length;
            if (this.col_union_chk == true && colsGroupCount > 0)
                colsGroupCount = 1;
            if (this.row_union_chk == true && rowsGroupCount > 0)
                rowsGroupCount = 1;
            //当前行列的偏移量
            let col = 0, row = 0;
            
            let expr=''
            let luckysheet=this.sheet_window.luckysheet
            
            const {row_focus,column_focus}=luckysheet.getluckysheet_select_save()[0]    
            luckysheet.insertColumn(column_focus,{number:this.detail_fields.length})
            let data=luckysheet.getSheet(0).data
            if(this.col_union_chk) {
                expr=''
                this.col_grp_fields.forEach(one_col=>{
                    if (expr != "")
                        expr = expr + ",";
                    expr = `${one_col.ds}.group(${one_col.ds}["${one_col.field}"])`
                })
                if(expr!=''){
                    if(this.col_grp_fields.length>1)
                        expr = "=union_set(" + expr + ")"
                    else
                        expr = "=" + expr 
                    let mc={"r": row_focus+row, //主单元格的行号
                                "c": column_focus+ rowsGroupCount + col, //主单元格的列号
                                "rs": 1, //合并单元格占的行数
                                "cs": this.detail_fields.length //合并单元格占的列数
                                }
                    if(this.detail_fields.length>1)
                        mc==undefined
                    data[row_focus+row][column_focus+ rowsGroupCount + col ]
                        = {v:expr,m:expr,
                            mc:mc,
                            cr:{"_displayValueExpr":"=@value","_valueExpr":expr,"_extendDirection":"column"}}
                    if(mc!=undefined){
                        luckysheet.getSheet(0).config.merge[`${row_focus+row}_${column_focus+ rowsGroupCount + col}`]=mc                    
                        for(let idx=1;idx < this.detail_fields.length ;idx++ ){
                            data[row_focus+row][column_focus+ rowsGroupCount + col + idx ]={ mc:{ "r": row_focus+row,"c": column_focus+ rowsGroupCount + col} }
                        }
                    }
                    row++
                }
            }else{
                expr=''
                this.col_grp_fields.forEach(one_col=>{
                    expr = `=${one_col.ds}.group(${one_col.ds}["${one_col.field}"])`
                    let mc={"r": row_focus+row, //主单元格的行号
                                "c": column_focus+ rowsGroupCount + col, //主单元格的列号
                                "rs": 1, //合并单元格占的行数
                                "cs": this.detail_fields.length //合并单元格占的列数
                                }
                    if(this.detail_fields.length>1)
                        mc==undefined
                    data[row_focus+row][column_focus+ rowsGroupCount + col]
                        ={v:expr,m:expr,
                        mc:mc,
                        cr:{"_displayValueExpr":"=@value","_valueExpr":expr,"_extendDirection":"column"}}
                    if(mc!=undefined){
                        luckysheet.getSheet(0).config.merge[`${row_focus+row}_${column_focus+ rowsGroupCount + col}`]=mc                    
                        for(let idx=1;idx < this.detail_fields.length ;idx++ ){
                            data[row_focus+row][column_focus+ rowsGroupCount + col + idx ]={ mc:{ "r": row_focus+row,"c": column_focus+ rowsGroupCount + col} }
                        }
                    }    
                    row++
                })
                
            }
            col=0
            //行扩展
            if(this.row_union_chk) {
                expr=''
                this.row_grp_fields.forEach(one_col=>{
                    if (expr != "")
                        expr = expr + "\n,";
                    expr = expr + `${one_col.ds}.group(${one_col.ds}["${one_col.field}"])`
                })
                if(expr!=''){
                    data[row_focus+row][column_focus+col]={
                        v:this.row_grp_fields[0].field,
                        m:this.row_grp_fields[0].field,
                        cr:{"_displayValueExpr":"=@value",
                        "_valueExpr":this.row_grp_fields[0].field}
                    }
                    if(this.row_grp_fields.length>1)
                        expr = "=union_set(" + expr + ")"
                    else
                        expr = "=" + expr 
                    data[row_focus+row+1][column_focus + col]
                        = {v:expr,m:expr,cr:{"_displayValueExpr":"=@value","_valueExpr":expr,"_extendDirection":"row"}}
                    col++
                }
            }
            else{
                expr=''
                this.row_grp_fields.forEach(one_col=>{
                    data[row_focus+row][column_focus+col]={
                        v:one_col.field,m:one_col.field,cr:{"_displayValueExpr":"=@value", "_valueExpr":one_col.field}
                    }
                    expr = `=${one_col.ds}.group(${one_col.ds}["${one_col.field}"])`
                    data[row_focus+row+1][column_focus+col]
                        ={v:expr,m:expr,cr:{"_displayValueExpr":"=@value","_valueExpr":expr,"_extendDirection":"row"}}
                    col++
                })

            }
            let start_select=column_focus
            
            //luckysheet.insertRow(row_focus,{number:this.detail_fields.length})
            
            this.detail_fields.forEach(cur_field=> {
                let expr= cur_field.field
                data[row_focus+row][column_focus+col]={
                    v:expr,m:expr,cr:{"_displayValueExpr":"=@value","_valueExpr":expr}
                }
                if(col==0){
                    expr= `=${cur_field.ds}.select(${cur_field.ds}["${cur_field.field}"])`
                    data[row_focus+row+1][column_focus+col]={
                        v:expr,m:expr,cr:{"_displayValueExpr":"=@value","_valueExpr":expr,"_extendDirection":"row"}
                    }
                }
                else{
                    
                    if(cur_field.op)
                        expr= `=${cur_field.ds}.sum(${cur_field.ds}["${cur_field.field}"])`
                    else
                        expr= `=${cur_field.ds}["${cur_field.field}"]`
                    data[row_focus+row+1][column_focus+col]={
                        v:expr,m:expr,cr:{"_displayValueExpr":"=@value","_valueExpr":expr}
                    }
                }
                col++
            })
            luckysheet.is_in_simapleGuid=true
            luckysheet.refresh()   
            this.$emit('update:visible', false)
        },
        close(){
            this.$emit('update:visible', false)      
        },
    }
}
</script>
