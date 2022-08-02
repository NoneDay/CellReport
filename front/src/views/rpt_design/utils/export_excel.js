import {getLuckyStyle,numToString } from "./util.js"

const BitArray = require("./bits");
let color_convert = require('onecolor');

  const getBase64Img_old = (key) => {
    return new Promise((resolve,reject) => {
    axios.request({
      url:  key, headers: {
        "Cross-Method":'CORS',
      },
      method: 'get',noloading:true,needResponse:true,responseType: 'arraybuffer' 
    })
    .then((resp) => {
    const returnedB64 = `data:${resp.headers['content-type']};base64,${Buffer.from(resp.data).toString('base64')}`
    resolve(returnedB64)
    })
    .catch((err) => 
    {
      reject({ error: 'Invalid signature image' })
    }
    )
    })
    }
    const getBase64Img = (imgsrc) => {
      return new Promise((resolve,reject) =>    {
        const image =  document.createElementNS( 'http://www.w3.org/1999/xhtml', 'img' );;
      // 解决跨域 Canvas 污染问题      
      image.crossOrigin= '*';
      image.crossOrigin= 'anonymous';
      image.src = imgsrc;
      image.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, image.width, image.height);
          const url = canvas.toDataURL('image/png');
          resolve(url)
      };
      
  })
  }
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
    let ccc,i_idx
    let ret={'font':{},'alignment':{},'border':{},'fill':{}};
    x_ele.split(";").forEach(element => {
        if(element=="")
          return
        let one_pair=element.split(":")
        switch(one_pair[0].trim()){
          case "background-color":
            i_idx=one_pair[1].indexOf("!")
            if(i_idx>0)
              ccc=color_convert(one_pair[1].substring(0,i_idx).trim())
            else
            ccc=color_convert(one_pair[1].trim())
            if(ccc)
              ret['fill']['fgColor']={argb:ccc.hex().substring(1)}
            break
          case "color":
            i_idx=one_pair[1].indexOf("!")
            if(i_idx>0)
              ccc=color_convert(one_pair[1].substring(0,i_idx).trim())
            else
            ccc=color_convert(one_pair[1].trim())
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

function find_config_merge(result_tbl,rowNo,colNo){
  let {optimize,config_merge,abs_to_design,extend_lines}={...result_tbl}
  if(optimize){
      if(rowNo>=extend_lines[0] && rowNo<=extend_lines[1]){
          let t=config_merge[`${extend_lines[0]}_${colNo}`]
          return 
      }
      else
          return config_merge[`${rowNo}_${colNo}`]
  }
  for(let idx=0;idx<abs_to_design.length;idx++){
      let one=abs_to_design[idx]
      if(one.row[0]<=rowNo && rowNo<=one.row[1]
          && one.col[0]<=colNo && colNo<=one.col[1]){
              return config_merge[`${rowNo}_${colNo}`]
      }
  }
}  
const http_src_pattern=/<img [^>]*src=['"]([^'"]+)[^>]*>/gi  
export  async function exceljs_inner_exec(_this_result,name_lable_map){
    const wb = new ExcelJS.Workbook();
    let ws ,title,one_obj
    let allSheetNames=new Set()
    //Object.keys( name_lable_map).forEach(one => {
    for(let one of Object.keys( name_lable_map) ){
        one_obj=name_lable_map[one]
        if(one_obj.component=="luckySheetProxy"){
          title=one_obj.label??one
          let cur_table=_this_result.data[one]
          let cur_tbl_class_dict=parse_class(cur_table)
          if (cur_table.type== "common"){
            //if(cur_table.optimize==true &&
            //  cur_table.columns.slice(-1)=="key")
            while(allSheetNames.has(title)) //_worksheets[1].name
              title=title+one_obj.gridName
            allSheetNames.add(title)
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
            let tableBitFlag =new Array()
            for(let i=0;i<cur_table.tableData.length;i++)
                tableBitFlag[i]=new BitArray()
            let line_no=0
            let column_nums=Object.keys( cur_table.columnlenArr).length
            //cur_table.tableData.forEach(one_line=>{   
            for(let one_line of cur_table.tableData ){  
              ws.addRow(one_line.slice(0,column_nums))//添加数据到excel
              let col_no=0
              const row = ws.getRow(line_no+1)// 从1 开始计数，设置行高
              row.height= (cur_table.rowlenArr[line_no]??cur_table.rowlenArr["default"] )*72/96
              for(let one_cell of one_line){ 
              //one_line.forEach(async (one_cell) => {
                if(col_no>=column_nums)
                  continue   
                if(tableBitFlag[line_no].get(col_no))
                {
                  continue;
                }
                tableBitFlag[line_no].set(col_no ,1)
                let r_c=find_config_merge(cur_table,line_no,col_no)//config_merge[`${rowNo}_${colNo}`]
                if(r_c){
                    let {r, c, rs, cs}={...r_c}
                    for(let ri=0;ri<rs;ri++){
                        for(let ci=0;ci<cs;ci++){
                            tableBitFlag[r+ri]?.set(c+ci ,1)
                        }
                    }
                }
                let name=numToString(col_no+1)+(line_no+1)      //excel 单元格名字       
                if(one_cell?.indexOf && one_cell.indexOf("<img")>=0){
                  let imageId2=null
                  let script_result;
                  while ((script_result = http_src_pattern.exec(one_cell)) != null)  {
                      let match_result=script_result[1];
                      if(match_result && match_result.length>0){
                        if(match_result.startsWith("data")){
                          imageId2 = wb.addImage({
                            base64filename: `img/${name}.png`,
                            base64: match_result,
                            extension: 'png'
                          });
                         
                        }else 
                        //if(match_result.startsWith("http"))
                        {
                          
                          //let resp=await fetch(match_result,{mode: 'no-cors',redirect: 'follow',})
                          //let bbb=await resp.blob()
                          //const returnedB64 = `data:${resp.headers['content-type']};base64,${Buffer.from(bbb).toString('base64')}`
                          let img_response=await getBase64Img(match_result)
                          imageId2 = wb.addImage({
                            base64: img_response, 
                            extension: 'png',
                          });
                        }
                      }
                  }
                  ws.getCell(name).value=""
                  let m=cur_table.config_merge[`${line_no}_${col_no}`]
                  if(m){
                    ws.addImage(imageId2, numToString(m.c+1) + (m.r+1)+":"+ numToString(m.c+m.cs)+ (m.r+m.rs));
                  }else{                  
                    ws.addImage(imageId2, name+":"+name);
                  }
                  //ws.addBackgroundImage(imageId2);
                }
                //else  if(one_cell && one_cell.startsWith("<")>=0){
                //  let excel_cell=ws.getCell(name)
                //  excel_cell.value=""
                //  excel_cell.html= '<div>' + one_cell + '</div>';
                //}
                let ret=find_style(cur_table,line_no,col_no,cur_tbl_class_dict)
                
                let cur_cell=ws.getCell(name);
                ['font','alignment','border','fill'].forEach(p=>{
                  if(ret[p]){
                    cur_cell[p]=ret[p]
                  }
                })
                col_no++
              };
              line_no++
            }                
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
    };
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream"}), "这里是下载的文件名" + ".xlsx");
  }
  function s2ab(s) {
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
  export function xlsxjs_inner_exec(_this,name_lable_map){
      const wb = XLSX.utils.book_new()
      
      let ws ,title,one_obj
      Object.keys( name_lable_map).forEach(one => {
          one_obj=name_lable_map[one]
          if(one_obj.component=="ele-grid"){
            let {__valid_data__,valid_fileds,real_data}=build_chart_data(one_obj.datasource,{report_result:_this.result,clickedEle:_this.clickedEle,
                allElementSet:_this.allElementSet,},one_obj.fields)
            //let tableData = convert_array_to_json(__valid_data__)
            ws= XLSX.utils.aoa_to_sheet(__valid_data__)
            Object.entries(ws).forEach(([k,cell])=>{
              if(k=="!ref")
                return
              cell.s = {									//为某个单元格设置单独样式
                font: {
                  name: '宋体',
                  sz: 24,
                  bold: true,
                  color: { rgb: "red" }
                },
                alignment: { horizontal: "center", vertical: "center", wrap_text: true },
                fill: { bgcolor: { rgb: 'ffff00' } }
              }
            })
            title=one_obj.label??one
          }
          else if(one_obj.component=="luckySheetProxy"){
            if (_this.result.data[one].type== "common"){
              ws= XLSX.utils.aoa_to_sheet(_this.result.data[one].tableData)
              ws['!merges']=[]
              Object.keys( _this.result.data[one].config_merge).forEach(ele_m=>{
                let m=_this.result.data[one].config_merge[ele_m]
                ws['!merges'].push({s:{c:m.c,r:m.r},e:{c:m.c+m.cs-1,r:m.r+m.rs-1}})
                              
              })
              title=one_obj.label??one
            }
            if (_this.result.data[one].type== "large"){
              ws= XLSX.utils.aoa_to_sheet(_this.result.data[one].tableData)
              let header_len=_this.result.data[one].tableData.length
              XLSX.utils.sheet_add_json (ws,_this.result.data[one].data, { origin: { r: header_len, c: 0 }})
              title=one_obj.label??one
            }
          }
          if(ws==undefined)
            return
          while(wb.SheetNames.includes(title))
            title=title+one_obj.gridName
          XLSX.utils.book_append_sheet(wb, ws, title.replace(/[\\|/|?|*|\[|\]]/,'_'))
          ws=undefined
      });
      const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };//这里的数据是用来定义导出的格式类型 
      saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}), 
      "这里是下载的文件名" + ".xlsx");

    }
