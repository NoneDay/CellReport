<report version="2" needCatchQuShuException="False"><dataSets><dataSet name="数据集1" type="sql" dataSource="testsqlite" fields="[&quot;订单ID&quot;,&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;单价&quot;,&quot;数量&quot;,&quot;折扣&quot;,&quot;总价&quot;]">SELECT [订单明细].[订单ID], [订单明细].[产品ID], [产品].[产品名称], [订单明细].[单价], [订单明细].[数量], [订单明细].[折扣], ([订单明细].[单价]*[数量]*(1-[折扣])/100)*100 AS 总价
FROM 产品 INNER JOIN 订单明细 ON [产品].[产品ID]=[订单明细].[产品ID]
where 1=1
$if(false==isEmpty(param.dindan)){$
 and [订单明细].[订单ID]=&#x27;$dindan$&#x27;
$}$

$if(false==isEmpty(param.chanping)){$
and [订单明细].[产品ID]=&#x27;$chanping$&#x27;
$}$
ORDER BY [订单明细].[订单ID]</dataSet></dataSets><params><param name="dindan" data_type="string" prompt="订单id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" /><param name="chanping" data_type="string" prompt="产品id" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="0" dataSetName_default="" valueField_default="" default_value="" /></params><AllGrids><grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr=""><columns><column name="a" width="75" fixed="False" /><column name="b" width="75" fixed="False" /><column name="c" width="75" fixed="False" /><column name="d" width="75" fixed="False" /><column name="e" width="75" fixed="False" /><column name="f" width="75" fixed="False" /><column name="g" width="75" fixed="False" /><column name="h" width="75" fixed="False" /><column name="i" width="75" fixed="False" /></columns><rows><row name="1" height="25" fixed="False" /><row name="2" height="25" fixed="False" /><row name="3" height="25" fixed="False" /><row name="4" height="25" fixed="False" /></rows><cells><cell displayValueExpr="=@value" name="A1" valueExpr="订单id" rowsOfPage="0" leftHead="`0" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="B1" valueExpr="产品id" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="C1" valueExpr="产品名称" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="D1" valueExpr="单价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="E1" valueExpr="数量" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="F1" valueExpr="折扣" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="G1" valueExpr="总价" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" extendDirection="row" name="A2" valueExpr="=数据集1.group(数据集1.订单id)" rowsOfPage="25" leftHead="" calcLevel="0" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="B2" valueExpr="=数据集1.产品id" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="C2" valueExpr="=数据集1.产品名称" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="D2" valueExpr="=数据集1.单价" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="E2" valueExpr="=数据集1.数量" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="F2" valueExpr="=数据集1.折扣" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=formatNumber(@value)" name="G2" valueExpr="=数据集1.总价" rowsOfPage="0" leftHead="" calcLevel="1" text-align="right" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" /></cells></grid></AllGrids><reportName>test:/4.cr</reportName><layout>[
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
                        &quot;prop&quot;: &quot;1638165806230_44736&quot;,
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
]</layout><includeFiles /><datasources><dataSource name="dfsd">Dsn=testDb</dataSource></datasources><macros /><pageProperty Orientation="True" /><notebook /><template /><conn_list>testsqlite</conn_list><range_level><level>1</level><gridName>main</gridName><s_row>1</s_row><e_row>1</e_row><s_col>0</s_col><e_col>6</e_col></range_level><defaultsetting><font>微软雅黑</font><font_size>11</font_size><color>black</color><border_style>gray 1px dotted</border_style></defaultsetting><functions /><script /><canExecuteExpr /><cache time="10" /></report>