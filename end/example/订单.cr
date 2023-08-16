<report version="2" needCatchQuShuException="False">
  <dataSets>
    <dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;订单ID&quot;,&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价&quot;]">SELECT [订单明细].[订单ID], [订单明细].[产品ID], [产品].[产品名称], [订单明细].[单价], [订单明细].[数量], [订单明细].[折扣], ([订单明细].[单价]*[数量]*(1-[折扣])/100)*100 AS 总价
FROM 产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]
where 1=1 
$if(false==isEmpty(param.dindan)){$
 and [订单明细].[订单ID]='$dindan$'
$}$
--and $abc$=$abc$ 
$if(false==isEmpty(param.chanping)){$
and [订单明细].[产品ID]='$chanping$'
$}$
ORDER BY [订单明细].[订单ID] limit 100</dataSet>
  </dataSets>
  <params>
    <param name="dindan" data_type="string" prompt="订单id" hide="False" allowNull="False" inner="False" allowSpace="True" allowMutil="False" canUsedValueFrom="0" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" />
    <param name="chanping" data_type="string" prompt="产品id" hide="False" allowNull="False" inner="False" allowSpace="True" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="0" dataSetName_default="" valueField_default="" default_value="" />
    <param name="riqi" prompt="riqi" data_type="daterange" width="" lines="" value="" dateTimeFormat="yyyy-MM-dd" hide="False" allowNull="False" inner="False" allowSpace="True" allowMutil="False" canUsedValueFrom="noneQuery" dataSetName_kyz="" valueField_kyz="" parent_valueField_kyz="" tagField_kyz="" tagValueList="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="2022-07-26,2022-07-28" />
    <param name="abc" prompt="abc" data_type="string" width="" lines="" value="" dateTimeFormat="" hide="False" allowNull="False" inner="False" allowSpace="True" allowMutil="True" canUsedValueFrom="noneQuery" dataSetName_kyz="" valueField_kyz="" parent_valueField_kyz="" tagField_kyz="" tagValueList="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="col_7140" allowCreate="True">
      <tagValue tag="字段7140" value="col_7140" />
      <tagValue tag="字段36399" value="col_36399" />
    </param>
  </params>
  <AllGrids>
    <grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" fields="[&quot;订单ID&quot;,&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价pdf输出时，单元格行后分页(true)&quot;,&quot;&quot;,&quot;0&quot;,&quot;key&quot;]" is_large="0" auto_line_height="true" backend_split_page="true" page_size="20">
      <columns>
        <column name="a" width="247" fixed="False" />
        <column name="b" width="147" fixed="False" />
        <column name="c" width="137" fixed="False" />
        <column name="d" width="138" fixed="False" />
        <column name="e" width="124" fixed="False" />
        <column name="f" width="127" fixed="False" />
        <column name="g" width="106" fixed="False" />
        <column name="h" width="75" fixed="False" />
        <column name="i" width="75" fixed="False" />
      </columns>
      <rows>
        <row name="1" height="25" fixed="False" />
        <row name="2" height="28" fixed="False" />
        <row name="3" height="25" fixed="False" />
        <row name="4" height="25" fixed="False" />
        <row name="5" height="25" fixed="False" />
        <row name="6" height="25" fixed="False" />
      </rows>
      <cells>
        <cell displayValueExpr="=@value" text-align="right" vertical-align="bottom" valueExpr="ffffff" name="B1:C1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
        <cell displayValueExpr="=@value" name="A2" valueExpr="订单ID" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="B2" valueExpr="产品ID" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="C2" valueExpr="产品名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="D2" valueExpr="单价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="E2" valueExpr="数量" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="F2" valueExpr="折扣" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" name="G2" valueExpr="总价pdf输出时，单元格行后分页(true)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" BOLD="True" vertical-align="bottom" />
        <cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=数据集1.select(数据集1.订单id)" rowsOfPage="25" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=@value" name="B3" valueExpr="=数据集1.产品id" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=@value" name="C3" valueExpr="=数据集1.产品名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=@value" name="D3" valueExpr="=数据集1.单价" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=@value" name="E3" valueExpr="=数据集1.数量" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=@value" name="F3" valueExpr="=数据集1.折扣" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" text-align="center" />
        <cell displayValueExpr="=formatNumber(@value)" name="G3" valueExpr="=数据集1.总价" rowsOfPage="0" leftHead="" calcLevel="1" text-align="center" BORDER-LEFT="0.5pt solid #cccccc" BORDER-RIGHT="0.5pt solid #cccccc" BORDER-TOP="0.5pt solid #cccccc" BORDER-BOTTOM="0.5pt solid #cccccc" />
        <cell displayValueExpr="=@value" valueExpr="=Math.round(数据集1.总价)" text-align="right" vertical-align="bottom" name="H3" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
        <cell displayValueExpr="=@value" valueExpr="=new DateTime (2023,1,1).DayOfWeek.ToString()" text-align="right" vertical-align="bottom" name="I3" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
      </cells>
      <no_use_parent_css>0</no_use_parent_css>
      <conditionformat_save>[]</conditionformat_save>
      <alternateformat_save>[{"cellrange":{"row":[0,2],"column":[0,8]},"format":{"head":{"fc":"#ffffff","bc":"#df3e3e"},"one":{"fc":"#000","bc":"#ffffff"},"two":{"fc":"#000","bc":"#fde9e9"},"foot":{"fc":"#000","bc":"#f89292"}},"hasRowHeader":true,"hasRowFooter":true}]</alternateformat_save>
      <paperSetting>{"pageSize_name":"A4","pageSize_Width":595,"pageSize_Height":842,"orientation":"portrait","fitToPage":true,"scale":100,"fitToWidth":1,"fitToHeight":1,"margin_top":36,"margin_bottom":36,"margin_left":36,"margin_right":36,"page_header":10,"page_footer":10,"horizontalCentered":false,"verticalCentered":false,"page_header_left":"","page_header_center":"","page_header_right":"","page_footer_left":"","page_footer_center":"","page_footer_right":"","print_template_background":"","footer_left":"&amp;[xxxx]","footer_center":"&amp;[yyyy]"}</paperSetting>
      <as_tree>false</as_tree>
      <alternateformat_save_modelCustom>[{"head":{"fc":"#ffffff","bc":"#df3e3e"},"one":{"fc":"#000","bc":"#ffffff"},"two":{"fc":"#000","bc":"#fde9e9"},"foot":{"fc":"#000","bc":"#f89292"}}]</alternateformat_save_modelCustom>
    </grid>
  </AllGrids>
  <reportName>example:/订单.cr</reportName>
  <defaultsetting>
    <firstNoQuery>false</firstNoQuery>
    <excel_img_func>server</excel_img_func>
    <cr_front_validate>false</cr_front_validate>
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <BACKGROUND-COLOR>transparent</BACKGROUND-COLOR>
    <COLOR>black</COLOR>
    <FONT>微软雅黑</FONT>
    <FONT-SIZE>11</FONT-SIZE>
    <border_box>div</border_box>
    <layout_mode>0</layout_mode>
    <show_form>true</show_form>
    <layout_row_height>20</layout_row_height>
    <layout_colNum>24</layout_colNum>
    <layout_margin>10</layout_margin>
    <layout_pan_height>100%</layout_pan_height>
    <row_col_gutter>10</row_col_gutter>
    <backgroundImage />
    <big_screen>0</big_screen>
    <screen_width>1920</screen_width>
    <screen_height>1080</screen_height>
    <border_option>
      <color>#83bff6</color>
      <color>#00CED1</color>
    </border_option>
  </defaultsetting>
  <layout>[
    {
        "x": 0,
        "y": 6,
        "w": 24,
        "h": 16,
        "i": 0,
        "element": {
            "type": "layout_div",
            "label": "div布局",
            "span": 24,
            "icon": "icon-group",
            "display": true,
            "style": {
                "height": "100%"
            },
            "component": "widget-form-group",
            "prop": "_random_",
            "children": {
                "column": [
                    {
                        "type": "luckySheetProxy",
                        "label": "main",
                        "display": true,
                        "style": {
                            "height": "100%"
                        },
                        "no_use_parent_css": false,
                        "fit": true,
                        "page_size": 20,
                        "page_sizes": "[20, 50, 100, 200]",
                        "gridName": "main",
                        "span": 24,
                        "component": "luckySheetProxy",
                        "prop": "1638165806230_44736",
                        "fresh_ds": [],
                        "fresh_params": [],
                        "conditionformat_save": "[]",
                        "alternateformat_save": "[]",
                        "icon": "img/m_pm.png",
                        "paperSetting": "{\"pageSize_name\":\"A4\",\"pageSize_Width\":595,\"pageSize_Height\":842,\"orientation\":\"portrait\",\"fitToPage\":true,\"scale\":100,\"fitToWidth\":1,\"fitToHeight\":1,\"margin_top\":36,\"margin_bottom\":36,\"margin_left\":36,\"margin_right\":36,\"page_header\":10,\"page_footer\":10,\"horizontalCentered\":false,\"verticalCentered\":false,\"page_header_left\":\"\",\"page_header_center\":\"\",\"page_header_right\":\"\",\"page_footer_left\":\"\",\"page_footer_center\":\"\",\"page_footer_right\":\"\",\"print_template_background\":\"\",\"footer_left\":\"&amp;[xxxx]\",\"footer_center\":\"&amp;[yyyy]\"}",
                        "auto_line_height": true
                    }
                ]
            }
        },
        "moved": false,
        "show": true,
        "bg": {
            "backgroundImage": "",
            "BACKGROUND-COLOR": "",
            "border_box": "div",
            "border_option": {
                "color": [
                    "#83bff6",
                    "#00CED1"
                ]
            }
        }
    },
    {
        "x": 0,
        "y": 0,
        "w": 24,
        "h": 6,
        "i": 1,
        "element": {
            "type": "flex_span_row",
            "label": "同行容器",
            "span": 24,
            "icon": "icon-group",
            "display": true,
            "style": {
                "height": "100%",
                "width": "30%"
            },
            "component": "widget-form-row-span",
            "flex": {
                "flex-direction": "row"
            },
            "flex-margin": 5,
            "gridName": "flex_span_row_359",
            "prop": "_random_",
            "children": {
                "column": [
                    {
                        "type": "dv_scroll_board",
                        "label": "轮播表",
                        "gridName": "dv_scroll_board_450",
                        "h": 4,
                        "span": 6,
                        "icon": "",
                        "color": "#fff",
                        "display": true,
                        "fresh_ds": [],
                        "fresh_params": [],
                        "fields": [],
                        "component": "dync-template",
                        "style": {
                            "height": "100%",
                            "width": "100%"
                        },
                        "option": {
                            "rowNum": 5,
                            "waitTime": 2000,
                            "carousel": "single",
                            "unit": "",
                            "sort": true,
                            "headerBGC": "#00BAFF",
                            "oddRowBGC": "#003B51",
                            "evenRowBGC": "#0A2732",
                            "headerHeigh": 35,
                            "index": false,
                            "indexHeade": "#",
                            "hoverPause": true
                        },
                        "content": "&lt;dv-scroll-board :config=\"{\n            header: cur_ds[0],\n            data: cur_ds.slice(1)\n,columnWidth :conf_field_prop_arr('width')\n,align :conf_field_prop_arr('align')\n,rowNum\t       :self.option.rowNum\t       || 5        \n,waitTime\t   :self.option.waitTime\t   ||  2000    \n,carousel\t   :self.option.carousel\t   ||  'single'\n,unit\t       :self.option.unit\t       ||  ''      \n,sort\t       :self.option.sort\t       ||  true              \n,rowNum\t       :self.option.rowNum\t     ||  5         \n,headerBGC\t   :self.option.headerBGC\t ||  '#00BAFF' \n,oddRowBGC\t   :self.option.oddRowBGC\t ||  '#003B51' \n,evenRowBGC\t   :self.option.evenRowBGC\t ||  '#0A2732' \n,waitTime\t   :self.option.waitTime\t ||  2000      \n,headerHeight\t:self.option.headerHeight||  35        \n,index\t       :self.option.index\t     ||  false     \n,indexHeader\t:self.option.indexHeader||  '#'        \n,carousel\t   :self.option.carousel\t ||  'single'  \n,hoverPause\t   :self.option.hoverPause\t ||  \tfalse   \n          }\" style=\"width:100%;height:100%;\" /&gt;",
                        "prop": "1655539497431_5026",
                        "height": "100%",
                        "flex-shrink": 1,
                        "flex-grow": 1,
                        "align-self": "auto",
                        "flex-margin": "5px",
                        "idx": 0
                    },
                    {
                        "type": "dv_scroll_ranking_board",
                        "label": "排名轮播表",
                        "gridName": "dv_scroll_ranking_board_480",
                        "h": 4,
                        "span": 6,
                        "icon": "",
                        "color": "#fff",
                        "display": true,
                        "component": "dync-template",
                        "style": {
                            "height": "100%",
                            "width": "100%"
                        },
                        "fresh_ds": [],
                        "fresh_params": [],
                        "fields": [],
                        "option": {
                            "rowNum": 5,
                            "waitTime": 2000,
                            "carousel": "single",
                            "unit": "",
                            "sort": true,
                            "headerBGC": "#00BAFF",
                            "oddRowBGC": "#003B51",
                            "evenRowBGC": "#0A2732",
                            "headerHeigh": 35,
                            "index": false,
                            "indexHeade": "#",
                            "hoverPause": true,
                            "color": ""
                        },
                        "content": "&lt;dv-scroll-ranking-board :config=\"{\n            data: Enumerable.from(cur_ds).skip(1).select(x=&gt; { \n              return {'name':x[0],value:x[1]} \n            }).toArray()\n,rowNum\t       :self.option.rowNum\t       || 5        \n,waitTime\t   :self.option.waitTime\t   ||  2000    \n,carousel\t   :self.option.carousel\t   ||  'single'\n,unit\t       :self.option.unit\t       ||  ''      \n,sort\t       :self.option.sort\t       ||  true    \n          }\" :style=\"'width:100%;height:100%;color:'+(self.option.color||defaultsetting['COLOR'])\" /&gt;",
                        "prop": "1655539496426_29789",
                        "height": "100%",
                        "flex-shrink": 1,
                        "flex-grow": 1,
                        "align-self": "auto",
                        "flex-margin": "5px",
                        "idx": 1
                    },
                    {
                        "type": "text",
                        "label": "文字",
                        "h": 4,
                        "span": 6,
                        "component": "dync-template",
                        "gridName": "text_592",
                        "icon": "icon-table",
                        "style": {
                            "height": "100%",
                            "width": "100%"
                        },
                        "titleOption": {
                            "scroll": false,
                            "step": 0.5,
                            "speed": 70,
                            "textAlign": "center",
                            "fontSize": 22,
                            "fontWeight": "normal",
                            "color": "",
                            "textShadowX": 1,
                            "textShadowY": 1,
                            "textShadowZ": 1,
                            "margin_left": 0,
                            "split": 0,
                            "lineHeight": 0
                        },
                        "color": "#fff",
                        "display": true,
                        "content": "&lt;eleText :self=\"self\"&gt;{{ &lt;t&gt;value&lt;/t&gt; }}&lt;/eleText&gt;",
                        "prop": "1655541772881_69322",
                        "height": "100%",
                        "flex-shrink": 1,
                        "flex-grow": 1,
                        "align-self": "auto",
                        "flex-margin": "5px",
                        "background-color": "rgba(255, 140, 0, 1)",
                        "idx": 2
                    }
                ]
            },
            "h": 5,
            "height": "100%"
        },
        "show": true,
        "border_box": "div",
        "bg": {
            "backgroundImage": "",
            "BACKGROUND-COLOR": "",
            "border_box": "div",
            "border_option": {
                "color": [
                    "#83bff6",
                    "#00CED1"
                ]
            }
        },
        "moved": false
    }
]</layout>
  <notebook />
  <template>
    <BACKGROUND-COLOR>transparent</BACKGROUND-COLOR>
    <COLOR>black</COLOR>
    <backgroundImage />
    <big_screen>0</big_screen>
    <screen_width>1920</screen_width>
    <screen_height>1080</screen_height>
    <border_option>
      <color>#83bff6</color>
      <color>#00CED1</color>
    </border_option>
    <rotate_second />
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <notebook />
    <before_exec_script>_zb_var_.xxxx='asd';
_zb_var_.yyyy=[{a:2},{a:3}];
function test_func(){
  var test_data='{
      "msg": "success",
      "data": [
          {
              "dataType": 1,
              "dataEnCode": "001-B2C-YMT",
              "dataFullName": "OLAY-B2C-洋码头",
              "sortCode": null,
              "remark": ""
          },
          {
              "dataType": 1,
              "dataEnCode": "002-B2C-TM",
              "dataFullName": "欧莱雅-B2C-天猫",
              "sortCode": null,
              "remark": "1"
          }
      ],
      "Code": "000",
      "IsSuccess": true
  }';

  var json_obj=json_parse(test_data);
  var last_result=json_obj.data.Select( x=&gt; {return [x.dataFullName,x.dataEnCode];}).ToList();

  __env__.logger.error(json_stringify(last_result)  );

}

function update_aaa(ppp){
  __env__.logger.info(ppp.ToString());
  test_func();
 return ppp; 
}</before_exec_script>
    <footer2>append
&lt;script&gt;
  window.cellreport.cr_click_main=function(data,that){ // 点击后出弹窗。_this 是报表页面根对象，that是当前组件对象。findElelment只在that上有
  	_this.$Log.capsule('cr_click_main', JSON.stringify(data) )
   _this.dync_item=that.findElelment("订单明细",{parent_obj:data.data,title:"订单明细"})
  _this.dync_item_dialogVisible=true;
  
}
let cur_rpt=_this.result.data.main
if(cur_rpt){
  let extend_lines= cur_rpt.extend_lines
	//debugger
  let before_val=undefined
  cur_rpt.tableData.slice( extend_lines[0],extend_lines[1]+1 ).forEach((x,idx)=&gt;{
    if(before_val ==undefined)   
    {
      before_val=x[0]
    } else if(before_val!=x[0] ){
          cur_rpt.row_page_break_set.push(idx+extend_lines[0])
          before_val=x[0]
      }  
        
  })
  _this.$Log.capsule('_this.result.data.main.tableData', cur_rpt.row_page_break_set )
}

  tool.call_server_func("update_aaa",{aa:111},_this).then(response_data =&gt;{
  	// _this.$message.error(JSON.stringify( response_data)  )
  _this.$Log.capsule( JSON.stringify( response_data) )
  _this.$DialogForm.show({
  title: '弹窗页面',  width: '30%',  menuPosition:'right',
  option:{
    submitText: '完成',span:24,
    column: [{
      label: "姓名",prop: "name",rules: [{required: true,message: "请输入姓名",trigger: "blur"}],
    }]
  },
  beforeClose: (done) =&gt; {
    _this.$message.success('关闭前方法')
    done()
  },
  callback:(res)=&gt;{
    console.log(res.data);
    _this.$message.success('关闭等待框')
    setTimeout(() =&gt; {
      res.done()
      setTimeout(() =&gt; {
        _this.$message.success('关闭弹窗')
        res.close()
      }, 1000)
    }, 1000)
  }
})
  }).catch(error=&gt; {
        _this.$notify({title: '提示',message: error,type: 'error'});
    })
  
&lt;/script&gt;</footer2>
    <excel_img_func>server</excel_img_func>
    <firstNoQuery>false</firstNoQuery>
    <cr_front_validate>false</cr_front_validate>
    <FONT>微软雅黑</FONT>
    <FONT-SIZE>11</FONT-SIZE>
    <border_box>div</border_box>
    <layout_mode>0</layout_mode>
    <show_form>true</show_form>
    <layout_row_height>20</layout_row_height>
    <layout_colNum>24</layout_colNum>
    <layout_margin>10</layout_margin>
    <layout_pan_height>100%</layout_pan_height>
    <row_col_gutter>10</row_col_gutter>
  </template>
  <conn_list>testsqlite</conn_list>
  <layout_hidden>[
    {
        "x": 0,
        "y": 0,
        "w": 16,
        "h": 11,
        "i": 0,
        "element": {
            "type": "dync_template",
            "label": "动态模板",
            "gridName": "订单明细",
            "icon": "icon-table",
            "color": "#fff",
            "display": true,
            "style": {
                "height": "100px"
            },
            "content": "\n  &lt;template&gt;\n    &lt;div style=\"width:100%;height:calc(100% - 120px);display: flex;\" ref=\"main\" v-if=\"cr_init\"&gt;\n      &lt;avue-crud  ref=\"crud\" :option=\"option\"   v-model=\"cur_obj\" :page.sync=\"page\" \n      :data=\"tableData.slice((page.currentPage - 1) * page.pageSize, page.currentPage*page.pageSize)\"\n      &gt;\n      &lt;/avue-crud&gt;\n    &lt;/div&gt;\n  &lt;/template&gt;\n&lt;script&gt;\n    export default {\n    data() {    \n      let ret= {\n        cur_obj:{},allDict:{},selfHeight:_this.selfHeight,ready:false,tableData:[],\n        page: {currentPage: 1,total: 0,background:false,pageSize: 20,},\n      }\n      return ret;\n    },\n    methods: {  \n\n  \n    },\n    computed:{\n      option(){\n        let ret=\n        {\n          border: true,align: \"center\",menu: true,addBtn: false,editBtn: false,dialogDrag:true,\n          viewBtn: true,delBtn: false,height: this.selfHeight-120,\n          column: [\n            {label:\"订单ID\",prop:\"订单ID\",span:8,},\n            {label:\"产品ID\",prop:\"产品ID\",span:8,},\n            {label:\"单价\",prop:\"单价\",span:8,},\n            {label:\"数量\",prop:\"数量\",span:8,},\n            {label:\"折扣\",prop:\"折扣\",span:8,}\n          ]\n        }\n        return ret;\n      }, \n     cr_init(){\n        cellreport.call_server_func(\"清单_订单明细\",this.self.parent_obj ,this).then(res=&gt;{\n           if(res.errcode){\n             this.$message({message: res.message,type: \"error\"});\n             return\n           }\n           this.tableData=res;   \n                this.page.total=this.tableData.length\n         });\n         return true\n        },\n    }\n  }  \n  /* 服务器脚本  \n    function 清单_订单明细(p){\n       var key_list= [{\"parent_key\":\"订单ID\",\"self_key\":\"订单ID\"}];\n       trace(p);\n       var db=kata(\"testsqlite\");\n       var last_statement=`select * from 订单明细 where `+ iif(p==null,' 1=0 ',`订单ID='${p.订单ID}'`);\n       trace(last_statement);\n       var result=db.Select(last_statement);//  \n       return result;\n    }\n     结束 */       \n  &lt;/script&gt;     ",
            "component": "dync-template",
            "prop": "1664421621108_44531",
            "span": 12,
            "h": 5,
            "height": "100%"
        },
        "show": true,
        "border_box": "div",
        "bg": {
            "backgroundImage": "",
            "BACKGROUND-COLOR": "",
            "border_box": "div",
            "border_option": {
                "color": [
                    "#83bff6",
                    "#00CED1"
                ]
            }
        },
        "moved": false
    }
]</layout_hidden>
  <includeFiles />
  <datasources>
    <dataSource name="dfsd">Dsn=testDb</dataSource>
  </datasources>
  <macros />
  <pageProperty Orientation="True" />
  <script />
  <cache time="10" />
  <bi_dataSets />
  <click_refresh_grids />
  <inner_script>    function 清单_订单明细(p){
       var key_list= [{"parent_key":"订单ID","self_key":"订单ID"}];
       trace(p);
       var db=kata("testsqlite");
       var last_statement=`select * from 订单明细 where `+ iif(p==null,' 1=0 ',`订单ID='${p.订单ID}'`);
       trace(last_statement);
       var result=db.Select(last_statement);//  
       return result;
    }
     
</inner_script>
</report>