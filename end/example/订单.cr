<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;订单ID&quot;,&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价&quot;]">SELECT [订单明细].[订单ID], [订单明细].[产品ID], [产品].[产品名称], [订单明细].[单价], [订单明细].[数量], [订单明细].[折扣], ([订单明细].[单价]*[数量]*(1-[折扣])/100)*100 AS 总价&#xA;FROM 产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]&#xA;where 1=1&#xA;$if(false==isEmpty(param.dindan)){$&#xA; and [订单明细].[订单ID]=&#x27;$dindan$&#x27;&#xA;$}$&#xA;&#xA;$if(false==isEmpty(param.chanping)){$&#xA;and [订单明细].[产品ID]=&#x27;$chanping$&#x27;&#xA;$}$&#xA;ORDER BY [订单明细].[订单ID]</dataSet>
</dataSets>
<params>
<param name="dindan" data_type="string" prompt="订单id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" />
<param name="chanping" data_type="string" prompt="产品id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="0" dataSetName_default="" valueField_default="" default_value="" />
</params>
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" is_large="0" fields="[&quot;订单id&quot;,&quot;产品id&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价&quot;,&quot;key&quot;]">
<columns>
<column name="a" width="75" fixed="False" />
<column name="b" width="75" fixed="False" />
<column name="c" width="75" fixed="False" />
<column name="d" width="75" fixed="False" />
<column name="e" width="75" fixed="False" />
<column name="f" width="75" fixed="False" />
<column name="g" width="75" fixed="False" />
<column name="h" width="75" fixed="False" />
<column name="i" width="75" fixed="False" />
</columns>
<rows>
<row name="1" height="25" fixed="False" />
<row name="2" height="25" fixed="False" />
<row name="3" height="25" fixed="False" />
<row name="4" height="25" fixed="False" />
</rows>
<cells>
<cell displayValueExpr="=@value" name="A1" valueExpr="订单id" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B1" valueExpr="产品id" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C1" valueExpr="产品名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="D1" valueExpr="单价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="E1" valueExpr="数量" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="F1" valueExpr="折扣" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="G1" valueExpr="总价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="row" name="A2" valueExpr="=数据集1.group(数据集1.订单id)" rowsOfPage="25" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B2" valueExpr="=数据集1.产品id" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C2" valueExpr="=数据集1.产品名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="D2" valueExpr="=数据集1.单价" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="E2" valueExpr="=数据集1.数量" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="F2" valueExpr="=数据集1.折扣" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=formatNumber(@value)" name="G2" valueExpr="=数据集1.总价" rowsOfPage="0" leftHead="" calcLevel="1" text-align="right" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
</cells>
<no_use_parent_css>0</no_use_parent_css>
<paperSetting>{&quot;pageSize_name&quot;:&quot;A4&quot;,&quot;pageSize_Width&quot;:595,&quot;pageSize_Height&quot;:842,&quot;orientation&quot;:&quot;portrait&quot;,&quot;fitToPage&quot;:true,&quot;scale&quot;:100,&quot;fitToWidth&quot;:1,&quot;fitToHeight&quot;:1222,&quot;margin_top&quot;:36,&quot;margin_bottom&quot;:36,&quot;margin_left&quot;:36,&quot;margin_right&quot;:36,&quot;page_header&quot;:10,&quot;page_footer&quot;:10,&quot;horizontalCentered&quot;:false,&quot;verticalCentered&quot;:false,&quot;page_header_left&quot;:&quot;&quot;,&quot;page_header_center&quot;:&quot;&quot;,&quot;page_header_right&quot;:&quot;&quot;,&quot;page_footer_left&quot;:&quot;&quot;,&quot;page_footer_center&quot;:&quot;&quot;,&quot;page_footer_right&quot;:&quot;&quot;,&quot;print_template_background&quot;:&quot;&quot;,&quot;header_left&quot;:&quot;第&amp;[页码]页 共&amp;[总页数]页&amp;[日期] &amp;[人员]&quot;}</paperSetting>
</grid>
</AllGrids>
<reportName>example:/订单.cr</reportName>
<defaultsetting>
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
<layout>[&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 0,&#xA;        &quot;w&quot;: 24,&#xA;        &quot;h&quot;: 15,&#xA;        &quot;i&quot;: 0,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;label&quot;: &quot;main&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;no_use_parent_css&quot;: false,&#xA;                        &quot;fit&quot;: true,&#xA;                        &quot;page_size&quot;: 20,&#xA;                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,&#xA;                        &quot;gridName&quot;: &quot;main&quot;,&#xA;                        &quot;span&quot;: 24,&#xA;                        &quot;component&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;prop&quot;: &quot;1638165806230_44736&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;conditionformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;alternateformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;icon&quot;: &quot;img/m_pm.png&quot;,&#xA;                        &quot;paperSetting&quot;: &quot;{\&quot;pageSize_name\&quot;:\&quot;A4\&quot;,\&quot;pageSize_Width\&quot;:595,\&quot;pageSize_Height\&quot;:842,\&quot;orientation\&quot;:\&quot;portrait\&quot;,\&quot;fitToPage\&quot;:true,\&quot;scale\&quot;:100,\&quot;fitToWidth\&quot;:1,\&quot;fitToHeight\&quot;:1222,\&quot;margin_top\&quot;:36,\&quot;margin_bottom\&quot;:36,\&quot;margin_left\&quot;:36,\&quot;margin_right\&quot;:36,\&quot;page_header\&quot;:10,\&quot;page_footer\&quot;:10,\&quot;horizontalCentered\&quot;:false,\&quot;verticalCentered\&quot;:false,\&quot;page_header_left\&quot;:\&quot;\&quot;,\&quot;page_header_center\&quot;:\&quot;\&quot;,\&quot;page_header_right\&quot;:\&quot;\&quot;,\&quot;page_footer_left\&quot;:\&quot;\&quot;,\&quot;page_footer_center\&quot;:\&quot;\&quot;,\&quot;page_footer_right\&quot;:\&quot;\&quot;,\&quot;print_template_background\&quot;:\&quot;\&quot;,\&quot;header_left\&quot;:\&quot;第&amp;[页码]页 共&amp;[总页数]页&amp;[日期] &amp;[人员]\&quot;}&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;moved&quot;: false,&#xA;        &quot;show&quot;: true,&#xA;        &quot;bg&quot;: {&#xA;            &quot;backgroundImage&quot;: &quot;&quot;,&#xA;            &quot;BACKGROUND-COLOR&quot;: &quot;&quot;,&#xA;            &quot;border_box&quot;: &quot;div&quot;,&#xA;            &quot;border_option&quot;: {&#xA;                &quot;color&quot;: [&#xA;                    &quot;#83bff6&quot;,&#xA;                    &quot;#00CED1&quot;&#xA;                ]&#xA;            }&#xA;        }&#xA;    }&#xA;]</layout>
<includeFiles />
<datasources>
<dataSource name="dfsd">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" />
<notebook />
<template>
<backgroundImage />
<big_screen>0</big_screen>
<screen_width>1920</screen_width>
<screen_height>1080</screen_height>
<border_option>
<color>#83bff6</color>
<color>#00CED1</color>
</border_option>
<notebook />
<before_exec_script>_zb_var_.人员=&#x27;人员xxxx&#x27;;</before_exec_script>
<footer2 />
</template>
<conn_list>testsqlite</conn_list>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>1</s_row>
<e_row>1</e_row>
<s_col>0</s_col>
<e_col>6</e_col>
</range_level>
<functions />
<script />
<canExecuteExpr />
<cache time="10" />
<parent_defaultsetting>
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
</parent_defaultsetting>
<layout_hidden>[]</layout_hidden>
</report>