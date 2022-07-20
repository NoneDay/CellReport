using CellReport.core.expr;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Security.Cryptography;

namespace CellReport.function
{
	public class Func_randon : FunctionUnit
	{
		public override Object calculate(IList args)
		{
            int max = System.Int32.MaxValue, min = 0;
            switch (args.Count)
            {
                case 2:
                    max = int.Parse( calcExpr(args[1]).ToString());
                    
                    goto case 1;
                case 1:
                    max = int.Parse(calcExpr(args[0]).ToString());
                    break;
                case 0:
                    break;
                default:
                    throw new CellReport.core.ReportRuntimeException("参数不对！");
            }
            Object expr = args[0];
            return Random.Shared.Next(min, max);            
		}
    }

}
