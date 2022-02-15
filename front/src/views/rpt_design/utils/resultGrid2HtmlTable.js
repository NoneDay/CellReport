import {getObjType} from "./util"


export function dateToString(date){ 
    var year = date.getFullYear(); 
    var month =(date.getMonth() + 1).toString(); 
    var day = (date.getDate()).toString();  
    if (month.length == 1) { 
        month = "0" + month; 
    } 
    if (day.length == 1) { 
        day = "0" + day; 
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime; 
  }

//JS中实现StringBuilder
function StringBuilder() {  
    this._stringArray = new Array();  
}             
StringBuilder.prototype.append = function(str){  
    this._stringArray.push(str);  
    return this
}  
StringBuilder.prototype.toString = function(joinGap){  
    return this._stringArray.join(joinGap);  
}
//数据排序方法
function orderbydata(data, index, isAsc) {
    if (isAsc == null) {
        isAsc = true;
    }
    //是否是空值
    function isRealNull(val) {
        if (val == null || val.toString().replace(/\s/g, "") == "") {
            return true;
        }
        else {
            return false;
        }
    }
    //是否是纯数字
    function isRealNum(val) {
        if (val == null || val.toString().replace(/\s/g, "") === "") {
            return false;
        }

        if (typeof val == "boolean") {
            return false;
        }

        if (!isNaN(val)) {
            return true;
        }
        else {
            return false;
        }
    }
    function isdatetime(s) {
        if (s == null || s.toString().length < 5) {
            return false;
        }
        else if (checkDateTime(s)) {
            return true;
        }
        else {
            return false;
        }

        function checkDateTime(str) {
            var reg1 = /^(\d{4})-(\d{1,2})-(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;
            var reg2 = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;

            if (!reg1.test(str) && !reg2.test(str)) {
                return false;
            }

            var year = RegExp.$1,
                month = RegExp.$2,
                day = RegExp.$3;

            if (year < 1900) {
                return false;
            }

            if (month > 12) {
                return false;
            }

            if (day > 31) {
                return false;
            }

            if (month == 2) {
                if (new Date(year, 1, 29).getDate() == 29 && day > 29) {
                    return false;
                }
                else if (new Date(year, 1, 29).getDate() != 29 && day > 28) {
                    return false;
                }
            }

            return true;
        }
    }

    function diff(now, then) {
        return now.localeCompare(then)
        //return moment(now).diff(moment(then));
    }

    function isdatetime(s) {
        if (s == null || s.toString().length < 5) {
            return false;
        }
        else if(checkDateTime(s)){
            return true;
        }
        else {
            return false;
        }

        function checkDateTime(str){
            var reg1 = /^(\d{4})-(\d{1,2})-(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;
            var reg2 = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/;

            if(!reg1.test(str) && !reg2.test(str)){
                return false;
            }

            var year = RegExp.$1,
                month = RegExp.$2,
                day = RegExp.$3;

            if(year < 1900){
                return false;
            }

            if(month > 12){
                return false;
            }

            if(day > 31){
                return false;
            }

            if(month == 2){
                if(new Date(year, 1, 29).getDate() == 29 && day > 29){
                    return false;
                }
                else if(new Date(year, 1, 29).getDate() != 29 && day > 28){
                    return false;
                }
            }

            return true;
        }
    }

    function diff(now, then) {
        return now.localeCompare(then)
        //return moment(now).diff(moment(then));
    }

    let a = function (x, y) {
        let x1 = x.value[index], y1 = y.value[index];

        if (getObjType(x[index]) == "object")
            x1 = x[index]._v || x[index].v;
        if (getObjType(y[index]) == "object")
            y1 = y[index]._v || y[index].v;

        if (isRealNull(x1))
            return 1;
        if (isRealNull(y1))
            return -1;

        if (isdatetime(x1) && isdatetime(y1))
            return diff(x1, y1);
        else if (isRealNum(x1) && isRealNum(y1))
            return parseFloat(x1) - parseFloat(y1);
        else if (!isRealNum(x1) && !isRealNum(y1))
            return x1.localeCompare(y1, "zh");
        else if (!isRealNum(x1))
            return 1;
        else if (!isRealNum(y1))
            return -1;

    }

    let d = function (x, y) {
        let x1 = x.value[index], y1 = y.value[index];
        if (getObjType(x[index]) == "object")
            x1 = x[index]._v || x[index].v;
        if (getObjType(y[index]) == "object")
            y1 = y[index]._v || y[index].v;

        if (isRealNull(x1))
            return 1;
        if (isRealNull(y1))
            return -1;

        if (isdatetime(x1) && isdatetime(y1))
            return diff(y1, x1);
        else if (isRealNum(x1) && isRealNum(y1))
            return parseFloat(y1) - parseFloat(x1);
        else if (!isRealNum(x1) && !isRealNum(y1))
            return y1.localeCompare(x1, "zh");
        else if (!isRealNum(x1))
            return -1;
        else if (!isRealNum(y1))
            return 1;
    }

    if (isAsc)
        return data.sort(a);
    else
        return data.sort(d);
}

function getScrollBarWidth() {
    var odiv = document.createElement('div'),//创建一个div
        styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'//让他有滚动条
        }, i, scrollbarWidth;
    for (i in styles) odiv.style[i] = styles[i];
    document.body.appendChild(odiv);//把div添加到body中
    scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;//相减
    odiv.remove();//移除创建的div
    return scrollbarWidth;//返回滚动条宽度
}
const BitArray = require("./bits");
import {cellFromatCompute} from "./cellFromatCompute"
const luckysheet_CFiconsImg = new Image();
//luckysheet_CFiconsImg.src = "data:image/png;base64,";
const icon_arr=[]
function cut_icon_image(l,t){
    if(icon_arr[l] && icon_arr[l][t] )
        return icon_arr[l][t]
    let nCanvas = document.createElement('canvas');
    nCanvas.width = 32;
    nCanvas.height = 32;
    let nCtx = nCanvas.getContext('2d');
    nCtx.drawImage(
        luckysheet_CFiconsImg, 
        l * 42, 
        t * 32, 
        32, 
        32,0,0,32,32);
    if(icon_arr[l]==undefined)
        icon_arr[l]=[]
    icon_arr[l][t]=nCanvas.toDataURL('image/png');
    return icon_arr[l][t]
}
function build_col_arr(s_col,e_col){
    let ret=[]
    for(let i =s_col;i<e_col;i++)
        ret.push(i)
    return ret
}
export default class ResultGrid2HtmlTable{
    constructor(param_grid,el,setting,footer2,defaultsetting){
        let {name,tableData,extend_lines,rowlenArr,hyperlink,conditionformat,
            columnlenArr,styles,loc_style,colName_lines,my_sort,columns,
            config_merge,reportDefaultCss,optimize,abs_to_design} ={...param_grid}
        this.el=el
        this.footer2=footer2
        this.sort_col={"col":-1,"isAsc":0}
        this.setting=setting
        this.defaultsetting=defaultsetting
        this.fit=setting.fit??true
        this.param_grid=param_grid
        this.optimize=optimize
        this.abs_to_design=abs_to_design
        this.loc_style=loc_style
        //this.param_grid.need_footer=true
        this.ScrollBarWidth=getScrollBarWidth()
        this.cell_cf={}
        let cdf_arr=[]
        
        
        if(!setting.no_use_parent_css)
        {
            let cond=[]
            if(localStorage.luckysheet_conditionformat)
                cond=JSON.parse( localStorage.luckysheet_conditionformat)
            if(window.luckysheet_conditionformat)
                cond=window.luckysheet_conditionformat
            if(columns)
                cond.forEach(one=>{
                    let a_reg=RegExp(one.column_match)
                    for(let i=0;i<columns.length;i++){
                        if(a_reg.test( columns[i]))
                        {
                            let x=JSON.parse(one.val)
                            x.cellrange.forEach(xcr=>{
                                xcr.row=[extend_lines[0], extend_lines[1]]
                                xcr.column=[i, i]
                            })
                            cdf_arr.push(x)
                        }
                    }
                })
        }
        
        JSON.parse(setting.conditionformat_save??"[]").forEach(x=>{
            x.cellrange.forEach(xcr=>{
                xcr.row=[extend_lines[0], extend_lines[1]]
            })
            cdf_arr.push(x)
        })
        this.cur_page=1
        this.page_size=setting.page_size??20
        if(!optimize)
        {
            setting.page_size=tableData.length
        }
        if(tableData.length<=1000)
            this.cell_cf= cellFromatCompute(cdf_arr,tableData)

        this.t_tableData=new Array(tableData.length)
        this.tableData_bridge=new Array(tableData.length)
        for(let idx=0;idx<tableData.length;idx++)
            this.tableData_bridge[idx]=idx

        //this.convert(0,this.param_grid.extend_lines[0]+this.page_size*2)
        //setTimeout(() => {
        //    this.convert(this.param_grid.extend_lines[0]+this.page_size*2,Number.MAX_VALUE)
        //});
        this.total_columns=Object.keys(this.param_grid.columnlenArr).length
        this.total_rows=Object.keys(this.param_grid.rowlenArr).length
        this.fix_rows=1
        this.fix_cols=parseInt( param_grid.fix_cols||param_grid.fixCols||0 )
        if(this.fix_cols==undefined || this.fix_cols<1) this.fix_cols=1
        this.fix_rows=parseInt( param_grid.fix_rows||Math.max(this.fix_rows,this.param_grid.colName_lines[1]+1) )

        
    }
    getData(s_num,e_num){
        let ret=[]
        this.tableData_bridge.slice(s_num,e_num).forEach(rowNo=>{
            let rowData=this.param_grid.tableData[rowNo]
            let newRowData=new Array(Object.keys(this.param_grid.columnlenArr).length)
            ret.push(newRowData)
            rowData.slice(0,-1).forEach((cell,colNo)=>{
                let m
                if(rowNo<=this.param_grid.colName_lines[1])
                    m=cell
                else
                    m=this.param_grid.hyperlink[`${rowNo}_${colNo}`]??cell
                let cur_cell={v:cell,m,clazz:this.find_style(rowNo,colNo) }
                cur_cell.local_style=this.cell_cf[`${rowNo}_${colNo}`]
                newRowData[colNo]=cur_cell
            })
            newRowData.push({v:rowNo})
        })
        return ret;
    }
    find_style(rowNo,colNo){
        //if(this.optimize){
        //    if(rowNo>=this.param_grid.extend_lines[0] && rowNo<=this.param_grid.extend_lines[1])
        //        return (this.loc_style[`${this.param_grid.extend_lines[0]}_${colNo}_S`]??"")+ " " +(this.loc_style[`${rowNo}_${colNo}_D`]??"")
        //    else
        //        return (this.loc_style[`${rowNo}_${colNo}_D`]??"")+ " " +(this.loc_style[`${rowNo}_${colNo}_S`] ??"")
        //}
        //if(this.setting.no_use_parent_css)
        {
            for(let idx=0;idx<this.abs_to_design.length;idx++){
                let one=this.abs_to_design[idx]
                if(one.row[0]<=rowNo && rowNo<=one.row[1]
                    && one.col[0]<=colNo && colNo<=one.col[1]){
                        return (this.loc_style[`${rowNo}_${colNo}_D`]??"")+ " " +(this.loc_style[one.cell+"_S"] ??"")
                }
            }
        }
        return ''
        //return this.loc_style[`${rowNo}_${colNo}`]
    }
    convert(s_num,e_num){
        this.param_grid.tableData.slice(s_num,e_num).forEach((rowData,idx)=>{
            let rowNo=idx+s_num
            let newRowData=new Array(Object.keys(this.param_grid.columnlenArr).length)
            this.t_tableData[rowNo]=newRowData
            rowData.slice(0,-1).forEach((cell,colNo)=>{
                let m
                if(rowNo<=this.param_grid.colName_lines[1])
                    m=cell
                else
                    m=this.param_grid.hyperlink[`${rowNo}_${colNo}`]??cell
                let cur_cell={v:cell,m,clazz:this.find_style(rowNo,colNo) }
                cur_cell.local_style=this.cell_cf[`${rowNo}_${colNo}`]
                newRowData[colNo]=cur_cell
            })
            newRowData.push({v:rowNo})
        })
    }
    calc_style(cur_cell,width,height){
        if(cur_cell && cur_cell.local_style){
            cur_cell.style=""
            let local_style=cur_cell.local_style
            if(local_style.cellColor)
                cur_cell.style+="background-color:" + local_style.cellColor+";"
            if(local_style.textColor)
                cur_cell.style+="color:" + local_style.textColor+";"
            if(local_style.dataBar){
                let bar=local_style.dataBar
                if(bar.valueType=='minus'){
                    cur_cell.style+=`background-image: linear-gradient(to left, #ffffff , #ff0000);
                    background-repeat: no-repeat;
                    background-size: calc(${bar.minusLen*bar.valueLen*100}% - 0px);
                    background-position: calc(${bar.minusLen*(1-bar.valueLen)*width}px );`
                }//用百分比会错位，没找到好的用百分比的方法
                if(bar.valueType=='plus'){
                    cur_cell.style+=`background-image: linear-gradient(to left, ${bar.format[0]} , ${bar.format.length>1?bar.format[1]:bar.format[0]});
                    background-repeat: no-repeat;
                    background-size: calc(${bar.plusLen*bar.valueLen*100}% - 0px);
                    background-position:calc(${(bar.minusLen*width)}px);`
                }                        
            }
            if(local_style.icons){
                let {left,top}={...local_style.icons}
                let img=cut_icon_image(left,top)
                cur_cell.style+=`background-image:url(${img});
                background-size: 12px;
                background-repeat: no-repeat;
                background-position: 2px center;
                    ` 
            }
            return cur_cell.style    
        }
        return ""
    }
    total(){
        return this.param_grid.extend_lines[1]- this.param_grid.extend_lines[0] + 1
    }
    handleSizeChange(){

    }
    handleCurrentChange(){

    }
    sort(sort_col){
        if(sort_col!=undefined){
            if(this.sort_col.col==sort_col){
                if(this.sort_col.isAsc==0)
                    this.sort_col.isAsc=1
                else if(this.sort_col.isAsc==1)
                    this.sort_col.isAsc=-1
                else
                    this.sort_col.isAsc=0
            }else{
                this.sort_col={isAsc:-1,col:sort_col}
            }
            let extend_lines=this.param_grid.extend_lines
            //let tmp_arr=this.t_tableData.slice(extend_lines[0],extend_lines[1]+1)
            let tmp_arr=this.param_grid.tableData.slice(extend_lines[0],extend_lines[1]+1).map((item,idx)=>{return {"k":idx,'value':item}})
            if(this.sort_col.isAsc==-1)
                tmp_arr=orderbydata(tmp_arr,Number.parseInt(this.sort_col.col),false)
            else if(this.sort_col.isAsc==1)
                tmp_arr=orderbydata(tmp_arr,Number.parseInt(this.sort_col.col),true)
            //else
            //    tmp_arr=orderbydata(tmp_arr,tmp_arr[0].length-1,true)
            for(let idx=0;idx<tmp_arr.length;idx++)
                this.tableData_bridge[extend_lines[0]+idx]=extend_lines[0]+tmp_arr[idx].k
            //for(let i=extend_lines[0];i<extend_lines[1]+1;i++){
            //    this.t_tableData[i]=tmp_arr[i-extend_lines[0]]
            //}           
        }
    }
    find_config_merge(config_merge,rowNo,colNo){
        if(this.optimize){
            if(rowNo>=this.param_grid.extend_lines[0] && rowNo<=this.param_grid.extend_lines[1]){
                let t=config_merge[`${this.param_grid.extend_lines[0]}_${colNo}`]
                return 
            }
            else
                return config_merge[`${rowNo}_${colNo}`]
        }
        for(let idx=0;idx<this.abs_to_design.length;idx++){
            let one=this.abs_to_design[idx]
            if(one.row[0]<=rowNo && rowNo<=one.row[1]
                && one.col[0]<=colNo && colNo<=one.col[1]){
                    return config_merge[`${rowNo}_${colNo}`]
            }
        }
    }

    _inner_table(s_row,e_row,col_arr,gutter){
        let {name,tableData,extend_lines,rowlenArr,hyperlink,
            columnlenArr,styles,loc_style,colName_lines,my_sort,
            config_merge,reportDefaultCss} ={...this.param_grid}
        let sb = new StringBuilder();  
        let table_height=0
        let table_width=0
        if(e_row>=extend_lines[1] && extend_lines[1]>extend_lines[0])
            e_row=tableData.length
        for(let i =s_row;i<e_row;i++)
        {
            table_height+=rowlenArr[i]
        }
        sb.append(`<colgroup>`)
        col_arr.forEach(i=>//for(let i =s_col;i<e_col;i++)
        {
            let deta=0
            deta=table_width+Math.floor(columnlenArr[i]*this.ratio)-(this.el.clientWidth-this.ScrollBarWidth )
            if(deta<0 || this.ratio==1)
                deta=0
            sb.append(`<col width=${Math.floor(columnlenArr[i]*this.ratio - deta)}px></col>\n`)
            table_width+=Math.floor(columnlenArr[i]*this.ratio- deta)
        })
        sb.append(`</colgroup>\n`)
        let tableBitFlag =new Array( e_row-s_row)
        for(let i=0;i<tableBitFlag.length;i++)
            tableBitFlag[i]=new BitArray()
        this.getData(s_row,e_row).forEach((rowData,row_idx)=>{
        //this.t_tableData.slice(s_row,e_row).forEach((rowData,row_idx)=>{
            let rowNo=s_row+row_idx
            let row_type=''
            if(extend_lines[0]<=rowNo && extend_lines[1]>=rowNo)
                row_type='detail'
            else  if(rowNo<colName_lines[0])
                row_type='isHead'
            else  if(rowNo<=colName_lines[1])
                row_type='isColumn'
            else  if(rowNo<extend_lines[0])
                row_type='isComment'
            else
                row_type='isComment isAfterExtend'
            sb.append(`<tr ${row_type} data-n=${rowNo} style='height:${rowlenArr[rowNo]??rowlenArr["default"]}px' >`)
            
            rowData.forEach((cell,colNo)=>{
                if(false== col_arr.includes(colNo)){
                    return
                }
                //let colNo=s_col+col_idx
                if(tableBitFlag[rowNo-s_row].get(colNo))
                {
                    return;
                }
                tableBitFlag[rowNo-s_row].set(colNo ,1)
                let max_height=rowlenArr[rowNo]??rowlenArr["default"]
                let max_width=columnlenArr[colNo]
                sb.append(`\n<td `)
                let r_c=this.find_config_merge(config_merge,rowNo,colNo)//config_merge[`${rowNo}_${colNo}`]
                if(r_c){
                    let {r, c, rs, cs}={...r_c}
                    if(rs>1)
                        sb.append(` rowspan=${rs}`)
                    if(cs>1)
                        sb.append(` colspan=${cs}`)
                    max_width=0
                    for(let ci=0;ci<cs;ci++){
                        max_width+=columnlenArr[colNo+ci]
                    }
                    max_height=0
                    for(let ri=0;ri<rs;ri++){
                        max_height+=rowlenArr[rowNo+ri]
                        for(let ci=0;ci<cs;ci++){
                            tableBitFlag[r+ri-s_row]?.set(c+ci ,1)
                        }
                    }
                }
                sb.append(` style='${this.calc_style(cell,max_width*this.ratio,max_height)};'`)
                sb.append(` class=' ${cell.clazz} `)
                let cell_sort=my_sort[`${rowNo}_${colNo}`]
                if(this.optimize && cell_sort!=undefined){
                    sb.append(` cr-sort`)
                    if(this.sort_col.col==colNo){
                        if(this.sort_col.isAsc==-1)
                            sb.append(` cr-sort-desc`)
                        if(this.sort_col.isAsc==1)
                            sb.append(` cr-sort-asc`)
                   }
                   sb.append(`' data-c=${colNo} ><div class="cr-cell" style="max-height:${max_height-1}px;max-width:${max_width*this.ratio}px"> 
                   <span>${cell.m??''}</span>
                   <span class="cr-sort-icon"></span>
                   </div></td>`)
                }
                else
                    sb.append(`' data-c=${colNo}><div class="cr-cell" style="max-height:${max_height-1}px;max-width:${max_width*this.ratio}px"> ${cell.m??''}</div></td>`)
            })
            if(gutter)
                sb.append(`<td class="gutter"></td>`)
            sb.append("</tr>\n")
        })
        sb.append("</table>\n</div>\n")
        return {sb,table_height,table_width}
    }

    show(cur_page,page_size){
        let tmp_width=0
        let col_arr,start_row=0
        if(this.param_grid.mobile_col_button_arr && this.param_grid.mobile_col_button_arr.length >0){
            let t_arr=this.param_grid.mobile_col_button_arr
            t_arr=t_arr[t_arr.length-1].arr[t_arr[t_arr.length-1].selected]
            col_arr=build_col_arr(0,this.fix_cols).concat(build_col_arr(t_arr.col_span[0],t_arr.col_span[1]+1) )
            start_row=this.param_grid.colName_lines[1]
        }else{
            col_arr=build_col_arr(0,this.total_columns)
        }
        col_arr.forEach(i=>
            {
                tmp_width+=this.param_grid.columnlenArr[i]
            })

        this.ratio=1
        if (this.fit && tmp_width<this.el.clientWidth)
        this.ratio=(1.0*(this.el.clientWidth-this.ScrollBarWidth)/tmp_width)

        let sb = new StringBuilder();  
        function add_other(){
            sb.append(` cellSpacing=0 cellPadding=0 border=0 style="TABLE-LAYOUT: fixed; MARGIN: 0px; BORDER-COLLAPSE: collapse;">\n`)
        }
        sb.append(`<div class="cr-table cr-table--fit cr-table--scrollable-x cr-table--scrollable-y 
        cr-table--enable-row-transition" style="width: 100%; height: 100%;">`)
        let table_obj
        let height=0
        let min_width,head_height=0,footer_obj,foot_height=0
        let background_color=this.defaultsetting['BACKGROUND-COLOR']
        if(this.param_grid.optimize){
            // header
            table_obj=this._inner_table(start_row,this.param_grid.extend_lines[0], col_arr,true)
            min_width=Math.min(this.el.clientWidth-this.ScrollBarWidth-2,table_obj.table_width+(this.ratio==1?0:this.ScrollBarWidth))
            sb.append(`<div id='reportDiv${this.param_grid.name}Top' class='cr-table__header-wrapper'  style='background-color:${background_color};width:${min_width+this.ScrollBarWidth+2}px'>\n
            <table class='cr-table__header reportDefaultCss' height=${table_obj.table_height} width=${table_obj.table_width+2}  `)
            add_other()
            sb.append(table_obj.sb.toString(''))
            height=height+table_obj.table_height
            head_height=table_obj.table_height
            foot_height=0            
            if (this.param_grid.extend_lines[1]+1<this.total_rows && this.param_grid.need_footer){
                footer_obj=this._inner_table(this.param_grid.extend_lines[1]+1,this.total_rows, col_arr)
                foot_height=footer_obj.table_height
            }
        }else{
            this.param_grid.extend_lines[0]=0
        }
        // body 
        table_obj=this._inner_table(this.param_grid.extend_lines[0] +(cur_page-1)*page_size
            ,this.param_grid.need_footer?
                Math.min(this.param_grid.extend_lines[0] +cur_page*page_size ,this.param_grid.extend_lines[1]+1 )
                : this.param_grid.extend_lines[0] +cur_page*page_size 
            ,  col_arr)
        min_width=Math.min(this.el.clientWidth-this.ScrollBarWidth-2, table_obj.table_width+(this.ratio==1?0:this.ScrollBarWidth))
        sb.append(`<div id='reportDiv${this.param_grid.name}' class="cr-table__body-wrapper is-scrolling-middle" 
        style='background-color:${background_color};height: calc(100% - ${head_height+foot_height}px);width:${min_width+this.ScrollBarWidth+3}px'>\n
        <table class='cr-table__body  reportDefaultCss' height=${table_obj.table_height} width=${table_obj.table_width} `)
        add_other()
        sb.append(table_obj.sb.toString(''))
        height=height+table_obj.table_height
        // footer
        if (footer_obj){
            sb.append(`<div id='reportDiv${this.param_grid.name}Footer' class="cr-table__footer-wrapper" style='background-color:${background_color};width:${table_obj.table_width+(this.ratio==1?0:this.ScrollBarWidth)}px'>\n
            <table class='cr-table__footer reportDefaultCss' height=${footer_obj.table_height} width=${footer_obj.table_width}  `)
            add_other()
            sb.append(footer_obj.sb.toString(''))
            height=height+footer_obj.table_height
        }
        if(this.param_grid.optimize){
            // 固定列，header
            table_obj=this._inner_table(start_row,this.param_grid.extend_lines[0],  build_col_arr(0,this.fix_cols))
            sb.append(`<div class="cr-table__fixed" style="width: ${table_obj.table_width+1}px; height:100%;">`)
            
            sb.append(`<div class='cr-table__fixed-header-wrapper'  style='background-color:${background_color};' >\n
            <table class='cr-table__header reportDefaultCss' height=${table_obj.table_height} width=${table_obj.table_width}  `)
            add_other()
            sb.append(table_obj.sb.toString(''))
            // 固定列，body
            table_obj=this._inner_table(this.param_grid.extend_lines[0] +(cur_page-1)*page_size,
                    this.param_grid.need_footer?
                    Math.min(this.param_grid.extend_lines[0] +cur_page*page_size ,this.param_grid.extend_lines[1]+1 )
                    : this.param_grid.extend_lines[0] +cur_page*page_size ,
                    build_col_arr(0,this.fix_cols))
            sb.append(`<div id='reportDiv${this.param_grid.name}Left' class="cr-table__fixed-body-wrapper" 
            style='background-color:${background_color};top: ${head_height+0.5}px;height: calc(100% - ${head_height+foot_height}px)'>\n
            <table class='cr-table__body  reportDefaultCss' height=${table_obj.table_height} width=${table_obj.table_width}  `)
            add_other()
            sb.append(table_obj.sb.toString(''))

            // 固定列，footer
            if (this.param_grid.extend_lines[1]+1<this.total_rows && this.param_grid.need_footer){
                footer_obj=this._inner_table(this.param_grid.extend_lines[1]+1,this.total_rows,build_col_arr(0,this.fix_cols))
                sb.append(`<div class="cr-table__fixed-footer-wrapper" style='background-color:${background_color};'>\n
                <table class='cr-table__footer reportDefaultCss' height=${footer_obj.table_height} width=${footer_obj.table_width}  `)
                add_other()
                sb.append(footer_obj.sb.toString(''))
                height=height+footer_obj.table_height
            }
            sb.append("</div>")             
        }
        sb.append("</div>")
        let alter_format_arr=[]
        if(!this.setting.no_use_parent_css){
            try{
            if(localStorage.luckysheet_alternateformat_save)
                alter_format_arr=alter_format_arr.concat(JSON.parse("["+(localStorage.luckysheet_alternateformat_save ??'') +"]"))
            if(window.luckysheet_alternateformat_save){
                if(typeof window.luckysheet_alternateformat_save=='string')
                    window.luckysheet_alternateformat_save=JSON.parse(window.luckysheet_alternateformat_save)
                alter_format_arr=[window.luckysheet_alternateformat_save]
            }
            }catch{}
        }
        sb.append(`<style type="text/css">`)
        alter_format_arr=alter_format_arr.concat(JSON.parse(this.setting.alternateformat_save??'[]'))
        alter_format_arr.forEach(x=>{
            let {head,one,two,foot}= {...x.format}
            let [s_col,e_col]=[...x.cellrange.column]
            for(let idx=s_col;idx<=e_col;idx++){
                if(alter_format_arr.length==1)
                sb.append(`tr[isHead]  td {background-color:${head.bc};color:${head.fc};}`)
                sb.append(`
                    tr[isColumn]  td[data-c${idx>=0?'="'+idx+'"':''}] {background-color:${head.bc};color:${head.fc}; border: 1px solid #bdbcbc;}
                    tr[isComment]:not([isAfterExtend] ) td[data-c${idx>=0?'="'+idx+'"':''}] {background-color:${foot.bc};border: 1px solid #bdbcbc;}
                    tr:nth-child(odd)[Detail]  td[data-c${idx>=0?'="'+idx+'"':''}] {background-color:${one.bc}; color:${one.fc};   border: 1px solid #bdbcbc;}
                    tr:nth-child(even)[Detail] td[data-c${idx>=0?'="'+idx+'"':''}] {background-color:${two.bc}; color:${two.fc};border: 1px solid #bdbcbc;}
                    .form_query_button {background-color:${head.bc};color:${head.fc};}
                    `)
            }
            
        })
        sb.append("\n</style>\n")  
        sb.append("<style>\n")
        Object.entries(this.param_grid.styles).forEach(([key, value])=>{
            sb.append(".").append(key).append('{').append(value).append("}\n")
        })
        sb.append(".reportDefaultCss{").append(this.param_grid.reportDefaultCss).append("}\n")
        sb.append(`.cr-cell {margin: 0;
            padding: 0 4px;
            white-space: wrap;
            word-wrap: normal;
            overflow: hidden;            
            }
            .cr-sort .cr-sort-icon {
                display: inline;
                padding: 0 13px 0 0;
                background: url(img/datagrid_icons.png) no-repeat -64px center;
            }
            .cr-sort-asc .cr-sort-icon {
                display: inline;
                padding: 0 13px 0 0;
                background: url(img/datagrid_icons.png) no-repeat 0px center;
            }
            .cr-sort-desc .cr-sort-icon {
                display: inline;
                padding: 0 13px 0 0;
                background: url(img/datagrid_icons.png) no-repeat -16px center;
            }
            `)
        sb.append("</style>")      
        return sb.toString('')
    }
}

