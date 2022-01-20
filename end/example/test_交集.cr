<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="ds1" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">SELECT 类别.类别ID, 类别.类别名称&#xA;FROM 类别&#xA;where&#xA;类别.类别ID &lt; 8</dataSet>
<dataSet name="ds2" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">SELECT 类别.类别ID, 类别.类别名称&#xA;FROM 类别&#xA;where&#xA;类别.类别ID &gt;1</dataSet>
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
<reportName>example:/test_交集.cr</reportName>
<layout>[&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 0,&#xA;        &quot;w&quot;: 24,&#xA;        &quot;h&quot;: 7,&#xA;        &quot;i&quot;: 0,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;label&quot;: &quot;main&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;no_use_parent_css&quot;: true,&#xA;                        &quot;fit&quot;: false,&#xA;                        &quot;page_size&quot;: 20,&#xA;                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,&#xA;                        &quot;gridName&quot;: &quot;main&quot;,&#xA;                        &quot;span&quot;: 24,&#xA;                        &quot;component&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;prop&quot;: &quot;1638166837614_89949&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;conditionformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;alternateformat_save&quot;: &quot;[]&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;moved&quot;: false,&#xA;        &quot;show&quot;: true&#xA;    },&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 7,&#xA;        &quot;w&quot;: 8,&#xA;        &quot;h&quot;: 7,&#xA;        &quot;i&quot;: 1,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;echart&quot;,&#xA;                        &quot;label&quot;: &quot;柱状图&quot;,&#xA;                        &quot;gridName&quot;: &quot;echart1642640215648_38473&quot;,&#xA;                        &quot;color&quot;: &quot;#fff&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;component&quot;: &quot;echarts&quot;,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;series_type&quot;: &quot;{\&quot;type\&quot;:\&quot;bar\&quot;}&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;fields&quot;: [],&#xA;                        &quot;datasource&quot;: &quot;示例&quot;,&#xA;                        &quot;data&quot;: [],&#xA;                        &quot;content&quot;: &quot;option = {\n  //backgroundColor: &#x27;#fff&#x27;,\n  legend: {selectedMode:&#x27;single&#x27;},//单选模式\n  tooltip: {},\n  dataset: {\n      // 提供一份数据。__valid_data__为自动生成，如果全自定义，就不要使用\n      source: __valid_data__\n  },\n  grid:{left :30,right:10,top:10,bottom:30},\n  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。\n  yAxis: {},\n  // 声明一个 Y 轴，数值轴。\n  xAxis: {type: &#x27;category&#x27;,\&quot;axisLabel\&quot;: {\n    \&quot;margin\&quot;: 8,\n    \&quot;interval\&quot;:0,//解决代码,坐标轴上的刻度是否全显示\n    \&quot;textStyle\&quot;: {\n        \&quot;color\&quot;: \&quot;#676767\&quot;\n    }}},\n  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。\n  series:function(){\n      let series_type=[]\n      __valid_data__[0].slice(1).forEach(ele=&gt;{\n          series_type.push({\&quot;type\&quot;:\&quot;bar\&quot;})\n      }); return series_type\n    }() \n}&quot;,&#xA;                        &quot;prop&quot;: &quot;1642640215648_29386&quot;,&#xA;                        &quot;span&quot;: 12,&#xA;                        &quot;height&quot;: &quot;100%&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;show&quot;: true,&#xA;        &quot;border_box&quot;: &quot;div&quot;,&#xA;        &quot;moved&quot;: false&#xA;    },&#xA;    {&#xA;        &quot;x&quot;: 8,&#xA;        &quot;y&quot;: 7,&#xA;        &quot;w&quot;: 9,&#xA;        &quot;h&quot;: 7,&#xA;        &quot;i&quot;: 2,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;ele-grid&quot;,&#xA;                        &quot;label&quot;: &quot;ele_grid&quot;,&#xA;                        &quot;color&quot;: &quot;#fff&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;pageSize&quot;: 20,&#xA;                        &quot;gridName&quot;: &quot;ele_grid1642640222712_74423&quot;,&#xA;                        &quot;datasource&quot;: &quot;示例&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;fields&quot;: [],&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;content&quot;: &quot;&lt;div style=\&quot;width:100%;height:100%\&quot; v-if=\&quot;tableData.length&gt;0\&quot;&gt; \n            &lt;el-table stripe border height=\&quot;calc(100% - 28px)\&quot;  @cell-click=\&quot;cell_click\&quot;\n              :data=\&quot;tableData.slice((currentPage - 1) * self.pageSize, currentPage*self.pageSize)\&quot; \n            &gt;\n                &lt;el-table-column v-for=\&quot;(one,idx) in Object.keys(tableData[0])\&quot;  sortable\n                  :key=\&quot;one+idx\&quot; :prop=\&quot;one\&quot; :label=\&quot;one\&quot;&gt; \n                &lt;/el-table-column&gt;\n            &lt;/el-table&gt;\n            &lt;el-pagination  \n                :current-page.sync=\&quot;currentPage\&quot;\n                :page-sizes=\&quot;[2, 5, 10, 20]\&quot;\n                :page-size.sync=\&quot;self.pageSize\&quot; \n                layout=\&quot;total, sizes, prev, pager, next, jumper\&quot;\n                :total.sync=\&quot;tableData.length\&quot;&gt;\n            &lt;/el-pagination&gt;\n            &lt;/div&gt; &quot;,&#xA;                        &quot;component&quot;: &quot;ele-grid&quot;,&#xA;                        &quot;prop&quot;: &quot;1642640222712_92800&quot;,&#xA;                        &quot;span&quot;: 12,&#xA;                        &quot;height&quot;: &quot;100%&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;show&quot;: true,&#xA;        &quot;border_box&quot;: &quot;div&quot;,&#xA;        &quot;moved&quot;: false&#xA;    }&#xA;]</layout>
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