<report version="1" needCatchQuShuException="False"><dataSets><dataSet name="ds" type="sql" dataSource="testsqlite" fields="[]">select 
$+ param.field.ToString().Replace(&quot;&#x27;&quot;,&quot;&quot;) $
 from 产品</dataSet></dataSets><params><param name="field" data_type="string" width="20" lines="1" prompt="挑选字段" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="True" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="noneQuery" dataSetName_default="" valueField_default="" default_value="产品ID,产品名称,供应商ID,类别ID,单位数量,单价,库存量,订购量,再订购量,中止"><tagValue tag="产品ID" value="产品ID" /><tagValue tag="产品名称" value="产品名称" /><tagValue tag="供应商ID" value="供应商ID" /><tagValue tag="类别ID" value="类别ID" /><tagValue tag="单位数量" value="单位数量" /><tagValue tag="单价" value="单价" /><tagValue tag="库存量" value="库存量" /><tagValue tag="订购量" value="订购量" /><tagValue tag="再订购量" value="再订购量" /><tagValue tag="中止" value="中止" /></param></params><AllGrids><grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" is_large="0" fix_rows="-1" fix_cols="-1" title="main" CanShow_expr=""><columns><column name="a" width="30" fixed="False" /><column name="b" width="75" fixed="False" /><column name="c" width="75" fixed="False" /><column name="d" width="75" fixed="False" /><column name="e" width="75" fixed="False" /></columns><rows><row name="1" height="31" fixed="False" /><row name="2" height="25" fixed="False" /><row name="3" height="25" fixed="False" /><row name="4" height="25" fixed="False" /><row name="5" height="25" fixed="False" /></rows><cells><cell displayValueExpr="=ds.col_name(@value)" extendDirection="column" name="B1" valueExpr="=fromto(1,ds.col_count())" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" text-align="right" /><cell displayValueExpr="" extendDirection="row" name="A2" valueExpr="=ds.select(ds.rowno)" rowsOfPage="0" leftHead="" calcLevel="0" BORDER-RIGHT="" BORDER-LEFT="" BORDER-TOP="" BORDER-BOTTOM="" /><cell displayValueExpr="=@value" name="B2" valueExpr="=ds[b1]" rowsOfPage="0" leftHead="" calcLevel="1" BORDER-LEFT="" BORDER-RIGHT="" BORDER-TOP="" BORDER-BOTTOM="" text-align="right" /></cells><no_use_parent_css>0</no_use_parent_css></grid></AllGrids><reportName>test:/固定sql动态选择列.cr</reportName><layout>[
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
                        &quot;prop&quot;: &quot;1638167220571_74391&quot;,
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
]</layout><includeFiles /><datasources><dataSource name="ds" oledb="0">Dsn=testDb</dataSource></datasources><macros /><pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" /><notebook /><template /><conn_list>test</conn_list><conn_list>testsqlserver</conn_list><range_level><level>0</level><gridName>main</gridName><s_row>0</s_row><e_row>1</e_row><s_col>1</s_col><e_col>1</e_col></range_level><range_level><level>1</level><gridName>main</gridName><s_row>1</s_row><e_row>1</e_row><s_col>0</s_col><e_col>1</e_col></range_level><defaultsetting><font>微软雅黑</font><font_size>11</font_size><color>black</color><border_style>gray 1px dotted</border_style></defaultsetting><functions /><script /><canExecuteExpr /><cache time="10" /></report>