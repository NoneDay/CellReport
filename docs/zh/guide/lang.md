# 内置语言

- 内置语言的语法类似js。
  
## 基础数据类型
  - 数字: 如：1   1.2
  - 日期时间 如： 2021-10-10
  - 字符串 可以用单引号包起来，也可以用双引号包记起来，如：'hello' "hello"
  - 数组/列表 如：[ ] 空数组 [1,2] ["hello","world"] [1,"hello"]
  - 字典 如：{ } 空字典 {"k1":"hello","k2":"world"}
~~~js
1.2 //数字
date(2012,10,1) //日期
"hello" //字符串
'world' //字符串
["hello","world"] //数组/列表
{"k1":"hello","k2":"world"} //字典
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
 in 在后续列表的值里面 
 not  in 不在后续列表的值里面
 var aaa='a2'
aaa in ['a1','a2'] // true
aaa in ('a1','a2') // true 兼容 sql 的写法
aaa not in ['a1','a2'] // false
aaa not in ('a1','a2') // false 兼容 sql 的写法
 
~~~
- 语句规范
::: warning
  
  普通单独语句必须以分号结束，for 、function 等语句块 后不跟分号
:::
- 变量定义
~~~js
var my_test_1="22";//必须以var 开始
~~~

- 条件语句 if
~~~js
if(param.b_date=='2022-01-01')
    return '2022元旦';
else    
    return '不是2022元旦';
~~~

- 循环for
~~~js
var lj_sum=0;
for(var i=0;i<10;i++){
    lj_sum=lj_sum+i;
}
~~~

- 函数定义
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

