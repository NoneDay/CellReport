<report version="2" needCatchQuShuException="False">
  <dataSets>
    <dataSet name="类别名称" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">select 类别ID,类别名称 from 类别</dataSet>
    <dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;产品名称&quot;,&quot;产品销售额&quot;,&quot;发货季度&quot;]">SELECT [类别].[类别ID], [产品].[产品名称], Sum(([订单明细].[单价]*[数量]*(1-[折扣])/100)*100) AS 产品销售额, 
cast( round(strftime('%m',发货日期)/3.0 + 0.495) as int) ||  '季度' AS 发货季度
FROM 类别 INNER JOIN (订单 INNER JOIN (产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]) ON [订单].[订单ID]=[订单明细].[订单ID]) ON [类别].[类别ID]=[产品].[类别ID]
WHERE ((([订单].[发货日期]) Between '$起始日期$' And '$end_date$'))
GROUP BY [类别].[类别ID], [产品].[产品名称], cast( round(strftime('%m',发货日期)/3.0 + 0.495) as int)|| '季度';</dataSet>
  </dataSets>
  <params>
    <param name="起始日期" data_type="string" prompt="开始日期" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-01-01" />
    <param name="end_date" data_type="string" prompt="终止日期" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-1-2" />
  </params>
  <AllGrids>
    <grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" is_large="0">
      <columns>
        <column name="a" width="75" fixed="False" />
        <column name="b" width="75" fixed="False" />
        <column name="c" width="75" fixed="False" />
        <column name="d" width="75" fixed="False" />
        <column name="e" width="75" fixed="False" />
        <column name="f" width="75" fixed="False" />
        <column name="g" width="75" fixed="False" />
        <column name="h" width="75" fixed="False" />
      </columns>
      <rows>
        <row name="1" height="25" fixed="False" />
        <row name="2" height="25" fixed="False" />
        <row name="3" height="25" fixed="False" />
        <row name="4" height="25" fixed="False" />
        <row name="5" height="25" fixed="False" />
        <row name="6" height="25" fixed="False" />
      </rows>
      <cells>
        <cell displayValueExpr="=@value" name="A1:A2" valueExpr="发货季度" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" />
        <cell displayValueExpr="=类别名称.select1(类别名称.类别名称,类别名称.类别id==@value)" extendDirection="column" name="B1:C1" valueExpr="=数据集1.group(数据集1.类别ID)" rowsOfPage="0" leftHead="" calcLevel="0" text-align="center" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" />
        <cell displayValueExpr="=@value" name="D1:D2" valueExpr="合计" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#f6b26b" text-align="right" />
        <cell displayValueExpr="=@value" extendDirection="column" name="B2" valueExpr="=数据集1.group(数据集1.产品名称)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffe599" text-align="right" />
        <cell displayValueExpr="=@value" name="C2" valueExpr="小计" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
        <cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=数据集1.group(数据集1.发货季度)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="B3" valueExpr="=数据集1.sum(数据集1.产品销售额)" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#fff2cc" text-align="right" />
        <cell displayValueExpr="=@value" name="C3" valueExpr="=sum(B3{})" rowsOfPage="0" leftHead="" calcLevel="3" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
        <cell displayValueExpr="=@value" name="D3" valueExpr="=sum(C3{})" rowsOfPage="0" leftHead="" calcLevel="4" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#f6b26b" text-align="right" />
        <cell displayValueExpr="=@value" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" valueExpr=" " text-align="right" name="A4" />
        <cell displayValueExpr="=@value" valueExpr="=sum(B3{})" text-align="right" name="B4" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" valueExpr="=sum(B3{})" text-align="right" name="C4" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" valueExpr="=sum(C3{})" text-align="right" name="D4" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
      </cells>
      <no_use_parent_css>0</no_use_parent_css>
    </grid>
  </AllGrids>
  <reportName>example:/类别季度交叉.cr</reportName>
  <defaultsetting>
    <firstNoQuery>false</firstNoQuery>
    <excel_img_func>server</excel_img_func>
    <cr_front_validate>false</cr_front_validate>
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <BACKGROUND-COLOR>#ffffff</BACKGROUND-COLOR>
    <COLOR>#000000</COLOR>
    <FONT>微软雅黑</FONT>
    <FONT-SIZE>11</FONT-SIZE>
    <border_box>div</border_box>
    <layout_mode />
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
        "y": 0,
        "w": 24,
        "h": 15,
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
                        "no_use_parent_css": true,
                        "fit": true,
                        "page_size": 20,
                        "page_sizes": "[20, 50, 100, 200]",
                        "gridName": "main",
                        "span": 24,
                        "component": "luckySheetProxy",
                        "prop": "1638252361316_76102",
                        "fresh_ds": [],
                        "fresh_params": [],
                        "conditionformat_save": "[]",
                        "alternateformat_save": "[]",
                        "icon": "img/m_pm.png",
                        "paperSetting": "{\"pageSize_name\":\"A4\",\n                \"pageSize_Width\":595,\n                \"pageSize_Height\":842,\n                \"margin_top\":36,\n                \"margin_bottom\":36,\n                \"margin_left\":36,\n                \"margin_right\":36}"
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
    }
]</layout>
  <includeFiles />
  <datasources>
    <dataSource name="dfsd">Dsn=testDb</dataSource>
  </datasources>
  <macros />
  <pageProperty Orientation="True" paperSize="A4" pageHeight="" pageWidth="" marginLeft="19" marginRight="19" marginTop="19" marginBottom="19" Landscape="True" header="" footer="" />
  <notebook />
  <template>
    <excel_img_func>server</excel_img_func>
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <backgroundImage />
    <big_screen>0</big_screen>
    <screen_width>1920</screen_width>
    <screen_height>1080</screen_height>
    <border_option>
      <color>#83bff6</color>
      <color>#00CED1</color>
    </border_option>
    <before_exec_script>function lastSetParam(name){
  
 trace("====",name) ;
}
</before_exec_script>
    <footer2 />
    <notebook />
  </template>
  <conn_list>testsqlite</conn_list>
  <script />
  <cache time="10" />
  <bi_dataSets />
  <click_refresh_grids />
  <layout_hidden>[]</layout_hidden>
  <inner_script>
  </inner_script>
</report>