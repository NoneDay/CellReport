<report version="1" needCatchQuShuException="False">
<dataSets>
<dataSet name="ds" type="sql" dataSource="testsqlite" fields="[&quot;订购日期&quot;,&quot;运货费&quot;]">SELECT 订单.订购日期,sum(订单.运货费) as 运货费
FROM 订单
where  订购日期 between &#x27;$begin_date$&#x27; and &#x27;$end_date$&#x27;
group by 订购日期</dataSet>
</dataSets>
<params>
<param name="订购日期" data_type="date" prompt="某月的任一天" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-02-01" />
<param name="begin_date" data_type="date" prompt="" hide="False" allowNull="False" inner="True" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="=monthBegin(param.订购日期)" />
<param name="end_date" data_type="date" prompt="" hide="False" allowNull="False" inner="True" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="=monthEnd(param.订购日期)" />
</params>
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   " optimize="True" name="main" title="main" CanShow_expr="" fix_rows="-1" fix_cols="-1" is_large="0">
<columns>
<column name="a" width="75" fixed="False" />
<column name="b" width="140" fixed="False" />
<column name="c" width="136" fixed="False" />
<column name="d" width="93" fixed="False" />
<column name="e" width="89" fixed="False" />
<column name="f" width="75" fixed="False" />
<column name="g" width="75" fixed="False" />
<column name="h" width="75" fixed="False" />
<column name="i" width="75" fixed="False" />
<column name="j" width="75" fixed="False" />
</columns>
<rows>
<row name="1" height="25" fixed="False" />
<row name="2" height="47" fixed="False" />
<row name="3" height="25" fixed="False" />
<row name="4" height="25" fixed="False" />
<row name="5" height="25" fixed="False" />
<row name="6" height="25" fixed="False" />
<row name="7" height="25" fixed="False" />
<row name="8" height="25" fixed="False" />
<row name="9" height="25" fixed="False" />
</rows>
<cells>
<cell displayValueExpr="=@value" name="B2:F2" valueExpr="数据库中只有９６年６月到９８年６月的数据" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" ITALIC="False" UNDERLINE="False" BOLD="False" FONT-SIZE="18" text-align="center" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B3:C3" valueExpr="这边是补齐日期的数据" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="0.5pt solid #000;" BORDER-LEFT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="center" background-color="#93c47d" />
<cell displayValueExpr="=@value" name="E3:F4" valueExpr="这边是原始数据" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="0.5pt solid #000;" BORDER-LEFT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="center" background-color="#ffd966" />
<cell displayValueExpr="=formatDatetime(@value,&#x27;yyyy年MM月dd日&#x27;)" name="B4" valueExpr="=param.begin_date" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#93c47d" text-align="right" />
<cell displayValueExpr="=formatDatetime(@value,&#x27;yyyy年MM月dd日&#x27;)" name="C4" valueExpr="=param.end_date" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#93c47d" text-align="right" />
<cell displayValueExpr="=@value" name="B5" valueExpr="订购日期" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#93c47d" text-align="right" />
<cell displayValueExpr="=@value" name="C5" valueExpr="运货费" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#93c47d" text-align="right" />
<cell displayValueExpr="=@value" name="E5" valueExpr="订购日期" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="F5" valueExpr="运货费" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" extendDirection="row" name="A6" valueExpr="   " rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" text-align="right" />
<cell displayValueExpr="=formatDatetime(date(year(param.订购日期),month(param.订购日期),@value) )" extendDirection="row" name="B6" valueExpr="=union_set( fromto(1,dayOfMonth(monthEnd(param.订购日期))), ds.select(dayOfMonth(ds.订购日期)) )" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" background-color="#b6d7a8" />
<cell displayValueExpr="=@value" name="C6" valueExpr="=ds.sum(ds.运货费)" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#b6d7a8" text-align="right" />
<cell displayValueExpr="=formatDatetime(@value)" extendDirection="row" name="E6" valueExpr="=ds.select(ds.订购日期)" rowsOfPage="0" leftHead="A6" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" background-color="#ffe599" />
<cell displayValueExpr="=@value" name="F6" valueExpr="=ds.sum(ds.运货费)" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" background-color="#ffe599" />
</cells>
<no_use_parent_css>0</no_use_parent_css>
</grid>
</AllGrids>
<reportName>test:/补齐某月的连续日期.cr</reportName>
<layout>[
    {
        &quot;x&quot;: 0,
        &quot;y&quot;: 0,
        &quot;w&quot;: 24,
        &quot;h&quot;: 15,
        &quot;i&quot;: 0,
        &quot;element&quot;: {
            &quot;type&quot;: &quot;layout_div&quot;,
            &quot;label&quot;: &quot;div布局&quot;,
            &quot;span&quot;: 24,
            &quot;icon&quot;: &quot;icon-group&quot;,
            &quot;display&quot;: true,
            &quot;style&quot;: {
                &quot;height&quot;: &quot;100%&quot;
            },
            &quot;component&quot;: &quot;widget-form-group&quot;,
            &quot;prop&quot;: &quot;_random_&quot;,
            &quot;children&quot;: {
                &quot;column&quot;: [
                    {
                        &quot;type&quot;: &quot;luckySheetProxy&quot;,
                        &quot;label&quot;: &quot;main&quot;,
                        &quot;display&quot;: true,
                        &quot;style&quot;: {
                            &quot;height&quot;: &quot;100%&quot;
                        },
                        &quot;no_use_parent_css&quot;: true,
                        &quot;fit&quot;: false,
                        &quot;page_size&quot;: 200,
                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,
                        &quot;gridName&quot;: &quot;main&quot;,
                        &quot;span&quot;: 24,
                        &quot;component&quot;: &quot;luckySheetProxy&quot;,
                        &quot;prop&quot;: &quot;1638191225046_83143&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: [],
                        &quot;conditionformat_save&quot;: &quot;[]&quot;,
                        &quot;alternateformat_save&quot;: &quot;[]&quot;
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    }
]</layout>
<includeFiles />
<datasources>
<dataSource name="asda">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="19" marginRight="19" marginTop="19" marginBottom="19" Landscape="True" header="" footer="" />
<notebook />
<template />
<conn_list>testsqlite</conn_list>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>5</s_row>
<e_row>5</e_row>
<s_col>0</s_col>
<e_col>5</e_col>
</range_level>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>5</s_row>
<e_row>5</e_row>
<s_col>1</s_col>
<e_col>2</e_col>
</range_level>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>5</s_row>
<e_row>5</e_row>
<s_col>4</s_col>
<e_col>5</e_col>
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