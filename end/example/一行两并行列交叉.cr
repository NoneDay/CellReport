<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;类别名称&quot;,&quot;雇员名字&quot;,&quot;运货商名称&quot;,&quot;订购日期&quot;,&quot;金额&quot;]">SELECT 类别.类别名称, 雇员.姓氏||雇员.名字 AS 雇员名字, 运货商.公司名称 AS 运货商名称, 订单.订购日期,&#xA; ([订单明细].[单价]*[数量]*(1-[折扣])/100)*100 AS 金额&#xA;FROM 运货商 INNER JOIN (类别 INNER JOIN (雇员 INNER JOIN (订单 INNER JOIN (产品 INNER JOIN 订单明细 ON 产品.产品ID = 订单明细.产品ID) ON 订单.订单ID = 订单明细.订单ID) ON 雇员.雇员ID = 订单.雇员ID) ON 类别.类别ID = 产品.类别ID) ON 运货商.运货商ID = 订单.运货商</dataSet>
</dataSets>
<params>
<param name="起始日期" data_type="string" width="20" lines="1" prompt="开始日期" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-01-01" />
<param name="end_date" data_type="string" width="20" lines="1" prompt="终止日期" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-12-31" />
</params>
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="1" is_large="0" title="main" CanShow_expr="" fields="[&quot;&quot;,&quot;类别名称肉/家禽&quot;,&quot;类别名称谷类/麦片&quot;,&quot;类别名称日用品&quot;,&quot;类别名称特制品&quot;,&quot;类别名称海鲜&quot;,&quot;类别名称调味品&quot;,&quot;类别名称点心&quot;,&quot;类别名称饮料&quot;,&quot;类别合计&quot;,&quot;运货商名称联邦货运&quot;,&quot;运货商名称急速快递&quot;,&quot;运货商名称统一包裹&quot;,&quot;合计&quot;,&quot;key&quot;]">
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
<cell displayValueExpr="=@value" extendDirection="column" name="B1" valueExpr="类别名称" rowsOfPage="0" leftHead="" calcLevel="0" text-align="center" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="C1" valueExpr="类别合计" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" />
<cell displayValueExpr="=@value" extendDirection="column" name="D1" valueExpr="运货商名称" rowsOfPage="0" leftHead="" calcLevel="0" text-align="center" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="E1" valueExpr="合计" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" extendDirection="column" name="B2" valueExpr="=数据集1.group(数据集1.类别名称)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" extendDirection="column" name="D2" valueExpr="=数据集1.group(数据集1.运货商名称)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=数据集1.group(数据集1.雇员名字)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="B3" valueExpr="=数据集1.sum(数据集1.金额)" rowsOfPage="0" leftHead="" calcLevel="2" background-color="#80FF80" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="C3" valueExpr="=数据集1.sum(数据集1.金额)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="D3" valueExpr="=数据集1.sum(数据集1.金额)" rowsOfPage="0" leftHead="" calcLevel="2" background-color="#FFFF80" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
<cell displayValueExpr="=@value" name="E3" valueExpr="=sum(D3{})" rowsOfPage="0" leftHead="" calcLevel="3" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" />
</cells>
<no_use_parent_css>0</no_use_parent_css>
</grid>
</AllGrids>
<reportName>example:/一行两并行列交叉.cr</reportName>
<layout>[&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 0,&#xA;        &quot;w&quot;: 24,&#xA;        &quot;h&quot;: 15,&#xA;        &quot;i&quot;: 0,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;label&quot;: &quot;main&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;no_use_parent_css&quot;: true,&#xA;                        &quot;fit&quot;: true,&#xA;                        &quot;page_size&quot;: 20,&#xA;                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,&#xA;                        &quot;gridName&quot;: &quot;main&quot;,&#xA;                        &quot;span&quot;: 24,&#xA;                        &quot;component&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;prop&quot;: &quot;1638161796653_46247&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;conditionformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;alternateformat_save&quot;: &quot;[]&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;moved&quot;: false&#xA;    }&#xA;]</layout>
<includeFiles />
<datasources>
<dataSource name="dfsd" oledb="0">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" />
<notebook />
<template />
<conn_list>testsqlite</conn_list>
<range_level>
<level>0</level>
<gridName>main</gridName>
<s_row>0</s_row>
<e_row>2</e_row>
<s_col>1</s_col>
<e_col>1</e_col>
</range_level>
<range_level>
<level>0</level>
<gridName>main</gridName>
<s_row>0</s_row>
<e_row>2</e_row>
<s_col>3</s_col>
<e_col>3</e_col>
</range_level>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>1</s_row>
<e_row>2</e_row>
<s_col>1</s_col>
<e_col>1</e_col>
</range_level>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>1</s_row>
<e_row>2</e_row>
<s_col>3</s_col>
<e_col>3</e_col>
</range_level>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>2</s_row>
<e_row>2</e_row>
<s_col>0</s_col>
<e_col>4</e_col>
</range_level>
<defaultsetting>
<font>微软雅黑</font>
<font_size>11</font_size>
<color>black</color>
<border_style>gray 1px dotted</border_style>
</defaultsetting>
<functions />
<script />
<canExecuteExpr />
<cache time="10" />
<bi_dataSets />
<click_refresh_grids />
<parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black">
<h3>This page contains the following errors:</h3>
<h3>Below is a rendering of the page up to the first error.</h3>
<div style="font-family:monospace;font-size:12px">error on line 90 at column 20864: Char 0x0 out of allowed range</div>
</parsererror>
</report>