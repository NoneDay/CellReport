using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CellReport.core.expr;
using CellReport.running;
using Microsoft.AspNetCore.Http;
using reportWeb.Pages;

namespace CellReport
{
    public class ReportDefineForWeb:IDisposable
    {
        public void Dispose()
        {
            if (this.reportDefine != null)
                this.reportDefine.Dispose();
            if (this.Report != null)
                this.Report.Dispose();
        }

        //报表路径
        public String ReportDefinePath{get; set;}
        //报表定义
        private ReportDefine reportDefine;
        internal MyLogger logger;
        public ReportDefine CurrentReportDefine
        {
            get
            {
                ensureReportDefine();
                return reportDefine;
            }
        }
        private SortedDictionary<String, Object> paramSortedDictionary = new SortedDictionary<String, Object>();
        //增加参数
        public void addParam(String param, Object obj)
        {
            ensureReportDefine();
            if (param.Equals("reportName", StringComparison.OrdinalIgnoreCase) && String.IsNullOrEmpty(obj?.ToString()))
                throw new Exception("参数reportName 不能为空");
            if (paramSortedDictionary.ContainsKey(param))
                paramSortedDictionary.Remove(param);
            paramSortedDictionary.Add(param, obj);
            reportDefine.getEnv().addParam(param, obj);
        }
        public String getParam(string param)
        {
            if (paramSortedDictionary.ContainsKey(param))
                return paramSortedDictionary[param].ToString();
            return null;
        }
        public CellReport.running.Report Report { get; set; }
        public HttpRequest httpRequest { get; internal set; }

        internal ReportDefine ensureReportDefine()
        {
            if (reportDefine != null)
                return reportDefine;

            String gobal_reportDefinePath = ReportDefinePath;
            String reportName = getQueryValue("reportName");
             if (reportName != null)
                reportName = reportName.Replace("../", "");

            if (reportDefine == null && reportName != null && reportName != ""
                && gobal_reportDefinePath != null && gobal_reportDefinePath != "")
            {
                if (!gobal_reportDefinePath.EndsWith(Path.DirectorySeparatorChar))
                        gobal_reportDefinePath = gobal_reportDefinePath + Path.DirectorySeparatorChar;
                {
                    //var load_task=;
                    //load_task.ConfigureAwait(continueOnCapturedContext:false);
                    reportDefine = XmlReport.loadReport(gobal_reportDefinePath, reportName).Result;
                }
                    reportDefine.getEnv().logger = logger;
                //reportDefinePath = gobal_reportDefinePath + reportName;
            }
            return reportDefine;
        }
        public String getParamSortedString()
        {
            var ret_sb = new System.Text.StringBuilder(1024);
            foreach (KeyValuePair<String, Object> one in paramSortedDictionary)
            {
                if (reportDefine.getEnv().getParam(one.Key) == null && "sort"!= one.Key)
                    continue;
                if (ret_sb.Length > 0)
                    ret_sb.Append("&");
                ret_sb.Append(one.Key).Append("=").Append(one.Value == null ? "" : one.Value.ToString());
            }
            return ret_sb.ToString();
        }
        public Func<string,string> resetDefaultParam = null;
        public Func<string, string> lastSetParam = null;
        public Dictionary<String, Object> fixParamValueDict = new Dictionary<string, object>();
        public Dictionary<String, Object> fixDefaultParamValueDict = new Dictionary<string, object>();
        private String getFormValue(string name)
        {
            if (!httpRequest.HasFormContentType)
                return null;
            if (httpRequest.Form.TryGetValue(name, out var ret))
                return ret.ToString();
            else
                return null;
        }
        private String getQueryValue(string name)
        {
            if (httpRequest.Query.TryGetValue(name, out var ret))
                return ret.ToString();
            else
                return null;
        }
        public void putRequestParamForForm()
        {
            ensureReportDefine();
            var exprfaced=reportDefine.getEnv().getExprFaced();
            paramSortedDictionary.Clear();
            foreach (var one in new string[] { "__updated", "__inserted", "__deleted", "_d" })
            {
                if (getFormValue(one)!=null)
                    exprfaced.addVariable(one, System.Net.WebUtility.UrlDecode(getFormValue(one)));
            }
            exprfaced.addNewScopeForScript();
            ParamDefineDataSet pds = reportDefine.getEnv().getParamDefineDataSet();
            
            foreach (var row in pds.Rows)
            {
                String param_name = row.getData("name").ToString();
                if (row.getData("inner") != null && row.getData("inner").ToString().ToLower().Equals("true"))
                    continue;
                String default_value = CellReport.dataSet.DotNetDataSet.convertValue(pds.getDefaultValueForRow(row));
                if (fixDefaultParamValueDict.ContainsKey(param_name))
                {
                    if (fixDefaultParamValueDict[param_name] != null)
                        default_value = fixDefaultParamValueDict[param_name].ToString();
                    else
                        default_value = "";
                    this.addParam(param_name, default_value);
                }
                if (resetDefaultParam != null)
                {
                    var t_val = resetDefaultParam?.Invoke(param_name);
                    if (t_val != null)
                        default_value = t_val;
                }
                exprfaced.addVariable("param_obj", row);
                if (exprfaced.getVariableDefine("resetDefaultParam") != null)
                {
                    var t_val= exprfaced.calculate($"=resetDefaultParam('{param_name}',param_obj)", reportDefine.getEnv().getDataSetResultMap())?.ToString();
                    if(t_val!=null)
                        default_value = t_val;
                }
                if(param_name!="reportName")
                    this.addParam(param_name, default_value);
                if (getQueryValue(param_name)!= null)
                    this.addParam(param_name, getQueryValue(param_name));
                if (getFormValue(param_name) != null)
                    this.addParam(param_name, getFormValue(param_name));

                if (fixParamValueDict.ContainsKey(param_name))
                {
                    row.setData("hide", "True");
                    if (fixParamValueDict[param_name] != null)
                        default_value = fixParamValueDict[param_name].ToString();
                    else
                        default_value = "";
                    this.addParam(param_name, default_value);
                }
                if (lastSetParam != null)
                {
                    default_value = paramSortedDictionary[param_name].ToString();
                    default_value=lastSetParam(param_name);
                    this.addParam(param_name, default_value);
                }
                
                if (exprfaced.getVariableDefine("lastSetParam") != null)
                {
                    var t_val = exprfaced.calculate($"=lastSetParam('{param_name}',param_obj)", reportDefine.getEnv().getDataSetResultMap())?.ToString();
                    if (t_val != null)
                        this.addParam(param_name, t_val);
                }
                //if (exprfaced.getVariableDefine("lastSetParam") != null)
                //{
                //    default_value = exprfaced.calculate($"=lastSetParam('{param_name}','{default_value}')")?.ToString();
                //    this.addParam(param_name, default_value);
                //}
            }
            exprfaced.popCurrentScope();
        }
        public Exception currentException;

        public bool alreadyCalc = false;
        public async Task calcReport(CellReport.exporter.MyTextWrite tw)
        {
            if (alreadyCalc)
                return ;
            alreadyCalc = true;
            logger.Debug("===============================");
            ensureReportDefine();
            if (reportDefine == null)
                return;
            if (Report == null)
            {
                
                Engine engine = new Engine(reportDefine);
                //if (this.getParam("_d") != null)
                //{
                //    CellReport.dataSet.DataSet ds = reportDefine.getEnv().getDataSet(this.getParam("_d"));
                //    await ds.loadDataAsync();
                //    this.CurrentPage.Response.Write(ds.getJson());
                //    Report = engine.getResult();
                //    return;
                //}
                await engine.calcReportAsync();
                Report = engine.getResult();
            }
        }
    }
}