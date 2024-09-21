using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CellReport.exporter;
using CellReport.running;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using reportWeb.hubs;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using reportWeb.Model;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Antlr.Runtime;
using CellReport.core.expr;
using System.Text.RegularExpressions;
using reportWeb.Pages;
using SqlKata.Execution;
namespace reportWeb.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class DesignController : Controller
    {
        IConfiguration configuration;
        IHubContext<ChatHub> hubContext;
        Rpt_group rpt_group;
        ReportDbContext reportDb;
        JsonSerializerOptions json_option;
        ScopedObj reportGrp;

        public MyLogger logger { get; }

        public DesignController(IConfiguration configuration,
            IHubContext<ChatHub> hubContext, ReportDbContext reportDb, ILogger<UserController> logger,
            ScopedObj reportGrp)
        {
            this.configuration = configuration;
            this.hubContext = hubContext;
            this.rpt_group = reportGrp.rpt_group;
            this.reportDb = reportDb;
            this.reportGrp = reportGrp;
            this.logger = new Pages.MyLogger(logger);
            json_option = new JsonSerializerOptions()
            {
                DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All),
                //System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true
            };
            json_option.Converters.Add(new CellReport.math.BigDecimalConverter());
            json_option.Converters.Add(new CellReport.util.DateConverter());
            json_option.Converters.Add(new CellReport.util.DateTimeConverter());
            json_option.Converters.Add(new CellReport.util.DBNullConverter());
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
        private String getQueryValue(string name)
        {
            if (HttpContext.Request.Query.TryGetValue(name, out var ret))
                return ret.ToString();
            else
                return null;
        }
        public async Task<IActionResult> Preview(String _content, String _ConnectionId, string reportName,
            String _fresh_ds, String _fresh_params, bool _createFormParam, String _param_name_)
        {
            List<String> calcDsNames = null;
            List<String> calcGridNames = null;
            if (!String.IsNullOrEmpty(_ConnectionId))
                HttpContext.Session.SetString("_ConnectionId", _ConnectionId);
            if (String.IsNullOrEmpty(_ConnectionId))
                _ConnectionId = HttpContext.Session.GetString("_ConnectionId");
            if (!String.IsNullOrEmpty(_fresh_ds))
            {
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
            if (_createFormParam)
            {
                calcGridNames = new List<String>();
                calcDsNames = new List<String>();
            }
            try
            {
                long start = DateTime.Now.Ticks;
                System.Xml.XmlDocument xmlDoc = Content2XmlDoc(_content);

                if (reportName != null && reportName.Contains(":"))
                    reportName = reportName.Split(":")[1];
                using var reportDefine = await XmlReport.loadReportFromXmlDoc(xmlDoc, this.rpt_group.report_path, reportName ?? "temp.cr");
                using var report_env = reportDefine.getEnv();
                report_env.rpt_group_name = rpt_group.name;
                report_env.report_name = "0预览" + Guid.NewGuid().ToString("N");
                if (!String.IsNullOrEmpty(_fresh_ds))
                {
                    report_env.getExprFaced().addVariable("_fresh_ds", _fresh_ds);
                }

                report_env.logger = _ConnectionId == null ? logger :
                    new Logger(x => MessageQueueBlock<DemoMessage>
                        .Add(new DemoMessage()
                        {
                            hubContext = hubContext,
                            User = this.HttpContext.User,
                            ConnectionId = _ConnectionId,
                            Body = x
                        }
                    )
                );

                foreach (var one in this.rpt_group.db_connection_list)
                {
                    report_env.addDataSource(one.name, one.conn_str, one.db_type, "0", one.sql_prefix, one.sql_suffix);
                }
                ParamDefineDataSet pds = report_env.getParamDefineDataSet();
                foreach (var row in pds.Rows)
                {
                    String param_name = row.getData("name").ToString();
                    if (row.getData("inner") != null && row.getData("inner").ToString().ToLower().Equals("true"))
                        continue;
                    String default_value = CellReport.dataSet.DotNetDataSet.convertValue(pds.getDefaultValueForRow(row));
                    if (param_name != "reportName")
                        report_env.addParam(param_name, default_value);
                    if (getQueryValue(param_name) != null)
                        report_env.addParam(param_name, getQueryValue(param_name));
                    if (getFormValue(param_name) != null)
                        report_env.addParam(param_name, getFormValue(param_name));
                }
                if (!String.IsNullOrEmpty(_fresh_params))
                {
                    foreach (var item in JsonDocument.Parse(_fresh_params).RootElement.EnumerateArray())
                    {
                        object val = null;
                        if (item.GetProperty("value").ValueKind == JsonValueKind.Number)
                            val = item.GetProperty("value").GetDecimal();
                        else
                            val = item.GetProperty("value").GetString();
                        report_env.addParam(item.GetProperty("name").GetString(), val);
                    }
                }
                reportDefine.calcGridNames = calcGridNames?.ToArray();
                if (calcDsNames != null)
                    reportDefine.calcDsNames = new HashSet<String>(calcDsNames);
                var exprFaced = report_env.getExprFaced();
                exprFaced.getVariableDefine("_user_").value = null;
                exprFaced.getVariableDefine("_zb_url_").value = configuration["zb_url"];
                exprFaced.getVariableDefine("_zb_user_").value = rpt_group.zb_user;
                exprFaced.getVariableDefine("_zb_password_").value = rpt_group.zb_password;
                exprFaced.getVariableDefine("_rpt_group_").value = rpt_group;
                if (_createFormParam || (calcDsNames != null && calcDsNames.Count > 0) || (calcGridNames != null && calcGridNames.Count > 0))
                    exprFaced.getVariableDefine("_need_dataset_").value = false;
                else
                    exprFaced.getVariableDefine("_need_dataset_").value = true;
                exprFaced.addVariableForRoot("_page_size_", getFormValue("_page_size_"));
                exprFaced.addVariableForRoot("_cur_page_num_", getFormValue("_cur_page_num_"));
                if (_createFormParam == true)
                {
                    exprFaced.addVariable("_createFormParam_", _createFormParam);
                    exprFaced.addVariable("_param_name_", _param_name_);
                }
                exprFaced.getVariableDefine("__page__").value = HttpContext.Request;
                Engine engine = new Engine(reportDefine);
                long end = DateTime.Now.Ticks;
                report_env.logger.Debug($"分析xml耗时：{(DateTime.Now.Ticks - start) / 10000000.0}秒");
                report_env.report_name = "1预览" + Guid.NewGuid().ToString("N");
                Exception cur_exception = null;
                Func<Task> my_out_act = async () =>
                {
                    //if (cur_exception != null)
                    //{
                    //    while (cur_exception.InnerException != null)
                    //    {
                    //        report_env.logger.Error(cur_exception.Message);
                    //        cur_exception = cur_exception.InnerException;
                    //    }
                    //}
                    using (var Report = engine.getResult())
                    {
                        using (MemoryStream jsonStream = CellReport.Redis_Cache.manager.GetStream())
                        {
                            bool haswrite = false;
                            using (MyTextWrite jsonWriter = new MyTextWrite(jsonStream))
                            {
                                start = DateTime.Now.Ticks;
                                try
                                {
                                    await Report.exportJson(jsonWriter);
                                    haswrite = true;
                                }
                                catch (Exception ex)
                                {
                                    if (cur_exception == null)
                                        cur_exception = ex;
                                }

                                if (cur_exception != null)
                                {
                                    string message = reportWeb.Pages.ReportModel.output_expection(cur_exception, Report.getEnv().logger, Report.getEnv());
                                    if (haswrite)
                                        jsonWriter.Write(",");
                                    jsonWriter.Write("\"errcode\":1,\"message\":");
                                    jsonWriter.Write(JsonSerializer.Serialize(message, json_option));
                                }
                                jsonWriter.Write(",\"footer2\":");
                                jsonWriter.Write(System.Text.Json.JsonSerializer.Serialize(report_env.TemplateGet("footer2"), CellReport.running.Logger.getJsonOption()));

                                jsonWriter.Write(",\"_zb_var_\":");
                                if (exprFaced.getVariable("_zb_var_") != null)
                                {
                                    jsonWriter.Write(JsonSerializer.Serialize(exprFaced.getVariable("_zb_var_"), CellReport.running.Logger.getJsonOption()));
                                }
                                else
                                {
                                    jsonWriter.Write("{}");
                                }
                                jsonWriter.Write("\n}");
                                await jsonWriter.FlushAsync();
                                jsonStream.Position = 0;
                                await jsonStream.CopyToAsync(Response.Body);
                            }
                        }
                    }
                };
                if (Request.HasFormContentType && (Request.Form.ContainsKey("__call_func")))
                {
                    var func_json = JsonDocument.Parse(Request.Form["__call_func"].ToString()).RootElement;
                    Object result = await CellReport.core.expr.ExprHelper.calc_client_func(report_env, func_json);
                    await Response.WriteAsJsonAsync(result, CellReport.running.Logger.getJsonOption());
                }
                else
                {
                    try
                    {
                        await engine.calcReportAsync();
                        //GC.Collect(2, GCCollectionMode.Forced);
                    }
                    catch (Exception ex)
                    {
                        cur_exception = ex;
                    }
                    await my_out_act();
                }
                report_env.logger.Debug($"总用时：{(DateTime.Now.Ticks - start) / 10000000.0}秒");
                //if (String.IsNullOrEmpty(fresh_ds))
                //{
                //}
                //else
                //{
                //    CellReport.dataSet.DataSet ds = reportDefine.getEnv().getDataSet(fresh_ds);
                //    await ds.loadDataAsync();
                //    List<Object> result = new List<object>();
                //    result.Add(ds.getColumns().Skip(1).ToArray());
                //    for (int i = 0; i < ds.RowsCount; i++)
                //    {
                //        result.Add(ds.getDataByLineNo(i));
                //    }
                //    await Response.Body.FlushAsync();
                //    await JsonSerializer.SerializeAsync(Response.Body, result, reportDefine.getEnv().getJsonOption());
                //    await Response.Body.FlushAsync();
                //}
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                StringBuilder sb = new StringBuilder();
                Exception las_ex;
                do
                {
                    sb.AppendLine(ex.Message);
                    las_ex = ex;
                    ex = ex.InnerException;
                } while (ex != null);
                return Json(new { errcode = 1, message = sb.ToString(), stacktrace = las_ex.StackTrace });
            }
        }

        public IActionResult test_expr(String expr, int line, int column, string word)
        {
            //var lines = expr.Split("\n");
            //lines[line - 1] = lines[line - 1].Insert(column, ".__HINT_NODE__");
            //expr = String.Join("\n", lines);
            try
            {
                var input = new ANTLRStringStream(expr);
                ExprLexer lex = new ExprLexer(input);
                CommonTokenStream tokens = new CommonTokenStream(lex);
                var parser = new ExprParser(tokens);//,true
                var exprNodes = expr.StartsWith("=") ? parser.assignExpr().Tree : parser.statement_block().Tree;
                //var hint = exprNodes.findHint();
                return Json(new { errcode = 0, message = "" });
            }
            catch (Exception ex)
            {
                return Json(new { errcode = 1, message = ex.Message });
            }
        }

        public async Task<IActionResult> exec_expr(String expr, String report_content)
        {
            Env report_env = null;
            try
            {
                BaseExprFaced exprFaced;

                CellReport.dataSet.GroupMap cur_GroupMap = null;


                if (String.IsNullOrEmpty(report_content))
                {
                    exprFaced = new ExprFaced2();
                    exprFaced.addNewScopeForScript();
                    report_env = new Env("exec_expr1");
                    cur_GroupMap = new();
                    exprFaced.addVariable("env", report_env);
                    exprFaced.addVariable("__env__", report_env);
                    exprFaced.addVariable("_user_", null);
                    exprFaced.addVariable("_zb_url_", configuration["zb_url"]);
                    exprFaced.addVariable("_zb_user_", rpt_group.zb_user);
                    exprFaced.addVariable("_zb_password_", rpt_group.zb_password);
                    exprFaced.addVariable("_zb_var_", new Dictionary<String, object>());
                    exprFaced.addVariable("_rpt_group_", rpt_group);
                    exprFaced.getVariableDefine("__page__").value = HttpContext.Request;

                }
                else
                {
                    System.Xml.XmlDocument xmlDoc = Content2XmlDoc(report_content);
                    string reportName = null;
                    if (reportName != null && reportName.Contains(":"))
                        reportName = reportName.Split(":")[1];
                    using var reportDefine = await XmlReport.loadReportFromXmlDoc(xmlDoc, this.rpt_group.report_path, reportName ?? "temp.cr");
                    report_env = reportDefine.getEnv();
                    exprFaced = report_env.getExprFaced();
                    exprFaced.getVariableDefine("__page__").value = HttpContext.Request;
                    exprFaced.addVariableForRoot("_page_size_", getFormValue("_page_size_"));
                    exprFaced.addVariableForRoot("_cur_page_num_", getFormValue("_cur_page_num_"));
                    cur_GroupMap = report_env.getDataSetResultMap();
                }
                report_env.logger = logger;
                foreach (var one in this.rpt_group.db_connection_list)
                {
                    report_env.addDataSource(one.name, one.conn_str, one.db_type, "0", one.sql_prefix, one.sql_suffix);
                }

                var exec_result = exprFaced.calculate("{  " + expr + "\n}", cur_GroupMap, "当前脚本");
                if (exec_result is Exception ex)
                {
                    throw ex;
                }
                return Json(new { errcode = 0, message = "", result = exec_result }, json_option);
            }
            catch (Exception ex)
            {
                StringBuilder sb_err = new();
                sb_err.AppendLine(ex.Message);
                while (ex.InnerException != null)
                {
                    ex = ex.InnerException;
                    sb_err.AppendLine(ex.Message);
                }
                return Json(new { errcode = 1, message = sb_err.ToString() }, json_option);
            }
            finally
            {
                if (report_env != null)
                    report_env.Dispose();
            }
        }
        public IActionResult exec_cmd(String cmd, string from, string to)
        {
            // from 格式： grp_id:文件名
            // to 格式 grp_id:文件名
            string getReal_path(string target, String file_type)
            {
                if (String.IsNullOrEmpty(target))
                    throw new Exception("非法路径:" + file_type);
                var where_id = target.Split(":")[0];

                var grp = reportDb.Query("Rpt_group").Where(new { id = where_id }).FirstOrDefault().report_path;
                target = target.Split(":")[1];
                if (target.StartsWith("/"))
                    target = target.Substring(1);
                var target_path = Path.Combine(grp, target);
                if (target_path.StartsWith(grp))
                    return target_path;
                else
                    throw new Exception("非法路径！");
            }
            string from_path = getReal_path(from, "from");

            if (cmd == "rename")
            {
                var to_path = getReal_path(to, "to");
                new FileInfo(from_path).MoveTo(to_path, false);
            }
            else if (cmd == "copy")
            {
                if (from == to)
                {
                    to = to.Substring(0, to.Length - 3) + "_copy.cr";
                }
                var to_path = getReal_path(to, "to");
                if (System.IO.File.Exists(to))
                {
                    return Json(new { errcode = 1, message = "文件已存在" });
                }
                new FileInfo(from_path).CopyTo(to_path, false);
            }
            else if (cmd == "cut")
            {
                var to_path = getReal_path(to, "to");
                if (System.IO.File.Exists(to))
                {
                    return Json(new { errcode = 1, message = "文件已存在" });
                }
                new FileInfo(from_path).MoveTo(to_path, false);
            }
            else if (cmd == "delete")
            {
                if (!System.IO.File.Exists(from_path))
                {
                    return Json(new { errcode = 1, message = "文件不存在" });
                }
                new FileInfo(from_path).Delete();
            }
            else if (cmd == "mkdir")
            {
                if (!System.IO.File.Exists(from_path) && !Directory.Exists(from_path))
                {
                    Directory.CreateDirectory(from_path);
                    return Json(new { errcode = 0, message = "OK" });
                }
                //new FileInfo(from_path).Delete();
            }
            else if (cmd == "getImg")
            {
                if (!System.IO.File.Exists(from_path + ".jpg"))
                {
                    return Json(new { errcode = 0, message = "文件不存在" });
                }
                return Json(new
                {
                    errcode = 0,
                    message = "文件存在",
                    data = Convert.ToBase64String(System.IO.File.ReadAllBytes(from_path + ".jpg"))
                });
            }
            else
            {
                return Json(new { errcode = 1, message = "非法命令" });
            }
            return Json(new { errcode = 0, message = "保存成功" });


        }
        [HttpPost]
        public async Task<IActionResult> Open(String reportName, string zb_dict_str, string zb_param)
        {
            if (reportName.StartsWith("/"))
                reportName = reportName.Substring(1);
            var file_path = Path.Combine(this.rpt_group.report_path, reportName);
            if (file_path.StartsWith(this.rpt_group.report_path)
                && System.IO.File.Exists(file_path))
            {
                using Env parent_env = new Env("open");
                await XmlReport.templateValue2Env(this.rpt_group.report_path, reportName, parent_env);
                var xmlDoc = (await XmlReport.getReportXmlDoc(this.rpt_group.report_path, reportName, isDesign: true)).xml;
                //var ret = XmlReport.reportToXmlDocumnt(XmlReport.loadReport(file_path), false).OuterXml;
                //var report_content = await System.IO.File.ReadAllTextAsync(file_path, System.Text.Encoding.UTF8);
                var conn_list = from x in this.rpt_group.db_connection_list select x.name;
                var ttt = await range_level(xmlDoc.OuterXml, reportName);
                return Json(new
                {
                    report_content = xmlDoc.OuterXml,
                    conn_list,
                    range_level = ttt.range_level,
                    defaultsetting = ttt.defaultsetting,
                    parent_defaultsetting = new Dictionary<String, String>((from x in parent_env.TemplateGet("out_keys").Split(",") select new KeyValuePair<string, string>(x, parent_env.TemplateGet(x))))
                }
                );
            }
            return Json(new { errcode = 1, message = "路径错误" });
        }
        private async Task insert_ds_param(string reportName, string zb_dict_str, string zb_param)
        {
            var file_path = Path.Combine(this.rpt_group.report_path, reportName);
            var xmlDoc = (await XmlReport.getReportXmlDoc(this.rpt_group.report_path, reportName, isDesign: true)).xml;
            //var ret = XmlReport.reportToXmlDocumnt(XmlReport.loadReport(file_path), false).OuterXml;
            //var report_content = await System.IO.File.ReadAllTextAsync(file_path, System.Text.Encoding.UTF8);
            var xml_elem_root = xmlDoc.SelectSingleNode("//report");
            var zb_var = new Dictionary<String, object>();
            if (!String.IsNullOrEmpty(zb_dict_str))
            {

                var zb_dict_json = JsonDocument.Parse(zb_dict_str).RootElement;
                if (zb_dict_json.ValueKind == JsonValueKind.Object)
                {
                    var xmlelem_jiHe = xmlDoc.SelectSingleNode("//dataSets");
                    if (xmlelem_jiHe == null)
                    {
                        xmlelem_jiHe = xmlDoc.CreateElement("dataSets");
                        xml_elem_root.AppendChild(xmlelem_jiHe);
                    }
                    foreach (var one in zb_dict_json.EnumerateObject())
                    {
                        var one_val = JsonDocument.Parse(one.Value.ToString()).RootElement;
                        if (one_val.ValueKind != JsonValueKind.Object)
                        {//变量
                            zb_var.TryAdd(one.Name, one_val);
                            continue;
                        }
                        if (!one_val.TryGetProperty("data", out var ds_data))
                            continue;
                        //数据集
                        if (one_val.TryGetProperty("columns", out var columns))
                        {
                            var ds_xml = xmlDoc.SelectSingleNode($"//dataSet[@name='{one.Name}']");
                            if (ds_xml == null)
                            {
                                var xmlelem_one = xmlDoc.CreateElement("dataSet");
                                xmlelem_one.SetAttribute("name", one.Name);
                                xmlelem_one.SetAttribute("type", "csv");
                                xmlelem_one.SetAttribute("dataSource", "");
                                xmlelem_one.SetAttribute("fields", columns.ToString());
                                xmlelem_one.SetAttribute("path_list", $"[\"{one.Name}\"]");

                                var xmlelem_one_data = xmlDoc.CreateElement("data");
                                var ins_data = ds_data.EnumerateArray().ToList();
                                ins_data.Insert(0, columns);
                                xmlelem_one_data.InnerText = $"{{\"{one.Name}\":" + JsonSerializer.Serialize(ins_data, json_option) + "}";
                                xmlelem_one.AppendChild(xmlelem_one_data);

                                xmlelem_one_data = xmlDoc.CreateElement("get");
                                xmlelem_one_data.InnerText = $"{one.Name}";
                                xmlelem_one.AppendChild(xmlelem_one_data);

                                xmlelem_jiHe.AppendChild(xmlelem_one);
                            }
                            else
                            {
                                ds_xml.Attributes["fields"].InnerText = columns.ToString();
                                var ins_data = ds_data.EnumerateArray().ToList();
                                ins_data.Insert(0, columns);
                                ds_xml.SelectSingleNode("data").InnerText = $"{{\"{one.Name}\":" + JsonSerializer.Serialize(ins_data, json_option) + "}";
                            }
                        }
                    }


                }
                xmlDoc.SelectSingleNode("//zb_var").InnerText = JsonSerializer.Serialize(zb_var, json_option);

            }

            if (!String.IsNullOrEmpty(zb_param))
            {
                var zb_param_json = JsonDocument.Parse(zb_param).RootElement;
                var xmlelem_jiHe = xmlDoc.SelectSingleNode("//params");
                List<String> param_list = new List<String>();
                foreach (var one in JsonDocument.Parse(zb_param).RootElement.EnumerateArray())
                {
                    var name = one.GetProperty("name").ToString();
                    var param_value = one.GetProperty("value").ToString();
                    if (name.Equals("reportName", StringComparison.OrdinalIgnoreCase))
                        continue;
                    param_list.Add($"'{name}':param['{name}']");
                    if (null == xmlelem_jiHe.SelectSingleNode(name))
                    {
                        var xmlelem_3 = xmlDoc.CreateElement("param");
                        xmlelem_3.SetAttribute("name", name);
                        xmlelem_3.SetAttribute("data_type", "string");
                        xmlelem_3.SetAttribute("prompt", name);
                        xmlelem_3.SetAttribute("default_value", param_value);
                        //xmlelem_one.SetAttribute("value", param.getData("value") != null ? param.getData("value").ToString() : "");
                        xmlelem_jiHe.AppendChild(xmlelem_3);
                    }
                }
                xmlelem_jiHe = xmlDoc.SelectSingleNode("//template");
                if (xmlelem_jiHe == null)
                {
                    xmlelem_jiHe = xmlDoc.CreateElement("template");
                    xml_elem_root.AppendChild(xmlelem_jiHe);
                }
                string zb_id = new FileInfo(file_path).Directory.Name;
                var xmlelem_2 = xmlelem_jiHe.SelectSingleNode("before_exec_script");

                string init_str = $"_init_zb_dataset_=web_request({{'url':_zb_url_+'/api/rpt_ds/{zb_id}','method':'post',\n'data':{{ {String.Join("\n,", param_list)} }}}});";
                string exec_script = $"_need_dataset_=true;\nvar _init_zb_dataset_=null;\nfunction beforeCalcDataSet(){{\n  {init_str} \n}}";
                if (xmlelem_2 == null)
                {
                    xmlelem_2 = xmlDoc.CreateElement("before_exec_script");
                    xmlelem_2.InnerText = exec_script;
                    xmlelem_jiHe.AppendChild(xmlelem_2);
                }
                if (!xmlelem_2.InnerText.Contains("_init_zb_dataset_"))
                {//这里应该用正则替换原来的数据集初始化
                    xmlelem_2.InnerText = xmlelem_2.InnerText + exec_script;
                }
                else
                {
                    xmlelem_2.InnerText = new Regex($"_init_zb_dataset_=web_request([\\w|\\W]*?);").Replace(xmlelem_2.InnerText, init_str);
                }
            }
            xmlDoc.Save(file_path);

        }
        public async Task<IActionResult> Save(String reportName, String content, string zb_dict_str, string zb_param, IFormFile imgFile)
        {
            if (reportName.StartsWith("/"))
                reportName = reportName.Substring(1);
            if (!Directory.Exists(this.rpt_group.report_path))
                Directory.CreateDirectory(this.rpt_group.report_path);
            var file_path = Path.Combine(this.rpt_group.report_path, reportName);
            if (file_path.StartsWith(this.rpt_group.report_path))
            {
                var fileInfo = new FileInfo(file_path);
                if (!Directory.Exists(fileInfo.DirectoryName))
                    Directory.CreateDirectory(fileInfo.DirectoryName);
                if (imgFile != null)
                {
                    using (var stream = System.IO.File.Create(file_path + ".jpg"))
                    {
                        await imgFile.CopyToAsync(stream);
                    }
                    return Json(new { errcode = 0, message = "保存图片成功" }); ;
                }
                if (!fileInfo.Exists || (fileInfo.Exists && String.IsNullOrEmpty(zb_dict_str)))
                {
                    System.Xml.XmlDocument xmlDoc = Content2XmlDoc(content.Replace("\r", ""));
                    xmlDoc.Save(file_path);
                    XmlReport.MemoryCacheInstance.Remove(file_path);
                }
                if (!String.IsNullOrEmpty(zb_dict_str))
                {
                    await insert_ds_param(reportName, zb_dict_str, zb_param);
                }
                return Json(new { errcode = 0, message = "保存成功" });
            }
            return Json(new { errcode = 1, message = "路径错误" });


        }
        static System.Xml.XmlDocument Content2XmlDoc(string content)
        {
            var xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(content);
            var xml_report = xmlDoc.SelectSingleNode("//report");
            foreach (var one in new String[] { "parsererror", "parent_defaultsetting" , "range_level", "functions",
                        "canExecuteExpr","inner_script" })
            {
                var cur_node_list = xmlDoc.SelectNodes($"//report/{one}");
                if (cur_node_list != null)
                {
                    foreach (System.Xml.XmlNode cur_node in cur_node_list)
                        xml_report.RemoveChild(cur_node);
                }
            }
            StringBuilder sb = new();
            foreach (Match one in new Regex(@"/\*\s*服务器脚本\s*\\n(.*?)结束\s*\*/").Matches(content))
            {
                sb.AppendLine(one.Groups[1].Value);
            }
            var xmlNode = xmlDoc.CreateElement("inner_script");
            xmlNode.InnerText = ExprHelper.extractString(System.Net.WebUtility.HtmlDecode(sb.ToString()));
            xml_report.AppendChild(xmlNode);
            return xmlDoc;
        }
        public async Task<IActionResult> open_template(String path)
        {
            if (!Directory.Exists(this.rpt_group.report_path))
                Directory.CreateDirectory(this.rpt_group.report_path);
            if (string.IsNullOrEmpty(path))
                path = "template.xml";
            else if (path.StartsWith("/"))
                path = path.Substring(1) + "/template.xml";
            else
                path = path + "/template.xml";
            var file_path = Path.Combine(this.rpt_group.report_path, path);
            using Env parent_env = new Env("open_template");
            await XmlReport.templateValue2Env(this.rpt_group.report_path, path, parent_env, true);

            if (file_path.StartsWith(this.rpt_group.report_path) && System.IO.File.Exists(file_path))
            {
                var content = await System.IO.File.ReadAllTextAsync(file_path, System.Text.Encoding.UTF8);
                return Json(new
                {
                    content,
                    parent_defaultsetting = new Dictionary<String, String>((from x in parent_env.TemplateGet("out_keys").Split(",") select new KeyValuePair<string, string>(x, parent_env.TemplateGet(x))))
                });
            }
            return Json(new { errcode = 1, message = "路径错误" });
        }
        public async Task<IActionResult> Save_template(String path, String content)
        {
            if (string.IsNullOrEmpty(path))
                path = "template.xml";
            else if (path.StartsWith("/"))
                path = path.Substring(1) + "/template.xml";
            else
                path = path + "/template.xml";
            var file_path = Path.Combine(this.rpt_group.report_path, path);
            if (file_path.StartsWith(this.rpt_group.report_path))
            {
                await System.IO.File.WriteAllTextAsync(file_path, content, System.Text.Encoding.UTF8);
                XmlReport.MemoryCacheInstance.Remove(file_path);
                return Json(new { errcode = 0, message = "保存成功" });
            }
            return Json(new { errcode = 1, message = "路径错误" });
        }
        private async Task<(System.Collections.IEnumerable range_level, object defaultsetting)> range_level(String content, string reportName)
        {
            System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(content);
            using var report = await XmlReport.loadReportFromXmlDoc(xmlDoc, this.rpt_group.report_path, reportName ?? "temp.cr");
            Engine engine = new Engine(report);
            engine.buildRelation();
            engine.prepareCalcLevelForCell();
            var b_l = from x in engine.getResult().getAllCell()
                      where x.getExtendDirection() != CellReport.cell.Direction.none
                      select new { band = ((CellReport.cell.ExtendCell)x).getRangeOfGroup(), level = x.getCalcLevel(), gridName = x.getGrid().Name };
            var env = report.getEnv();

            return ((
                from x in b_l
                select new
                {
                    x.level,
                    x.gridName,
                    s_row = x.band.getRow() - 1,
                    e_row = x.band.getEndRow() - 1,
                    s_col = x.band.getColumn() - 1,
                    e_col = x.band.getEndColumn() - 1
                }
            ).ToList(),
            new Dictionary<String, String>((from x in env.TemplateGet("out_keys").Split(",") select new KeyValuePair<string, string>(x, env.TemplateGet(x))))
            );
        }

        public async Task<IActionResult> grid_range_level(String content, string reportName)
        {
            return Json((await range_level(content, reportName)).range_level);
        }
        class MyFileInfo
        {
            public MyFileInfo(String local_name)
            {
                this.local_name = local_name;
            }
            private string local_name;
            public String FileName { get; set; }
            public String Directory { get; set; }
            public String FullPathFileName { get; set; }
            public bool isFile { get; set; }
            public String LastAccessTime { get; set; }
            public String LastWriteTime { get; set; }
            public long Length { get; set; }
            public string Img
            {
                get
                {
                    if (isFile == true && new FileInfo(local_name + ".jpg").Exists)
                        return Convert.ToBase64String(System.IO.File.ReadAllBytes(local_name + ".jpg"));
                    else
                        return "";
                }
            }
            public bool _menu { get; set; } = false;
            public List<MyFileInfo> children { get; set; }
        }
        public IActionResult List(String loc_path = ".")
        {
            loc_path = Path.Combine(this.rpt_group.report_path, loc_path);
            if (!loc_path.StartsWith(this.rpt_group.report_path))
                return Json(new { errcode = 1, message = "路径错误" });

            //List<MyFileInfo> ret = new List<MyFileInfo>();
            DirectoryInfo parent = new DirectoryInfo(loc_path);
            int len = this.rpt_group.report_path.Length;
            var ret = new MyFileInfo(loc_path);
            ret.Directory = parent.FullName.Substring(len);
            ret.children = new List<MyFileInfo>();
            if (!parent.Exists)
                return Json(ret);
            //遍历文件夹
            foreach (DirectoryInfo NextFolder in parent.GetDirectories())
            {
                ret.children.Add(new MyFileInfo(NextFolder.FullName)
                {
                    FileName = NextFolder.Name,
                    FullPathFileName = NextFolder.FullName.Substring(len + 1).Replace("\\", "/"),
                    isFile = false
                });
            }
            //遍历文件
            foreach (FileInfo NextFile in parent.GetFiles("*.cr"))
                ret.children.Add(new MyFileInfo(NextFile.FullName)
                {
                    FileName = NextFile.Name,
                    FullPathFileName = NextFile.FullName.Substring(len + 1).Replace("\\", "/"),
                    LastAccessTime = NextFile.LastAccessTime.ToString("s"),
                    LastWriteTime = NextFile.LastWriteTime.ToString("s"),
                    Length = NextFile.Length,
                    isFile = true,
                });
            var options = new JsonSerializerOptions();
            options.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;

            return Json(ret, options);
        }
        public IActionResult ListForAllGroup()
        {
            //Request.HttpContext.Connection.RemoteIpAddress.ToString();
            //HttpContext.RequestServices.GetService(typeof(Pages._Pages_Default));
            HttpContext.GetEndpoint();
            var userid = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value;
            var ret = //(from x1 in this.reportDb.Rpt_group where x1.owner==userid || x1.members.Contains(userid) select x1);
            reportDb.Query("Rpt_group").Where(new { owner = userid }).OrWhereContains("members", userid).Get();
            return Json(ret, json_option);
        }
        public IActionResult getAllWidget(string action)
        {
            var userid = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value;
            var file_path = Path.Combine(Environment.CurrentDirectory, "widgets", userid + ".json");
            String self_txt = "{}";
            if (System.IO.File.Exists(file_path))
                self_txt = System.IO.File.ReadAllText(file_path, encoding: Encoding.UTF8);

            var admin_file_path = Path.Combine(Environment.CurrentDirectory, "widgets", "admin.json");
            string admin_txt = "{}";
            if (userid != "admin" && System.IO.File.Exists(admin_file_path))
                admin_txt = System.IO.File.ReadAllText(admin_file_path, encoding: Encoding.UTF8);

            return Json(new { admin_json = JsonDocument.Parse(admin_txt), self_json = JsonDocument.Parse(self_txt) }, json_option);
        }
        public IActionResult saveWidget(string txt)
        {
            var userid = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "userid").Value;
            var file_path = Path.Combine(Environment.CurrentDirectory, "widgets", userid + ".json");
            System.IO.File.WriteAllText(file_path, txt, encoding: Encoding.UTF8);
            return Json(new { errcode = 0, message = "" });
        }
        public IActionResult getKeyAndLicese()
        {
            //var tMachine_key = CellReport.util.KeyAndPassword.getMachine_key();
            //var ccc = CellReport.util.EncryptHelper.AES_Encrypt(tMachine_key, "CellReport");

            return Json(new { errcode = 0, message = "" });
        }
        public IActionResult getImgFileList(string path)
        {
            if (path.Contains(".") || path.Contains("/") || !Path.Combine(this.reportGrp.WebHostEnvironment.WebRootPath, "img", path).StartsWith(reportGrp.WebHostEnvironment.WebRootPath))
                return Json(new { errcode = 1, message = "非法地址" });
            var ret = new List<string>();
            var sourceDirectory = Path.Combine(this.reportGrp.WebHostEnvironment.WebRootPath, "../static", path);
            foreach (var one in Directory.EnumerateFiles(sourceDirectory))
            {
                string fileName = one.Substring(sourceDirectory.Length + 1);
                ret.Add("static/" + path + "/" + fileName);
            }

            return Json(new { errcode = 0, data = ret, message = "成功" }); ;
        }
        public IActionResult putFile(IFormFile file, string file_type)
        {
            string static_path = configuration["static_path"];
            if (String.IsNullOrEmpty(static_path))
                static_path = Path.Combine(reportGrp.WebHostEnvironment.WebRootPath, "../static");
            if (!(new DirectoryInfo(static_path).Exists))
            {
                Directory.CreateDirectory(static_path);
            }
            var currentDate = DateTime.Now;
            var webRootPath = Directory.GetCurrentDirectory();//获取项目路径
            try
            {
                if (!Directory.Exists(Path.Combine(static_path, file_type)))
                {
                    Directory.CreateDirectory(Path.Combine(static_path, file_type));
                }
                if (file != null)
                {
                    var fileSize = file.Length;
                    //判断文件大小
                    if (fileSize > 1024 * 1024 * 10) //10M TODO:(1mb=1024X1024b)
                    {
                        return new JsonResult(new { errcode = 1, message = "上传失败，文件大小超过范围" });
                    }
                    var completeFilePath = Path.Combine(static_path, file_type, file.FileName);
                    //文件保存
                    using (var fs = System.IO.File.Create(completeFilePath))
                    {
                        file.CopyTo(fs);
                        fs.Flush();
                    }
                    //完整的文件路径

                    return new JsonResult(new { errcode = 0, message = "上传成功", url = "static/" + file_type + "/" + file.FileName });
                }
                else
                {
                    return new JsonResult(new { errcode = 1, message = "上传失败，未检测上传的文件信息~" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    isSuccess = false,
                    resultMsg = "文件保存失败，异常信息为：" + ex.Message
                });
            }
        }

    }
}
