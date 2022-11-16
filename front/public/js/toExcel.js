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

