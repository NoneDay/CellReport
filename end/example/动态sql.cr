<report version="2" needCatchQuShuException="False"><dataSets><dataSet name="ds" type="sql" dataSource="testsqlite" fields="[&quot;产品ID&quot;,&quot;产品名称&quot;,&quot;供应商ID&quot;,&quot;类别ID&quot;,&quot;单位数量&quot;,&quot;单价&quot;,&quot;库存量&quot;,&quot;订购量&quot;,&quot;再订购量&quot;,&quot;中止&quot;]">$sql$</dataSet></dataSets><params><param name="sql" data_type="string" width="40" lines="6" prompt="在这里输入sql语句，点查询即可" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="noneQuery" dataSetName_default="" valueField_default="" default_value="select * from 产品" /></params><AllGrids><grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr=""><columns><column name="a" width="16" fixed="False" /><column name="b" width="75" fixed="False" /><column name="c" width="75" fixed="False" /><column name="d" width="75" fixed="False" /><column name="e" width="75" fixed="False" /></columns><rows><row name="1" height="32" fixed="False" /><row name="2" height="25" fixed="False" /><row name="3" height="25" fixed="False" /><row name="4" height="25" fixed="False" /><row name="5" height="25" fixed="False" /><row name="6" height="25" fixed="False" /></rows><cells><cell displayValueExpr="=@value" extendDirection="column" name="B1" valueExpr="数据库中的可用表：
产品 订单 订单明细 供应商 雇员 客户 类别 运货商
每年计划  test_联系表 test" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" text-align="left" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=ds.col_name(B2)" extendDirection="column" name="B2" valueExpr="=fromto(1,ds.col_count())" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" text-align="right" /><cell displayValueExpr="" extendDirection="row" name="A3" valueExpr="=ds.select(ds.rowno)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="B3" valueExpr="=ds[B2]" rowsOfPage="0" leftHead="" calcLevel="2" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" text-align="right" /></cells></grid></AllGrids><reportName>test:/动态sql.cr</reportName><layout>[
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
                        &quot;prop&quot;: &quot;1638176536810_86426&quot;,
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
]</layout><includeFiles /><datasources><dataSource name="ds" oledb="0">Dsn=testDb</dataSource></datasources><macros /><pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" /><notebook /><template /><conn_list>test</conn_list><conn_list>testsqlserver</conn_list><range_level><level>0</level><gridName>main</gridName><s_row>0</s_row><e_row>2</e_row><s_col>1</s_col><e_col>1</e_col></range_level><range_level><level>1</level><gridName>main</gridName><s_row>1</s_row><e_row>2</e_row><s_col>1</s_col><e_col>1</e_col></range_level><range_level><level>2</level><gridName>main</gridName><s_row>2</s_row><e_row>2</e_row><s_col>0</s_col><e_col>1</e_col></range_level><defaultsetting><font>微软雅黑</font><font_size>11</font_size><color>black</color><border_style>gray 1px dotted</border_style></defaultsetting><functions /><script /><canExecuteExpr /><cache time="10" /></report>