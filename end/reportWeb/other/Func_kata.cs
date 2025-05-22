using CellReport.core.expr;
using System;
using System.Collections.Generic;
using System.Collections;
using SqlKata;
using SqlKata.Execution;
using System.Data.SqlClient;
using CellReport.running;
using System.Data.Common;
using SqlKata.Compilers;
using System.Reflection;
using System.Linq;
using System.Collections.Concurrent;
using Dapper;

namespace CellReport.function
{
    public class Func_kata_Variable : FunctionUnit
    {
        public override Object calculate(IList args)
        {
            if (args.Count == 0)
                throw new CellReport.core.ReportRuntimeException("kata至少需要一个参数！");
            object expr = args[0];
            var ret_obj = calcExpr(expr)?.ToString();
            return new Variable(ret_obj);
        }
    }
    public class CrQueryFactory : QueryFactory, IDisposable
    {
        public RunReportDataSourceInfo CurrentDataSourceInfo { get; private set; }
        public CrQueryFactory(DbConnection cur_connection, Compiler compiler, RunReportDataSourceInfo CurrentDataSourceInfo) : base(cur_connection, compiler)
        {
            this.CurrentDataSourceInfo = CurrentDataSourceInfo;
        }
        public void close()
        {
            base.Dispose();
            CurrentDataSourceInfo.datasource_stat = "关闭";
            //this.close();
        }
        public new void Dispose()
        {
            close();
        }
    }
    public class Func_kata : FunctionUnit
    {
        static Func_kata()
        {
            ExprHelper.AddCSFuncOperator("kata", DirectCallObjectMethod);
        }
        RunReportDataSourceInfo CurrentDataSourceInfo = new();
        public override SqlKata.Execution.QueryFactory calculate(IList args)
        {
            if (args.Count == 0)
                throw new CellReport.core.ReportRuntimeException("kata至少需要一个参数！");
            object expr = args[0];
            Object ret_obj = calcExpr(expr);
            DatasourceStruct ds_struct;
            if (ret_obj is CR_Object cr_obj)
            {
                ds_struct = new();
                ds_struct.ds_link = cr_obj["db_link"].ToString();
                ds_struct.ds_type = cr_obj["ds_type"].ToString();
                ds_struct.name = "动态指定：" + ds_struct.ds_type;
            }
            else
                ds_struct = (DatasourceStruct)(getEnv().getDataSource(ret_obj.ToString()));
            if (ds_struct == null)
                throw new core.ReportRuntimeException($"没有找到数据源：【{ret_obj}】，查看报表组和数据源名称是否正确。");
            var ds_type = ds_struct.ds_type;
            if (args.Count > 1)
                ds_type = calcExpr(args[1])?.ToString();

            SqlKata.Compilers.Compiler compiler = null;
            switch (ds_type.ToLower())
            {
                case "sqlserver":
                case "sqlclient":
                    compiler = new SqlServerCompiler();
                    break;
                case "oracle":
                    compiler = new OracleCompiler();
                    break;
                case "npgsql":
                    compiler = new PostgresCompiler();
                    break;
                case "mysql":
                    compiler = new MySqlCompiler();
                    break;
                case "sqlite":
                case "microsoft.data.sqlite":
                    compiler = new SqliteCompiler();
                    break;
                default:
                    throw new core.ReportRuntimeException($"sqlKata没有{ds_type}对应的编译器。");
            }
            DbConnection cur_connection = getEnv().getConnection(ds_struct, "来自于openDb的临时数据集");
            var queryFactory = new CrQueryFactory(cur_connection, compiler, CurrentDataSourceInfo);
            CurrentDataSourceInfo.ds_name = "kata函数";
            CurrentDataSourceInfo.datasource_name = ds_struct.name;
            CurrentDataSourceInfo.datasource_stat = "预打开";
            this.getEnv().CurrentRunReportInfo.DataSourceInfoBag.Add(CurrentDataSourceInfo);
            this.getEnv().Disposables.Add(queryFactory);
            var logger = (exprFaced.getVariable("__env__") as Env).logger;
            queryFactory.Logger = compiled =>
            {
                queryFactory.CurrentDataSourceInfo.datasource_stat = "执行";
                queryFactory.CurrentDataSourceInfo.sql = compiled.ToString();
                logger.Debug("kata sql:" + compiled.ToString());
            };
            //queryFactory.Connection.Query("sql").ToList();
            //db.Query("Users").Get();
            //db.Query("Books").Where().OrderBy("Date").Paginate(1)
            return queryFactory;
        }
        private static Type extend_type;

        public static (bool, bool, object) DirectCallObjectMethod(Object obj, string methodName, object[] methodParams, BaseExprFaced exprFaced = null, bool alreadyCalc = false)
        {
            if (obj is not SqlKata.Execution.XQuery)
                return (false, false, null);
            if (extend_type == null)
            {
                extend_type = ExprHelper.findClass("SqlKata.Execution.QueryExtensions", false);// ;
                if (extend_type == null)
                    throw new core.ReportRuntimeException($"找不到SqlKata.Execution.QueryExtensions类型。");
            }
            int i = 0;
            if (exprFaced != null && obj is not GroupReturnList)//&& obj is not Group
                foreach (var one in ExprHelper.convertListRealValueToNetType(exprFaced, methodParams, alreadyCalc))
                {
                    if (one is IDictionary par_dic)
                    {
                        Dictionary<String, object> new_dic = new();
                        foreach (var x in par_dic.Keys)
                        {
                            new_dic.Add(x.ToString(), par_dic[x] is CellReport.math.BigDecimal val_dec ? ((float)val_dec.getCSDecmial()) : par_dic[x]);
                        }
                        methodParams[i] = new_dic;
                    }
                    else
                    if (one is not string && one is IEnumerable par_list)
                    {
                        foreach (var x1 in par_list)
                        {
                            //if (x1 is not string && x1 is IDictionary child_list2)
                            //{
                            //    List<KeyValuePair<String, object>> new_dic = new();
                            //    foreach (Dictionary<object, object> x2 in par_list)
                            //    {
                            //        KeyValuePair<String, object> t_list = new();
                            //        new_dic.Add(t_list);
                            //        foreach (var x3 in x2)
                            //        {
                            //            t_list.Add(new KeyValuePair(x3.Key.ToString(), x3.Value is CellReport.math.BigDecimal val_dec ? val_dec.getCSDecmial() : x3.Value));
                            //        }
                            //    }
                            //    methodParams[i] = new_dic;
                            //}
                            //else 
                            if (x1 is not string && x1 is IEnumerable child_list)
                            {
                                List<List<Object>> new_dic = new();
                                foreach (IEnumerable x2 in par_list)
                                {
                                    List<Object> t_list = new();
                                    new_dic.Add(t_list);
                                    foreach (var x3 in x2)
                                    {
                                        t_list.Add(x3 is CellReport.math.BigDecimal val_dec ? val_dec.getCSDecmial().ToString() : x3?.ToString());
                                    }
                                }
                                methodParams[i] = new_dic;
                            }
                            else
                            {
                                List<String> new_dic = new();
                                foreach (var x in par_list)
                                {
                                    new_dic.Add(x is CellReport.math.BigDecimal val_dec ? val_dec.getCSDecmial().ToString() : x?.ToString());
                                }
                                methodParams[i] = new_dic;
                            }
                            break;
                        }

                    }
                    else
                        methodParams[i] = one;
                    i++;
                };
            var ret = ExprHelper.CallObjectMethod_for_extendClass(extend_type, obj, methodName, methodParams, exprFaced, alreadyCalc);
            return (ret.Item1, true, ret.Item3);
        }

    }
}
