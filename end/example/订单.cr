<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;订单ID&quot;,&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价&quot;]">SELECT [订单明细].[订单ID], [订单明细].[产品ID], [产品].[产品名称], [订单明细].[单价], [订单明细].[数量], [订单明细].[折扣], ([订单明细].[单价]*[数量]*(1-[折扣])/100)*100 AS 总价&#xA;FROM 产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]&#xA;where 1=1 and &#x27;$riqi$&#x27;=&#x27;$riqi$&#x27;&#xA;$if(false==isEmpty(param.dindan)){$&#xA; and [订单明细].[订单ID]=&#x27;$dindan$&#x27;&#xA;$}$&#xA;&#xA;$if(false==isEmpty(param.chanping)){$&#xA;and [订单明细].[产品ID]=&#x27;$chanping$&#x27;&#xA;$}$&#xA;ORDER BY [订单明细].[订单ID]</dataSet>
</dataSets>
<params>
<param name="dindan" data_type="string" prompt="订单id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" />
<param name="chanping" data_type="string" prompt="产品id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="0" dataSetName_default="" valueField_default="" default_value="" />
<param name="riqi" prompt="riqi" data_type="date" width="" lines="" value="" dateTimeFormat="" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="noneQuery" dataSetName_kyz="" valueField_kyz="" parent_valueField_kyz="" tagField_kyz="" tagValueList="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" />
</params>
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr="" fields="[&quot;订单id&quot;,&quot;产品id&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价pdf输出时，单元格行后分页(true)&quot;,&quot;key&quot;]" is_large="0">
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
<row name="1" height="59" fixed="False" />
<row name="2" height="28" fixed="False" />
<row name="3" height="25" fixed="False" />
<row name="4" height="25" fixed="False" />
<row name="5" height="25" fixed="False" />
<row name="6" height="25" fixed="False" />
</rows>
<cells>
<cell displayValueExpr="=@value" leftHead="" topHead="" link="" valueExpr="的点点滴滴" calcLevel="" text-align="right" name="B1:D1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" BOLD="True" FONT-SIZE="18" />
<cell displayValueExpr="=@value" name="A2" valueExpr="订单id" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="B2" valueExpr="产品id" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="C2" valueExpr="产品名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="D2" valueExpr="单价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="E2" valueExpr="数量" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="F2" valueExpr="折扣" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" />
<cell displayValueExpr="=@value" name="G2" valueExpr="总价pdf输出时，单元格行后分页(true)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" BOLD="True" vertical-align="bottom" />
<cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=数据集1.select(数据集1.订单id)" rowsOfPage="25" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=@value" name="B3" valueExpr="=数据集1.产品id" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=@value" name="C3" valueExpr="=数据集1.产品名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=@value" name="D3" valueExpr="=数据集1.单价" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=@value" name="E3" valueExpr="=数据集1.数量" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=@value" name="F3" valueExpr="=数据集1.折扣" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" text-align="center" />
<cell displayValueExpr="=formatNumber(@value)" name="G3" valueExpr="=数据集1.总价" rowsOfPage="0" leftHead="" calcLevel="1" text-align="center" BORDER-LEFT="0.5pt solid #000" BORDER-RIGHT="0.5pt solid #000" BORDER-TOP="0.5pt solid #000" BORDER-BOTTOM="0.5pt solid #000" />
</cells>
<no_use_parent_css>0</no_use_parent_css>
<conditionformat_save>[]</conditionformat_save>
<alternateformat_save>[]</alternateformat_save>
</grid>
</AllGrids>
<reportName>example:/订单.cr</reportName>
<defaultsetting>
<BACKGROUND-COLOR>white</BACKGROUND-COLOR>
<COLOR>black</COLOR>
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
<layout>[&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 5,&#xA;        &quot;w&quot;: 24,&#xA;        &quot;h&quot;: 11,&#xA;        &quot;i&quot;: 0,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;layout_div&quot;,&#xA;            &quot;label&quot;: &quot;div布局&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-group&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;label&quot;: &quot;main&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;no_use_parent_css&quot;: true,&#xA;                        &quot;fit&quot;: false,&#xA;                        &quot;page_size&quot;: 20,&#xA;                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,&#xA;                        &quot;gridName&quot;: &quot;main&quot;,&#xA;                        &quot;span&quot;: 24,&#xA;                        &quot;component&quot;: &quot;luckySheetProxy&quot;,&#xA;                        &quot;prop&quot;: &quot;1638165806230_44736&quot;,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;conditionformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;alternateformat_save&quot;: &quot;[]&quot;,&#xA;                        &quot;icon&quot;: &quot;img/m_pm.png&quot;,&#xA;                        &quot;paperSetting&quot;: &quot;{\&quot;pageSize_name\&quot;:\&quot;A4\&quot;,\n                \&quot;pageSize_Width\&quot;:595,\n                \&quot;pageSize_Height\&quot;:842,\n                \&quot;margin_top\&quot;:36,\n                \&quot;margin_bottom\&quot;:36,\n                \&quot;margin_left\&quot;:36,\n                \&quot;margin_right\&quot;:36}&quot;&#xA;                    }&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;moved&quot;: false,&#xA;        &quot;show&quot;: true,&#xA;        &quot;bg&quot;: {&#xA;            &quot;backgroundImage&quot;: &quot;&quot;,&#xA;            &quot;BACKGROUND-COLOR&quot;: &quot;&quot;,&#xA;            &quot;border_box&quot;: &quot;div&quot;,&#xA;            &quot;border_option&quot;: {&#xA;                &quot;color&quot;: [&#xA;                    &quot;#83bff6&quot;,&#xA;                    &quot;#00CED1&quot;&#xA;                ]&#xA;            }&#xA;        }&#xA;    },&#xA;    {&#xA;        &quot;x&quot;: 0,&#xA;        &quot;y&quot;: 0,&#xA;        &quot;w&quot;: 24,&#xA;        &quot;h&quot;: 5,&#xA;        &quot;i&quot;: 1,&#xA;        &quot;element&quot;: {&#xA;            &quot;type&quot;: &quot;flex_span_row&quot;,&#xA;            &quot;label&quot;: &quot;同行容器&quot;,&#xA;            &quot;span&quot;: 24,&#xA;            &quot;icon&quot;: &quot;icon-group&quot;,&#xA;            &quot;display&quot;: true,&#xA;            &quot;style&quot;: {&#xA;                &quot;height&quot;: &quot;100%&quot;,&#xA;                &quot;width&quot;: &quot;30%&quot;&#xA;            },&#xA;            &quot;component&quot;: &quot;widget-form-row-span&quot;,&#xA;            &quot;flex&quot;: {&#xA;                &quot;flex-direction&quot;: &quot;row&quot;&#xA;            },&#xA;            &quot;flex-margin&quot;: 5,&#xA;            &quot;gridName&quot;: &quot;flex_span_row_359&quot;,&#xA;            &quot;prop&quot;: &quot;_random_&quot;,&#xA;            &quot;children&quot;: {&#xA;                &quot;column&quot;: [&#xA;                    {&#xA;                        &quot;type&quot;: &quot;dv_scroll_board&quot;,&#xA;                        &quot;label&quot;: &quot;轮播表&quot;,&#xA;                        &quot;gridName&quot;: &quot;dv_scroll_board_450&quot;,&#xA;                        &quot;h&quot;: 4,&#xA;                        &quot;span&quot;: 6,&#xA;                        &quot;icon&quot;: &quot;&quot;,&#xA;                        &quot;color&quot;: &quot;#fff&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;fields&quot;: [],&#xA;                        &quot;component&quot;: &quot;dync-template&quot;,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;,&#xA;                            &quot;width&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;option&quot;: {&#xA;                            &quot;rowNum&quot;: 5,&#xA;                            &quot;waitTime&quot;: 2000,&#xA;                            &quot;carousel&quot;: &quot;single&quot;,&#xA;                            &quot;unit&quot;: &quot;&quot;,&#xA;                            &quot;sort&quot;: true,&#xA;                            &quot;headerBGC&quot;: &quot;#00BAFF&quot;,&#xA;                            &quot;oddRowBGC&quot;: &quot;#003B51&quot;,&#xA;                            &quot;evenRowBGC&quot;: &quot;#0A2732&quot;,&#xA;                            &quot;headerHeigh&quot;: 35,&#xA;                            &quot;index&quot;: false,&#xA;                            &quot;indexHeade&quot;: &quot;#&quot;,&#xA;                            &quot;hoverPause&quot;: true&#xA;                        },&#xA;                        &quot;content&quot;: &quot;&lt;dv-scroll-board :config=\&quot;{\n            header: cur_ds[0],\n            data: cur_ds.slice(1)\n,columnWidth :conf_field_prop_arr(&#x27;width&#x27;)\n,align :conf_field_prop_arr(&#x27;align&#x27;)\n,rowNum\t       :self.option.rowNum\t       || 5        \n,waitTime\t   :self.option.waitTime\t   ||  2000    \n,carousel\t   :self.option.carousel\t   ||  &#x27;single&#x27;\n,unit\t       :self.option.unit\t       ||  &#x27;&#x27;      \n,sort\t       :self.option.sort\t       ||  true              \n,rowNum\t       :self.option.rowNum\t     ||  5         \n,headerBGC\t   :self.option.headerBGC\t ||  &#x27;#00BAFF&#x27; \n,oddRowBGC\t   :self.option.oddRowBGC\t ||  &#x27;#003B51&#x27; \n,evenRowBGC\t   :self.option.evenRowBGC\t ||  &#x27;#0A2732&#x27; \n,waitTime\t   :self.option.waitTime\t ||  2000      \n,headerHeight\t:self.option.headerHeight||  35        \n,index\t       :self.option.index\t     ||  false     \n,indexHeader\t:self.option.indexHeader||  &#x27;#&#x27;        \n,carousel\t   :self.option.carousel\t ||  &#x27;single&#x27;  \n,hoverPause\t   :self.option.hoverPause\t ||  \tfalse   \n          }\&quot; style=\&quot;width:100%;height:100%;\&quot; /&gt; &quot;,&#xA;                        &quot;prop&quot;: &quot;1655539497431_5026&quot;,&#xA;                        &quot;height&quot;: &quot;100%&quot;,&#xA;                        &quot;flex-shrink&quot;: 1,&#xA;                        &quot;flex-grow&quot;: 1,&#xA;                        &quot;align-self&quot;: &quot;auto&quot;,&#xA;                        &quot;flex-margin&quot;: &quot;5px&quot;&#xA;                    },&#xA;                    {&#xA;                        &quot;type&quot;: &quot;dv_scroll_ranking_board&quot;,&#xA;                        &quot;label&quot;: &quot;排名轮播表&quot;,&#xA;                        &quot;gridName&quot;: &quot;dv_scroll_ranking_board_480&quot;,&#xA;                        &quot;h&quot;: 4,&#xA;                        &quot;span&quot;: 6,&#xA;                        &quot;icon&quot;: &quot;&quot;,&#xA;                        &quot;color&quot;: &quot;#fff&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;component&quot;: &quot;dync-template&quot;,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;,&#xA;                            &quot;width&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;fresh_ds&quot;: [],&#xA;                        &quot;fresh_params&quot;: [],&#xA;                        &quot;fields&quot;: [],&#xA;                        &quot;option&quot;: {&#xA;                            &quot;rowNum&quot;: 5,&#xA;                            &quot;waitTime&quot;: 2000,&#xA;                            &quot;carousel&quot;: &quot;single&quot;,&#xA;                            &quot;unit&quot;: &quot;&quot;,&#xA;                            &quot;sort&quot;: true,&#xA;                            &quot;headerBGC&quot;: &quot;#00BAFF&quot;,&#xA;                            &quot;oddRowBGC&quot;: &quot;#003B51&quot;,&#xA;                            &quot;evenRowBGC&quot;: &quot;#0A2732&quot;,&#xA;                            &quot;headerHeigh&quot;: 35,&#xA;                            &quot;index&quot;: false,&#xA;                            &quot;indexHeade&quot;: &quot;#&quot;,&#xA;                            &quot;hoverPause&quot;: true,&#xA;                            &quot;color&quot;: &quot;&quot;&#xA;                        },&#xA;                        &quot;content&quot;: &quot;&lt;dv-scroll-ranking-board :config=\&quot;{\n            data: Enumerable.from(cur_ds).skip(1).select(x=&gt; { \n              return {&#x27;name&#x27;:x[0],value:x[1]} \n            }).toArray()\n,rowNum\t       :self.option.rowNum\t       || 5        \n,waitTime\t   :self.option.waitTime\t   ||  2000    \n,carousel\t   :self.option.carousel\t   ||  &#x27;single&#x27;\n,unit\t       :self.option.unit\t       ||  &#x27;&#x27;      \n,sort\t       :self.option.sort\t       ||  true    \n          }\&quot; :style=\&quot;&#x27;width:100%;height:100%;color:&#x27;+(self.option.color||defaultsetting[&#x27;COLOR&#x27;])\&quot; /&gt; &quot;,&#xA;                        &quot;prop&quot;: &quot;1655539496426_29789&quot;,&#xA;                        &quot;height&quot;: &quot;100%&quot;,&#xA;                        &quot;flex-shrink&quot;: 1,&#xA;                        &quot;flex-grow&quot;: 1,&#xA;                        &quot;align-self&quot;: &quot;auto&quot;,&#xA;                        &quot;flex-margin&quot;: &quot;5px&quot;&#xA;                    },&#xA;                    {&#xA;                        &quot;type&quot;: &quot;text&quot;,&#xA;                        &quot;label&quot;: &quot;文字&quot;,&#xA;                        &quot;h&quot;: 4,&#xA;                        &quot;span&quot;: 6,&#xA;                        &quot;component&quot;: &quot;dync-template&quot;,&#xA;                        &quot;gridName&quot;: &quot;text_592&quot;,&#xA;                        &quot;icon&quot;: &quot;icon-table&quot;,&#xA;                        &quot;style&quot;: {&#xA;                            &quot;height&quot;: &quot;100%&quot;,&#xA;                            &quot;width&quot;: &quot;100%&quot;&#xA;                        },&#xA;                        &quot;titleOption&quot;: {&#xA;                            &quot;scroll&quot;: false,&#xA;                            &quot;step&quot;: 0.5,&#xA;                            &quot;speed&quot;: 70,&#xA;                            &quot;textAlign&quot;: &quot;center&quot;,&#xA;                            &quot;fontSize&quot;: 22,&#xA;                            &quot;fontWeight&quot;: &quot;normal&quot;,&#xA;                            &quot;color&quot;: &quot;&quot;,&#xA;                            &quot;textShadowX&quot;: 1,&#xA;                            &quot;textShadowY&quot;: 1,&#xA;                            &quot;textShadowZ&quot;: 1,&#xA;                            &quot;margin_left&quot;: 0,&#xA;                            &quot;split&quot;: 0,&#xA;                            &quot;lineHeight&quot;: 0&#xA;                        },&#xA;                        &quot;color&quot;: &quot;#fff&quot;,&#xA;                        &quot;display&quot;: true,&#xA;                        &quot;content&quot;: &quot;&lt;eleText :self=\&quot;self\&quot;&gt;{{ &lt;t&gt;value&lt;/t&gt; }}&lt;/eleText&gt; &quot;,&#xA;                        &quot;prop&quot;: &quot;1655541772881_69322&quot;,&#xA;                        &quot;height&quot;: &quot;100%&quot;,&#xA;                        &quot;flex-shrink&quot;: 1,&#xA;                        &quot;flex-grow&quot;: 1,&#xA;                        &quot;align-self&quot;: &quot;auto&quot;,&#xA;                        &quot;flex-margin&quot;: &quot;5px&quot;,&#xA;                        &quot;background-color&quot;: &quot;rgba(255, 140, 0, 1)&quot;&#xA;                    }&#xA;                ]&#xA;            },&#xA;            &quot;h&quot;: 5,&#xA;            &quot;height&quot;: &quot;100%&quot;&#xA;        },&#xA;        &quot;show&quot;: true,&#xA;        &quot;border_box&quot;: &quot;div&quot;,&#xA;        &quot;bg&quot;: {&#xA;            &quot;backgroundImage&quot;: &quot;&quot;,&#xA;            &quot;BACKGROUND-COLOR&quot;: &quot;&quot;,&#xA;            &quot;border_box&quot;: &quot;div&quot;,&#xA;            &quot;border_option&quot;: {&#xA;                &quot;color&quot;: [&#xA;                    &quot;#83bff6&quot;,&#xA;                    &quot;#00CED1&quot;&#xA;                ]&#xA;            }&#xA;        },&#xA;        &quot;moved&quot;: false&#xA;    }&#xA;]</layout>
<includeFiles />
<datasources>
<dataSource name="dfsd">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" />
<notebook />
<template>
<BACKGROUND-COLOR>white</BACKGROUND-COLOR>
<COLOR>black</COLOR>
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
<rotate_second />
</template>
<conn_list>testsqlite</conn_list>
<range_level>
<level>1</level>
<gridName>main</gridName>
<s_row>2</s_row>
<e_row>2</e_row>
<s_col>0</s_col>
<e_col>6</e_col>
</range_level>
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