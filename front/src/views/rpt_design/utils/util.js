if(Date.prototype.format==undefined){
    Date.prototype.format = function(fmt){
      var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
      };
    
      if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
      }
            
      for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(
            RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
        }       
      }
    
      return fmt;
    }  
  }

// 使用方法 arrayToTree(data,{pid:'pid',id:'id'})
export function arrayToTree(array,paramsKey){
	
	// pid 和id 都是字符串
	const pid = paramsKey.pid;
	const id = paramsKey.id;
	
	let copyArr = JSON.parse(JSON.stringify(array));
	
	// 筛选出没有父级的数据
	array.forEach(function(item){
		copyArr = copyArr.filter(function(child){
			return child[pid] !== item[id]
		})
	})
	
	// 递归转换
	function treeLoop(arr = [],total=[]){
		for(let i=0;i<arr.length;i++){
			const aid = arr[i][id]
			let children = total.filter(function(child){
				return child[pid] === aid
			});
			if(children.length > 0){
				children = treeLoop(children,total);
			}
            if(children.length>0)
			    arr[i].children = children;
		}
		return arr;
	}
	
	return treeLoop(copyArr,array)
}
export const parseParam=function(one_ds__text){
    let params=[]
    let result=one_ds__text.match(/#([^ \t\v\n\r\f\+\*-\/\(\)\{\}\.\"\']*?)#/img)
    if(result){
        result.forEach(ele=>{
            let new_name=ele.slice(1,-1)
            if(params.find(x=>x==new_name)==null){
                params.push(new_name)
            }
        })
    }
    result=one_ds__text.match(/\$([^ \t\v\n\r\f\+\*-\/\(\)\{\}\.\"\']*?)\$/img)
    if(result){
        result.forEach(ele=>{
            let new_name=ele.slice(1,-1)
            if(params.find(x=>x==new_name)==null){
                params.push(new_name)
            }
        })
    }
    result=one_ds__text.match(/\$\+(.*?)\$/img)
    if(result){
        result.forEach(one_stat=>{
            let param_result=one_stat.match(/param\.[^ \t\v\n\r\f\+\*-\/\(\)\{\}\.\"\']*/img)
            if(param_result){
                param_result.forEach(ele=>{
                    let new_name=ele.substring(6).replace("$","")
                    if(params.find(x=>x==new_name)==null){
                        params.push(new_name)
                    }
                })
            }
        })
    }
    return Enumerable.from(params).where(x=>x!="" && x!=null).toArray()
}
export const build_layout=function(AllGrids){
    let layout_item_arr =[]
    if(AllGrids.grid)
        AllGrids.grid.forEach(ele=>{
            layout_item_arr.push({
                "type": "luckySheetProxy",
                "label": ele._title||ele.title||ele._name||ele.name,
                "display": true,
                "style": {
                    "height": "100%"
                },no_use_parent_css:false,
                "fit":true,page_size:20,
                page_sizes:"[20, 50, 100, 200]",
                "gridName": ele._name||ele.name,
                "span": 24,
                "component": "luckySheetProxy",
                "prop": Date.now() + '_' + Math.ceil(Math.random() * 99999)
            })
        })
    if(AllGrids.HtmlText)
        AllGrids.HtmlText.forEach(ele=>{
            layout_item_arr.push({
                "type": "html-text",
                "label":ele._title||ele.title||ele._name||ele.name,
                "gridName": ele._name||ele.name,
                "color": "#fff",
                "display": true,
                "component": "html-text",
                "style": {
                    "height": "100%"
                },
                "content": "<h1>哈==哈哈</h1>",
                "prop": Date.now() + '_' + Math.ceil(Math.random() * 99999)
            })
        })
    let insert_item
    if(layout_item_arr.length==1)
    {
        insert_item=layout_item_arr[0]
    }else{
        insert_item={
              "type": "tabs",
              "component": "widget-form-tabs",
              "label": "tab面板",
              "span": 24,
              "display": true,
              "style": {
                  "height": "100%"
              },
              
              "children": {
                  "align": "center",
                  "headerAlign": "center",
                  "column": layout_item_arr
              },
              "prop": Date.now() + '_' + Math.ceil(Math.random() * 99999)
          }
    }
    return insert_item
    return {
        "type": "layout_div",
        "component": "widget-form-group",
        "label": "div布局",
        "span": 24,
        "icon": "icon-group",
        "display": true,
        "style": {
            "height": "100%"
        },                    
        "children": {
            "column": [
            insert_item
            ]
        }
    } //*/
}
export const test_data=[
    ['product', '2015', '2016', '2017'],
    ['苹果', 43.3, 85.8, 93.7],
    ['柚子', 23.1, 73.4, 55.1],
    ['香蕉', 36.4, 65.2, 82.5],
    ['菠萝', 42.4, 53.9, 39.1],
    ['枇杷', 53.3, 85.8, 93.7],
    ['草莓', 63.1, 73.4, 55.1],
    ['柠檬', 76.4, 65.2, 82.5],
    ['红枣', 72.4, 53.9, 39.1],
    ['葡萄', 48.3, 85.8, 93.7],
    ['芒果', 88.1, 73.4, 55.1],
    ['山竹', 88.4, 65.2, 82.5],
    ['桂圆', 78.4, 53.9, 39.1] 
]
export const build_chart_data=function (ds_name_source,report_result,clickedEle_data,fields) {
    let ds_name=ds_name_source.split(":")
    ds_name=ds_name.length>1?ds_name[1]:ds_name[0]
    let real_data
    if(ds_name_source.startsWith("数据集")){
        if(report_result.dataSet[ds_name])
            real_data= JSON.parse(JSON.stringify(report_result.dataSet[ds_name][0]))
        else 
            return [[],[],[]];
    } 
    else if(ds_name_source.startsWith("元素")){
        let cur_grid=report_result.data[ds_name]
        real_data=clickedEle_data
        if(real_data){
            if(!Array.isArray(real_data))
            {
                let keys=Object.keys(real_data)
                let values=Object.values(real_data)
                if(keys.length==0){
                    keys=cur_grid.columns
                    values= cur_grid.tableData[cur_grid.extend_lines[0]]
                }
                real_data=JSON.parse(JSON.stringify([keys,values]))
            }
            
        }
    }
    else if(ds_name_source.startsWith('表格'))
    {
        if(report_result.data==undefined  || report_result.data[ds_name]==undefined)
            return
        let cur_grid=report_result.data[ds_name]
        real_data=[cur_grid.columns]
        if(ds_name_source.startsWith('表格明细数据'))
        {
            real_data=real_data.concat(cur_grid.tableData.slice(cur_grid.extend_lines[0],cur_grid.extend_lines[1]+1) )
            //for (let index = cur_grid.extend_lines[0]; index <= cur_grid.extend_lines[1]; index++) 
            //{
            //    real_data.push(cur_grid.tableData[index])
            //}
        }
        else if(ds_name_source.startsWith('表格汇总数据')){
            for (let index = cur_grid.colName_lines[1]+1; index < cur_grid.tableData.length; index++) 
            {
                if(index<cur_grid.extend_lines[0] || index > cur_grid.extend_lines[1] ){
                //if(cur_grid.tableData[index].find(x=>x==null)).length>2) //todo
                real_data.push(cur_grid.tableData[index])
                }
            }
        } 
        else if(ds_name_source.startsWith('表格明细及汇总数据')){
            real_data=real_data.concat(cur_grid.tableData.slice(cur_grid.extend_lines[0],cur_grid.extend_lines[1]+1) )            
            for (let index = cur_grid.colName_lines[1]+1; index < cur_grid.tableData.length; index++) 
            {
                if(index<cur_grid.extend_lines[0] || index > cur_grid.extend_lines[1] ){
                //if(cur_grid.tableData[index].find(x=>x==null)).length>2) //todo
                real_data.push(cur_grid.tableData[index])
                }
            }
        }        
    }else
    {
        real_data= test_data
    }
    let valid_fileds=[]  
    if(!fields || fields.length==0)
        return {__valid_data__:real_data,valid_fileds:real_data[0],real_data} 
      
    let __valid_data__=[[]]
    for (let index = 0; index < fields.length; index++) {
        const element = fields[index];
        if(!element.selected)
            continue
        valid_fileds.push(real_data[0].indexOf(element.key))
        __valid_data__[0].push(element.label)
    }
    real_data.slice(1).forEach(element=>{
        let one_line=[]
        __valid_data__.push(one_line)
        valid_fileds.forEach(i=>{
                one_line.push(element[i])
        });
    });
    return {__valid_data__,valid_fileds,real_data}
}
export function select_field_data(real_data,fields){
    if(real_data){
        let valid_fileds=[] 
        if(!fields || fields.length==0)
            return real_data
          
        let __valid_data__=[[]]
        for (let index = 0; index < fields.length; index++) {
            const element = fields[index];
            if(!element.selected)
                continue
            valid_fileds.push(real_data[0].indexOf(element.key))
            __valid_data__[0].push(element.label)
        }
        real_data.slice(1).forEach(element=>{
            let one_line=[]
            __valid_data__.push(one_line)
            valid_fileds.forEach(i=>{
                    one_line.push(element[i])
            });
        });
        return __valid_data__
    }
}
export const convert_csv_to_json=function (txt,start=0,end=-1){
    let gridData=[]
    let data=txt.split("\n")
    if(end==-1)
        end =data.length-1
    let col_list=data[0].split(",")
    
    data.slice(start+1,end).forEach(element => {
        let one_line={}
        if(element.length==0)
            return false;
        let one_line_data=element.split(",")
        gridData.push(one_line)
        for (let index = 0; index < col_list.length; index++) {
            one_line[col_list[index]]=one_line_data[index];
        }  
    });
    return gridData
}
//转换数据库表样式的数组为JSON数组
export const convert_array_to_json=function (data,start=0,end=-1,col_list){
    let gridData=[]
    if(end==-1)
        end =data.length
    if(col_list==undefined)
    {
        col_list=data[0]
        start=start+1
    }
    data.slice(start,end).forEach(element => {
        let one_line={}
        if(element==undefined || element.length==0)
            return false;
        gridData.push(one_line)
        for (let index = 0; index < col_list.length; index++) {
            if(["object","array"].includes(getObjType(element[index])))
                one_line[col_list[index]]=JSON.stringify(element[index]);
            else
                one_line[col_list[index]]=element[index];
        }  
    });
    return gridData
}

export const getObjType = obj => {
    var toString = Object.prototype.toString;
    var map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    if (obj instanceof Element) {
      return 'element';
    }
    return map[toString.call(obj)];
  };
  /**
   * 对象深拷贝
   */
  export const deepClone = data => {
    var type = getObjType(data);
    var obj;
    if (type === 'array') {
      obj = [];
    } else if (type === 'object') {
      obj = {};
    } else {
      // 不再具有下一层次
      return data;
    }
    if (type === 'array') {
      for (var i = 0, len = data.length; i < len; i++) {
        data[i] = (() => {
          if (data[i] === 0) {
            return data[i];
          }
          return data[i];
        })();
        if(data[i]?.$parent)
        delete data[i].$parent;
        obj.push(deepClone(data[i]));
      }
    } else if (type === 'object') {
      for (var key in data) {
        if(data[i]?.$parent)
        delete data.$parent;
        obj[key] = deepClone(data[key]);
      }
    }
    return obj;
  };

  
export function loadFile (name) { // name为文件所在位置
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/plain;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}
var stringArray = [];
export function numToString(numm){
    stringArray.length = 0;
    var numToStringAction = function(nnum){
        var num = nnum - 1;
        var a = parseInt(num / 26);
        var b = num % 26;
        stringArray.push(String.fromCharCode(64 + parseInt(b+1)));
        if(a>0){
            numToStringAction(a);
        }
    }
    numToStringAction(numm);
    return stringArray.reverse().join("");
}
export function stringToNum(a){
    
    let str=a.toLowerCase().split("");

    let al = str.length;
    let getCharNumber = function(charx){
        return charx.charCodeAt() -96;
    };
    let numout = 0;
    let charnum = 0;
    for(let i = 0; i < al; i++){
        charnum = getCharNumber(str[i]);
        numout += charnum * Math.pow(26, al-i-1);
    }
    return numout;
}

export function getRangeByText(txt){
    
    let ret=[]
    txt.toLowerCase().split(":").forEach(one_txt => {
      let idx=0
      for(idx=0;idx<one_txt.length;idx++){
        if (one_txt[idx]<'a' || one_txt[idx]>'z' )
          break    
      }
      let c=stringToNum(one_txt.substring(0,idx))-1
      let r=parseInt(one_txt.substring(idx))-1
      ret.push({r,c})
    });
    if(ret.length==1)
      return ret[0]
    else
      return {r:ret[0].r,c:ret[0].c  , rs:ret[1].r-ret[0].r+1,cs:ret[1].c- ret[0].c+1 }
}
export function getLuckyStyle(border){
    if(!border)
        return;
    let size=""
    let line_type=""
    let _color="black"
    border.replace(";","").split(" ").forEach(x=>{
        if(x.includes("px") || x.includes("pt")){
            if(x=="1.5pt")
            size="Thick";
            else if(x=="1pt")
            size="Medium";

        }
        else if(x.indexOf("#")>=0 || x.indexOf("rgb")>=0){
            _color=x;
            if(!color(_color))
                _color="black"
        }
        else if(x.indexOf("double")> -1){
            line_type = "Hair";
        }
        else if(x.indexOf("dotted") > -1){
            line_type = "Dotted";
        }
        else if(x.indexOf("Dashed") > -1){
            line_type = "Dashed";
        }
    })
    
    let borderType = {
        "none" : "0",
        "Thin" : "1",
        "Hair" : "2",
        "Dotted" : "3",
        "Dashed" : "4",
        "DashDot" : "5",
        "DashDotDot" : "6",
        "Double" : "7",
        "Medium" : "8",
        "MediumDashed" : "9",
        "MediumDashDot" : "10",
        "MediumDashDotDot" : "11",
        "SlantedDashDot" : "12",
        "Thick" : "13",
    };
    
    let t_type=size+line_type
    if(t_type=="")t_type="thin"
    return [borderType[t_type]??'0',_color??"#000",t_type==""?"":(t_type[0].toLowerCase()+t_type.substring(1))]
}
function getHtmlBorderStyle(type, _color){
    let style = "";
    let borderType = {
        "0": "none",
        "1": "Thin",
        "2": "Hair",
        "3": "Dotted",
        "4": "Dashed",
        "5": "DashDot",
        "6": "DashDotDot",
        "7": "Double",
        "8": "Medium",
        "9": "MediumDashed",
        "10": "MediumDashDot",
        "11": "MediumDashDotDot",
        "12": "SlantedDashDot",
        "13": "Thick"
    };
    type = borderType[type.toString()];

    if(type.indexOf("Medium") > -1){
        style += "1pt ";
    }
    else if(type == "Thick"){
        style += "1.5pt ";
    }
    else {
        style += "0.5pt ";
    }

    if(type == "Hair"){
        style += "double ";
    }
    else if(type.indexOf("DashDotDot") > -1){
        style += "dotted ";
    }
    else if(type.indexOf("DashDot") > -1){
        style += "dashed ";
    }
    else if(type.indexOf("Dotted") > -1){
        style += "dotted ";
    }
    else if(type.indexOf("Dashed") > -1){
        style += "dashed ";
    }
    else{
        style += "solid ";
    }
    if(!color(_color))
        _color="black"
    return style + _color;
}

export function luckySheet2ReportGrid(sheet_window,DefaultCssSetting){
    let sheet=sheet_window.luckysheet.getSheet(0)
    let gridName=sheet_window.gridName
    let boderinfo=sheet_window.luckysheet.getBorderInfoCompute(0)
    let cells=[]
    let max_c=0,max_r=0
    sheet.data.forEach( (row,r)=>{
        row.forEach((cell,c)=>{
            if(cell!=null && cell.cr!=undefined && cell.cr._valueExpr!=undefined ){
                let cell_merge=(sheet.config && sheet.config.merge)?sheet.config.merge[`${r}_${c}`]:undefined
                if(cell_merge!=undefined){
                    cell.cr._name=numToString(cell_merge.c+1) + (cell_merge.r+1)+":"+
                            numToString(cell_merge.c+cell_merge.cs)+ (cell_merge.r+cell_merge.rs)
                    max_c=Math.max(max_c,cell_merge.c+cell_merge.cs)
                    max_r=Math.max(max_r,cell_merge.r+cell_merge.rs)
                }
                else {
                    cell.cr._name=numToString(c+1)+(r+1)
                    max_c=Math.max(max_c,c)
                    max_r=Math.max(max_r,r)
                }
                let cell_bd=boderinfo[`${r}_${c}`]
                cell.cr['_BORDER-LEFT']  = cell_bd?.l?getHtmlBorderStyle(cell_bd.l?.style,cell_bd.l?.color):""
                cell.cr['_BORDER-RIGHT'] = cell_bd?.r?getHtmlBorderStyle(cell_bd.r?.style,cell_bd.r?.color):""
                cell.cr['_BORDER-TOP']   = cell_bd?.t?getHtmlBorderStyle(cell_bd.t?.style,cell_bd.t?.color):""
                cell.cr['_BORDER-BOTTOM']= cell_bd?.b?getHtmlBorderStyle(cell_bd.b?.style,cell_bd.b?.color):""
                if(cell.mc){
                    cell_bd=boderinfo[`${r}_${c+cell.mc.cs-1}`]
                    if(cell_bd)
                        cell.cr['_BORDER-RIGHT'] = cell_bd?.r?getHtmlBorderStyle(cell_bd.r?.style,cell_bd.r?.color):""
                    cell_bd=boderinfo[`${r+cell.mc.rs-1}_${c}`]
                    if(cell_bd)
                        cell.cr['_BORDER-BOTTOM'] = cell_bd?.b?getHtmlBorderStyle(cell_bd.b?.style,cell_bd.b?.color):""
                }
                if(cell.cr['_FONT']==DefaultCssSetting["FONT"]) delete cell.cr['_FONT']
                if(cell.cr['_FONT-SIZE']==DefaultCssSetting["FONT-SIZE"]) delete cell.cr['_FONT-SIZE']
                if(cell.cr['_background-color']==DefaultCssSetting["BACKGROUND-COLOR"]) delete cell.cr['_background-color']
                if(cell.cr['_color']==DefaultCssSetting["COLOR"]) delete cell.cr['_color']
                if(cell.cr['_displayValueExpr']=="=@value") delete cell.cr['_displayValueExpr']
                //if(cell.cr['_BORDER-LEFT']==DefaultCssSetting.border_style) delete cell.cr['_BORDER-LEFT']
                //if(cell.cr['_BORDER-RIGHT']==DefaultCssSetting.border_style) delete cell.cr['_BORDER-RIGHT']
                //if(cell.cr['_BORDER-TOP']==DefaultCssSetting.border_style) delete cell.cr['_BORDER-TOP']
                //if(cell.cr['_BORDER-BOTTOM']==DefaultCssSetting.border_style) delete cell.cr['_BORDER-BOTTOM']

                if(cell.cr._absName)
                    delete cell.cr._absName
                let t_cell=JSON.parse(JSON.stringify(cell.cr))
                Object.keys(t_cell).forEach(x=>{
                    if(x!='_valueExpr' && t_cell[x]=='')
                        delete t_cell[x]
                })
                cells.push(t_cell)
                //cells.push(JSON.parse(JSON.stringify(cell.cr)))
            }
        })
    })
    let rows=[]
    let row_num=Math.min(max_r+4, sheet.visibledatarow.length)
    let col_num=Math.min(max_c+4,sheet.visibledatacolumn.length)
    for(let i=0;i<row_num;i++){
        rows[i]={...sheet.cr_rows[i],... {_name:i +1,_height:
            (sheet.config && sheet.config.rowlen && sheet.config && sheet.config.rowlen[i.toString()]!=undefined)?
            sheet.config.rowlen[i.toString()]:sheet.defaultRowHeight,
            _fixed:"False" }}
        Object.keys(rows[i]).forEach(x=>{
            if(rows[i][x]=='')
                delete rows[i][x]
        })
        delete rows[i]._fixed
    }
    let columns=[]
    for(let i=0;i<col_num;i++){
        columns[i]={...sheet.cr_columns[i],...{_name:numToString(parseInt(i)+1).toLowerCase() ,_width:
            (sheet.config && sheet.config.columnlen && sheet.config && sheet.config.columnlen[i.toString()]!=undefined)?     
            sheet.config.columnlen[i.toString()] :sheet.defaultColWidth
             ,_fixed:"False" }}
        Object.keys(columns[i]).forEach(x=>{
        if(columns[i][x]=='')
            delete columns[i][x]
        })
        delete columns[i]._fixed
    }
    let fix_rows=sheet.freezen?.horizontal?.freezenhorizontaldata[1]
    let fix_cols=sheet.freezen?.vertical?.freezenverticaldata[1]
    
    let aaa= {grid:{_name:gridName,_title:gridName,_CanShow_expr:"",
            columns:{column:columns},rows:{row:rows},cells:{cell:cells}
            }
        }
    if(aaa.grid.columns.column.length==0)
        delete aaa.grid.columns.column
    if(aaa.grid.rows.row.length==0)
        delete aaa.grid.rows.row
    aaa.grid.conditionformat_save=JSON.stringify(sheet_window.luckysheet.getAllSheets()[0].luckysheet_conditionformat_save)
    aaa.grid.alternateformat_save_modelCustom=JSON.stringify(sheet_window.luckysheet.getAllSheets()[0].luckysheet_alternateformat_save_modelCustom)
    aaa.grid.alternateformat_save=JSON.stringify(sheet_window.luckysheet.getAllSheets()[0].luckysheet_alternateformat_save)
    return aaa      
}

export function designGrid2LuckySheet(grid,setting,DefaultCssSetting){
    let color = require('onecolor');
    let celldata=[]
    let merge={}
    let borderInfo=[]
    let rowlen={}
    let frozen_row_focus=-1, frozen_column_focus=-1
    if(grid.rows==undefined)    grid.rows={row:Enumerable.range(1,10).select(x=> {return {_name:x,_height:parseInt(DefaultCssSetting['defaultRowHeight']??'25'),_fixed:"False"}}).toArray()}
    if(grid.columns==undefined)    grid.columns={column:Enumerable.range(0,10).select(x=> {return {_name:'abcdefghijklmn'[x],_width:parseInt(DefaultCssSetting['defaultColWidth']??'75'),_fixed:"False"}}).toArray()}
    if(grid.rows && grid.rows.row)
    grid.rows.row.forEach(one => {
        rowlen[(parseInt(one._name)-1).toString()]=parseInt(one._height)
        if(one._fixed=="True")
            frozen_row_focus=parseInt(one._name)-1
        
    });
    let columnlen={}
    if(grid.columns && grid.columns.column)
    grid.columns.column.forEach((one) => {
        columnlen[ (stringToNum(one._name)-1).toString()]=parseInt(one._width)
        if(one._fixed=="True")
            frozen_column_focus=stringToNum(one._name)-1
    });
    if(grid._fix_rows!=undefined){
        frozen_row_focus=grid._fix_rows-1
        frozen_column_focus=grid._fix_cols-1
    }
    let frozen={type: 'rangeBoth',range: {row_focus: frozen_row_focus, column_focus:frozen_column_focus } }
    if(frozen.range.row_focus<0) frozen.type='rangeColumn'
    if(frozen.range.column_focus<0) frozen.type='rangeRow'
    if(frozen.range.column_focus<0 && frozen.range.row_focus<0)
        frozen=undefined
    if(grid.cells && grid.cells.cell && Array.isArray(grid.cells.cell)==false)
        grid.cells.cell=[grid.cells.cell]
    if(grid.cells && grid.cells.cell)
    grid.cells.cell.forEach(cell => {
        // {"r":13,"c":5,"v":{"bg":null,"bl":0,"it":0,"ff":0,"fs":11,"fc":"rgb(51, 51, 51)","ht":1,"vt":1,
        // "mc":{"r":13,"c":5,"rs":3,"cs":1}}}
        let pos=getRangeByText(cell._name)
        let one={r:pos.r,c:pos.c,v:{},cr:{}}

        one.v.v=cell._valueExpr
        one.v.cr=Object.assign({'_color':DefaultCssSetting["COLOR"],'_displayValueExpr':'=@value'},cell)
        if(cell._color)
            one.v.fc=cell._color
        one.v.ff=cell['_FONT']??DefaultCssSetting["FONT"]
        one.v.fs=parseInt(cell['_FONT-SIZE']??DefaultCssSetting["FONT-SIZE"])
        if(cell['_BOLD'] && cell['_BOLD']=="True")
            one.v.bl=1
        if(cell['_ITALIC'] && cell['_ITALIC']=="True")
            one.v.it=1
        if(cell['_UNDERLINE'] && cell['_UNDERLINE']=="True")
            one.v.cl=1
            
        if(cell._color)
            one.v.fc=color(cell._color) ? cell._color :DefaultCssSetting["COLOR"]
        else
            one.v.fc=DefaultCssSetting["COLOR"]
        if(cell["_background-color"])
            one.v.bg=color(cell["_background-color"])?cell["_background-color"]:DefaultCssSetting["BACKGROUND-COLOR"]
        else
            one.v.bg=DefaultCssSetting["BACKGROUND-COLOR"]

        if(cell['_text-align']){
            if (cell['_text-align']=="center")
                one.v.ht='0'
            else if (cell['_text-align']=="left")
                one.v.ht='1'
            else
                one.v.ht='2'
        }
        if(cell['_vertical-align']){
            if (cell['_vertical-align']=="bottom")
                one.v.vt='2'
            else if (cell['_vertical-align']=="top")
                one.v.vt='1'
            else
                one.v.vt='0'
        }
        celldata.push(one)
        if(pos.hasOwnProperty("cs")&& !(pos.cs<=1 && pos.rs<=1)){
            one.v.mc=Object.assign({},pos)
            for(let idx_r=0;idx_r<pos.rs;idx_r++){
                for(let idx_c=0;idx_c<pos.cs;idx_c++){
                    if (idx_r==0 && idx_c==0)
                        continue
                    celldata.push({r:pos.r+idx_r,c:pos.c+idx_c,v:{mc:{r:pos.r,c:pos.c}}})
                    merge[`${pos.r}_${pos.c}`]=Object.assign({},pos)
                }    
            }
        }  
        function push_border(param) {
            if(cell[param]){
                let result=getLuckyStyle(cell[param])
                borderInfo.push({"rangeType": "range","borderType": param.toLowerCase().substring(1),"style": result[0],"color": color(result[1])?result[1]:'black',
                            "range": [{"row": [pos.r,pos.r+(pos.rs?(pos.rs-1):0)],"column": [pos.c,pos.c+(pos.cs?(pos.cs-1):0)]}]  });
            }
        } 
        if(cell['_BORDER-BOTTOM'] &&  cell['_BORDER-TOP'] &&  cell['_BORDER-LEFT'] &&  cell['_BORDER-RIGHT'])    {
            let result=getLuckyStyle(cell['_BORDER-BOTTOM'])
            borderInfo.push({"rangeType": "range","borderType": "border-all","style":result[0],"color": color(result[1])?result[1]:'black',
            "range": [{"row": [pos.r,pos.r+(pos.rs?(pos.rs-1):0)],"column": [pos.c,pos.c+(pos.cs?(pos.cs-1):0)]}]  });
        }else
        {
            push_border('_BORDER-LEFT')
            push_border('_BORDER-TOP')
            push_border('_BORDER-RIGHT')
            push_border('_BORDER-BOTTOM')
        }
    });
    
    return {
        "name": grid._name, //工作表名称
        "color": "", //工作表颜色
        "index": 0, //工作表索引
        "status": 1, //激活状态
        "order": 0, //工作表的下标
        "hide": 0,//是否隐藏
        "row": (grid.rows && grid.rows.row) ? grid.rows.row.length:10, //行数
        "column": (grid.columns && grid.columns.column) ? grid.columns.column.length:10, //列数
        "defaultRowHeight": parseInt(DefaultCssSetting['defaultRowHeight']?? '25'), //自定义行高
        "defaultColWidth": parseInt(DefaultCssSetting['defaultColWidth']??'75'), //自定义列宽
        "celldata": celldata, //初始化使用的单元格数据
        "config": {
            "merge":merge, //合并单元格
            "rowlen":rowlen, //表格行高
            "columnlen":columnlen, //表格列宽
            "rowhidden":{}, //隐藏行
            "colhidden":{}, //隐藏列
            "borderInfo":borderInfo, //边框
            "authority":{}, //工作表保护
            
        },
        "cr_rows":grid.rows.row,
        "cr_columns":grid.columns.column,
        enableAddBackTop:false,enableAddRow:false,
		sheetFormulaBar:false,
        "scrollLeft": 0, //左右滚动条位置
        "scrollTop": 0, //上下滚动条位置
        "luckysheet_alternateformat_save":  JSON.parse( grid.alternateformat_save??'[]'), //交替颜色
        //"luckysheet_alternateformat_save_modelCustom":  JSON.parse( setting.alternateformat_save_modelCustom??'[]'), //自定义交替颜色	
        "luckysheet_conditionformat_save": JSON.parse( grid.conditionformat_save??'[]'),//条件格式
        "frozen": frozen, //冻结行列配置
        "chart": [], //图表配置
        "allowEdit": true, //是否允许编辑
        "image":[], //图片
        "showGridLines": true, //是否显示网格线
    }
}
export function resultGrid2LuckySheet(grid_name, param_grid){
    let {config_merge,rowlenArr,columnlenArr,config_borderInfo,config_celldata,conditionformat,alternateformat}={...param_grid}
    let _alternateformat;
    eval("_alternateformat=["+alternateformat+"]")
    return {
        "name": grid_name, //工作表名称
        "color": "", //工作表颜色
        "index": 0, //工作表索引
        "status": 1, //激活状态
        "order": 0, //工作表的下标
        "hide": 0,//是否隐藏
        
        "row": Object.keys(rowlenArr).length , //行数
        "column": Object.keys(columnlenArr).length, //列数
        "defaultRowHeight": 25, //自定义行高
        "defaultColWidth": 73, //自定义列宽
        "celldata": config_celldata, //初始化使用的单元格数据
        "config": {
            
            "merge":config_merge, //合并单元格
            "rowlen":rowlenArr, //表格行高
            "columnlen":columnlenArr, //表格列宽
            "rowhidden":{}, //隐藏行
            "colhidden":{}, //隐藏列
            "borderInfo":config_borderInfo, //边框
            "authority":{//当前工作表的权限配置
                selectLockedCells:1, //选定锁定单元格
                selectunLockedCells:1, //选定解除锁定的单元格
                formatCells:0, //设置单元格格式
                formatColumns:1, //设置列格式
                formatRows:1, //设置行格式
                insertColumns:0, //插入列
                insertRows:0, //插入行
                insertHyperlinks:1, //插入超链接
                deleteColumns:0, //删除列
                deleteRows:0, //删除行
                sort:1, //排序
                filter:1, //使用自动筛选
                usePivotTablereports:0, //使用数据透视表和报表
                editObjects:0, //编辑对象
                editScenarios:0, //编辑方案    
                sheet:1, //如果为1或true，则该工作表受到保护；如果为0或false，则该工作表不受保护。
                hintText:"", //弹窗提示的文字
                algorithmName:"None",//加密方案：MD2,MD4,MD5,RIPEMD-128,RIPEMD-160,SHA-1,SHA-256,SHA-384,SHA-512,WHIRLPOOL
                saltValue:null, //密码解密的盐参数，为一个自己定的随机数值
  
                allowRangeList:[{ //区域保护
                    name:"area", //名称
                    password:"1", //密码
                    hintText:"", //提示文字
                    algorithmName:"None",//加密方案：MD2,MD4,MD5,RIPEMD-128,RIPEMD-160,SHA-1,SHA-256,SHA-384,SHA-512,WHIRLPOOL
                    saltValue:null, //密码解密的盐参数，为一个自己定的随机数值
                    sqref:"\$C\$1:\$D\$5" //区域范围
                }]}, //工作表保护
            
        },
        enableAddBackTop:false,enableAddRow:false,
		sheetFormulaBar:false,
        "scrollLeft": 0, //左右滚动条位置
        "scrollTop": 0, //上下滚动条位置
        "luckysheet_alternateformat_save": _alternateformat, //交替颜色
        "luckysheet_alternateformat_save_modelCustom": [], //自定义交替颜色	
        //"luckysheet_conditionformat_save": conditionformat,//条件格式
        //"frozen": frozen, //冻结行列配置
        "chart": [], //图表配置
        "allowEdit": false, //是否允许编辑
        "image":[], //图片
        "showGridLines": 0, //是否显示网格线
    }   
}
export function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
  }
let signalR_connection
let _onReceiveMessage = undefined;
import { baseUrl } from '@/config/env'; 
import color from 'onecolor/lib/color';
export const get_signalR_connection=function(onReceiveMessage)
{ 
    _onReceiveMessage=onReceiveMessage
    if(signalR_connection && signalR_connection.connectionState!="Disconnected"    ){
        return signalR_connection
    }
    signalR_connection=new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/chatHub`, { accessTokenFactory: () => "d2762dbd" }).build();
    // Create a function that the hub can call to broadcast messages.
    signalR_connection.on('ReceiveMessage', function (name, message) {
        if(_onReceiveMessage)
            _onReceiveMessage(message)
        console.log(name||'', message||'');
    });
    // Transport fallback functionality is now built into start.
    signalR_connection.start()
        .then(function () {
            console.log('connection started');
            signalR_connection.invoke('SendMessage', "name", "messageInput.value");
    })
    .catch(error => {
        console.error(error.message);
    });
    return signalR_connection;
}
export const output_largeGrid=function(_this,cur_grid,onclickrow){
    if(cur_grid.type=="large"){
        let gridData=[]
        //cur_grid.data.splice(10)
        cur_grid.data.forEach(element => {
          let one_line={}
           gridData.push(one_line)
           for (let index = 0; index < cur_grid.col_list.length; index++) {
              one_line[cur_grid.col_list[index]]=element[index];
           }  
        });
        gridData={rows:gridData,footer:undefined,footer_merger_cell:undefined,total:gridData.length}
        _this.self.content=cur_grid.content.replace('data-options=""', 'data-options="" style="height:250px"').replaceAll("__url__",`${baseUrl}/run`)
        _this.self.content=cur_grid.content.replace("__exportjson__",JSON.stringify(gridData))
      }
      //_this.self.content=cur_grid.content//.replace(/needResizeFunc.push\( function \(\) \{myChart.resize\(\);\}\);/,'')
      
    if($.easyui==undefined){
        load_css_file("cdn/jquery-easyui-1.4.5/themes/default/easyui.css")
        load_css_file("cdn/jquery-easyui-1.4.5/themes/icon.css")
        seriesLoadScripts(["cdn/jquery-easyui-1.4.5/jquery.easyui.min.js",
                    "cdn/jquery-easyui-1.4.5/locale/easyui-lang-zh_CN.js",
                    "js/jquery-easyui-extend/datagrid-filter.js",
                    "js/jquery-easyui-extend/jquery.edatagrid.js",
                    "js/toExcel.js?updateTime=-12352"]
                    ,null,function(){ 
                    inner_output_largeGrid (_this,cur_grid,onclickrow) 
        })
    }else{
        inner_output_largeGrid (_this,cur_grid,onclickrow)
    }
}
function inner_output_largeGrid(_this,cur_grid,onclickrow){  
    
      let script_pattern=/<script.*?>*?>([\s\S]*?)<\/script>/img
      let result;
      while ((result = script_pattern.exec(_this.self.content)) != null)  {
        let match_result=result[1];
        if(match_result && match_result.length>0){
            setTimeout(function(){
                if (window.needResizeFunc==undefined)
                    window.needResizeFunc=[]
                if (window.allTableArr==undefined)
                    window.allTableArr=[]
                let script = document.createElement('script'); 
                _this.scriptArr.push(script);
                script.type ='text/javascript'; 
                window['easyui_grid_onclickrow_'+_this.gridName]=onclickrow
                script.text = match_result +`
                jQuery(function(){
                jQuery('#reportDiv${_this.gridName}thetable').datagrid({
                    onClickRow:easyui_grid_onclickrow_${_this.gridName} 
                }).datagrid('loadData', reportDiv${_this.gridName}_data);
            })
                
                `
                document.head.appendChild(script)      
            })
        }
      }
    } 

export const parse_json=function(root=[],cur_path="$",retList){
    
    let root_type=getObjType(root)
    if(root_type=="array"){
        retList.push(cur_path)
        return true
    }
    let has=false
    if(root_type=="object"){
        Object.keys(root).forEach(one=>{
            let child_has=parse_json(root[one],cur_path+"."+one,retList)
            has=has || child_has
        })
    }
    return has
}
export const json_by_path=function(root,path="$"){
    let cur=root
    path.split(".").forEach(one=>{
        if(one=='$')
            cur=root
        else 
            cur=cur[one]
    })
    return cur
}
export function extract_style_txt(txt){
    let script_pattern=/<style.*?>*?>([\s\S]*?)<\/style>/img
    let script_result;
    let css_result=''
    while ((script_result = script_pattern.exec(txt)) != null)  {
        let match_result=script_result[1];
        if(match_result && match_result.length>0){
            css_result=css_result+match_result
        }
    }
    return css_result
}
export function extract_script_txt(txt){
    let ret=""
    let script_result;
    let script_pattern=/<script.*?>*?>([\s\S]*?)<\/script>/img
    while ((script_result = script_pattern.exec(txt)) != null)  {
        let match_result=script_result[1];
        if(match_result && match_result.length>0){
            ret=ret+ "\n"+match_result
        }
    }
    return ret
}
export function insert_css_to_head(css_result,id="report_back_css") {
        document.getElementById(id)?.remove()
        const css_node = document.createElement('style');
        css_node.id = id;
        css_node.type="text/css"
        css_node.appendChild(document.createTextNode(css_result))
        document.getElementsByTagName('head')[0].appendChild(css_node);    
}
export function load_css_js(txt,id="report_back_css") {
    if(txt){
        let css_result=extract_style_txt(txt)
        if(css_result!=""){
            insert_css_to_head(css_result,id)
        }
        let ret=extract_script_txt(txt)
        return ret
    } 
}
export function load_script_file(script_name,inner_exec){
    let script=document.createElement('script');
    script.src=script_name;
    script.type='text/javascript';
    script.async=true;
    script.defer=true;
    if(inner_exec)
        script.onload=inner_exec
    void(document.head.appendChild(script))
}


/**
 * 并行加载指定的脚本
 * 并行加载[同步]同时加载，不管上个是否加载完成，直接加载全部
 * 全部加载完成后执行回调
 * @param {Array|String}  scripts 指定要加载的脚本
 * @param {Object} options 属性设置
 * @param {Function} callback 成功后回调的函数
 * @return {Array} 所有生成的脚本元素对象数组
 */

function parallelLoadScripts(scripts, options, callback) {
    if (typeof (scripts) !== 'object') {
        var scripts = [scripts];
    }
    var HEAD = document.getElementsByTagName('head')[0] || document.documentElement;
    var s = [];
    var loaded = 0;
    for (var i = 0; i < scripts.length; i++) {
        s[i] = document.createElement('script');
        s[i].setAttribute('type', 'text/javascript');
        // Attach handlers for all browsers
        // 异步
        s[i].onload = s[i].onreadystatechange = function () {
            if (!/*@cc_on!@*/0 || this.readyState === 'loaded' || this.readyState === 'complete') {
                loaded++;
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (loaded === scripts.length && typeof (callback) === 'function') callback();
            }
        };
        // 同步
        s[i].setAttribute('src', scripts[i]);

        // 设置属性
        if (typeof options === 'object') {
            for (var attr in options) {
                s[i].setAttribute(attr, options[attr]);
            }
        }

        HEAD.appendChild(s[i]);
    }
}
const load_script_list=[]
/** 
 * 串行加载指定的脚本
 * 串行加载[异步]逐个加载，每个加载完成后加载下一个
 * 全部加载完成后执行回调
 * @param {Array|String}  scripts 指定要加载的脚本
 * @param {Object} options 属性设置
 * @param {Function} callback 成功后回调的函数
 * @return {Array} 所有生成的脚本元素对象数组
 */
 export function seriesLoadScripts(scripts, options, callback) {
    function clear_define(){
        if(!old_define && window.define){
            old_define={_amdLoaderGlobal:window._amdLoaderGlobal,_commonjsGlobal:window._commonjsGlobal,AMDLoader:window.AMDLoader,define:window.define,require:window.require} 
            window._amdLoaderGlobal=undefined
            window._commonjsGlobal=undefined
            window.AMDLoader=undefined
            window.define=undefined
            window.require=undefined
        }
    }
    function restore_define(){
        if(old_define && old_define.define){
            window._amdLoaderGlobal=old_define._amdLoaderGlobal
            window._commonjsGlobal=old_define._commonjsGlobal
            window.AMDLoader=old_define.AMDLoader
            window.define=old_define.define
            window.require=old_define.require
          }
    }
    let old_define
    if (typeof (scripts) !== 'object') {
        var scripts = [scripts];
    }
    var HEAD = document.getElementsByTagName('head')[0] || document.documentElement;
    var s = [];
    var last = scripts.length - 1;
    //递归
    var recursiveLoad = function (i) {
        if(load_script_list.filter(x=>x==[scripts[i]]).length>0 ){
            if (i !== last) {
                recursiveLoad(i + 1);
            } else if (typeof (callback) === 'function') {
                clear_define()
                callback()
            };
            restore_define()
            return;
        }
        
        s[i] = document.createElement('script');
        s[i].setAttribute('type', 'text/javascript');
        s[i].onerror = function(e) {
            // 远程文件载入失败的处理逻辑
            alert('远程文件动态载入失败：'+scripts[i]);
          };
          
        // Attach handlers for all browsers
        // 异步
        s[i].onload = s[i].onreadystatechange = function () {
            if (!/*@cc_on!@*/0 || this.readyState === 'loaded' || this.readyState === 'complete') {
                load_script_list.push(scripts[i])
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
                if (i !== last) {
                    recursiveLoad(i + 1);
                } else if (typeof (callback) === 'function') {
                    clear_define()
                    callback()
                };
                restore_define()
            }
        }
        // 同步
        s[i].setAttribute('src', scripts[i]);

        // 设置属性
        if (typeof options === 'object') {
            for (var attr in options) {
                s[i].setAttribute(attr, options[attr]);
            }
        }
        HEAD.appendChild(s[i]);
    };
    clear_define()
    recursiveLoad(0);
}
export function load_css_file(url){
    var doc = document;
    var link = doc.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("id", url);
    link.setAttribute("href", url);
    document.getElementById(url)?.remove()
    var heads = doc.getElementsByTagName("head");
    if (heads.length) {
        heads[0].appendChild(link);
    }
    else {
        doc.documentElement.appendChild(link);
    }
}
//获取DPI
export function js_getDPI() {
    var arrDPI = new Array();
    if ( window.screen.deviceXDPI != undefined ) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        var tmpNode = document.createElement( "DIV" );
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild( tmpNode );
        arrDPI[0] = parseInt( tmpNode.offsetWidth );
        arrDPI[1] = parseInt( tmpNode.offsetHeight );
        tmpNode.parentNode.removeChild( tmpNode );
    }
    return arrDPI;
}

export function watermark(settings) {
    
    //默认设置
    let dft = {
        watermark_txt: "text",
        watermark_x: 20, //水印起始位置x轴坐标
        watermark_y: 20, //水印起始位置Y轴坐标
        watermark_rows: 20, //水印行数
        watermark_cols: 20, //水印列数
        watermark_x_space: 100, //水印x轴间隔
        watermark_y_space: 50, //水印y轴间隔
        watermark_color: '#aaa', //水印字体颜色
        watermark_alpha: 0.4, //水印透明度
        watermark_fontsize: '15px', //水印字体大小
        watermark_font: '微软雅黑', //水印字体
        watermark_width: 110, //水印宽度
        watermark_height: 40, //水印长度
        watermark_angle: 20 //水印倾斜度数
    };
    if (arguments.length === 1 && typeof arguments[0] === "object") {
        let src = arguments[0] || {};
        for (let key in src) {
            if (src[key] && dft[key] && src[key] === dft[key]) continue;
            else if (src[key]) dft[key] = src[key];
        }
    }
    let oTemp = document.createDocumentFragment();
    //获取页面最大宽度
    let page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
    let cutWidth = page_width * 0.0150;
    page_width = page_width - cutWidth;
    //获取页面最大高度
    let page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) - 50;
    //page_height = Math.max(page_height, window.innerHeight - 30);
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (dft.watermark_cols == 0 || (parseInt(dft.watermark_x + dft.watermark_width * dft.watermark_cols + dft.watermark_x_space * (dft.watermark_cols - 1)) > page_width)) {
        dft.watermark_cols = parseInt((page_width - dft.watermark_x + dft.watermark_x_space) / (dft.watermark_width + dft.watermark_x_space));
        dft.watermark_x_space = parseInt((page_width - dft.watermark_x - dft.watermark_width * dft.watermark_cols) / (dft.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (dft.watermark_rows == 0 || (parseInt(dft.watermark_y + dft.watermark_height * dft.watermark_rows + dft.watermark_y_space * (dft.watermark_rows - 1)) > page_height)) {
        dft.watermark_rows = parseInt((dft.watermark_y_space + page_height - dft.watermark_y) / (dft.watermark_height + dft.watermark_y_space));
        dft.watermark_y_space = parseInt(((page_height - dft.watermark_y) - dft.watermark_height * dft.watermark_rows) / (dft.watermark_rows - 1));
    }
    let x;
    let y;
    for (let i = 0; i < dft.watermark_rows; i++) {
        y = dft.watermark_y + (dft.watermark_y_space + dft.watermark_height) * i;
        for (let j = 0; j < dft.watermark_cols; j++) {
            x = dft.watermark_x + (dft.watermark_width + dft.watermark_x_space) * j;
            let mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            mask_div.appendChild(document.createTextNode(dft.watermark_txt));
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + dft.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + dft.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + dft.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + dft.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + dft.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "9999";
            //让水印不遮挡页面的点击事件
            mask_div.style.pointerEvents = 'none';
            mask_div.style.opacity = dft.watermark_alpha;
            mask_div.style.fontSize = dft.watermark_fontsize;
            mask_div.style.fontFamily = dft.watermark_font;
            mask_div.style.color = dft.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = dft.watermark_width + 'px';
            mask_div.style.height = dft.watermark_height + 'px';
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        };
    };
    document.body.appendChild(oTemp);
}
export function formatTime(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length));
    }    
    let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
    };
    
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';    
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));    
        }        
    }
    
    return fmt;

};
    
function padLeftZero(str) {
    return ('00' + str).substring(str.length);
}
function getNow() {
    let d = new Date();
    let year = d.getFullYear();
    let month = change(d.getMonth() + 1);
    let day = change(d.getDate());
    let hour = change(d.getHours());
    let minute = change(d.getMinutes());
    let second = change(d.getSeconds());

    function change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }
    let time = year + '年' + month + '月' + day + '日 ' + hour + '时' + minute + '分' + second + '秒';
    return time;
}
export function randomRgbColor() { //随机生成RGB颜色
    const r = Math.floor(Math.random() * 256); //随机生成256以内r值
    const g = Math.floor(Math.random() * 256); //随机生成256以内g值
    const b = Math.floor(Math.random() * 256); //随机生成256以内b值
    return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
  }
import {request} from 'axios'
import x2js from 'x2js' 
function getUrl(_this,data){
    if(typeof(_this)=="string")
        return _this
    else if(["preview","design",'conf'].includes( _this.mode) || ["preview","design",'conf'].includes( _this.context?.mode)){
        const x2jsone=new x2js(); //实例
        data.append("_content", x2jsone.js2xml({report:_this.context.report}) )
        data.append("reportName", _this.context.report.reportName)
        let grpId=_this.context.report.reportName.split(":")[0]
        return `${baseUrl}/design/preview${grpId==0?"":":"+grpId}`
    }
    else  if(_this.mode=="run"| _this.context?.mode=="run"){
        if(window.location.pathname.endsWith("run.html")){
            if(window.location.hash!='')
                return `${baseUrl}/run:${window.location.hash.substring(1)}`
            else
                return `${baseUrl}/run:default${window.location.search}`
        }
        else// if(window.location.pathname.endsWith("run"))
            return window.location.href
    }
}
export function call_server_func(func_name,func_params,_this,get_post='post') {
    let data=new FormData();
    data.append("__call_func",JSON.stringify({func_name,func_params}))    
    let run_url=getUrl(_this,data)
    if(run_url)
        return request({method: 'post',data,url: run_url,withCredentials: true
    })
    else{
        return new Promise((resolve,reject) => {
            reject(`call_server_func 远程调用【${func_name}】，没有定义url`);
        })
    }    
}
window.cellreport.call_server_func=call_server_func

export function getBase64(file){  //把图片转成base64编码
    return new Promise(function(resolve,reject){
        let reader=new FileReader();
        let imgResult="";
        reader.readAsDataURL(file);
        reader.onload=function(){
            imgResult=reader.result;
        };
        reader.onerror=function(error){
            reject(error);
        };
        reader.onloadend=function(){
            resolve(imgResult);
        }
    })
}
export function s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
//如果使用 FileSaver.js 就不要同时使用以下函数
export function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式 
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "下载";
    tmpa.href = URL.createObjectURL(obj); //绑定a标签
    tmpa.click(); //模拟点击实现下载
    setTimeout(function () { //延时释放
        URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}
//设置cookie
export function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
//获取cookie
export function  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return null;
}
//清除cookie  
export function  clearCookie(name) {  
    setCookie(name, "", -1);  
}  
function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}  
export async function  showDialog2 (ele_str, self,_this) {
    let context=_this.context||_this.create_context()
    let Cpn = { template:`
        <el-dialog v-draggable v-if="visible" style="text-align: left;" 
            :visible.sync="visible" 
            :close-on-click-modal="false" direction="btt" append-to-body 
            v-bind="{...{'custom-class':'dync_dialog',title:'信息'},...(self.dialog_params||{}) }"
        > 
        <div v-bind="{...{style:'height:50vh'},...(self.params||{})}">
            ${ele_str}
        </div>
        ${self?.slot?.footer??''}
        </el-dialog> 
            `,
                data(){
                    return {
                        visible: true,
                        self:self,
                    }
                },
                methods:{...(self?.methods??{} )}
            };
    return new Promise(function (resolve, reject) {
      // 初始化配置参数
      let opt = {
        
      }
      let component = Object.assign({}, Cpn)
      component.parent=_this
      // 创建构造器创建实例挂载
      let DialogC = Vue.extend(component)
      let dialog = new DialogC()
      // 关闭事件
      let _onClose = dialog.$options.methods.onClose
      dialog.onClose = function () {
        resolve()
        dialog.$destroy()
        _onClose && _onClose.call(dialog)
        document.body.removeChild(dialog.$el)
      }
      // 回调事件
      let _onCallback = dialog.$options.methods.onCallback
      dialog.onCallback = function (...arg) {
        try {
          _onCallback && _onCallback()
          resolve(arg)
          dialog.$destroy()
          _onClose && _onClose.call(dialog)
          document.body.removeChild(dialog.$el)
        } catch (e) {
          console.log(e)
        }
      }
      
      dialog.$mount()
      // 点击关闭按钮时会改变visible
      dialog.$watch('visible', function (n, o) {
            dialog?.onClose()
      })
      document.body.appendChild(dialog.$el)
    })
}
export async function  showDialog (ele_name, data,_this) {
    let self=findElelment(ele_name,data,_this)
    return showDialog2(`<widget-form-item  :self="self"  >  </widget-form-item>`,self,_this);
}

  export function findElelment(name,prop_dict,_this){
    let context=_this.context||_this.create_context()
    if(context.report_result){
      let ret=context.report_result.layout?.concat(
        context.report_result.layout_hidden||[]).filter(x=>x.element.gridName==name)
      if(ret!=null)
        return Object.assign({}, ret[0].element,prop_dict||{})
    }
  }
  export function find_item(item,_this){
    let context=_this.context||_this.create_context()
    if(context.mode!='design' || _this.selectWidget.type=='layout')
        return false;
    if(_this.selectWidget.type=='layout_item' && item.i==_this.selectWidget.item_i)
    {
        return true;
    }
    if(item==_this.selectWidget || item.element==_this.selectWidget)
    {
        return true;
    }
    let children=item.element?.children?.column || item.children?.column
    if(children)
    {
        for(let one in children){
            let in_child=_this.find_item(children[one])
            if(in_child)
            {
                return true;
            }
        }
    }        
    return false;
}
export function pivot(data) {
    const headers = [...new Set(data.slice(1).map(row => row[1]))];
    const rowHeaders = [...new Set(data.slice(1).map(row => row[0]))];
    const result = [[data[0][0], ...headers]];
    rowHeaders.forEach(rowHeader => {
        const row = [rowHeader];
        headers.forEach(header => {
            const sum = data
                .filter(row => row[0] === rowHeader && row[1] === header)
                .reduce((acc, row) => acc + row[2], 0);
            row.push(sum);
        });
        result.push(row);
    });
    return result;
}
export function isMobile(){
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag!=null && flag.length>0;
}