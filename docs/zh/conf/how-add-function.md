# 自定义函数 
## 内置语言制作自定义函数
如果某函数只在某报表中使用一次，而且相对实现比较简单，我们可以直接在报表中定义。点《记事》->《后端运行的脚本》中，添加，例如，下面是计算某值的一个特殊要求的百分比：
```js
function percent(val,比例){
    return val-formatNumber( val *  比例 ,'0') + 1;  
}

```
定义好后，我们就可以在单元格中直接使用了。

我们也可以在目录的自定义模板中添加自定义函数。这样该目录下的所有报表就都可以使用该函数了。

## c#语言写的自定义函数
::: tip
每个自定义函数都是一个必须继承`CellReport.core.expr.FunctionUnit` 的class，该class的名字必须以Func_开头。
:::
例子：
```csharp
using System;
using System.Collections;
namespace CellReport.function
{
    public class Func_test : FunctionUnit
    {
        public override Object calculate(IList args)
        {
            int args_count = args.Count;
            if (args_count < 3 || args_count % 2 == 0)
                throw new CellReport.core.ReportRuntimeException("test参数数目不对！应该为2N+1个。");
            Object obj;
            object target_expr;
            for (int i = 0; i < args_count - 1; i += 2)
            {
                object case_expr = args[i];
                obj = calcExpr(case_expr);
                if (obj is Boolean && (System.Boolean)obj == true)
                {
                    target_expr = args[i + 1];
                    return calcExpr(target_expr);
                }
            }
            target_expr = args[args.Count - 1];
            return calcExpr(target_expr);
        }
    }
}
```

- 这个函数是报表中iif函数的实现。
解释：
- `calculate(List args)` 在报表中使用的参数，都是打包到类型为List的 args中。类型为内部的表达式类型，不要对该参数做修改。需要计算某个参数的值时，使用类似这样的函数调用来计算该表达式的值： `calcExpr(target_expr)`。
- 父类FunctionUnit中定义了很多常用的成员。

| 成员 | 解释 |
| ---- | ---- |
| exprFaced | 计算表达式所使用成员 |
| ds_map | 当前单元格所使用的数据集的集合 |
| current_cell | 当前单元格 |
| exprTree | 当前表达式树 |

- 可以使用exprTree 来自己分析解释执行。通常用不到这个功能
~~~csharp
if(this.exprTree.Children[1].GetChild(0).Type != ExprLexer.ID)
	throw new ReportRuntimeException("参数不对！");
~~~

**将自定义函数添加到执行环境**
在`startip.cs`中的函数`public void ConfigureServices(IServiceCollection services)`中添加以下代码：
~~~csharp
CellReport.core.expr.ExprHelper.AddFunc(typeof(CellReport.function.Func_test));
~~~

现在我们就可以在报表中使用这个test函数了。