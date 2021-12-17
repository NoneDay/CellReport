<report version="2" needCatchQuShuException="False"><dataSets><dataSet name="ds" type="sql" dataSource="testsqlite" fields="[&quot;雇员ID&quot;,&quot;姓氏&quot;,&quot;名字&quot;,&quot;职务&quot;,&quot;尊称&quot;,&quot;出生日期&quot;,&quot;家庭电话&quot;]">SELECT  雇员.雇员ID, 雇员.姓氏, 雇员.名字, 雇员.职务, 雇员.尊称, 
       雇员.出生日期, 雇员.家庭电话 
FROM 雇员 
 where  1=1
$ if (isEmpty(param.雇员ID)==false) { $
and 雇员ID=&#x27;$雇员ID$&#x27;
$}$</dataSet></dataSets><params><param name="雇员ID" data_type="string" width="20" lines="1" prompt="雇员ID" hide="False" allowNull="False" inner="False" allowSpace="False" allowMutil="False" canUsedValueFrom="" dataSetName_kyz="" valueField_kyz="" tagField_kyz="" defaultValueFrom="" dataSetName_default="" valueField_default="" default_value="" /></params><AllGrids><grid append="cellSpacing=0 cellPadding=0  style=&quot;TABLE-LAYOUT: fixed; MARGIN-TOP: 0px; FONT-SIZE: 11px; Z-INDEX: -5; MARGIN-LEFT: 0px;   BORDER-COLLAPSE: collapse;&quot;" optimize="True" name="main" fix_rows="-1" fix_cols="-1"><columns><column name="a" width="75" append="" fixed="False" /><column name="b" width="75" append="" fixed="False" /><column name="c" width="75" append="" fixed="False" /><column name="d" width="75" append="" fixed="False" /><column name="e" width="75" append="" fixed="False" /><column name="f" width="75" append="" fixed="False" /><column name="g" width="75" append="" fixed="False" /><column name="h" width="75" append="" fixed="False" /><column name="i" width="75" append="" fixed="False" /><column name="j" width="75" append="" fixed="False" /></columns><rows><row name="1" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="2" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="3" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="4" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="5" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="6" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="7" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="8" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="9" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /><row name="10" height="25" append="" fixed="False" pageBreak="False" lineType="数据区" /></rows><cells><cell name="a1" valueExpr="雇员id" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b1" valueExpr="姓氏" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="c1" valueExpr="名字" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="d1" valueExpr="职务" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="e1" valueExpr="尊称" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="f1" valueExpr="出生日期" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="g1" valueExpr="家庭电话" rowsOfPage="0" leftHead="" calcLevel="0" /><cell extendDirection="row" name="a2" valueExpr="=ds.select(ds.雇员id)" rowsOfPage="0" leftHead="" calcLevel="0" /><cell name="b2" valueExpr="=ds.姓氏" rowsOfPage="0" leftHead="" calcLevel="1" /><cell name="c2" valueExpr="=ds.名字" rowsOfPage="0" leftHead="" calcLevel="1" /><cell name="d2" valueExpr="=ds.职务" rowsOfPage="0" leftHead="" calcLevel="1" /><cell name="e2" valueExpr="=ds.尊称" rowsOfPage="0" leftHead="" calcLevel="1" /><cell name="f2" valueExpr="=ds.出生日期" rowsOfPage="0" leftHead="" calcLevel="1" /><cell name="g2" valueExpr="=ds.家庭电话" rowsOfPage="0" leftHead="" calcLevel="1" /></cells></grid></AllGrids><reportName>test:/雇员查询.cr</reportName><layout>[
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
                        &quot;prop&quot;: &quot;1638162055731_39515&quot;,
                        &quot;fresh_ds&quot;: [],
                        &quot;fresh_params&quot;: []
                    }
                ]
            }
        },
        &quot;moved&quot;: false
    }
]</layout><includeFiles /><datasources><dataSource name="asd" oledb="0">Dsn=testDb</dataSource></datasources><macros /><pageProperty Orientation="True" paperSize="A4" paperSize_rawKind="9" pageHeight="0" pageWidth="0" marginLeft="19" marginRight="19" marginTop="19" marginBottom="19" Landscape="True" header="" footer="" /><notebook /><template /><conn_list>testsqlite</conn_list><range_level><level>1</level><gridName>main</gridName><s_row>1</s_row><e_row>1</e_row><s_col>0</s_col><e_col>6</e_col></range_level><defaultsetting><font>微软雅黑</font><font_size>11</font_size><color>black</color><border_style>gray 1px dotted</border_style></defaultsetting><functions /><script /><canExecuteExpr /><cache time="10" /></report>