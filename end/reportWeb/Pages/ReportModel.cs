using System;
using System.Security.Cryptography;
using System.Text;
using CellReport;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using Microsoft.Extensions.Primitives;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;
using CellReport.exporter;
using Microsoft.AspNetCore.Hosting;
using System.Text.Json;
using CellReport.core;
using Microsoft.AspNetCore.Authorization;
using CellReport.core.expr;

namespace reportWeb.Pages
{
    public class MyLogger : CellReport.running.Logger
    {
        ILogger _logger;
        public MyLogger(ILogger _logger) : base(null)
        {
            this._logger = _logger;
        }

        public override void Info(Object info)
        {

            _logger.LogInformation(info?.ToString());

        }
        public override void Warn(Object info)
        {
            _logger.LogWarning(info?.ToString());
        }
        public override void Debug(Object info)
        {
            _logger.LogDebug(info?.ToString());
        }
        public override void Error(Object info)
        {
            _logger.LogError(info?.ToString());
        }
    }

    [IgnoreAntiforgeryToken(Order = 2000)]
    [AllowAnonymous]
    public class ReportModel : PageModel, IDisposable
    {
        protected string ReportDefinePath = @"";
        private readonly MyLogger logger;
        protected Rpt_group rpt_group;
        private IConfiguration configuration;
        private readonly IWebHostEnvironment WebHostEnvironment;
        public ReportModel(IConfiguration configuration, ILogger<ReportModel> logger, ScopedObj scopedObj)
        {
            this.configuration = configuration;
            this.rpt_group = scopedObj.rpt_group;
            this.WebHostEnvironment = scopedObj.WebHostEnvironment;
            ReportDefinePath = this.rpt_group.report_path;
            this.logger = new MyLogger(logger);
        }
        public void OnGet()
        {
        }
        public void OnPost()
        {

        }
        private String getFormValue(string name)
        {
            if (!HttpContext.Request.HasFormContentType)
                return null;
            if (HttpContext.Request.Form.TryGetValue(name, out var ret))
                return ret.ToString();
            else
                return null;
        }
        public string FromAppendString = "";
        private String mc_report_id;
        private String tmpFileName;
        public string tips = "";
        protected Dictionary<String, object> page_var_dict = new();
        protected virtual bool pre_page_load()
        {
            return true;
        }
        public CellReport.BaseCache myCache { get; protected set; } = null;

        protected CellReport.running.Env report_env;
        private static string g_report_content = null;
        private string needType = "";
        public async Task Page_Load()
        {
            if (rpt_group == null)
                throw new Exception("没有定义rpt_group");
            if (rpt_group.default_page.Split(",").Contains(Request.Path.Value.Substring(1)) == false)
                throw new Exception("不被允许的调用：" + Request.Path.Value);
            string UserAgent = Request.Headers["User-Agent"];
            if (String.IsNullOrEmpty(UserAgent))
                UserAgent = "";
            Regex regex = new Regex("(iPhone|iPod|Android|ios|SymbianOS)", RegexOptions.IgnoreCase);
            var isPhone = regex.IsMatch(UserAgent);
            needType = Request.Headers["needType"];
            if (Request.HasFormContentType && Request.Form.Keys.Contains("__call_func"))
                needType = "json";
            if (!String.IsNullOrEmpty(Request.Query["_needType_"].ToString()))
                needType = Request.Query["_needType_"].ToString();
            string str_call_func = Request.Query["__call_func"].ToString();
            if (needType == "json" || !String.IsNullOrEmpty(str_call_func))
            {
                Response.ContentType = "application/json";
            }
            else if (needType == "fast_excel")
            {
                //Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            else
            {
                string Referer = Request.Headers["Referer"];
                string Authorization = Request.Headers["Authorization"];
                //if(g_report_content==null)
                g_report_content = await CellReport.running.XmlReport.getIndexHtml(this.WebHostEnvironment.WebRootPath, Referer, Authorization);

                var report_content = g_report_content.Replace("<head>", $"<head><script>var __real_referer='{Referer}';__Authorization='{Authorization}';document.title='{rpt_group.name ?? "CellReport报表"}'</script>");
                await Response.WriteAsync(report_content);
                return;
            }
            try
            {
                reportDefineForWeb = new ReportDefineForWeb()
                {
                    ReportDefinePath = this.ReportDefinePath,
                    httpRequest = HttpContext.Request,
                    logger = logger,
                    rpt_group_name = rpt_group.name,
                };
                this.HttpContext.Response.RegisterForDispose(reportDefineForWeb);
                //if(Request.Path != "/" + rpt_group.default_page)
                //{
                //    throw new Exception("非法路径！请使用run模式。当前："+ Request.Path);
                //}

                report_env = reportDefineForWeb.CurrentReportDefine.getEnv();
                if (!Request.Query.TryGetValue("reportName", out var report_name))
                    throw new Exception("没有设置reportName参数");
                Dictionary<string, string> user_dict = new Dictionary<string, string>();
                foreach (var one in HttpContext?.User?.Claims)
                {
                    user_dict.TryAdd(one.Type, one.Value);
                }
                foreach (var one in this.rpt_group.db_connection_list)
                {
                    report_env.addDataSource(one.name, one.conn_str, one.db_type, "0", one.sql_prefix, one.sql_suffix);
                }

                var exprFaced = report_env.getExprFaced();
                exprFaced.addVariable("isPhone", isPhone);
                //int grid_cnt=reportDefineForWeb.CurrentReportDefine.getGridList().FindAll(x=>x.XmlElementName=="grid").Count;
                //exprFaced.addVariableForRoot("use_luckysheet", 1);
                //exprFaced.addVariableForRoot("__grid_dict_", reportDefineForWeb.CurrentReportDefine.getGridList().ToDictionary(x => x.Name));
                exprFaced.getVariableDefine("_zb_url_").value = configuration["zb_url"];
                exprFaced.getVariableDefine("_zb_user_").value = rpt_group.zb_user;
                exprFaced.getVariableDefine("_zb_password_").value = rpt_group.zb_password;
                exprFaced.getVariableDefine("_rpt_group_").value = rpt_group;
                exprFaced.getVariableDefine("__page__").value = HttpContext.Request;
                exprFaced.addVariableForRoot("_page_size_", getFormValue("_page_size_"));
                exprFaced.addVariableForRoot("_cur_page_num_", getFormValue("_cur_page_num_"));
                //exprFaced.getVariableDefine("_user_").value = user_dict; 
                exprFaced.getVariableDefine("_user_").value = reportWeb.Controllers.UserController.ValidateJwtToken(HttpContext, HttpContext.Request.Cookies["access_token"]);
                report_env.CheckParamValid();
                var g_var_dict = exprFaced.getVariableDefine("_g_var_").value as Dictionary<String, object>;
                foreach (var kv in page_var_dict)
                {
                    g_var_dict[kv.Key] = kv.Value;
                }
                //exprFaced.addVariable("_cache_", RedisHelper.Instance);page_var_dict
                parse_fresh_ds();
                if (report_name != "/" && exprFaced.hasVariable("start_calc_report"))
                {
                    exprFaced.calculate("=start_calc_report()", report_env.getDataSetResultMap());
                }
                var start_time = DateTime.Now;
                reportDefineForWeb.putRequestParamForForm();

                CR_Object before_exec_result = null;
                //Console.WriteLine("before_exec:" + (DateTime.Now - start_time) / 10000 + "秒");
                if (false == pre_page_load())
                    return;
                if (report_name != "/" && exprFaced.hasVariable("before_exec"))
                {
                    before_exec_result = exprFaced.calculate("=before_exec()", report_env.getDataSetResultMap()) as CR_Object;
                    if (before_exec_result != null)
                    {
                        exprFaced.addVariable("before_exec_result", before_exec_result);
                        if (before_exec_result.TryGetValue("continue", out var my_continue))
                        {
                            if (my_continue is Boolean && (Boolean)my_continue == false)
                                throw new Exception("不能继续执行，原因：" + before_exec_result["tips"]?.ToString());
                        }
                        if (before_exec_result.TryGetValue("cache_id", out Object cache_id) && cache_id != null)
                        {
                            myCache = new CellReport.Redis_Cache(cache_id.ToString(), report_env.logger);//*/myCache = null;
                            myCache.getFreshFlag = () => before_exec_result["fresh_flag"].ToString();
                        }
                        this.tips = before_exec_result["tips"]?.ToString()?.Replace("\\n", "\n");
                    }
                }

                //Console.WriteLine("pre_page_load:" + (DateTime.Now - start_time) / 10000 + "秒");
                mc_report_id = reportDefineForWeb.getParamSortedString();
                if (needType == "fast_excel")
                {
                    await calc_output_excel();
                    return;
                }
                if (Request.Query["reportName"] == "")
                {

                }
                else
                {
                    await output();
                }
                //report_env.logger.Info(mc_report_id);
                // Console.WriteLine("output:" + (DateTime.Now - start_time) / 10000 + "秒");
                Response.Body.Flush();

            }
            catch (System.Exception ex)
            {
                string message = output_expection(ex, logger, report_env);
                // 设置响应头
                await Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    errcode = 1,
                    message = message
                }, CellReport.running.Logger.getJsonOption()));
                //throw ex;
            }
            finally
            {
                var exprFaced = reportDefineForWeb.CurrentReportDefine.getEnv().getExprFaced();
                if (exprFaced.hasVariable("end_calc_report"))
                {
                    exprFaced.calculate("=end_calc_report()", report_env.getDataSetResultMap());
                }
                reportDefineForWeb.Dispose();
                //GC.Collect(2, GCCollectionMode.Forced);
            }
        }

        internal static string output_expection(Exception e, CellReport.running.Logger logger, CellReport.running.Env report_env, HttpRequest Request = null)
        {
            StringBuilder sb = new("-----------------------------------\n");

            String curCellName = "`0";


            if (report_env != null)
            {
                sb.AppendLine("当前报表："
                    + report_env.getExprFaced().calculate("=_rpt_group_.Id").ToString()
                    + ":"
                    + report_env.getAppPath() + "/" + report_env.ReportName);
                if (report_env.Curr_calc_cell != null)
                    curCellName = report_env.Curr_calc_cell.getName();
                if (e is ParamHasCircularReferenceException)
                {
                    sb.AppendLine(e.Message);
                    return sb.ToString();
                }
                sb.Append("参数：");
                foreach (var kv in report_env.getParamMap())
                {
                    if (kv.Key == "reportName")
                        continue;
                    sb.Append("\t" + kv.Key + "='" + kv.Value + "'");
                }
                if (Request != null)
                {
                    sb.Append("\nQuery：");
                    foreach (var kv in Request.Query)
                    {
                        if (kv.Key == "reportName")
                            continue;
                        sb.Append("\t" + kv.Key + "='" + kv.Value + "'");
                    }
                    sb.Append("\nForm：");
                    if (Request.HasFormContentType)
                        foreach (var kv in Request.Form)
                        {
                            if (kv.Key == "reportName")
                                continue;
                            sb.Append("\t" + kv.Key + "='" + kv.Value + "'");
                        }
                }
                //sb.AppendLine().AppendLine("疑似出错单元格：" + curCellName);
            }
            sb.AppendLine();
            System.Exception inner_e = e;
            System.Exception last_e = e;
            int cnt = 1;
            while (inner_e != null)
            {
                last_e = inner_e;
                sb.Append(string.Join("\t", new string[cnt])).Append(inner_e.Message).AppendLine("");
                inner_e = inner_e.InnerException;
                cnt++;
            }
            if (last_e is NullReferenceException)
            {
                sb.Append("\nNullReferenceException:" + last_e.StackTrace.ToString());
            }
            logger.Error(sb.ToString());
            return sb.ToString();
        }
        public virtual void output_last_exception(System.Exception last_e, CellReport.running.Logger logger) { }

        private void parse_fresh_ds()
        {
            if (!Request.HasFormContentType)
                return;
            if (!Request.Form.TryGetValue("_fresh_ds", out var _fresh_ds))
                return;
            //ds.getSqlParamSet()   
            List<String> calcDsNames = null;
            List<String> calcGridNames = null;

            if (!String.IsNullOrEmpty(_fresh_ds))
            {
                var exprFaced = report_env.getExprFaced();
                exprFaced.addVariable("_fresh_ds", _fresh_ds.ToString());
                foreach (var item in JsonDocument.Parse(_fresh_ds).RootElement.EnumerateArray())
                {
                    var one = item.GetString().Split(":");
                    if (one[0] == "数据集")
                    {
                        if (calcDsNames == null)
                        {
                            if (calcGridNames == null)
                            {
                                calcGridNames = new List<String>();
                            }
                            calcDsNames = new List<String>();
                        }
                        calcDsNames.Add(one[1]);
                    }
                    if (one[0] == "表格")
                    {
                        if (calcGridNames == null)
                        {
                            calcGridNames = new List<String>();
                        }
                        calcGridNames.Add(one[1]);
                    }
                }
            }
            reportDefineForWeb.CurrentReportDefine.calcGridNames = calcGridNames?.ToArray();
            if (calcDsNames != null)
                reportDefineForWeb.CurrentReportDefine.calcDsNames = new HashSet<String>(calcDsNames);
        }
        protected internal ReportDefineForWeb reportDefineForWeb;
        public async Task output()
        {
            var aaa = Regex.Replace(mc_report_id, @"[:|\|""|\?|/|<|>]", "_");

            tmpFileName = rpt_group.Id + ":" + mc_report_id.Replace('/', '.').Replace(':', '_').Replace('\\', '_')
                        .Replace('"', '_').Replace('?', '_').Replace('/', '_').Replace('<', '_')
                        .Replace('>', '_').Replace('|', '_');
            //if (tmpFileName.Length > 150)
            //    tmpFileName = UserMd5(tmpFileName);
            //HttpContext.Request.Form["_param_name_"]
            if (report_env.TemplateGet("big_screen") == "0" &&
                Request.HasFormContentType && Request.Form.ContainsKey("_createFormParam")
                && Request.Form["_createFormParam"].ToString().Equals("true", comparisonType: StringComparison.OrdinalIgnoreCase)
                && report_env.TemplateGet("firstNoQuery").Equals("true", comparisonType: StringComparison.OrdinalIgnoreCase)
                )
            {
                await NotCalcReportAndOutput();
            }
            else if (myCache == null || (Request.HasFormContentType
                && (Request.Form.ContainsKey("__call_func")
                || Request.Form.ContainsKey("__inserted")
                || Request.Form.ContainsKey("__deleted")
                || Request.Form.ContainsKey("_fresh_ds")
                || Request.Form.ContainsKey("_param_name_")
                 )))
            {
                await NotCalcReportAndOutput();
            }
            else
            {
                report_env.CurrentRunReportInfo.calc_type = "计算或从cache取";
                await myCache.OutputOrCalcAndCache(tmpFileName, Response,
                    async (jsonWrite) => await calc_output(jsonWrite));
                report_env.CurrentRunReportInfo.stage = $"exportJson:other1:start";
                await Response.Body.FlushAsync();
                //await Response.WriteAsync(",\"footer2\":");
                //await Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("footer2"), CellReport.running.Logger.getJsonOption()));
                var exprFaced = report_env.getExprFaced();
                if (this.myCache != null)
                {
                    this.tips = this.tips
                         + "\n刷新标记是：" + this.myCache.fresh_flag
                        + "\n刷新标记取得时间:" + this.myCache.global_time.ToString("yyyy-MM-dd HH:mm:ss fff")
                         + "\n本报表计算时间：" + this.myCache.fresh_time.ToString("yyyy-MM-dd HH:mm:ss fff");
                    this.tips = System.Text.Json.JsonSerializer.Serialize(this.tips, CellReport.running.Logger.getJsonOption());
                    await Response.WriteAsync($",\"cache_key\":\"{myCache.cacheKey(tmpFileName)}\" ,\"tips\":{this.tips}");
                }
                await Response.WriteAsync(",\"_zb_var_\":");
                if (exprFaced.getVariable("_zb_var_") != null)
                {
                    await Response.WriteAsync(JsonSerializer.Serialize(exprFaced.getVariable("_zb_var_"), CellReport.running.Logger.getJsonOption()));
                }
                else
                {
                    await Response.WriteAsync("{}");
                }
                await Response.WriteAsync(",\"notebook\":");
                await Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("notebook"), CellReport.running.Logger.getJsonOption()));
                await Response.WriteAsync(",\"footer2\":");
                await Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("footer2"), CellReport.running.Logger.getJsonOption()));

                await Response.WriteAsync("\n}");
                report_env.CurrentRunReportInfo.stage = $"exportJson:other1:end";
            }
        }

        private async Task NotCalcReportAndOutput()
        {
            var exprFaced = report_env.getExprFaced();
            //using (MemoryStream jsonStream = CellReport.Redis_Cache.manager.GetStream())
            {
                using (MyTextWrite htmlWrite = new MyTextWrite(Response.Body))
                {
                    if (Request.HasFormContentType && Request.Form.ContainsKey("_param_name_") &&
                        Request.Form["_param_name_"].ToString() != "")
                    {
                        report_env.CurrentRunReportInfo.calc_type = "刷新参数值";
                        this.reportDefineForWeb.CurrentReportDefine.calcGridNames = new String[] { };
                        exprFaced.addVariable("_createFormParam_", true);
                        var param_name = Request.Form["_param_name_"].ToString();
                        exprFaced.addVariable("_param_name_", param_name);
                        reportDefineForWeb.CurrentReportDefine.calcGridNames = new String[] { };
                        reportDefineForWeb.CurrentReportDefine.calcDsNames = new();
                        //foreach (var ds in report_env.getDataSetList())
                        //{
                        //    if (ds.getSqlParamSet().Count == 1 && ds.getSqlParamSet().Contains(param_name))
                        //    {
                        //        if (reportDefineForWeb.CurrentReportDefine.calcDsNames == null)
                        //        {
                        //            reportDefineForWeb.CurrentReportDefine.calcDsNames = new();
                        //        }
                        //        reportDefineForWeb.CurrentReportDefine.calcDsNames.Add(ds.Name);
                        //    };
                        //}
                    }
                    else if (Request.HasFormContentType && Request.Form.ContainsKey("_createFormParam")
                        && Request.Form["_createFormParam"].ToString().Equals("true", comparisonType: StringComparison.OrdinalIgnoreCase)
                        && report_env.TemplateGet("firstNoQuery").Equals("true", comparisonType: StringComparison.OrdinalIgnoreCase)
                        )
                    {
                        report_env.CurrentRunReportInfo.calc_type = "刷新form";
                        exprFaced.addVariable("_createFormParam_", true);
                        reportDefineForWeb.CurrentReportDefine.calcGridNames = new String[] { };
                        reportDefineForWeb.CurrentReportDefine.calcDsNames = new();
                    }
                    //string str_call_func=Request.Query["__call_func"].ToString();
                    //if (!String.IsNullOrEmpty(str_call_func))
                    //{
                    //    Object result = CellReport.core.expr.ExprHelper.calc_client_func(report_env, str_call_func);
                    //    htmlWrite.Write(JsonSerializer.Serialize(result, CellReport.running.Logger.getJsonOption()));
                    //}
                    if (Request.HasFormContentType && (Request.Form.ContainsKey("__call_func")))
                    {
                        report_env.CurrentRunReportInfo.calc_type = "调用函数";
                        var __call_func = Request.Form["__call_func"].ToString();
                        var func_json = JsonDocument.Parse(__call_func).RootElement;
                        report_env.CurrentRunReportInfo.stage = $"calc";
                        Object result = await CellReport.core.expr.ExprHelper.calc_client_func(report_env, func_json);
                        report_env.CurrentRunReportInfo.stage = $"exportJson:__call_func:start";
                        htmlWrite.Write(JsonSerializer.Serialize(result, CellReport.running.Logger.getJsonOption()));
                        report_env.CurrentRunReportInfo.stage = $"exportJson:__call_func:end";
                    }
                    else
                    {
                        report_env.CurrentRunReportInfo.calc_type = "计算或cache";
                        await calc_output(htmlWrite);
                        report_env.CurrentRunReportInfo.stage = $"exportJson:other:start";
                        htmlWrite.Write(",\"_zb_var_\":");
                        if (exprFaced.getVariable("_zb_var_") != null)
                        {
                            htmlWrite.Write(JsonSerializer.Serialize(exprFaced.getVariable("_zb_var_"), CellReport.running.Logger.getJsonOption()));
                        }
                        else
                        {
                            htmlWrite.Write("{}");
                        }
                        htmlWrite.Write(",\"notebook\":");
                        htmlWrite.Write(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("notebook"), CellReport.running.Logger.getJsonOption()));
                        htmlWrite.Write(",\"footer2\":");
                        htmlWrite.Write(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("footer2"), CellReport.running.Logger.getJsonOption()));
                        htmlWrite.Write("\n}");
                        report_env.CurrentRunReportInfo.stage = $"exportJson:other:end";
                    }
                    await htmlWrite.FlushAsync();
                    //jsonStream.Position = 0;
                    //await jsonStream.CopyToAsync(Response.Body);
                }
            }
        }
        private async Task calc_output_excel()
        {
            this.reportDefineForWeb.CurrentReportDefine.getGridList().ForEach(x => (x as CellReport.cell.ReportGrid).backend_split_page = false);
            await this.reportDefineForWeb.calcReport();//命令格式：(g表格|d数据集|u修改数据)，
            if (reportDefineForWeb.Report == null && reportDefineForWeb.currentException != null)
            {
                throw reportDefineForWeb.currentException;
            }
            long start = DateTime.Now.Ticks;
            string fileName = Guid.NewGuid().ToString() + ".xlsx"; // 保存文件的路径
            other.Export.Excel(reportDefineForWeb.Report, Path.Combine(this.WebHostEnvironment.WebRootPath, "../static/tmp_files", fileName));
            logger.Debug("生成文件用时：" + (DateTime.Now.Ticks - start) / 10000000.0 + "秒");

            Response.ContentType = "application/json";
            // 设置响应头
            await Response.WriteAsJsonAsync(new
            {
                errcode = 0,
                url = Path.Combine("../static/tmp_files", fileName)
            });

        }
        private async Task calc_output(MyTextWrite htmlWrite)
        {
            await this.reportDefineForWeb.calcReport();//命令格式：(g表格|d数据集|u修改数据)，
            if (reportDefineForWeb.Report == null)
                if (reportDefineForWeb.currentException != null)
                {
                    throw reportDefineForWeb.currentException;
                }
            if (Request.Query["_fresh_ds"].ToString() == "")
            {
                await reportDefineForWeb.Report.exportJson(htmlWrite);
            }

        }
        /// MD5　32位加密
        /// &lt;/summary&gt;
        /// &lt;param name="str"&gt;&lt;/param&gt;
        /// &lt;returns&gt;&lt;/returns&gt;
        public static string UserMd5(string str)
        {
            string cl = str;
            string pwd = "";
            MD5 md5 = MD5.Create();//实例化一个md5对像
            // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(cl));
            // 通过使用循环，将字节类型的数组转换为字符串，此字符串是常规字符格式化所得
            for (int i = 0; i < s.Length; i++)
            {
                // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符 
                pwd = pwd + s[i].ToString("X");
            }
            return pwd;
        }

        public void Dispose()
        {
            reportDefineForWeb?.Dispose();
        }
    }
}