# 内置语言

- 内置语言的语法类似js。
  
## 基础数据类型
  - 数字: 如：1   1.2
  - 日期时间 如： 2021-10-10
  - 字符串 可以用单引号包起来，也可以用双引号包记起来，如：'hello' "hello"
  - 数组/列表 如：[ ] 空数组 [1,2] ["hello","world"] [1,"hello"]
  - 字典 如：{ } 空字典 或：{"k1":"hello","k2":"world"}
~~~js
1.2 //数字
date(2012,10,1) //日期
"hello" //字符串
'world' //字符串
["hello","world"] //数组/列表
{"k1":"hello",k2:"world"} //字典
~~~

## 基础运算 
::: tip
null 空在和数字做运算时当做0，和字符串做运算时当做空字符串''
:::
~~~ js
// 
//加法  
    =1+2 // 3
    ="hello" + " CellReport" // hello CellReport
    =123+ null // 123
    ="hello" + null // hello
    ="hello" + 123 // hello123
    =123 + "hello"  // 123hello
    =[1,2.3,4] +[5,6] //
    
// 除法。报表中经常会遇到除零或null，内置计算是直接返回0
    1/2     // 0.5
    123/0     // 0
    123/null // 0

    - * / % 
~~~
- 逻辑判断 ：
~~~   
   >   >=   <   <=  ==
~~~   
- 关系运算：
~~~js
 && 逻辑与
 ||  或
 and  与 // 兼容 sql 的写法
 or 或 // 兼容 sql 的写法
 ''|| false|| null|| 'A'  // A
 '' and false and  null and 'A'  // false
  'A' and    'B' // B
  
 in 在后续列表的值里面 
 not  in 不在后续列表的值里面
 var aaa='a2'
aaa in ['a1','a2'] // true
aaa in ('a1','a2') // true 兼容 sql 的写法
aaa not in ['a1','a2'] // false
aaa not in ('a1','a2') // false 兼容 sql 的写法

~~~

### 扩展运算符（...）
``` js
trace("{a:1, ...{b:2} }====>",{a:1, ...{b:2} });  // {"a":1,"b":2}
{a:1, ...{a:3,b:2} } ; //{"a":3,"b":2}
[...[1,1+2],4] // [1,3,4]
```

### 语句规范
::: warning
  
  普通单独语句必须以分号结束，for 、function 等语句块 后不跟分号
:::
### 变量定义
~~~js
var my_test_1="22";//必须以var 开始
~~~



### 条件语句 if
~~~js
if(param.b_date=='2022-01-01')
    return '2022元旦';
else    
    return '不是2022元旦';
~~~

### 循环for
~~~js
var lj_sum=0;
for(var i=0;i<10;i++){
    lj_sum=lj_sum+i;
}
//对数组循环
foreach(var one in [1,2,3]){

}
// ds是数据集的名称
foreach(var one in ds){
    __env__.logger.Info(ds.xxx);
}
~~~

### 函数定义
~~~js
function hello(p){
    return "hello "+p;
}
// 可以函数嵌套
function func_parent(p){
    function hello(p){//内部嵌套的函数，出了func_parent后无效
        return "hello "+p;
    }
    return hello(p);
}
~~~


## 后端linq 

\$ 表示循环变量。通常参数都是lambda 函数。集合运算函数中不支持
绝大部分函数都是延迟计算。

### All(判断函数)
确定序列中的所有元素是否都满足条件。
参数: 用于测试每个元素是否满足条件的函数。
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.all(x=>x<11);//true
test_arr.all(x=>x<3);//false
```

### Append()
添加一个元素。不影响原有的列表
``` js
var test_arr=[1,2,3];
var sencond=test_arr.Append(4);// [1,2,3,4]

```

### Any(判断函数)
确定序列中是否存在元素满足指定条件。
参数: 用于测试每个元素是否满足条件的函数。
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.any(x=>x<1);//false
```
### Count()
序列计数。
如果没有参数，然后序列元素的个数
如果包含参数，这个参数需要是一个 用于测试每个元素是否满足条件的函数，最终返回满足判断函数的元素个数。
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.Count();// 10
test_arr.Count(x=>x>8);// 2
```

### Concat()
连接多个序列
``` js
[1,2,3].Concat([2,3,4]) ;// [1,2,3,2,3,4]
[1,2,3].Concat([2],[3,4]) ;// [1,2,3,2,3,4]
```

### Contains()
是否保含元素。
如果只有一个参数，使用缺省判断函数测试是否包含这个参数
如果两个参数，第二个参数是用于判断是否相等的函数，使用这个判断函数测试是否包含这个第一个参数
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.Contains(2);// true
var arr2 = [{Name:"A", 'Val':1}, {'Name':"B", 'Val':2}]; 
var res2 = arr2.contains({'Name':"C", 'Val':2}, (a, b)=>{ return a.Val == b.Val; }) ;  //  true
```

### Distinct()
是否保护元素。
如果没有参数，通过使用默认的相等比较器对值进行比较，返回序列中的非重复元素。
如果一个参数，这个参数是用于判断是否相等的函数，使用这个判断函数比较器对值进行比较，返回序列中的非重复元素。
``` js
trace('[1,2,1,3].distinct()',[1,2,1,3].distinct()); //[1，2，3]
[{Name:"A", Val:1}, {Name:"B", Val:1}].distinct((a, b)=>{ return a.Val == b.Val; });//{Name:"A", Val:1}
```

### First()
返回第一个元素。
如果没有参数，返回第一个元素。
如果一个参数，第一个参数是用于判断条件是否成立的函数，返回满足条件的第一个元素
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.First(x=>x>8);//10
test_arr.First();//4
```

### Last()
返回最后一个元素。
如果没有参数，返回最后一个元素。
如果一个参数，第一个参数是用于判断条件是否成立的函数，返回满足条件的最后一个元素,如果没有，就返回null
如果有第二个参数，这个参数是用于返回没有last元素时应该返回的值
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.Last(x=>x<4);//1
test_arr.Last();//9
test_arr.Last(x=>x>14 , -1); // 由于没有满足条件的元素，所以返回 -1
```

### Where(判断函数)
基于谓词筛选值序列。
参数: 用于测试每个元素是否满足条件的函数。
``` js
var test_arr=[4,2,3,1,5,7,6,8,10,9,];
test_arr.where(x=>x>8);//[10,9]
```

### max()
如果有第一个参数，这个参数是返回key函数，最终返回最大的key 值。如果没有参数，就按元素本身比较
``` js

var arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
var max1 = arr.max();  // 8 

var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
var max2 = arr2.max(function(t){ return t.Val });   // 2 
```

### min()
如果有第一个参数，这个参数是返回key函数，最终返回最小的key 值。如果没有参数，就按元素本身比较
``` js
var arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
var min1 = arr.min();  // 1 

var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
var min2 = arr2.min(function(t){ return t.Val });   // 1 
```

### MaxBy()
第一个参数是返回key函数，最终返回最大的key 值对应的元素
``` js
var arr2 = [{Name:"A", 'Val':1}, {'Name':"B", 'Val':2}]; 
trace('MaxBy(x=>x.Val)',arr2.MaxBy(x=>x.Val));//{'Name':"B", 'Val':2}
```

### MinBy()
第一个参数是返回key函数，最终返回最小的key 值对应的元素
``` js
var arr2 = [{Name:"A", 'Val':1}, {'Name':"B", 'Val':2}]; 
trace('MinBy(x=>x.Val)',arr2.MinBy(x=>x.Val));//{Name:"A", 'Val':1}
```

### Sum()
第一个参数是返回key函数，最终返回最小的key 值对应的元素
``` js
var arr1 = [1, 2, 3, 4, 5, 6, 7, 8];
var sum1 = arr.sum();  // 36 

var arr2 = [{Name:"A", Val:1}, {Name:"B", Val:2}];
var sum2 = arr2.sum(function(t){ return t.Val });   // 3 
```

### Reduce
第一个参数是计算前面计算结果和当前元素的函数，第二个参数是初始值。很强大的函数
``` js
var fruits = [ {  description: 'orange', Amount: 50}, {  description: 'orange', Amount: 50},
 {  description: 'apple', Amount: 75}, {  description: 'kiwi', Amount: 35}, {  description: 'watermelon', Amount: 25},];
 
trace('reduce(235)', fruits.map(item => item.Amount).reduce((prev, curr) => prev + curr, 0) ); //reduce 函数，
var sentence = "the quick brown fox jumps over the lazy dog";
trace('sentence（原始）', sentence   );
trace('reduce(反转)',  split(sentence," ").reduce((prev, curr) => curr +' ' +prev) );

```

### Select
将序列中的每个元素投影到新序列。
``` js
  var test_arr=[{'a':1},{'a':2},{'a':3}];
  test_arr.Where(x=>x.a>1).Select( x=> {return {'b':x.a*2}; } ) ; // [{'b':4},{'v':6}]
```

### SelectMany
Projects each element of a sequence to an array and flattens the resulting sequences into one sequence.
处理序列中的每一个元素，并且熨平结果到一个新的大序列结果中。
第一个参数：返回每个元素对应的序列 的函数。这个函数的第二个参数是元素所在位置
第二个参数（可选） ： 需要两个参数。第一个参数，原始序列中的元素，第二个参数，中间序列中的元素，返回这两个参数计算后的新元素的序列

``` js
var arr = [{Name:"A", Values:[1, 2, 3, 4]}, {Name:"B", Values:[5, 6, 7, 8]}];  

arr.selectMany(t=>{ return t.Values; });// [1, 2, 3, 4,5, 6, 7, 8]

arr.selectMany(t=>{ return t.Values; }, (t, u)=>{ return {Name:t.Name, Val:u};});
// [{"Name":"A","Val":1},{"Name":"A","Val":2},{"Name":"A","Val":3},{"Name":"A","Val":4},{"Name":"B","Val":5},{"Name":"B","Val":6},{"Name":"B","Val":7},{"Name":"B","Val":8}]
```

### ForEach
对序列中的每个元素都调用一次函数参数
``` js
var arr = [1, 2, 3, 4, 5];
arr.forEach(t=>{ if(t % 2 ==0) trace(t); });   
```

### groupBy
 第一个参数：key选择器
 第二个参数可选：如果没有，就是将同组的元素放到一个List序列中。如果有，对同组的元素都调用这个处理函数，返回新元素组成新的List序列
 第三个参数：对结果进一步出来，处理函数接收两个参数(Key,中间List序列),作为最终结果返回。如果没有这个参数，就将(Key,中间List序列) 作为最终结果返回
``` js
var arr = [{Name:"A", Val:1}, {Name:"A", Val:1}, {Name:"C", Val:3}, {Name:"C", Val:4}]; 
var res = arr.groupBy( function(t){ return t.Name; } ); 
res.forEach(function(t){ 
    trace("Key: " + t.Key, "OBJ: ", t); 
});
// Key: A OBJ:  {"Key":"A","Value":[{"Name":"A","Val":1},{"Name":"A","Val":2}]}
// Key: C OBJ:  {"Key":"C","Value":[{"Name":"C","Val":3},{"Name":"C","Val":4}]}
var res = arr.groupBy( function(t){ return t.Name; } ,$.Val); 
res.forEach(function(t){ 
    trace("Key: " + t.Key, "OBJ: ", t); 
}); 
// Key: A OBJ:  {"Key":"A","Value":[1,2]}
// Key: C OBJ:  {"Key":"C","Value":[3,4]}
var res = arr.groupBy( x=>x.Name  ,v=>v,  (k,v)=>{ return {k,cnt:v.Count(),min:v.min($.Val),sum:v.sum(x=>x.Val) }; } ); 
res.forEach(function(t){ 
    trace("Key: " + t.Key, "OBJ: ", t); 
}); 
// Key: A OBJ:  {"Key":"A","Value":{"k":"A","cnt":2,"min":1,"sum":3}}
// Key: C OBJ:  {"Key":"C","Value":{"k":"C","cnt":2,"min":3,"sum":7}}
```
### ToDictionary
转换为Dictionary
第一个参数：key选择器
第二个参数可选
``` js
var arr = [{Name:"A", Val:1}, {Name:"A", Val:2}, {Name:"C", Val:3}, {Name:"C", Val:4}]; 
var res = arr.groupBy( $.Name ).ToDictionary($.Key,$); 
trace(res);
// {"A":[{"Name":"A","Val":1},{"Name":"A","Val":2}],"C":[{"Name":"C","Val":3},{"Name":"C","Val":4}]}

```
### Slice
和js 中slice 类似。参数：起始位置 结束位置，如果为负数，就是从结尾倒数
``` js
var test_arr=fromto(1,10);  
trace('slice()',test_arr.slice());  //不输入参数就是全部
trace('slice(2)',test_arr.slice(2)); // 跳过两个
trace('slice(1,3)',test_arr.slice(1,3)); //取第1 个（含） 到 第3 个（不含）。前含后不含
trace('slice(-3,-1)',test_arr.slice(-3,-1));// 倒数第三个到倒数第三个
trace('slice(-3)',test_arr.slice(-3));// 从倒数第三个开始
```

### Take
从头开始返回指定数目的元素
``` js
trace('take(2)=',test_arr.Take(2));// 返回两个
```

### Skip
从头开始跳过指定数目的元素后，其他全部返回
``` js
trace('Skip(2)=',test_arr.Skip(2));// 跳过两个
```
### TakeWhile
只要条件满足就返回到新序列里面，直到遇到不满足的第一个条件开始，剩余的全部忽略
``` js
trace('TakeWhile(x=>x<5)',test_arr.TakeWhile(x=>x<5));
```

### SkipWhile
只要条件满足就跳过，直到遇到不满足的第一个条件开始，剩下的全部返回到新序列里面
``` js
trace('skipWhile(x=>x<5)',test_arr.skipWhile(x=>x<5)); 
```
### orderBy thenBy ThenByDescending orderByDescending
升序。稳定排序
参数：根据键对序列的元素进行排序。有orderby的后面才可以跟thenby .
``` js
var arr = [ {Name:"C", Val:3}, {Name:"C", Val:4},{Name:"A", Val:11}, {Name:"A", Val:2},]; 
trace( arr.orderby(x=>x.Name).ThenBy(x=>-x.Val));
//  [{"Name":"A","Val":11},{"Name":"A","Val":2},{"Name":"C","Val":4},{"Name":"C","Val":3}]
trace( arr.orderby(x=>x.Name).ThenByDescending(x=>-x.Val));
// [{"Name":"A","Val":2},{"Name":"A","Val":11},{"Name":"C","Val":3},{"Name":"C","Val":4}]
```
### zip
打包
``` js
var numbers = [ 1, 2, 3, 4, ];
var words = [ "one", "two", "three" ];
numbers.Zip(words ).forEach(item=>trace(item) );
//[1,"one"]
//[2,"two"]
//[3,"three"]
numbers.Zip(words, (first, second) => first + "===" + second).forEach(item=>trace(item) );
//1===one
//2===two
//3===three
```
### Except
生成两个序列的差集。
``` js
trace({a:1,b:2}.Except({a:1}).ToDictionary($.Key,$.Value)); // [{"Key":"b","Value":2}]
trace([ 1, 2, 3, 4, ].Except([ 1, 2,  ])); // [3,4]
trace("1ab11dc".Except("abc")); // ['1','d']
trace([ 1, 2, 3, 4, ].Except([ "abc"  ])); // 异常，不能执行

```
### ExceptBy
根据指定的键选择器函数生成两个序列的集差异。
``` js
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = [{a:"A"}]; 
var res1 = arr1.ExceptBy(arr2, 
    t=> t.Name  ,  // arr1 关键字选择器
    (x,y)=>x.a==y  // 比较运算器 x是arr2里的记录  y 是上面的关键字选择器的结果。如果关键字选择器 的结果类型和arr2 一样，这个参数可以省略
    ) ;        
 trace(res1); //   [{"Name":"B","Val":2},{"Name":"C","Val":3}]
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = ["A"]; 
var res1 = arr1.ExceptBy(arr2, 
    t=> t.Name   // arr1 关键字选择器    
    ) ;        
 trace(res1); //   [{"Name":"B","Val":2},{"Name":"C","Val":3}]
```

### Intersect
生成两个序列的交集。
``` js
trace({a:1,b:2}.Intersect({a:1})); // [{"Key":"a","Value":1}]
trace([ 1, 2, 3, 4, ].Intersect([ 1, 2,  ])); // [1,2]
```
### IntersectBy
根据指定的键选择器函数生成两个序列的交集。
``` js
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = [{a:"A"}]; 
var res1 = arr1.IntersectBy(arr2, 
    t=> t.Name  ,  // arr1 关键字选择器
    (x,y)=>x.a==y  // 比较运算器 x是arr2里的记录  y 是上面的关键字选择器的结果。如果关键字选择器 的结果类型和arr2 一样，这个参数可以省略
    ) ;        
 trace(res1); //   [{"Name":"A","Val":1}]
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = ["B"]; 
var res1 = arr1.IntersectBy(arr2, 
    t=> t.Name   // arr1 关键字选择器    
    ) ;        
 trace(res1); //   [{"Name":"B","Val":2}]
```
### union
生成两个序列的集联合。
``` js
var arr1 = [1, 2, 3, 4, 5]; 
var arr2 = [5, 6, 7, 8, 9];
var res = arr1.union(arr2);  // [1, 2, 3, 4, 5, 6, 7, 8, 9]      
 trace(res); //   []
 ```

### unionBy
根据指定的键选择器函数生成两个序列的集联合。
``` js
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = [{Name:"A"}]; 
var res1 = arr1.unionBy(arr2, 
    t=> t.Name  ,  // arr1 关键字选择器
    (x,y)=>x.a==y  // 比较运算器 x是arr2里的记录  y 是上面的关键字选择器的结果。如果关键字选择器 的结果类型和arr2 一样，这个参数可以省略
    ) ;        
 trace(res1); // 
 ```

### groupJoin
基于键值等同性将两个序列的元素进行关联，并对结果进行分组。
``` js
var arr1 = [{Name:"A", Val:1}, {Name:"B", Val:2}, {Name:"C", Val:3}];
var arr2 = [{Code:"A"}, {Code:"A"}, {Code:"B"}, {Code:"B"}, {Code:"C"}]; 
var res1 = arr1.groupJoin(arr2, 
    t=> t.Name,                     // arr1 selector
    u=>u.Code,                     // arr2 selector
    (t, u)=>{ return {Item:t, Group:u} ;}) ;         // result selector    
trace(res1);
// [
// {"Item":{"Name":"A","Val":1},"Group":[{"Code":"A"},{"Code":"A"}]},
// {"Item":{"Name":"B","Val":2},"Group":[{"Code":"B"},{"Code":"B"}]},
// {"Item":{"Name":"C","Val":3},"Group":[{"Code":"C"}]}]
```

### join
基于匹配键对两个序列的元素进行关联。
``` js
var test_join=
        [{a:1,b:2},{a:2,b:2}].join([{a:1,b:'b11'},{a:11,b:'b222'}],
          left=>left.a ,
          right=>right.a,
          (left,right)=>{key:left.a,left_prop:left.b,right:right.b } 
);
// [{"key":1,"left_prop":2,"right":"b11"}]

trace(test_join);
```
### JoinAsString
将列表中的每一项取ToString(),然后用参数指定的字符串连接起来，如果没提供，就用逗号链接
``` js
[ "one", "two", "three" ].joinAsString();//one,two,three
[ "one", "two", "three" ].joinAsString(',');//one','two','three
```
### ToList
以上所有返回的是序列的函数，内部都是一个枚举对象，使用这个函数，将枚举对象转换为真正的序列列表
``` js
test_arr.skipWhile(x=>x<5).ToList(); 
```

### 大量的例子
``` js
function test_parse_json(){
  var test_arr=[1,2,3];
  __env__.logger.error( test_arr.Where(x=>x>2).Select( x=> x*2 )  );
  for(var one in test_arr.Where(x=>x>2).Select( x=> x*2 )){
    __env__.logger.error("one:"+ one.ToString() );
  }
  var test_arr=[{'a':1},{'a':2},{'a':3}];
  test_arr.Where(x=>x.a>2).Select( x=> {return {'b':x.a*2}; } ) ;
  
  var txt='{"a":1,"b":[1,2,3]}'; 
  return json_parse(txt);
}
var lambds_func= function(x){ return 1+33 ;};
function test_lambda_func(func){
	trace('test_lambda_func');
    trace(func());
}
test_lambda_func(x=>1+2);

trace('lambds_func(1)='+lambds_func(1));
var test_arr=fromto(1,10);  
trace('slice()',test_arr.slice());  //和js 中slice 类似，不输入参数就是全部
trace('slice(2)',test_arr.slice(2)); // 跳过两个
trace('slice(1,3)',test_arr.slice(1,3)); //取第1 个（含） 到 第3 个（不含）。前含后不含
trace('slice(-3,-1)',test_arr.slice(-3,-1));// 倒数第三个到倒数第三个
trace('slice(-3)',test_arr.slice(-3));// 从倒数第三个开始
var fruits = [ {  description: 'orange', Amount: 50}, {  description: 'orange', Amount: 50},
 {  description: 'apple', Amount: 75}, {  description: 'kiwi', Amount: 35}, {  description: 'watermelon', Amount: 25},];
 
trace('reduce(235)', fruits.map(item => item.Amount).reduce((prev, curr) => prev + curr, 0) ); //reduce 函数，第一个参数是计算前面计算结果和当前元素的函数，第二个参数是初始值
var sentence = "the quick brown fox jumps over the lazy dog";
trace('sentence（原始）', sentence   );
trace('reduce(反转)',  split(sentence," ").reduce((prev, curr) => curr +' ' +prev) );
trace('---------------------------');
trace('[1,2,1,3].distinct()',[1,2,1,3].distinct());// 如果没有参数，就是对每个元素做distinct ，如果有参数，这个参数需要是用来做比较的函数
trace('[{Name:"A", Val:1},{Name:"B", Val:1}].distinct(function(a, b){ return a.Val == b.Val })',[{Name:"A", Val:1}, {Name:"B", Val:1}].distinct((a, b)=>{ return a.Val == b.Val; }));

var test_arr=[4,2,3,1,5,7,6,8,10,9,];
trace('test_arr=',test_arr);

trace('all(x=>x<10)',test_arr.all(x=>x<11));//全部为true
trace('any(x=>x<2)',test_arr.any(x=>x<2));// 有为true
trace('skipWhile(x=>x<5)',test_arr.skipWhile(x=>x<5)); //只要条件满足就跳过，直到遇到不满足的第一个条件开始，剩下的全部返回到新序列里面
trace('TakeWhile(x=>x<5)',test_arr.TakeWhile(x=>x<5));//只要条件满足就返回到新序列里面，直到遇到不满足的第一个条件开始，全部忽略
trace('Min()',test_arr.Min());
trace('Max()',test_arr.Max());
trace('Sum()',test_arr.Sum());


trace('take(2)=',test_arr.Take(2));// 返回两个
trace('Skip(2)=',test_arr.Skip(2));// 跳过两个
trace('First()=',test_arr.First()); //第一个
trace('First(x=>x>4)=',test_arr.First(x=>x>4)); //满足条件的第一个，如果没有就返回空
trace('First(x=>x>14  ,-1 )  ',test_arr.First(x=>x>14 , -1)); //满足条件的第一个，如果没有就返缺省值（第二个参数）
trace('---------------------------');
trace('Last()',test_arr.Last());//和first类似
trace('Last(x=>x>4)',test_arr.Last(x=>x>4)); 
trace('Last(x=>x>14  ,-1 )  ',test_arr.Last(x=>x>14 , -1));
trace('ForEach(x=>x>4)\n',test_arr.ForEach(x=> trace('foreach:',x)));//ForEach 对每个元素用函数处理一下
trace('---------------------------');
trace('Contains(3) ',test_arr.contains(3));

var arr2 = [{Name:"A", 'Val':1}, {'Name':"B", 'Val':2}]; 
trace(arr2);
var res2 = arr2.contains({'Name':"C", 'Val':2}, (a, b)=>{ return a.Val == b.Val; }) ;  //  true
trace('MinBy(x=>x.Val)',arr2.MinBy(x=>x.Val)); //以函数计算后，满足最小条件的元素
trace('MaxBy(x=>x.Val)',arr2.MaxBy(x=>x.Val));//以函数计算后，满足最大条件的元素
trace('Sum(x=>x.Val)',arr2.Sum(x=>x.Val)); //以函数计算后的结果求和

trace("arr2.contains({'Name':\"C\", 'Val':2}, (a, b)=>{ return a.Val == b.Val; }) ",res2);
trace('---------------------------');
  var test_arr=fromto(1,10);
  trace("text !!!");
  trace( json_stringify( test_arr.Where(x=>x>2).Select( x=> x*2 ).ToList() )  );//可以级联。ToList转换为列表（类似js里面的数组和c#里面的List）

  for(var one in test_arr.Where(x=>x>2).Select( x=> x*2 )){
    trace("one:"+ one.ToString() );
  }
  var test_arr=[{'a':1},{'a':2},{'a':3}];
  trace( test_arr.Where(x=>x.a>1).Select( x=> {return {'b':x.a*2}; } ).ToList());

var lambds_func= (x)=>{ return 1+1 ;};
trace('lambds_func(1)='+lambds_func(1));
```
### 修改数据集数据
如果需要取完数据后，对数据集内的数据进行修改，我们必须要使用ds.Rows取出对应的行集。循环这个行集逐个修改。不能对数据集新增列，如果需要新增，我们要在sql 中提前准备好这个列，供我们修改使用。
``` js
function _after_calc_dataset_(){
  trace(" begin _after_calc_dataset_");
  trace(ds.Rows.select(x=>[x.排名, x.链接Id] ));// 打印修改前的数据
  ds.Rows.ForEach(x=>{x.setData('排名',1111);} );//修改数据
  trace(ds.Rows.select(x=>[x.排名, x.链接Id] ));// 打印修改后的数据
  trace(" end _after_calc_dataset_");
}
```