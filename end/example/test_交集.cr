<report version="2" needCatchQuShuException="False">
  <dataSets>
    <dataSet name="ds1" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">SELECT 类别.类别ID, 类别.类别名称
FROM 类别
where
类别.类别ID &lt; 8</dataSet>
    <dataSet name="ds2" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">SELECT 类别.类别ID, 类别.类别名称
FROM 类别
where
类别.类别ID &gt;1</dataSet>
  </dataSets>
  <params />
  <AllGrids>
    <grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" is_large="0" fields="[&quot;&quot;,&quot;0&quot;,&quot;类别ID &lt;= 8类别id&quot;,&quot;类别ID &lt;= 8类别名称&quot;,&quot;1&quot;,&quot;类别ID =&gt;1类别id&quot;,&quot;类别ID =&gt;1类别名称&quot;,&quot;key&quot;]">
      <columns>
        <column name="a" width="73" fixed="False" />
        <column name="b" width="75" fixed="False" />
        <column name="c" width="75" fixed="False" />
        <column name="d" width="75" fixed="False" />
        <column name="e" width="75" fixed="False" />
        <column name="f" width="75" fixed="False" />
        <column name="g" width="75" fixed="False" />
        <column name="h" width="75" fixed="False" />
        <column name="i" width="75" fixed="False" />
        <column name="j" width="75" fixed="False" />
        <column name="k" width="73" fixed="False" />
      </columns>
      <rows>
        <row name="1" height="25" fixed="False" />
        <row name="2" height="25" fixed="False" />
        <row name="3" height="25" fixed="False" />
        <row name="4" height="25" fixed="False" />
        <row name="5" height="25" fixed="False" />
        <row name="6" height="25" fixed="False" />
        <row name="7" height="25" fixed="False" />
        <row name="8" height="25" fixed="False" />
        <row name="9" height="25" fixed="False" />
      </rows>
      <cells>
        <cell displayValueExpr="=@value" text-align="center" valueExpr="类别ID &lt;= 8" name="C1:D1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#cfe2f3" />
        <cell displayValueExpr="=@value" text-align="center" valueExpr="类别ID =&gt;1" name="F1:G1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#cfe2f3" />
        <cell displayValueExpr="=@value" name="C2" valueExpr="类别id" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="D2" valueExpr="类别名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="F2" valueExpr="类别id" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="G2" valueExpr="类别名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" extendDirection="row" name="C3" valueExpr="=ds2.select(ds2.类别id)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="D3" valueExpr="=ds2.类别名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" extendDirection="row" name="F3" valueExpr="=ds1.select(ds1.类别id)" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="G3" valueExpr="=ds1.类别名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" text-align="center" valueExpr="ds1 和 ds2 的交集" name="C5:E5" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#cfe2f3" />
        <cell displayValueExpr="=@value" extendDirection="row" name="C6" valueExpr="=intersection_set(ds1.group(ds1.类别id),ds2.group(ds2.类别id))" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="D6" valueExpr="=ds1.类别名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
        <cell displayValueExpr="=@value" name="E6" valueExpr="=ds2.类别名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
      </cells>
      <no_use_parent_css>0</no_use_parent_css>
    </grid>
  </AllGrids>
  <reportName>example:/test_交集.cr</reportName>
  <defaultsetting>
    <firstNoQuery>false</firstNoQuery>
    <excel_img_func>server</excel_img_func>
    <cr_front_validate>false</cr_front_validate>
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <BACKGROUND-COLOR>white</BACKGROUND-COLOR>
    <COLOR>black</COLOR>
    <FONT>微软雅黑</FONT>
    <FONT-SIZE>11</FONT-SIZE>
    <border_box>div</border_box>
    <layout_mode />
    <show_form>true</show_form>
    <layout_row_height>30</layout_row_height>
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
        "h": 7,
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
                        "fit": false,
                        "page_size": 20,
                        "page_sizes": "[20, 50, 100, 200]",
                        "gridName": "main",
                        "span": 24,
                        "component": "luckySheetProxy",
                        "prop": "1638166837614_89949",
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
  <notebook />
  <template>
    <firstNoQuery>false</firstNoQuery>
    <excel_img_func>server</excel_img_func>
    <cr_front_validate>false</cr_front_validate>
    <cr_auto_line_height>false</cr_auto_line_height>
    <convert_col_to_button>false</convert_col_to_button>
    <BACKGROUND-COLOR>white</BACKGROUND-COLOR>
    <COLOR>black</COLOR>
    <FONT>微软雅黑</FONT>
    <FONT-SIZE>11</FONT-SIZE>
    <border_box>div</border_box>
    <layout_mode />
    <show_form>true</show_form>
    <layout_row_height>30</layout_row_height>
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
  </template>
  <conn_list>testsqlite</conn_list>
  <layout_hidden>[]</layout_hidden>
  <includeFiles />
  <datasources>
    <dataSource name="as" oledb="0">Dsn=testDb</dataSource>
  </datasources>
  <macros />
  <pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" />
  <script />
  <cache time="10" />
  <bi_dataSets />
  <click_refresh_grids />
  <inner_script>
  </inner_script>
</report>