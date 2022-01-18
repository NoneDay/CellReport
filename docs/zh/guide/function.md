# 内置函数

## 数据集函数

### group 分组

函数说明：
根据分组表达式，从数据集中选出符合过滤条件的一组组集。

~~~
    datasetName.group( select_exp,[filter_exp] )
      参数说明：
      select_exp：	选出的分组表达式，可以是字段列名。
      当然也可以是表达式
      filter_exp: 	数据过滤表达式。

      函数示例：
      ds1.group( ds1.name )
      从数据源ds1中选取name字段，并按照name列进行分组，取出每一组第一条记
      录的name字段的值, 不排序

      ds1.group( ds1.name,ds1.sex=='1').asc()
      从数据源ds1中选取性别为男性的name字段列的值并升序排列，然后按照name
      字段进行分组，取出每一组第一条记录的name字段的值

      ds1.group( ds1.name, ds1.sex=='1').desc(ds1.id)
      从数据源ds1中选取性别为男性的name字段列的值并按id字段降序排列

      返回值：
      一组数据的集合，该集合供子格计算的时候使用
~~~    
### select 清单 
类似sql语句中的select，返回指定数据集的行集。每一行的值是selcet_expr的计算结果.
~~~
ds.select(select_expr[,cond_expr])

ds1.select(ds1.first_name + ds1.last_name)

返回值：
      一组数据的集合，该集合供子格计算的时候使用
~~~      

### 唯一值计数 distinct\_count
```
 distinct_count(select_expr[,cond_expr])
```    
### 求和 sum
```
datasetName.sum( select_exp,[filter_exp] )
    ds.sum(被累加的表达式，条件)
    满足条件的数据集中的被累加的表达式的求和
    
    根据左顶格和上顶格所拥有的数据集的交集，计算当前单元格的值。下同，不再说明
```

### 最大值 max

    ds.max( select_exp,[filter_exp] )
    ds.sum(被计算的表达式，条件)
    满足条件的数据集中的被累加的表达式的求最大

### datasetName.min( select_exp,[filter_exp] )

      ds.min(被计算的表达式，条件)
      满足条件的数据集中的被累加的表达式的求最小

### datasetName.avg( select_exp,[filter_exp] )

      ds.avg(被计算的表达式，条件)
      满足条件的数据集中的被累加的表达式的求平均

### datasetName.select1( select_exp,[filter_exp] )
    当前分组中符合条件的第一条数据

### datasetName.colcount()

    函数说明：
    数据集的列数
    语法：
    datasetName.cols()

### datasetName.count(filter_exp)
      ds.count(条件)
      满足条件的数据集中的个数

### datasetName.colName(col_pos)
      
      数据集的第col_pos列的名字

### datasetName.valueForColName()

      函数说明：
      取数据集的列
      datasetName.valueForColName( stringExp )
      datasetName.valueForColName( intExp )
      参数说明：
      stringExp 	返回数据集列名的表达式
      intExp		返回数据集列号的表达式

### getDataSourceName()

      函数说明：
      取数据集的的数据源名称
      语法：
      datasetName.getDataSourceName( )

## 集合函数 
::: tip    
    计算统计报表的时候，最常用的函数
    数据集的group、select以及下面列出的所有集合函数后可以跟：
    //.where(expr) 条件判断 ,通常用不到这个函数
    //.asc(expr) 升序 不跟参数的时候，就是以当前值做排序
    //.desc(expr) 降序 不跟参数的时候，就是以当前值做排序
    //例如:
    ds.group(ds.key).asc()

    union_set(ds.group(ds.key),
        ds2.group(ds2.key))
    .asc()
:::
### 并集 union_set

      使用方法：union_set([ds.group(ds.key)]+ )
      对各分组集合的ds.key求并集
- **可以对任意多的分组做并集。**
- 该函数应用在多数据集的报表中，能够极大的加快报表的开发速度。在数据集做完归并后，相应的子单元格都可以正确引用到归并后的各个数据集中的数据。
- 举例：`union_set(ds1.group(ds1.id),ds2,group(ds2.id))`
ds1数据集分组后的数据为:                

| id |	
| ------ | 
| 1 |
| 2	|	
ds2数据集分组后的数据为: 
| id |	
| ------ | 
| 2 |
| 3	|

这两个集合的并集为：`1，2，3`
在某单元格使用该函数后，报表运算后，从该单元格扩展出3个单元格。

| 单元格行号 | 对应的Ds1的数据分组 | 对应的Ds2的数据分组 | 子格运算公式	运算结果 | 
| ------ | ------ |------ |------ |------ |------ |
|  | | | =ds1.id+ds2.id |
| 1 | 1 | 空 | 1 |
| 2 | 2 | 2 |	4 | 
| 3 | 空 | 3 |	3 |

### 交集 intersection_set

      使用方法：intersection_set([ds.group(ds.key)]+, (sort)? )
      对各分组集合的ds.key求交集

### 差集 subtract_set

      使用方法：subtract_set([ds.group(ds.key)]+, (sort)? )
      以第一个分组为主集合，减去其他各集合的元素

### 左外连接 leftJoin_set

      leftJoin_set([ds.group(ds.key)]+, (sort)? )
      以第一个分组为主集合，将后续集合按关键字合并。这个函数将会完全保留主数据集中的所有数据，不管关键字是否重复。
      其他集合函数

::: tip
除了leftJoin_set，其他集合函数都要保证每个数据集的计算结果是唯一的。只有leftJoin_set 的第一个主数据集的计算结果可以不唯一。其他集合的数据集计算如果使用select，需要自行保证计算结果唯一，否则最终结果在做完集合运算后可能不正确。
:::

## 集合运算后可接函数
### asc()
对已经生成的列表做升序计算。如果没有参数，将按集合元素的value计算顺序，有参数就按参数计算结果计算顺序
``` csharp
=union_set(ds1.group(ds1.key),ds2.group(ds2.key)).asc()
=ds1.group(ds1.key).asc()
```
### desc()
对已经生成的列表做降序计算

### where()
对已经生成的列表做降序计算
``` csharp
=union_set(ds1.group(ds1.key),ds2.group(ds2.key)).where(ds1.xx==2)
=ds1.group(ds1.key).where(@value>100)
```
### to_dict()
将当前生成的列表转换为字典，主键为元素的值
主要使用在自定义函数中，对数据集做进一步计算。如查找
``` js
var ds_dict;//定义一个全局变量
//在所有数据集取数结束，计算报表的单元格前，将会自动调用这个函数
function _after_calc_dataset_(){
   ds_dict=ds.group(ds.订单ID).to_dict();  //字典的key是订单ID，value是group,group.rows是所有订单ID相同的行组成的列表
}

function 订单ID_count(订单ID,rowno){
  var _yc=ds_dict[订单ID]; 
  if(_yc==null)
      return null;
  //查找`订单ID`对应的group对应有多少条数据
  return _yc.count();
  // 也可以加条件，注意条件里面的数据集名称要和 函数前的一样。_yc.count(_yc.rowno<=rowno);
  //                                                    ^          ^

  //下面是类似sql中的row_number功能的实现。rowno是原始数据中存放的行号，通过判断行号是否相等来判断是否是同一条数据
  //当然这样的实现很丑陋，但这仅仅是一个功能演示。_yc.count(_yc.rowno<=rowno)也可以实现类似功能
  var idx=0;
  for(var t in _yc){
    idx=idx+1;
    if(t.rowno==rowno)
  	  return idx;  
  }
}
```
做好预定义后，我们可以在单元格中引用该函数
``` js
=订单ID_count(ds.订单ID)//计算某个订单号有几条记录
```
::: tip
单元格计算中，不能使用变量数据集。变量数据集只能在自定义函数中使用。
:::

## 单元格函数
### ifEmpty(,)

      函数说明：
      从前往后，参数如果不为null或空字符串，就返回当前参数值，如果都是为空，就返回""
      语法：
      ifEmpty(ValueExp1, ValueExp2,..... )

  ### iif(,,)

      函数说明：
      根据布尔表达式的不同结果，返回不同的值
      语法：
      iif( (条件, 结果,)+,falseValueExp)
      ***条件结果对*** 可以无限多，找到的第一个条件成立时，返回紧跟其后的结果

    例子：iif（param.xxx=='1','x1',param.yyy==2,'x2','x3')
      解释：当param.xxx==1时,返回 'x1'，param.yyy==2时，返回 'x2'，否则返回'x3'
      优先判断前面的条件

### sum(expr)
    如果参数是集合类型，将对其做累加，其他类型不计算，直接返回
### max(expr)
    如果参数是集合类型，将对其计算最大值，其他类型不计算，直接返回
### min(expr)
    如果参数是集合类型，将对其计算最小值，其他类型不计算，直接返回
### avg(expr)
    如果参数是集合类型，将对其做累加后计算平均值，其他类型不计算，直接返回
### desc_rank()
    参数必须是单元格名称，现在只对只有一个行扩展的情况有效。
    按降序排名。 数字最大的是第一名。 参数填对应单元格。如：第1名有2个重复，下一个名次是3
### asc_rank()
    参数必须是单元格名称，现在只对只有一个行扩展的情况有效。
    按升序排名。数字小大的是第一名。参数填对应单元格。如：第1名有2个重复，下一个名次是3 
### desc_dense_rank()
    参数必须是单元格名称，现在只对只有一个行扩展的情况有效。
    按降序做密集排名。数字最大的是第一名。参数填对应单元格。如：第1名有两个重复，下一个名次是2 
### asc_dense_rank()
    参数必须是单元格名称，现在只对只有一个行扩展的情况有效。
    按降序做密集排名。数字最小的是第一名。参数填对应单元格。 名次是连续的，如：第1名有两个重复，下一个名次是2  

### fromto(,)

    fromto(开始值，结束值，步长）
    如：fromto(1,20) 缺省步长为1
    fromto(1,20,2)
    通常我们在计算补齐数据的时候使用它作为数据集来计算连续数据，从而达到补齐效果
### row()

    函数说明：
    取得当前格所有行的行号

### col()

    函数说明：
    取得当前单元格所在列的列号

### cellColName()

      函数说明：
      取得当前单元格所在列的列名
      语法：
      cellColName()

### query(,)

      query(数据库连接名字,sql语句)

### range_count(,)

      range_count(单元格列表,值1,是否相等,值2,是否相等)
      单元格列表中 大于值1 小于 值2的有多少个
      是否相等：缺省为相等


### @vaule
    本单元格的实际值

### floor()

      取带小数点的数字的地板值
      floor(3.5)=4

### ceiling()

      取带小数点的数字的天板值
      ceiling(3.5)=3
  

## 日期函数
### date(,,)

      使用方法：date(year,month,day)
      例如 date(2021,12,1) 结果就是2021年12月1日

### .AddDays()

      必须是日期型变量才能使用
      使用方法：date(2014,1,2).AddDays(-1)
      结果：2014-1-1

### .AddMonths()

      必须是日期型变量才能使用
      使用方法：date(2014,2,2).AddMonths(-1)
      结果：2014-1-2

### .AddYears()

      必须是日期型变量才能使用
      使用方法：date(2014,2,2).AddYears(-1)
      结果：2013-2-2

###    today()
  当天  
### prevDay()
  昨天  
  **以下函数如果没有参数，就是以当前日期计算，有的话就是按指定日期开始计算**
### firstDayOfYear()
  指定日期的当年第一天  
### prevMonth()
  上月同一天  
### prevYear()
  上年同一天  
### quaterEnd()
  本季度最后一天  
### quaterBegin()
    本季度第一天   
### monthEnd()
  本月最后一天  
### monthBegin()
 本月第一天   
### weekBegin()
  本周第一天  
### weekEnd()
 本周最后一天   
### weekNum()
 星期几   
### year()
  年  
### quater()
  季度  
### month()
  月  
### dayOfYear()
 本年的几天   
### dayOfMonth()
 本月的几天   
### hour()
 24小时制的小时   
### minute()
 分钟   
### second()
 秒   
### formatDatetime()

    格式化日期
    G 年代标志符   y 年   M 月   d 日
    h 时 在上午或下午 (1~12)   H 时 在一天中 (0~23)
    m 分   s 秒   S 毫秒   E 星期   D 一年中的第几天
    F 一月中第几个星期几   w 一年中第几个星期   W 一月中第几个星期
    a 上午 / 下午 标记符   k 时 在一天中 (1~24)
    K 时 在上午或下午 (0~11)
    z 时区

    缺省格式为：yyyy-MM-dd
    如果第一个参数不是日期类型，那么将使用缺省格式分析该字符串，将之装换为日期后再格式化
    举例：formatDatetime('2007-01-01','yyyy年MM月dd日HH时mm分ss秒')
    formatDatetime('2007-01-01')

  
## 字符串函数
### replaceStr(,,)

      query(源字符串,被替换字符串,替换字符串)

### substring(,,)

      substring(源字符串,开始位置,结束位置)

### length()

      length(字符串) 字符串长度

### indexof(,,)

      indexof(目标字符串,被查找字符串,(开始查找的位置)?)

### isEmpty()

      isEmpty(目标)
      如果目标为NULL返回true
      如果不是字符串,做toString()后作为字符串判断
      如果是字符串，且等于"",返回true
   
### formatNumber()

      格式化数字。
      缺省格式：###########0.##
      如： formatNumber(1234.567) 输出为 1234.57
      如要指定格式，在第二个参数写格式。
      如：formatNumber(1234,567,"#####.0000")输出为：1234.5670
