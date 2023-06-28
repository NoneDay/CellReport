<report version="2" needCatchQuShuException="False">
  <dataSets>
    <dataSet name="ds" type="sql" dataSource="testsqlite" fields="[&quot;雇员ID&quot;,&quot;姓氏&quot;,&quot;名字&quot;,&quot;职务&quot;,&quot;尊称&quot;,&quot;出生日期&quot;,&quot;家庭电话&quot;]">SELECT  雇员.雇员ID, 雇员.姓氏, 雇员.名字, 雇员.职务, 雇员.尊称, 
       雇员.出生日期, 雇员.家庭电话 
FROM 雇员 
 where  1=1
$ if (isEmpty(param.雇员ID)==false) { $
and 雇员ID='$雇员ID$'
$}$</dataSet>
  </dataSets>
  <params>
    <param name="雇员ID" data_type="string" width="20" lines="1" prompt="雇员ID" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" />
  </params>
  <AllGrids>
    <grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1">
      <columns>
        <column name="a" width="75" append="" fixed="False" />
        <column name="b" width="75" append="" fixed="False" />
        <column name="c" width="75" append="" fixed="False" />
        <column name="d" width="75" append="" fixed="False" />
        <column name="e" width="75" append="" fixed="False" />
        <column name="f" width="75" append="" fixed="False" />
        <column name="g" width="75" append="" fixed="False" />
        <column name="h" width="75" append="" fixed="False" />
        <column name="i" width="75" append="" fixed="False" />
        <column name="j" width="75" append="" fixed="False" />
      </columns>
      <rows>
        <row name="1" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="2" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="3" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="4" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="5" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="6" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="7" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="8" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="9" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
        <row name="10" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" />
      </rows>
      <cells>
        <cell name="a1" valueExpr="雇员id" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="b1" valueExpr="姓氏" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="c1" valueExpr="名字" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="d1" valueExpr="职务" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="e1" valueExpr="尊称" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="f1" valueExpr="出生日期" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="g1" valueExpr="家庭电话" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell extendDirection="row" name="a2" valueExpr="=ds.select(ds.雇员id)" rowsOfPage="0" leftHead="" calcLevel="0" />
        <cell name="b2" valueExpr="=ds.姓氏" rowsOfPage="0" leftHead="" calcLevel="1" />
        <cell name="c2" valueExpr="=ds.名字" rowsOfPage="0" leftHead="" calcLevel="1" />
        <cell name="d2" valueExpr="=ds.职务" rowsOfPage="0" leftHead="" calcLevel="1" />
        <cell name="e2" valueExpr="=ds.尊称" rowsOfPage="0" leftHead="" calcLevel="1" />
        <cell name="f2" valueExpr="=ds.出生日期" rowsOfPage="0" leftHead="" calcLevel="1" />
        <cell name="g2" valueExpr="=ds.家庭电话" rowsOfPage="0" leftHead="" calcLevel="1" />
      </cells>
    </grid>
  </AllGrids>
  <reportName>example:/雇员查询.cr</reportName>
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
                        "no_use_parent_css": false,
                        "fit": true,
                        "page_size": 20,
                        "page_sizes": "[20, 50, 100, 200]",
                        "gridName": "main",
                        "span": 24,
                        "component": "luckySheetProxy",
                        "prop": "1638162055731_39515",
                        "fresh_ds": [],
                        "fresh_params": [],
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
  </template>
  <conn_list>testsqlite</conn_list>
  <layout_hidden>[]</layout_hidden>
  <includeFiles />
  <datasources>
    <dataSource name="asd" oledb="0">Dsn=testDb</dataSource>
  </datasources>
  <macros />
  <pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="0" pageWidth="0" marginLeft="19" marginRight="19" marginTop="19" marginBottom="19" Landscape="True" header="" footer="" />
  <script />
  <cache time="10" />
  <bi_dataSets />
  <click_refresh_grids />
  <inner_script>
  </inner_script>
</report>