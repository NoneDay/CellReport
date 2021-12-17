<report version="2" needCatchQuShuException="False">
<dataSets>
<dataSet name="本期" type="sql" dataSource="testsqlite" fields="[&quot;类别名称&quot;,&quot;产品销售额&quot;]">SELECT [类别].[类别名称],  Sum(([订单明细].[单价]*[数量]*(1-[折扣])/100)*100) AS 产品销售额
FROM 类别 INNER JOIN (订单 INNER JOIN (产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]) ON [订单].[订单ID]=[订单明细].[订单ID]) ON [类别].[类别ID]=[产品].[类别ID]
WHERE ((([订单].[发货日期]) Between &#x27;$month_begin_date$&#x27; And &#x27;$end_date$&#x27;))
GROUP BY [类别].[类别名称]</dataSet>
<dataSet name="累计" type="sql" dataSource="testsqlite" fields="[&quot;类别名称&quot;,&quot;产品销售额&quot;]">SELECT [类别].[类别名称],  Sum(([订单明细].[单价]*[数量]*(1-[折扣])/100)*100) AS 产品销售额
FROM 类别 INNER JOIN (订单 INNER JOIN (产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]) ON [订单].[订单ID]=[订单明细].[订单ID]) ON [类别].[类别ID]=[产品].[类别ID]
WHERE ((([订单].[发货日期]) Between &#x27;$year_begin_date$&#x27; And &#x27;$end_date$&#x27;))
GROUP BY [类别].[类别名称]</dataSet>
<dataSet dataSource="" name="计划" type="csv" fields="[&quot;类别名称&quot;,&quot;计划数&quot;]" path_list="[&quot;Sheet1&quot;,&quot;Sheet2&quot;,&quot;Sheet3&quot;]">
<data>{&quot;Sheet1&quot;:[[&quot;类别名称&quot;,&quot;计划年&quot;,&quot;计划数&quot;],[&quot;饮料&quot;,1997,80000],[&quot;调味品&quot;,1997,80000],[&quot;点心&quot;,1997,80000],[&quot;日用品&quot;,1997,80000],[&quot;谷类/麦片&quot;,1997,80000],[&quot;肉/家禽&quot;,1997,80000],[&quot;特制品&quot;,1997,80000],[&quot;海鲜&quot;,1997,80000]],&quot;Sheet2&quot;:[],&quot;Sheet3&quot;:[]}</data>
<get>Sheet1</get>SELECT 类别名称, 计划数
FROM 计划</dataSet>
</dataSets>
<params>
<param name="end_date" data_type="date" width="20" lines="1" prompt="终止日期" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="1997-12-23" />
<param name="year_begin_date" data_type="date" width="20" lines="1" prompt="year_begin_date" hide="False" allowNull="False" inner="True" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="=firstDayOfYear(param.end_date)" />
<param name="month_begin_date" data_type="date" width="20" lines="1" prompt="month_begin_date" hide="False" allowNull="False" inner="True" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="NoneQuery" dataSetName_default="" valueField_default="" default_value="=monthBegin(param.end_date)" />
</params>
<AllGrids>
<grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" title="main" CanShow_expr="" fix_rows="-1" fix_cols="-1" is_large="0">
<columns>
<column name="a" width="98" fixed="False" />
<column name="b" width="76" fixed="False" />
<column name="c" width="90" fixed="False" />
<column name="d" width="75" fixed="False" />
<column name="e" width="95" fixed="False" />
<column name="f" width="75" fixed="False" />
<column name="g" width="73" fixed="False" />
<column name="h" width="73" fixed="False" />
</columns>
<rows>
<row name="1" height="25" fixed="False" />
<row name="2" height="25" fixed="False" />
<row name="3" height="25" fixed="False" />
<row name="4" height="25" fixed="False" />
<row name="5" height="25" fixed="False" />
<row name="6" height="25" fixed="False" />
<row name="7" height="25" fixed="False" />
</rows>
<cells>
<cell displayValueExpr="=@value" background-color="#00ff00" text-align="right" name="A1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" valueExpr=" " />
<cell displayValueExpr="=@value" background-color="#00ff00" text-align="right" name="B1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" valueExpr=" " />
<cell displayValueExpr="=@value" background-color="#00ff00" text-align="right" name="C1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" valueExpr=" " />
<cell displayValueExpr="=@value" background-color="#00ff00" text-align="right" name="D1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" valueExpr=" " />
<cell displayValueExpr="=@value" background-color="#00ff00" text-align="right" name="E1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" valueExpr=" " />
<cell displayValueExpr="=@value" name="A2" valueExpr="类别名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="B2" valueExpr="本期" rowsOfPage="0" leftHead="" calcLevel="0" link="=&#x27;?reportName=&#x27;+param.reportName +&#x27;&amp;end_date=&#x27;+formatDatetime(param.end_date) +&quot;&amp;sort=1_b5_c5&quot;" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="C2" valueExpr="累计" rowsOfPage="0" leftHead="" calcLevel="0" link="=&#x27;?reportName=&#x27;+param.reportName +&#x27;&amp;end_date=&#x27;+formatDatetime(param.end_date) +&quot;&amp;sort=1_b5_d5&quot;" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="D2" valueExpr="计划数" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="E2" valueExpr="完成比例" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" extendDirection="row" name="A3" valueExpr="=union_set(累计.group(累计.类别名称),     
       本期.group(本期.类别名称),    
      计划.group(计划.类别名称) )" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffe599" text-align="right" />
<cell displayValueExpr="=@value" name="B3" valueExpr="=本期.sum(本期.产品销售额)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffe599" text-align="right" />
<cell displayValueExpr="=@value" name="C3" valueExpr="=累计.sum(累计.产品销售额)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffe599" text-align="right" />
<cell displayValueExpr="=@value" name="D3" valueExpr="=计划.sum(计划.计划数)" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" text-align="right" background-color="#ffe599" />
<cell displayValueExpr="=@value" name="E3" valueExpr="=100*C3/D3" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="=iif(@value&gt;=100,&#x27;red&#x27;,&#x27;#ffe599&#x27;)" text-align="right" />
<cell displayValueExpr="=@value" name="A4" valueExpr="合计" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="B4" valueExpr="=sum(B3{})" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="C4" valueExpr="=sum(C3{})" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="D4" valueExpr="=sum(D3{})" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
<cell displayValueExpr="=@value" name="E4" valueExpr="=100*C4/D4" rowsOfPage="0" leftHead="" calcLevel="3" BORDER-LEFT="0.5pt solid #000;" BORDER-RIGHT="0.5pt solid #000;" BORDER-TOP="0.5pt solid #000;" BORDER-BOTTOM="0.5pt solid #000;" background-color="#ffd966" text-align="right" />
</cells>
<no_use_parent_css>0</no_use_parent_css>
</grid>
</AllGrids>
<reportName>example:/订单本期累计统计.cr</reportName>
<layout>[
    {
        &quot;x&quot;: 0,
        &quot;y&quot;: 0,
        &quot;w&quot;: 13,
        &quot;h&quot;: 10,
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
                        &quot;fit&quot;: true,
                        &quot;page_size&quot;: 20,
                        &quot;page_sizes&quot;: &quot;[20, 50, 100, 200]&quot;,
                        &quot;gridName&quot;: &quot;main&quot;,
                        &quot;span&quot;: 24,
                        &quot;component&quot;: &quot;luckySheetProxy&quot;,
                        &quot;prop&quot;: &quot;1638162106302_9831&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: [],
                        &quot;conditionformat_save&quot;: &quot;[]&quot;,
                        &quot;alternateformat_save&quot;: &quot;[]&quot;
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    },
    {
        &quot;x&quot;: 0,
        &quot;y&quot;: 10,
        &quot;w&quot;: 24,
        &quot;h&quot;: 9,
        &quot;i&quot;: 1,
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
                        &quot;type&quot;: &quot;echart&quot;,
                        &quot;label&quot;: &quot;柱状图&quot;,
                        &quot;gridName&quot;: &quot;echart1639645958157_42712&quot;,
                        &quot;color&quot;: &quot;#fff&quot;,
                        &quot;display&quot;: true,
                        &quot;component&quot;: &quot;echarts&quot;,
                        &quot;style&quot;: {
                            &quot;height&quot;: &quot;100%&quot;
                        },
                        &quot;series_type&quot;: &quot;{\&quot;type\&quot;:\&quot;bar\&quot;}&quot;,
                        &quot;fields&quot;: [
                            {
                                &quot;key&quot;: &quot;类别名称&quot;,
                                &quot;label&quot;: &quot;类别名称&quot;,
                                &quot;selected&quot;: true,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;产品名称&quot;,
                                &quot;label&quot;: &quot;产品名称&quot;,
                                &quot;selected&quot;: false,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;产品销售额&quot;,
                                &quot;label&quot;: &quot;产品销售额&quot;,
                                &quot;selected&quot;: true,
                                &quot;type&quot;: &quot;bar&quot;
                            }
                        ],
                        &quot;datasource&quot;: &quot;数据集:本期&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: [
                            {
                                &quot;name&quot;: &quot;end_date&quot;,
                                &quot;value&quot;: &quot;原始参数:end_date&quot;
                            }
                        ],
                        &quot;data&quot;: [
                            [
                                &quot;product&quot;,
                                &quot;2015&quot;,
                                &quot;2016&quot;,
                                &quot;2017&quot;
                            ],
                            [
                                &quot;Matcha Latte&quot;,
                                43.3,
                                85.8,
                                93.7
                            ],
                            [
                                &quot;Milk Tea&quot;,
                                83.1,
                                73.4,
                                55.1
                            ],
                            [
                                &quot;Cheese Cocoa&quot;,
                                86.4,
                                65.2,
                                82.5
                            ],
                            [
                                &quot;Walnut Brownie&quot;,
                                72.4,
                                53.9,
                                39.1
                            ]
                        ],
                        &quot;content&quot;: &quot;option = {\n  backgroundColor: &#x27;#fff&#x27;,\n  legend: {selectedMode:&#x27;single&#x27;},//单选模式\n  tooltip: {},\n  dataset: {\n      // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用\n      source: valid_data\n  },\n  grid:{left :30,right:10,top:10,bottom:30},\n  // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。\n  yAxis: {},\n  // 声明一个 Y 轴，数值轴。\n  xAxis: {type: &#x27;category&#x27;,\&quot;axisLabel\&quot;: {\n    \&quot;margin\&quot;: 8,\n    \&quot;interval\&quot;:0,//解决代码,坐标轴上的刻度是否全显示\n    \&quot;textStyle\&quot;: {\n        \&quot;color\&quot;: \&quot;#676767\&quot;\n    }}},\n  // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。\n  series:function(){\n      let series_type=[]\n      valid_data[0].slice(1).forEach(ele=&gt;{\n          series_type.push({\&quot;type\&quot;:\&quot;bar\&quot;})\n      }); return series_type\n    }() \n}&quot;,
                        &quot;prop&quot;: &quot;1639645958157_18708&quot;,
                        &quot;span&quot;: 12,
                        &quot;height&quot;: &quot;100%&quot;
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    },
    {
        &quot;x&quot;: 13,
        &quot;y&quot;: 0,
        &quot;w&quot;: 11,
        &quot;h&quot;: 10,
        &quot;i&quot;: 3,
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
                        &quot;type&quot;: &quot;echart&quot;,
                        &quot;label&quot;: &quot;仪表盘&quot;,
                        &quot;gridName&quot;: &quot;echart1639646425986_65206&quot;,
                        &quot;color&quot;: &quot;#fff&quot;,
                        &quot;display&quot;: true,
                        &quot;component&quot;: &quot;echarts&quot;,
                        &quot;style&quot;: {
                            &quot;height&quot;: &quot;100%&quot;
                        },
                        &quot;series_type&quot;: &quot;{\&quot;type\&quot;: \&quot;gauge\&quot;}&quot;,
                        &quot;fields&quot;: [
                            {
                                &quot;key&quot;: &quot;类别名称&quot;,
                                &quot;label&quot;: &quot;类别名称&quot;,
                                &quot;selected&quot;: true,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;本期&quot;,
                                &quot;label&quot;: &quot;本期&quot;,
                                &quot;selected&quot;: false,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;累计&quot;,
                                &quot;label&quot;: &quot;累计&quot;,
                                &quot;selected&quot;: false,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;计划数&quot;,
                                &quot;label&quot;: &quot;计划数&quot;,
                                &quot;selected&quot;: false,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;完成比例&quot;,
                                &quot;label&quot;: &quot;完成比例&quot;,
                                &quot;selected&quot;: true,
                                &quot;type&quot;: &quot;bar&quot;
                            },
                            {
                                &quot;key&quot;: &quot;key&quot;,
                                &quot;label&quot;: &quot;key&quot;,
                                &quot;selected&quot;: false,
                                &quot;type&quot;: &quot;bar&quot;
                            }
                        ],
                        &quot;datasource&quot;: &quot;表格汇总数据:main&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: [
                            {
                                &quot;name&quot;: &quot;end_date&quot;,
                                &quot;value&quot;: &quot;原始参数:end_date&quot;
                            }
                        ],
                        &quot;data&quot;: [
                            [
                                &quot;product&quot;,
                                &quot;2015&quot;,
                                &quot;2016&quot;,
                                &quot;2017&quot;
                            ],
                            [
                                &quot;Matcha Latte&quot;,
                                43.3,
                                85.8,
                                93.7
                            ],
                            [
                                &quot;Milk Tea&quot;,
                                83.1,
                                73.4,
                                55.1
                            ],
                            [
                                &quot;Cheese Cocoa&quot;,
                                86.4,
                                65.2,
                                82.5
                            ],
                            [
                                &quot;Walnut Brownie&quot;,
                                72.4,
                                53.9,
                                39.1
                            ]
                        ],
                        &quot;content&quot;: &quot;option = \n          option = {\n            backgroundColor: &#x27;#fff&#x27;,\n            legend: {selectedMode:&#x27;single&#x27;},//单选模式\n            tooltip: {},\n            dataset: {\n                // 提供一份数据。valid_data为自动生成，如果全自定义，就不要使用\n                source: valid_data\n            },\n            grid:{left :0,right:0,top:0,bottom:0},\n            // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。\n            yAxis: {},\n            // 声明一个 Y 轴，数值轴。\n            xAxis: {type: &#x27;category&#x27;,\&quot;axisLabel\&quot;: {\n              \&quot;margin\&quot;: 8,\n              \&quot;interval\&quot;:0,//解决代码,坐标轴上的刻度是否全显示\n              \&quot;textStyle\&quot;: {\n                  \&quot;color\&quot;: \&quot;#676767\&quot;\n              }}},\n            // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。\n            series:function(){\n                let series_type=[]\n                valid_data.slice(1).forEach(ele=&gt;{\n                    series_type.push({\&quot;type\&quot;: \&quot;gauge\&quot; ,\n                                  data: [{\n                      value: ele[1],\n                      name: ele[0]\n                  }]   \n                                })\n                }); return series_type\n              }() \n          }          \n          &quot;,
                        &quot;prop&quot;: &quot;1639646425986_19295&quot;,
                        &quot;span&quot;: 12,
                        &quot;height&quot;: &quot;100%&quot;
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    }
]</layout>
<includeFiles />
<datasources>
<dataSource name="dfsd" oledb="0">Dsn=testDb</dataSource>
</datasources>
<macros />
<pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="True" header="" footer="" />
<notebook />
<template />
<conn_list>testsqlite</conn_list>
<range_level>
<level>1</level>
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