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
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" is_large="0">
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
<reportName>test:/test_交集.cr</reportName>
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
                        &quot;page_size&quot;: 20,
                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,
                        &quot;gridName&quot;: &quot;main&quot;,
                        &quot;span&quot;: 24,
                        &quot;component&quot;: &quot;luckySheetProxy&quot;,
                        &quot;prop&quot;: &quot;1638166837614_89949&quot;,
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
<dataSource name="as" oledb="0">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" />
<notebook />
<template />
<conn_list>testsqlite</conn_list>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>2</s_row>
<e_row>2</e_row>
<s_col>2</s_col>
<e_col>3</e_col>
</range_level>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>2</s_row>
<e_row>2</e_row>
<s_col>5</s_col>
<e_col>6</e_col>
</range_level>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>5</s_row>
<e_row>5</e_row>
<s_col>2</s_col>
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