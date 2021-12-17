using CellReport.core.expr;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Security.Cryptography;

namespace CellReport.function
{
	public class Func_md5 : FunctionUnit
	{
		public override Object calculate(IList args)
		{
            if (args.Count > 1 || args.Count == 0)
                throw new CellReport.core.ReportRuntimeException("参数不对！");
            Object expr = args[0];

            Object ret_obj = calcExpr(expr);
            String expr_value = this.getValue(ret_obj).ToString();
            return md5(expr_value);
		}
        public static string md5(string str)
        {
            try
            {
                MD5 md5 = MD5.Create();
                byte[] bytValue, bytHash;
                bytValue = System.Text.Encoding.UTF8.GetBytes(str);
                bytHash = md5.ComputeHash(bytValue);
                md5.Clear();
                string sTemp = "";
                for (int i = 0; i < bytHash.Length; i++)
                {
                    sTemp += bytHash[i].ToString("X2");
                }
                str = sTemp.ToLower();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return str;
        }
    }

}
