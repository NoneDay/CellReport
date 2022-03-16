import {getLuckyStyle,numToString } from "./util.js"
let color_convert = require('onecolor');

//如果使用 FileSaver.js 就不要同时使用以下函数
function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式 
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "下载";
    tmpa.href = URL.createObjectURL(obj); //绑定a标签
    tmpa.click(); //模拟点击实现下载
    setTimeout(function () { //延时释放
        URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}

function find_style(tbl,rowNo,colNo,cur_tbl_class_dict){        
    for(let idx=0;idx<tbl.abs_to_design.length;idx++){
        let one=tbl.abs_to_design[idx]
        let cur_ret={}
        if(one.row[0]<=rowNo && rowNo<=one.row[1] && one.col[0]<=colNo && colNo<=one.col[1]){
            Object.assign(cur_ret,default_css,cur_tbl_class_dict[tbl.loc_style[one.cell+"_S"] ??""],cur_tbl_class_dict[tbl.loc_style[one.cell+"_D"] ??""]
            )
            return cur_ret
        }
    }        
    return {}
  }
  let default_css
  function parse_elelment(x_ele){
    let ccc
    let ret={'font':{},'alignment':{},'border':{},'fill':{}};
    x_ele.split(";").forEach(element => {
        if(element=="")
          return
        let one_pair=element.split(":")
        switch(one_pair[0].trim()){
          case "background-color":
            ccc=color_convert(one_pair[1])
            if(ccc)
              ret['fill']['fgColor']={argb:ccc.hex().substring(1)}
            break
          case "color":
            ccc=color_convert(one_pair[1])
            if(ccc)
              ret['font']['color']={argb:ccc.hex().substring(1)}
            break
          case "font-family":
              ret['font']['name']=one_pair[1]
            break
          case "FONT-SIZE":
              ret['font']['size']=Number(one_pair[1].substring(0,one_pair[1].length-2)) //*72/96
            break
          case "font-weight":
            if(one_pair[1].trim()=='bold') ret['font']['bold']=true
            break
          case "text-align":
            if(one_pair[1].trim()!='')ret['alignment']['horizontal']=one_pair[1].trim()
            break
          case "vertical-align":
              if(one_pair[1].trim()!='')ret['alignment']['vertical']=one_pair[1].trim()
            break
          case "BORDER-LEFT":
            ccc=getLuckyStyle(one_pair[1])
            ret['border']['left']={style:ccc[2], color: {argb: color_convert(ccc[1]).hex()}}
            break
          case "BORDER-RIGHT":
            ccc=getLuckyStyle(one_pair[1])
            ret['border']['right']={style:ccc[2], color: {argb: color_convert(ccc[1]).hex()}}
            break
          case "BORDER-BOTTOM":
            ccc=getLuckyStyle(one_pair[1])
            ret['border']['bottom']={style:ccc[2], color: {argb: color_convert(ccc[1]).hex()}}
            break
          case "BORDER-TOP":
            ccc=getLuckyStyle(one_pair[1])
            ret['border']['top']={style:ccc[2], color: {argb: color_convert(ccc[1]).hex()}}
            break
            
        }
      });
      ['font','alignment','border','fill'].forEach(x=>{
        if(JSON.stringify(ret[x])=="{}")
          delete ret[x]
      })
      if(ret['fill']){
        ret['fill']['type']='pattern'
        ret['fill']['pattern']='solid'
      }
    
      return ret;
  }
  function parse_class(tbl){
    let cur_tbl_class_dict={'':{}}
    default_css=parse_elelment(tbl.reportDefaultCss) 
    
    //tbl.reportDefaultCss.split()
     //"background-color:#FFF; color:#000; font-family:微软雅黑; text-align:; FONT-SIZE:11pt; "
    Object.entries(tbl.styles).forEach(element=>{
      let ret=parse_elelment(element[1]) ;  
      ['font','alignment','border','fill'].forEach(prop=>{
          if(ret[prop]){
            ret[prop]=Object.assign({},default_css[prop],ret[prop])
          }
      })  
      cur_tbl_class_dict[element[0].trim()]=ret
                    
    })
    return cur_tbl_class_dict
  }
export  async function exceljs_inner_exec(_this_result){
    const wb = new ExcelJS.Workbook();
    let ws ,title,one_obj
    Object.keys( _this_result?.name_lable_map).forEach(one => {
      
        one_obj=_this_result?.name_lable_map[one]
        if(one_obj.component=="luckySheetProxy"){
          title=one_obj.label??one
          let cur_table=_this_result.data[one]
          let cur_tbl_class_dict=parse_class(cur_table)
          if (cur_table.type== "common"){
            //if(cur_table.optimize==true &&
            //  cur_table.columns.slice(-1)=="key")
            //while(wb.SheetNames.includes(title)) //_worksheets[1].name
            //  title=title+one_obj.gridName
            ws =wb.addWorksheet(title,{pageSetup:{fitToPage: false} });
            let col_width_arr=[]
            //1磅pt = 1/72 英寸
            //1英寸 = 96像素px（小字体时）
            //1英寸 = 120像素（大字体时）
            //Excel行高所使用单位为磅,列宽使用单位为0.1英寸
            //Excel行高所使用单位为磅（1cm=28.346磅），列宽使用单位为1/10英寸（既1个单位为2.54cm)
            Object.entries(cur_table.columnlenArr).forEach(c=>{
              col_width_arr[c[0]]={width:c[1] *10 /72 } 
            })
            ws.columns =col_width_arr

            let line_no=0
            let column_nums=Object.keys( cur_table.columnlenArr).length
            cur_table.tableData.forEach(one_line=>{                                    
              ws.addRow(one_line.slice(0,column_nums))
              let col_no=0
              one_line.forEach(one_cell => {
                if(col_no>=column_nums)
                  return
                let ret=find_style(cur_table,line_no,col_no,cur_tbl_class_dict)
                let name=numToString(col_no+1)+(line_no+1)
                let cur_cell=ws.getCell(name);
                ['font','alignment','border','fill'].forEach(p=>{
                  if(ret[p]){
                    cur_cell[p]=ret[p]
                  }
                })
                col_no++
              });
              line_no++
            })                
            Object.keys( cur_table.config_merge).forEach(ele_m=>{
              let m=cur_table.config_merge[ele_m]
              ws.mergeCells(numToString(m.c+1) + (m.r+1)+":"+ numToString(m.c+m.cs)+ (m.r+m.rs));
            })                
          }
          if (_this_result.data[one].type== "large"){
            ws= XLSX.utils.aoa_to_sheet(_this_result.data[one].tableData)
            let header_len=_this_result.data[one].tableData.length
            XLSX.utils.sheet_add_json (ws,_this_result.data[one].data, { origin: { r: header_len, c: 0 }})
            title=one_obj.label??one
          }
        }
        if(ws==undefined)
          return
        //while(wb.SheetNames.includes(title))
        //  title=title+one_obj.gridName
        //XLSX.utils.book_append_sheet(wb, ws, title.replace(/[\\|/|?|*|\[|\]]/,'_'))
        //ws=undefined
    });
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream"}), "这里是下载的文件名" + ".xlsx");
  }