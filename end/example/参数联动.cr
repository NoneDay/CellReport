<report version="2" needCatchQuShuException="False"><dataSets><dataSet name="产品" type="sql" dataSource="testsqlite" fields="[&quot;产品ID&quot;,&quot;产品名称&quot;]">SELECT 产品.产品ID, 产品.产品名称
FROM 产品
where 类别ID=&#x27;$leibie$&#x27;</dataSet><dataSet name="类别" type="sql" dataSource="testsqlite" fields="[&quot;类别ID&quot;,&quot;类别名称&quot;]">SELECT 类别.类别ID, 类别.类别名称
FROM 类别;</dataSet></dataSets><params><param name="leibie" data_type="string" width="20" lines="1" prompt="leibie" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="Query" dataSetName_kyz="类别" valueField_kyz="类别ID" tagField_kyz="类别名称" defaultValueFrom="Query" dataSetName_default="" valueField_default="" default_value="1" /><param name="chanpin" data_type="string" width="20" lines="1" prompt="产品" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="Query" dataSetName_kyz="产品" valueField_kyz="产品ID" tagField_kyz="产品名称" defaultValueFrom="Query" dataSetName_default="" valueField_default="" default_value="1" /></params><AllGrids><grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1"><columns><column name="a" width="75" append="" fixed="False" /><column name="b" width="75" append="" fixed="False" /><column name="c" width="75" append="" fixed="False" /><column name="d" width="75" append="" fixed="False" /><column name="e" width="75" append="" fixed="False" /><column name="f" width="75" append="" fixed="False" /><column name="g" width="75" append="" fixed="False" /><column name="h" width="75" append="" fixed="False" /><column name="i" width="75" append="" fixed="False" /><column name="j" width="75" append="" fixed="False" /></columns><rows><row name="1" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="2" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="3" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="4" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="5" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="6" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="7" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="8" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="9" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="10" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="11" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="12" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /></rows><cells><cell name="a1" valueExpr="chanpin" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b1" valueExpr="leibie" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="a2" valueExpr="=param.chanpin" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b2" valueExpr="=param.leibie" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="a3" valueExpr="产品id" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b3" valueExpr="产品名称" rowsOfPage="0" leftHead="" calcLevel="0" /><cell extendDirection="row" name="a4" valueExpr="=产品.select(产品.产品id)" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b4" valueExpr="=产品.产品名称" rowsOfPage="0" leftHead="" calcLevel="1" /></cells></grid></AllGrids><reportName>test:/参数联动.cr</reportName><layout>[
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
                        &quot;prop&quot;: &quot;1638253927947_38861&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: []
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    }
]</layout><includeFiles /><datasources><dataSource name="adsas" oledb="0">Dsn=testDb</dataSource></datasources><macros /><pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="1169" pageWidth="827" marginLeft="1" marginRight="1" marginTop="1" marginBottom="1" Landscape="False" header="" footer="" /><notebook /><template /><conn_list>testsqlite</conn_list><range_level><level>1</level><gridName>main</gridName><s_row>3</s_row><e_row>3</e_row><s_col>0</s_col><e_col>1</e_col></range_level><defaultsetting><font>微软雅黑</font><font_size>11</font_size><color>black</color><border_style>gray 1px dotted</border_style></defaultsetting><functions /><script /><canExecuteExpr /><cache time="10" /><bi_dataSets /><click_refresh_grids /><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><h3>Below is a rendering of the page up to the first error.</h3><div style="font-family:monospace;font-size:12px">error on line 90 at column 20864: Char 0x0 out of allowed range</div></parsererror></report>