# 基本配置

## 报表制作平台的用户登录管理

- admin 用户登录后，在报表组管理中，选登录管理。
 我们通常已经有了成熟的用户管理系统，这时候我们可以直接将已有的用户管理引入到本平台中使用。
::: tip
传入用户名的变量分别是userid和口令password，返回为字典结构，必须有errcode，userid，username。errcode为零，表示验证成功。
:::

~~~js
// 以下是脚本先使用内置字典配置了两个用户：
var userDict={'test':{'password':'password','username':'测试用户1'},
              'test2':{'password':'password','username':'测试用户2'}
             };
if(userDict[userid]!=null ){
  if(password==userDict[userid]['password'])
  	return {'errcode':0,'message':'ok', 'userid':'test','username':userDict[userid]['username'],'old_result':'ok'};
  else
    return {'errcode':1,'message':'error', 'userid':'test','username':userDict[userid]['username'],'old_result':'error'};
}
// 引入外部已有用户管理系统的校验。这里是假设该url 需要使用 form 的post方式提交参数p_userid和p_password，实现验证
var result=web_request({'url':'http://xx.xx.xx.xx/auth/user/login'  
            ,'method':'post','data':{'p_userid':userid,'p_password':password} } );
var json=eval('='+result);	
return {'errcode':json.errcode,'message':json.errmsg, 'userid':json.userid,'username':json.username,'old_result':result};

~~~


## 报表运行前校验

在报表组的任何目录都可以在《设置模板》中设置报表运行前的脚本（后端运行前脚本）。
::: tip
报表运行前后调用的钩子函数，在各个目录和报表中都可以配置。执行时遵循的原则是，先检查整个平台目录下的template.xml中的配置，然后从报表所在报表组中的根目录开始，逐个执行配置语句，配置语句中的变量和函数，在报表真正执行的时候都可以引用到。如果有重复变量或函数，距离报表最近的起作用（我们可以将之前的用临时变量保存，然后就不会被覆盖）。
:::

如果定义了函数before_exec，报表执行前将会先调用他。

~~~js
// 这是一个能力演示。根据情况裁剪添加
function before_exec(){
	var db=openDb('testdb');
	var result=db.select("select fresh_time,load_time from dual");
	db.close();
   if(param.reportName=="test/test111.cr")//遇见这个报表不校验
     return;
	if( __page__.Path=="/f10" or regex_match('f10\\.cr$',param.reportName) 
      or param.reportName in ['t1/b33.cr','t2/a22.cr'])
   {
		var tips=iif(result.is_huizhong,"当前正在汇总，可能数据不准，请稍后重新查询,","")+"使用<load_time,10分钟>,"
				+"本次汇总完成时间"+result.fresh_time.ToString()+",最近数据同步时间"+result.load_time.ToString();
		return {"continue":true,//继续执行标记,可以用来判断是否有权限继续执行
				"cache_id":"report5",//所有缓存的公共标记部分，如果返回null，将不缓存
				"fresh_flag":result.load_time.ToString(),//如果这个值改变就表示当前报表需要刷新了
				"tips":tips//额外的提示信息,
			};
	}else{
		var tips=iif(result.is_huizhong,"当前正在汇总，可能数据不准，请稍后重新查询,","")+"使用<fresh_time，1小时>,"
				+"本次汇总完成时间"+result.fresh_time.ToString()+",最近数据同步时间"+result.load_time.ToString();
		return {"continue":true,//继续执行标记,可以用来判断是否有权限继续执行
				"cache_id":"report6",//所有缓存的公共标记部分，如果返回null，将不缓存
				"fresh_flag":result.fresh_time.ToString(),//如果这个值改变就表示当前报表需要刷新了
				"tips":"===="+tips //额外的提示信息,
			};		
	}
}
~~~
::: warning
**before_exec返回的字典里:**
- **如果包含continue，并且值为false ，报表将不继续执行，向前台返回错误信息。**

- **包含cache_id,并且不会空，将会对报表结果缓存到redis 中。如果没有启动redis，将会报错**
- **如果报表需要缓存，将根据fresh_flag标记报表的基础数据是否改变，从而决定报表是否重新计算**
- tips 是可以被前台接收到的额外提示信息。根据喜好设置内容
:::



## 缺省参数的重置

- 在《设置模板》中设置报表运行前的脚本（后端运行前脚本）添加代码：
 
~~~js
function resetDefaultParam(name){
	if(name=='branch_no')//如果参数名是branch_no ，那么缺省参数就是改wei xxxxx
		return 'xxxxx';
}
~~~

## 前端隔行变色和条件颜色的配置

全局缺省配置，在安装目录的template.xml的footer2中。可以视情况修改
每个目录都可以设置该目录下的所有文件（包含子目录中的）的缺省显示样式。
如果报表不想使用缺省样式，可以点报表上面的黄色条带，然后将右面的是否使用全局样式取消掉。

~~~js
// 控制条件格式，如果列名按正则表达式匹配上了，就用条件样式控制当前列的显示。其他样式例子：
////{column_match:".*(累计)" ,val:'{"type":"dataBar","cellrange":[{"left":283,"width":88,"top":117,"height":25,"left_move":283,"width_move":88,"top_move":117,"height_move":25,"row":[4,4],"column":[3,3],"row_focus":4,"column_focus":3}],"format":["red","#ffffff"]}' },
window.luckysheet_conditionformat=[
		{column_match:".*(占比|率)\$" ,val:'{"type":"colorGradation","cellrange":[{ "row":[0,1],"column":[1,1] }],"format":["rgb(248, 105, 107)", "rgb(255, 235, 132)", "rgb(99, 190, 123)"] }' },
	]

//控制表头、隔行变色等。需要修改的是format 中的有关内容，其他不宜修改。
// head 表头 one 奇数行 two 偶数行 fc 字体颜色 bc 单元格的背景色 foot 表尾
window.luckysheet_alternateformat_save='{"cellrange":{"row":[0,8],"column":[-1,-1]},"format":{"head":{"fc":"#000","bc":"#dff0d8"},"one":{"fc":"#000","bc":"#ffffff"},"two":{"fc":"#000","bc":"#dff0d8"},"foot":{"fc":"#000","bc":"#cef3bf"}},"hasRowHeader":true,"hasRowFooter":false}'

~~~

## 前端的公共数据
- 前端组件的《编辑内容》中，可以使用以下参数引用后端传过来的数据.可以通过添加《动态模板》，将以下代码片段复制到内容里面做测试，以便找到适合自己使用的代码。
~~~js
    context.clickedEle['test'] //点击test 元素后选中的数据，这里的元素指的是页面上的可点击单元。
    //结构为:{data:deepClone(cur_data[0]),cell:cell.innerText,column}
    
    context.report_result.dataSet //sql 结果数据，只有在设计预览状态，或设置变量_need_dataset_=True时才会有这个数据 
    // 内部为多个array ，每一个代表的都是数据集。如 context.report_result.dataSet['test'][0] 才是真正的数据,第一行是表头，其他是数据
    
    context.report_result.data['main'] //页面上名字叫main 的报表数据。
    // 格式为：{columns:[],tableData:[],colName_lines:[0,2],extend_lines:[4,22]} ,
    // tableData 存放的所有单元格的数据。colName_lines 列标题起止范围，extend_lines 明细行起止范围
    
    self 配置
    
~~~