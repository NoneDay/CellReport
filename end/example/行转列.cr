<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="ds" type="sql" dataSource="testsqlite" fields="[]">SELECT test_联系表.ID, test_联系表.姓名, test_联系表.名称, test_联系表.联系类型
FROM test_联系表;</dataSet>
</dataSets>
<params />
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" title="main" CanShow_expr="" fix_rows="-1" fix_cols="-1">
<columns>
<column name="a" width="75" fixed="False" />
<column name="b" width="75" fixed="False" />
<column name="c" width="130" fixed="False" />
<column name="d" width="75" fixed="False" />
<column name="e" width="75" fixed="False" />
<column name="f" width="75" fixed="False" />
<column name="g" width="75" fixed="False" />
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
<row name="10" height="25" fixed="False" />
<row name="11" height="25" fixed="False" />
<row name="12" height="25" fixed="False" />
<row name="13" height="25" fixed="False" />
<row name="14" height="25" fixed="False" />
<row name="15" height="25" fixed="False" />
<row name="16" height="25" fixed="False" />
<row name="17" height="25" fixed="False" />
<row name="18" height="25" fixed="False" />
<row name="19" height="25" fixed="False" />
</rows>
<cells>
<cell displayValueExpr="=@value" name="A1:C1" valueExpr="这是原来的数据" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" text-align="left" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A2" valueExpr="姓名" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B2" valueExpr="名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C2" valueExpr="联系类型" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=ds.select(ds.姓名)" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B3" valueExpr="=ds.名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C3" valueExpr="=ds.联系类型" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A4:C4" valueExpr="这是已知列做的例子" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" text-align="left" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B5" valueExpr="省份" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C5" valueExpr="邮箱" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="D5" valueExpr="电话" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="row" name="A6" valueExpr="=ds.group(ds.姓名)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B6" valueExpr="=ds.select1(ds.名称,ds.联系类型==&#x27;省份&#x27;)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="C6" valueExpr="=ds.select1(ds.名称,ds.联系类型==&#x27;邮箱&#x27;)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="D6" valueExpr="=ds.select1(ds.名称,ds.联系类型==&#x27;电话&#x27;)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A7:C7" valueExpr="这是用交叉表的方式中做的行列转换" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" text-align="left" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="column" name="B8" valueExpr="=ds.group(ds.联系类型)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="row" name="A9" valueExpr="=ds.group(ds.姓名)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B9" valueExpr="=ds.名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A10:C10" valueExpr="下面是完全的数据行列转换" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A11" valueExpr="姓名" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="column" name="B11" valueExpr="=ds.select(ds.姓名)" rowsOfPage="0" leftHead="" topHead="`0" calcLevel="0" text-align="right" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A12" valueExpr="名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B12" valueExpr="=ds.名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="A13" valueExpr="联系类型" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" name="B13" valueExpr="=ds.联系类型" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
<cell displayValueExpr="=@value" extendDirection="column" name="B15:C15" valueExpr="=ds.group(ds.姓名)" rowsOfPage="0" leftHead="" topHead="`0" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" />
</cells>
</grid>
</AllGrids>
<reportName>test:/行转列.cr</reportName>
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
                        &quot;no_use_parent_css&quot;: false,
                        &quot;fit&quot;: true,
                        &quot;page_size&quot;: 20,
                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,
                        &quot;gridName&quot;: &quot;main&quot;,
                        &quot;span&quot;: 24,
                        &quot;component&quot;: &quot;luckySheetProxy&quot;,
                        &quot;prop&quot;: &quot;1638322444878_28947&quot;,
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
<dataSource name="data">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" paperSize="A4" pageHeight="1169" pageWidth="827" marginLeft="19" marginRight="19" marginTop="19" marginBottom="19" Landscape="False" header="" footer="" />
<notebook />
<template />
<conn_list>testsqlite</conn_list>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>2</s_row>
<e_row>2</e_row>
<s_col>0</s_col>
<e_col>2</e_col>
</range_level>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>5</s_row>
<e_row>5</e_row>
<s_col>0</s_col>
<e_col>3</e_col>
</range_level>
<range_level>
<level>0</level>
<gridName>main</gridName>
<s_row>7</s_row>
<e_row>8</e_row>
<s_col>1</s_col>
<e_col>1</e_col>
</range_level>
<range_level>
<level>2</level>
<gridName>main</gridName>
<s_row>8</s_row>
<e_row>8</e_row>
<s_col>0</s_col>
<e_col>1</e_col>
</range_level>
<range_level>
<level>0</level>
<gridName>main</gridName>
<s_row>10</s_row>
<e_row>12</e_row>
<s_col>1</s_col>
<e_col>1</e_col>
</range_level>
<range_level>
<level>0</level>
<gridName>main</gridName>
<s_row>14</s_row>
<e_row>14</e_row>
<s_col>1</s_col>
<e_col>2</e_col>
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