function treeGrid_onLoadSuccess(a_dataGrid,gridName,grid_data){
    if(grid_data.footer)
        $(a_dataGrid).treegrid("reloadFooter",grid_data.footer);
    var footer_merger_cell=grid_data.footer_merger_cell;
    if(!footer_merger_cell)
        return;

    for(var i=0; i<footer_merger_cell.length; i++){
        var one_merge=footer_merger_cell[i];
        var cell_width=0,cell_height=0;

        var options=$(a_dataGrid).datagrid("options");
        in_view_1=false;
        if(options.frozenColumns.length>0 ){
            var columns=options.frozenColumns[options.frozenColumns.length-1];
            for(var i2=0;i2<columns.length;i2++)
                if(columns[i2].field== one_merge.field){
                    in_view_1=true;
                    if(options.rownumbers)
                        one_merge.col++;
                    break;
                }
        } 
        if(in_view_1)
            all_line=$('#reportDiv'+ gridName +' .datagrid-view1 .datagrid-footer .datagrid-ftable tbody tr');
        else
            all_line=$('#reportDiv'+ gridName +' .datagrid-view2 .datagrid-footer .datagrid-ftable tbody tr');

        var one_cell=$(all_line[one_merge.index]).children('td[field='+ one_merge.field+']');
        for(var row= one_merge.index;row<one_merge.index + one_merge.rowspan;row++)
        {
            var one_line=$(all_line[row]).children();
            for(var col= one_merge.col;col<one_merge.col+one_merge.colspan;col++){
                if(row== one_merge.index )
                    cell_width+=$(one_line[col].childNodes[0]).outerWidth();
                if(col== one_merge.col )
                    cell_height+=$(one_line[col].childNodes[0]).outerHeight();
                if(row== one_merge.index && col== one_merge.col)
                    continue;
                $(one_line[col]).css('display',"none");
            }
        }
        one_cell.addClass('datagrid-td-merged');
        if(one_merge.rowspan)one_cell.attr('rowspan',one_merge.rowspan);
        if(one_merge.colspan)one_cell.attr('colspan',one_merge.colspan);
        $(one_cell.children('div')[0]).css('width',cell_width-(one_merge.col==1?0:4));
        $(one_cell.children('div')[0]).css('height',cell_height);                           
    }
}
 function pagerFilter(data){  
            if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array  
                data = {  
                    total: data.length,  
                    rows: data  
                }  
            }  
            var dg = $(this);  
            var opts = dg.datagrid('options');  
            var pager = dg.datagrid('getPager');  
            pager.pagination({  
                onSelectPage:function(pageNum, pageSize){  
                    opts.pageNumber = pageNum;  
                    opts.pageSize = pageSize;  
                    pager.pagination('refresh',{  
                        pageNumber:pageNum,  
                        pageSize:pageSize  
                    });  
                    dg.datagrid('loadData',data);  
                }  
            });  
            if (!data.originalRows){  
                data.originalRows = (data.rows);  
            }
                        if (!opts.remoteSort && opts.sortName){
                                var target = this;
                                var names = opts.sortName.split(',');
                                var orders = opts.sortOrder.split(',');
                                data.originalRows.sort(function(r1,r2){
                                    var r = 0;
                                    for(var i=0; i<names.length; i++){
                                        var sn = names[i];
                                        var so = orders[i];
                                        var col = $(target).datagrid('getColumnOption', sn);
                                        var sortFunc = col.sorter || function(a,b){
                                            return a==b ? 0 : (a>b?1:-1);
                                        };
                                        r = sortFunc(r1[sn], r2[sn]) * (so=='asc'?1:-1);
                                        if (r != 0){
                                            return r;
                                        }
                                    }
                                    return r;
                                });
                            }              
            var start = (opts.pageNumber-1)*parseInt(opts.pageSize);  
            var end = start + parseInt(opts.pageSize);  
            data.rows = (data.originalRows.slice(start, end));  
            return data;  
        }  
function ChangeToTable(elDiv,my_excel_file) {
        var printDatagrid=$('#'+elDiv+'thetable');
    var tableString = '\r\n<table border="1" style="font-size: 12px;" cellspacing="0">\r\n';
       var aaaaaaa='';
    if(printDatagrid.attr('data-options') == undefined) return null;
            
    var frozenColumns = printDatagrid.datagrid("options").frozenColumns;  // 得到frozenColumns对象
    var a_columns = printDatagrid.datagrid("options").columns;    // 得到columns对象
    var newJson = $.extend(true,{}, frozenColumns);
    var columns =[] ;
    if(!frozenColumns || frozenColumns.length==0)
        columns=a_columns;
    else{
        for(var i=0;i<a_columns.length;i++){
            var one=[];
            Array.prototype.push.apply(one, frozenColumns[i]);
            Array.prototype.push.apply(one, a_columns[i]);
            columns.push(one);
        }
    }
    var gridFillBitArr=new Array();
    for(var i=0;i<columns.length;i++){
        gridFillBitArr.push(new Array());
        //gridFillBitArr[length-1].push(1);
    }
        var nameList2 = new Array();
        var col_num=0,row_num=0,cur_col=0;
    // 载入title
    if (typeof columns != 'undefined' && columns != '') {
        $(columns).each(function (index) {
            tableString += '\n<tr>';
                cur_col=0;
            for(var row_i=0;row_i<gridFillBitArr[index].length;row_i++){
                            if(gridFillBitArr[index][row_i]==0) break;
                            cur_col=row_i+1;
            }


            for (var i = 0; i < columns[index].length; ++i) {
 
                if (!columns[index][i].hidden) {
                    tableString += '\n<th width="' + columns[index][i].width + '"';
                    if (typeof columns[index][i].rowspan != 'undefined' && columns[index][i].rowspan > 1) 
                        tableString += ' rowspan="' + columns[index][i].rowspan + '"';
                    if (typeof columns[index][i].colspan != 'undefined' && columns[index][i].colspan > 1) 
                        tableString += ' colspan="' + columns[index][i].colspan + '"';     
                    if (typeof columns[index][i].field != 'undefined' && columns[index][i].field != '') 
                        nameList2[cur_col]=columns[index][i];
                    tableString += '>' + columns[index][i].title + '</th>';
                }
                if (typeof columns[index][i].rowspan != 'undefined' && columns[index][i].rowspan > 1) 
                    row_num=columns[index][i].rowspan;
                else row_num=1;
                if (typeof columns[index][i].colspan != 'undefined' && columns[index][i].colspan > 1) 
                    col_num=columns[index][i].colspan;                         
                else col_num=1;
                    for(var row_i=0;row_i<row_num;row_i++)
                        for(var col_i=0;col_i<col_num;col_i++){
                            while(gridFillBitArr[row_i+ index ].length<cur_col)
                                gridFillBitArr[row_i+ index ].push(0);
                        if(gridFillBitArr[row_i+ index ][cur_col]!= 'undefined' && gridFillBitArr[row_i+ index ][cur_col]==0)
                        	gridFillBitArr[row_i+ index ][cur_col]=1;
                        else
                        	gridFillBitArr[row_i+ index ].push(1);
                        }
                cur_col+=col_num;
                for(var row_i=0;row_i<gridFillBitArr[index].length;row_i++){
                            if(gridFillBitArr[index][row_i]==0) break;
                            cur_col=row_i+1;
            		}
            }
            tableString += '</tr>\r\n';
        });
    }
    // 载入内容
    var rows = eval(elDiv+'_data'); // 这段代码是获取当前页的所有行
   if(rows.originalRows )
        rows=rows.originalRows ;
   else if(rows.rows)
        rows=rows.rows;
        
   my_excel_file.write(tableString);
    for (var i = 0; i < rows.length; ++i) {
        my_excel_file.write('\n<tr>');
    		for (var j = 0; j < nameList2.length; j++) {
 
            var e = nameList2[j].field.lastIndexOf('_0');
						if(typeof rows[i][nameList2[j].field]=='number')
            	my_excel_file.write('\n<td');
            else
            	my_excel_file.write('\n<td x:str');
            if (nameList2[j].align != undefined && nameList2[j].align != '') {
                my_excel_file.write(' style="text-align:' + nameList2[j].align + ';"');
            }
            my_excel_file.write('>');
            if (e + 2 == nameList2[j].field.length) {
                tableString = rows[i][nameList2[j].field.substring(0, e)];
            }
            else
                tableString = rows[i][nameList2[j].field];
           my_excel_file.write(tableString);                
           my_excel_file.write('</td>');
        }
        my_excel_file.write('</tr>\r\n');
    }
    my_excel_file.write('\n</table>');
}

function Export(strXlsName, exportGrid) {
    var f = $('<form action="/export.aspx" method="post" id="fm1"></form>');
    var i = $('<input type="hidden" id="txtContent" name="txtContent" />');
    var l = $('<input type="hidden" id="txtName" name="txtName" />');
    i.val(ChangeToTable(exportGrid));
    i.appendTo(f);
    l.val(strXlsName);
    l.appendTo(f);
    f.appendTo(document.body).submit();
    document.body.removeChild(f);
}


function replaceHtml(replacedStr,repStr,endStr){   
    var replacedStrF = "";   
    var replacedStrB = "";   
    var repStrIndex = replacedStr.indexOf(repStr);   
    while(repStrIndex != -1){   
        replacedStrF = replacedStr.substring(0,repStrIndex);   
        replacedStrB = replacedStr.substring(repStrIndex,replacedStr.length);   
        replacedStrB = replacedStrB.substring(replacedStrB.indexOf(endStr)+1,replacedStrB.length);   
        replacedStr = replacedStrF + replacedStrB;   
        repStrIndex = replacedStr.indexOf(repStr);   
    }   
    return replacedStr;   
}   
// file generateHTML.js
// this method saves the passed HTML text to file
function Save(file, pageNumber, htmlText)
{
  file = file + pageNumber;
  file = file + ".html"

  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var folder = fso.GetSpecialFolder(2);
folder="c:/";
  file = folder + "/" + file;
  var a = fso.CreateTextFile(file, true);
     a.WriteLine(htmlText);
  a.Close();

  return file;
}
function MyStringBuffer(){
    this.obj="";
}
MyStringBuffer.prototype.write=function(str){
    this.obj=this.obj+str;
}
function htmlToExcel(print_prview,elDiv ){  
        var oExcel=null;
    try{ //document.getElementById(myTable),  ChangeToTable($('#'+myTable+'thetable'))
        if(elDiv==null)  elDiv=reportDivmain;
        var my_excel_file = new MyStringBuffer();
        my_excel_file.write('<html xmlns:x=\'urn:schemas-microsoft-com:office:excel\' xmlns:o=\'urn:schemas-microsoft-com:office:office\'>');
        my_excel_file.write('<head><meta http-equiv=\'Content-Type\' content=\'text/html; charset=utf-8\' /></head><body>') ;
        //my_excel_file.write(reportDivmainthetable_style.outerHTML) ;
        if($('#'+elDiv+'thetable').attr('data-options') == undefined){
            var elDivStr = document.getElementById(elDiv).innerHTML.replace(/x:str=""/g, "x:str");
                elDivStr = replaceHtml(elDivStr,'<a','>');   
        elDivStr = replaceHtml(elDivStr,'</a','>');   
             my_excel_file.write(elDivStr);
        } else{
            ChangeToTable(elDiv,my_excel_file);
        }       
        my_excel_file.write("</body></html>");
        var isIE = !!window.ActiveXObject || "ActiveXObject" in window;
        if(!isIE){
            var blob = new Blob([my_excel_file.obj], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "报表.xls");
            return;
        }
        //elTableOut.border=1;   
        var fso = new ActiveXObject("Scripting.FileSystemObject") ;
        var filePath = fso.GetSpecialFolder(2) + "\MyExportedExcel.htm" ;
        var i=0;var hasExpection=false;
        do{
            hasExpection=false;
            try{
                filePath = fso.GetSpecialFolder(2) + "\MyExportedExcel"+i+".htm" ;
                var my_excel_file=fso.CreateTextFile(filePath);
                
                my_excel_file.write('<html xmlns:x=\'urn:schemas-microsoft-com:office:excel\' xmlns:o=\'urn:schemas-microsoft-com:office:office\'>');
                my_excel_file.write('<head><meta http-equiv=\'Content-Type\' content=\'text/html; charset=gb2312\' /></head><body>') ;
                //my_excel_file.write(reportDivmainthetable_style.outerHTML) ;
                        if($('#'+elDiv+'thetable').attr('data-options') == undefined){
                                var elDivStr =document.getElementById(elDiv).innerHTML;
                                elDivStr = replaceHtml(elDivStr,'<a','>');   
                        elDivStr = replaceHtml(elDivStr,'</a','>');   
                             my_excel_file.write(elDivStr);
                        } else{
                            ChangeToTable(elDiv,my_excel_file);
                        }       
                        my_excel_file.write("</body></html>");
                my_excel_file.close();
                if(fso.FileExists(filePath+'.xls'))
                    fso.DeleteFile(filePath+'.xls');
            }catch(e){
                i++;
                hasExpection=true;
            }
        }while(hasExpection && i<10);
               
                
        try{
            oExcel = new ActiveXObject('Excel.Application');
        }
        catch(e) {
              alert( '要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件,并信任服务器。”，您的浏览器须允许执行控件。 请点击【帮助】了解浏览器设置方法！');
              return '';
        }

                //return;
        var workbooks=oExcel.Workbooks.open(filePath,null,true) ;
/*              oExcel.ActiveWorkbook.saveAs(filePath+'.xls',56);
                workbooks.close();
                fso.DeleteFile(filePath);

                oExcel.Workbooks.open(filePath+'.xls') ;*/
/* excel 2003
        //oExcel.Application.DisplayAlerts = false;
        var oBook = oExcel.Workbooks.Add;
        oBook.HTMLProject.HTMLProjectItems('Sheet1').Text = sHTML;
        //alert(oExcel.Version);
        oBook.HTMLProject.RefreshDocument();
        */
        try{
        var PageSetup = oExcel.Sheets(1).PageSetup; 
        //PageSetup.PaperSize = elDiv.paperSize_rawKind ; 
        PageSetup.CenterFooter = "第 &P 页，共 &N 页";
        if(elDiv.landscape=='false')
            PageSetup.Orientation = 1;
        else
            PageSetup.Orientation = 2;
       if(elDiv.titleRows!=null)
            PageSetup.PrintTitleRows = elDiv.titleRows;
        if(elDiv.titleCols!=null)
            PageSetup.PrintTitleColumns = elDiv.titleCols;
            }catch(e){ alert(e); }
/* 
      PageSetup.LeftMargin = elDiv.marginLeft;
        PageSetup.RightMargin = elDiv.marginRight;
        PageSetup.TopMargin = elDiv.marginTop;
        PageSetup.BottomMargin =elDiv.marginBottom;

        PageSetup.LeftHeader = elDiv.header ;                                        
                                   
        PageSetup.LeftFooter = elDiv.footer   ;                                       
 
        //*/   
         oExcel.Visible = true;
        oExcel.UserControl = true;        

        if(print_prview==1){
            oExcel.ActiveWindow.SelectedSheets.PrintPreview;
        }
        if(print_prview==2){
            oExcel.Dialogs(9).Show;
            oExcel.ActiveWindow.SelectedSheets.PrintOut;
        }
        if(print_prview==1 || print_prview==2){
            oExcel.Application.DisplayAlerts = false
            oExcel.ActiveWindow.Close;
            oExcel.Quit();
            //window.setInterval('Cleanup();',1);  
        }
    }catch(e){   
        if(oExcel!=null){
            oExcel.Application.DisplayAlerts = false
            oExcel.ActiveWindow.Close;
            oExcel.Quit();
        }
        alert(e.description)   
    }   
}
function GotoErr()
{
    var DivErr=document.getElementById('DivErr')
    if(DivErr.style.visibility=="")
    {   
        DivErr.style.visibility="hidden"
    }
    else
    {
        DivErr.style.visibility=""
    }
} 

 function setReportWZ()
        {       /*
             $(allTableArr).each(function (){
           var div_Fix=$('#'+this.table).parent();               
           if($(div_Fix).hasClass("ui-tabs-panel"))
                            $(div_Fix).height(div_Fix.parent().height()-20);
        });*/
        		$(needResizeFunc).each(function(){this.call()});
             $(allTableArr).each(function (){
                if(this.tableType=='datagrid')
                    $('#'+this.table+'thetable').datagrid("resize");
                if(this.tableType=='edatagrid')
                    $('#'+this.table+'thetable').edatagrid("resize");
                if(this.tableType=='freeReport' && (this.fix_rows_hight>0 || this.fix_columns_width>0)){                         
                        var div_Fix_parent=$('#'+this.table).parent();      
                  var div_Fix=$('#'+this.table);
                      var thetable=$('#'+this.table + 'thetable');
                      var Div_Left=$('#'+this.table + '_Div_Left');
                      var Div_Top=$('#'+this.table + '_Div_Top');
                      var Div_TopLeft=$('#'+this.table + '_Div_TopLeft');         
               
                var deta1 = 16; 
                    if(window.navigator.userAgent.indexOf("Mobil")>=0)
                        deta1=0;
                                       
                  div_Fix.css("width",'100%').css("height",'100%');
                  Div_Top.css({width:'100%',height:Div_Top.children('table').height()+1}).width(Div_Top.width()-deta1);
                  Div_TopLeft.css({width:this.fix_columns_width+1 ,height:Div_Top.children('table').height()});
                  Div_Left.css({width:this.fix_columns_width +1,height:'100%'}).height(Div_Left.height()-deta1);

                    div_Fix.scroll(function (){
                              Div_Top.scrollLeft(this.scrollLeft);
                        Div_Left.scrollTop(this.scrollTop);
                    });                 
                }                   
             });
   }
    function menuForSheet(myTable,tableType){
        $('#'+myTable).bind('contextmenu',function(e){
                e.preventDefault();   
                $('#mm').html("");
                    $('#mm').menu('appendItem', {text: '导出excel',iconCls: 'icon-ok',onclick: function(){ htmlToExcel(0,myTable);}});
                    $('#mm').menu('appendItem', {text: '打印',iconCls: 'icon-ok',onclick: function(){htmlToExcel(1,myTable);}});
                    $('#mm').menu('appendItem', {text: '打印预览',iconCls: 'icon-ok',onclick: function(){htmlToExcel(2,myTable);}});
                    if(tableType=='datagrid'){
                            var data =eval(myTable +"_data");
                            if(data.hasFilter || data.hasFilter==true)
                                $('#mm').menu('appendItem', {text: '关闭过滤器',iconCls: 'icon-ok',onclick: function(){
                                    $("#"+ myTable +"thetable").datagrid("disableFilter").datagrid("options").loadFilter=pagerFilter;
                                    $("#"+ myTable +"thetable").datagrid('loadData', data);                 
                                    data.hasFilter=false;    
                                 }});
                          else
                                $('#mm').menu('appendItem', {text: '打开过滤器',iconCls: 'icon-ok',onclick: function(){
                                    $("#"+ myTable +"thetable").datagrid("options").loadFilter=function (data){return data;};
                        if (data.originalRows){  
                            data.rows= data.originalRows ;
                                    delete data.originalRows;
                                    }
                                    $("#"+ myTable +"thetable").datagrid("enableFilter").datagrid('loadData', data);
                                    data.hasFilter=true;

                                 }});
          }
                $('#mm').menu('show', {                    
                        left: e.pageX,                    
                        top: e.pageY                
                });            
        });
        }       


//Date的prototype 属性可以向对象添加属性和方法。   
Date.prototype.Format = function(fmt){
        var o = {
            "M+": this.getMonth()+1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "S+": this.getMilliseconds()
        };
        //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
        if(/(y+)/.test(fmt)){
            //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
            fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
        }
        for(var k in o){
            if (new RegExp("(" + k +")").test(fmt)){
                //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
            }
        }
        return fmt;
    };	
function watermark(settings) {
    //默认设置
    var defaultSettings={
        watermark_txt:"14100298",
        watermark_x:20,//水印起始位置x轴坐标
        watermark_y:20,//水印起始位置Y轴坐标
        watermark_rows:20,//水印行数
        watermark_cols:20,//水印列数
        watermark_x_space:100,//水印x轴间隔
        watermark_y_space:50,//水印y轴间隔
        watermark_color:'gray',//水印字体颜色
        watermark_alpha:0.4,//水印透明度
        watermark_fontsize:'15px',//水印字体大小
        watermark_font:'微软雅黑',//水印字体
        watermark_width:210,//水印宽度
        watermark_height:80,//水印长度
        watermark_angle:15//水印倾斜度数
    };
    //采用配置项替换默认值，作用类似jquery.extend
    if(arguments.length===1&&typeof arguments[0] ==="object" )
    {
        var src=arguments[0]||{};
        for(key in src)
        {
            if(src[key]&&defaultSettings[key]&&src[key]===defaultSettings[key])
                continue;
            else if(src[key])
                defaultSettings[key]=src[key];
        }
    }
 
    var oTemp = document.createDocumentFragment();
 
    //获取页面最大宽度
    var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
    var cutWidth = page_width*0.0150;
    var page_width=page_width-cutWidth;
    //获取页面最大高度
    var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight)+450;
    // var page_height = document.body.scrollHeight+document.body.scrollTop;
    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
    if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width *defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
        defaultSettings.watermark_cols = parseInt((page_width-defaultSettings.watermark_x+defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
        defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
    }
    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
    if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
        defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
        defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
    }
    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermark_rows; i++) {
        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
        for (var j = 0; j < defaultSettings.watermark_cols; j++) {
            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
            var mask_div = document.createElement('div');
            mask_div.id = 'mask_div' + i + j;
            mask_div.className = 'mask_div';
            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
            //设置水印div倾斜显示
            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
            mask_div.style.visibility = "";
            mask_div.style.position = "absolute";
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            mask_div.style.overflow = "hidden";
            mask_div.style.zIndex = "9999";
            mask_div.style.pointerEvents='none';//pointer-events:none  让水印不遮挡页面的点击事件
            //mask_div.style.border="solid #eee 1px";
            mask_div.style.opacity = defaultSettings.watermark_alpha;
            mask_div.style.fontSize = defaultSettings.watermark_fontsize;
            mask_div.style.fontFamily = defaultSettings.watermark_font;
            mask_div.style.color = defaultSettings.watermark_color;
            mask_div.style.textAlign = "center";
            mask_div.style.width = defaultSettings.watermark_width + 'px';
            mask_div.style.height = defaultSettings.watermark_height + 'px';
            mask_div.style.display = "block";
            oTemp.appendChild(mask_div);
        };
    };
    document.body.appendChild(oTemp);
}

//数据排序方法
function orderbydata(data, index, isAsc) {
    if (isAsc == null) {
        isAsc = true;
    }
    //获取数据类型
    function getObjType(obj) {
        let toString = Object.prototype.toString;

        let map = {
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
        }

        // if(obj instanceof Element){
        //     return 'element';
        // }

        return map[toString.call(obj)];
    }
    let error = {
        v: "#VALUE!",    //错误的参数或运算符
        n: "#NAME?",     //公式名称错误
        na: "#N/A",      //函数或公式中没有可用数值
        r: "#REF!",      //删除了由其他公式引用的单元格
        d: "#DIV/0!",    //除数是0或空单元格
        nm: "#NUM!",     //当公式或函数中某个数字有问题时
        nl: "#NULL!",    //交叉运算符（空格）使用不正确
        sp: "#SPILL!"    //数组范围有其它值
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
        return moment(now).diff(moment(then));
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
    return moment(now).diff(moment(then));
}

    let a = function (x, y) {
        let x1 = x[index], y1 = y[index];

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
            return numeral(x1).value() - numeral(y1).value();
        else if (!isRealNum(x1) && !isRealNum(y1))
            return x1.localeCompare(y1, "zh");
        else if (!isRealNum(x1))
            return 1;
        else if (!isRealNum(y1))
            return -1;

    }

    let d = function (x, y) {
        let x1 = x[index], y1 = y[index];
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
            return numeral(y1).value() - numeral(x1).value();
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
function my_sort(d,r1,r2,c1,c2,sort_i,sheet) {
    let str = r1;
    let hasMc = false; //Whether the sort selection has merged cells
    let data = [];
    for (let r = str; r <= r2; r++) {
        let data_row = [];
        for (let c = c1; c <= c2; c++) {
            if (d[r][c] != null && d[r][c].mc != null) {
                hasMc = true;
                break;
            }
            data_row.push(d[r][c]);
        }

        data.push(data_row);
    }
    if (hasMc) {
        alert('locale_sort.mergeError');
        return;
    }
    data = orderbydata([].concat(data), sort_i, false);
    let my_hyperlink = {};
    for (let r = str; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
            if (data[r - str][c - c1].my_href != undefined) {
                my_hyperlink[`${r}_${c}`] = data[r - str][c - c1].my_href
            }
            d[r][c] = data[r - str][c - c1];
        }
    }
    sheet.my_hyperlink = my_hyperlink
} 
function cellAllRenderBefore(data, sheet, ctx) {
    if (!sheet.already_cr) {
        sheet.already_cr = true;
        $("#my-sort-options-sheet" + sheet.index).remove();
        let r1 = sheet.my_line_conf.start_extend_line_no,
            r2 = sheet.my_line_conf.end_extend_line_no;
        let c1 = 0,
            c2 = sheet.my_line_conf.columns;
       
        let optionHTML = "";
        Object.keys(sheet.my_sort).forEach(element => {
            if (sheet.my_hyperlink[element] != undefined)
                delete sheet.my_hyperlink[element]
            c_r = element.split('_');
            let r = parseInt( c_r[0])
            let c = parseInt(c_r[1])

            let _r2 = r, _c2 = c, merge_cell = sheet.config.merge[`${r}_${c}`]
            if (merge_cell != undefined) {
                _r2 = merge_cell.r + merge_cell.rs-1
                _c2 = merge_cell.c + merge_cell.cs-1
            }

            let row = sheet.visibledatarow[_r2],
                row_pre = r - 1 == -1 ? 0 : sheet.visibledatarow[r - 1]

            col = sheet.visibledatacolumn[_c2],
                col_pre = c - 1 == -1 ? 0 : sheet.visibledatacolumn[c - 1];
            optionHTML += '<div data-rowhidden="" data-str="' + (r1-1) + '" data-edr="' + r2 +
                '" data-rindex="' + r + '" data-cindex="' + c + '" data-stc="' + c1 + '" data-edc="' + c2 +
                `" class="my-sort-options my-options" style="left:${col_pre + 1}px;top:${row_pre}px;width:${col - col_pre - 2}px;height:${row - row_pre - 3}px;">` +
                '<i class="fa fa-caret-down" aria-hidden="true" style="bottom: 0;position: absolute;right: 0px;"></i></div>';
            
        });
         
        Object.keys(sheet.my_hyperlink).forEach(element => {
            let c_r = element.split('_');
            let r1 = parseInt(c_r[0]), c1 = parseInt(c_r[1]),r2=r1,c2=c1, merge_cell = sheet.config.merge[`${r1}_${c1}`]
            if (merge_cell != undefined) {
                r2 = merge_cell.r + merge_cell.rs - 1
                c2 = merge_cell.c + merge_cell.cs - 1
            }
            sheet.data[r1][c1].my_href = sheet.my_hyperlink[element]
            let row = sheet.visibledatarow[r2],
                row_pre = r1 - 1 == -1 ? 0 : sheet.visibledatarow[r1 - 1];
            col = sheet.visibledatacolumn[c2],
                col_pre = c1 - 1 == -1 ? 0 : sheet.visibledatacolumn[c1 - 1];
            optionHTML += '<div data-rowhidden="" data-str="' + (r1 - 1) + '" data-edr="' + r2 +
                '" data-rindex="' + r1 + '" data-cindex="' + c1 + '" data-stc="' + c1 + '" data-edc="' + c2 +
                `" class="my-options" style="background-color:#fff; left:${col_pre + 1}px;top:${row_pre}px;width:${col - col_pre - 2}px;height:${row - row_pre - 3}px;">${sheet.my_hyperlink[element]}</div>`;
        });
        $("#luckysheet-cell-main").append('<div id="my-sort-options-sheet' + sheet.index + '" class="my-sort-options-c">' + optionHTML + '</div>');
        $('a').attr("target", "_parent");
        $(`#luckysheet-cell-main #my-sort-options-sheet${sheet.index} .my-sort-options`).on("click", function (event, aa, bb) {
            $(`#my-sort-options-sheet${sheet.index}`).remove();
            sheet.already_cr = false;
            my_sort(sheet.data, sheet.my_line_conf.start_extend_line_no,
                sheet.my_line_conf.end_extend_line_no,
                0,
                sheet.my_line_conf.columns,
                $(this).data("cindex"), sheet)
            luckysheet.scroll({ scrollTop: 0 })
            luckysheet.refresh()
        }) 
        
    }
    function luckysheetbinary_search(arr, key) {
        let low = 0, high = arr.length - 1;

        while (low <= high) {
            let mid = parseInt((high + low) / 2);

            if (key < arr[mid] && (mid == 0 || key >= arr[mid - 1])) {
                return mid;
            }
            else if (key >= arr[mid]) {
                low = mid + 1;
            }
            else if (key < arr[mid]) {
                high = mid - 1;
            }
            else {
                return -1;
            }
        }
    }
    let freezenhorizontaldata = sheet.freezen.horizontal.freezenhorizontaldata
    let freezenverticaldata = sheet.freezen.vertical.freezenverticaldata

    let freezen_rowindex = freezenhorizontaldata[1];
    let freezen_top = freezenhorizontaldata[0] + $("#luckysheet-cell-main").scrollTop();

    let freezen_colindex = freezenverticaldata[1];
    let offsetColumn = luckysheetbinary_search(freezenverticaldata[3], $("#luckysheet-cell-main").scrollLeft() - freezenverticaldata[2]);

    $(`#my-sort-options-sheet${sheet.index} .my-options`).each(function (i, e) {
        let row_index = $(e).data("rindex");
        let top = row_index - 1 == -1 ? 0 : sheet.visibledatarow[row_index - 1];
        let col_index = $(e).data("cindex");

        let r1 = row_index, c1 = col_index, r2 = r1, c2 = c1, merge_cell = sheet.config.merge[`${r1}_${c1}`]
        if (merge_cell != undefined) {
            r2 = merge_cell.r + merge_cell.rs - 1
            c2 = merge_cell.c + merge_cell.cs - 1
        }
        let row_px = sheet.visibledatarow[r2],
            row_pre_px = r1 - 1 == -1 ? 0 : sheet.visibledatarow[r1 - 1];
        col_px = sheet.visibledatacolumn[c2],
            col_pre_px = c1 - 1 == -1 ? 0 : sheet.visibledatacolumn[c1 - 1];

        if (row_index >= freezen_rowindex && col_index >= freezen_colindex) {
            if (top < freezen_top || col_index < (freezen_colindex + offsetColumn)) {
                $(e).hide();
            }
            else {
                $(e).show();
            }
        }
        else if (row_index >= freezen_rowindex) {
            if (top < freezen_top) {
                $(e).hide();
            }
            else {
                let left
                if ($(e).hasClass("my-sort-options"))
                    left = sheet.visibledatacolumn[col_index + offsetColumn]-20
                else {
                    if (col_index== 0)
                        left = 1;
                    else 
                        left = 1+sheet.visibledatacolumn[col_index ]
                    left += $("#luckysheet-cell-main").scrollLeft()//- (col_pre_px-col_pre_px)
                }
                $(e).show().css("left", left);
            }
        }
        else if (col_index >= freezen_colindex) {
            if (col_index < (freezen_colindex + offsetColumn)) {
                $(e).hide();
            }
            else {
                $(e).show().css("top", top + $("#luckysheet-cell-main").scrollTop());
            }
        }
        else {
            let left = sheet.visibledatacolumn[col_index + offsetColumn] - 20;
            $(e).show().css({ "left": left, "top": top + $("#luckysheet-cell-main").scrollTop() });
        }
    });
}
function cellRenderBefore(cell, postion, sheet, ctx) {

}
function cellAllRenderBefore2(data,sheet,ctx) {
    let main_div = '#luckysheet-cell-main'
    let main_top = (sheet.freezen && sheet.freezen.horizontal && sheet.freezen.horizontal.top) || 0
    let main_left = (sheet.freezen && sheet.freezen.vertical && sheet.freezen.vertical.left) || 0
    let scrollLeft = $(main_div).scrollLeft(), scrollTop = $(main_div).scrollTop()
    function my_scroll(id, top,left,width, height) {
        if ($(`#${id}`).length == 0) {
            top = top - (sheet.freezen != null && sheet.freezen.horizontal != null ? 0 : 1)
            left = left - (sheet.freezen != null && sheet.freezen.vertical != null ? 0 : 1)
            $(`<div id='${id}' data-my_top='${top}' data-my_left='${left}' style='position:absolute;left:${left};top:${top}' class='my_freezen'>
                    <div class="main" style='top: 0px;height:100000px;width:100000px;position: absolute;'></div></div>
        `).appendTo($(main_div));
        } 
        $(`#${id}`).css({ top: $(`#${id}`).data('my_top') + scrollTop, left: $(`#${id}`).data('my_left') + scrollLeft }).show()        
    }
    $(`${main_div} .my_freezen`).hide()
    if (!sheet.freezen || !sheet.freezen.horizontal || !sheet.freezen.vertical) {
        $(`${main_div} .my_freezen`).remove()
    }
    my_scroll(`my_frozen_${sheet.index}_freezen_3`,0,0)
    my_scroll(`my_frozen_${sheet.index}_freezen_4`, 0, main_left)
    my_scroll(`my_frozen_${sheet.index}_freezen_7`, main_top,0)
    my_scroll(`my_frozen_${sheet.index}_luckysheetTableContent`, main_top, main_left)
}
function cellRenderBefore2(cell, postion, sheet, ctx) {
    let r = postion.r, c = postion.c, main_div = '#luckysheet-cell-main'
    let main_top = (sheet.freezen && sheet.freezen.horizontal && sheet.freezen.horizontal.top ) || 0
    let main_left= (sheet.freezen && sheet.freezen.vertical && sheet.freezen.vertical.left ) || 0
    if (cell == null)
        return
    {
        let ctx_elem = $(`#${ctx.canvas.id}`)
        let ctx_offset = $(`#${ctx.canvas.id}`).offset()
        let main_offset = $(`${main_div}`).offset()
        let top = ctx_offset.top - main_offset.top
        let left = ctx_offset.left - main_offset.left
        if ("luckysheetTableContent" == ctx.canvas.id) {
            top = main_top - (sheet.freezen != null && sheet.freezen.horizontal!=null?0:1)
            left = main_left - (sheet.freezen != null && sheet.freezen.vertical != null ? 0 : 1)
        }
        $(`#my_frozen_${sheet.index}_${ctx.canvas.id}`).css({ width: ctx_elem.width(), height: ctx_elem.height() })
    }
    let deta = 2
    let top = deta + postion.start_r
    let left = deta + postion.start_c 
    let width = postion.end_c - postion.start_c - deta * 2
    let height = postion.end_r - postion.start_r - deta * 2
    let cell_sort = sheet.my_sort && sheet.my_sort[`${r}_${c}`]
    if (cell_sort != undefined) {
        let cur_id_dom = `luckysheet-sort-show_${sheet.index}_${ctx.canvas.id }_${r}_${c}`
        let cur_id = "#" + cur_id_dom
        if ($(cur_id).length > 0) {
            $(cur_id).show().children().css({ 'top': top -1, 'left': left - 1})
            return
        }
        let html = `<div id="${cur_id_dom}" class="luckysheet-sort-show">
            <div class="my-sort-options" style="left:${left - 1}px;top:${top -1 }px;width:${width}px;height:${height-2}px
            ;position:absolute;background:transparent;display: block;">
            <div class="fa fa-caret-down" aria-hidden="true" style="bottom: 0;position: absolute;right: 0px;" ></div>
            </div></div>`
        $(html).appendTo($(`#my_frozen_${sheet.index}_${ctx.canvas.id} .main`));
        $(cur_id).on("click", function (event) {
            $(`${main_div} .my_freezen`).remove()
            my_sort(sheet.data, sheet.my_line_conf.start_extend_line_no,
                sheet.my_line_conf.end_extend_line_no,
                0,
                sheet.my_line_conf.columns,
                cell_sort)
            luckysheet.scroll({ scrollTop: 0 })
            luckysheet.refresh()
        })
        return
    }
    if (cell.my_href) {
        let cur_id_dom = `luckysheet-href-show_${sheet.index}_${ctx.canvas.id}_${r}_${c}`
        let cur_id = "#" + cur_id_dom
        if ($(cur_id).length > 0) {
            $(cur_id).css({ top: top, left: left }).show()
            return
        }
        let html = `<div id="${cur_id_dom}"  class="luckysheet-href-show-main" 
            style="height:${height}px;width:${width}px;top:${top}px;left:${left}px;color:#000;background-color:#fff;
        ;position:absolute;z-index:100;display: flex;align-items: center;justify-content: center;text-align: justify;">   
        ${cell.my_href} 
        </div>`
        $(html).appendTo($(`#my_frozen_${sheet.index}_${ctx.canvas.id} .main`));
    }
}
