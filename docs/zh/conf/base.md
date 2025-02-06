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
- **包含cache_id,并且不为空，将会对报表结果缓存到redis 中。如果没有启动redis，将会报错**
- **如果报表需要缓存，将根据fresh_flag标记报表的基础数据是否改变，从而决定报表是否重新计算**
- tips 是可以被前台接收到的额外提示信息。根据喜好设置内容
:::
## 如何在后台脚本中取当前请求中的参数

后台脚本中取当前请求中的参数,可以方便报表系统和已有poral 门户 的集成 。
通过nginx反向代理后，在客户的浏览器中，看到的就是同一个网址了，这时候通过类似下面的取数，就可以去到portal 中存的用户信息

``` js
 __page__.Cookies["access_token"]; //返回字符串
 __page__.Headers["host"].ToString(); //Headers中取值，一定要加上ToString转换，因为Headers["host"]存的是一个列表
 __page__.Form["branch_no"]; //返回字符串
 __page__.Query["reportName"].ToString() //类似Headers

__env__.logger.Info( __page__.Cookies["access_token"] );//- 打印日志
```
## nginx 配置样例

``` 

worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    #gzip  on;
    upstream report{
        hash $remote_addr consistent;
        server 127.0.0.1:5300 max_fails=0 weight=1;
        #server 127.0.0.1:8080 max_fails=0 weight=1;
    }
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        location  /report5/ {             
            proxy_pass     http://report/;
            client_max_body_size    100m;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            #if ( !-e $request_filename) {
            #   proxy_pass     http://report/;        
            #}
        }
        location  /report5/static/ {             
            proxy_pass     http://report/static/;
            client_max_body_size    100m;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;            
        }
        location ~ /report5/(.*\.)(js|css|png|map|svg|woff|jpg|svg|gif|ico)$ {    
            alias 'D:/publish_test3/wwwroot/$2$3';
        } 
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```
## 缺省参数的重置
报表参数的设置过程：
报表设计时的缺省参数--->resetDefaultParam----->用户传过来的参数----->lastSetParam

- 在《设置模板》中设置报表运行前的脚本（后端运行前脚本）添加代码：
 
~~~js
function resetDefaultParam(param_name,param_row){ //param_row 参数可以动态修改参数定义，下面例子是修改下拉可选项
    __env__.logger.info(param_name+'---'+param_row.getData("value"));
    if(param_name=="abc"){
      if(你的判断成立){
        param_row.setData("allowCreate", true);// 设置为可动态添加
        param_row.setData("tagValueList", [['A','1'],['B','2']]);// 动态添加可选项
      }
      // param_row.setData("Inner", true);// 设置为内部参数，前端将看不到hidden ，但后端是可用的
      // param_row.setData("default_value", '1');// 设置为缺省值，或者用下行的方式返回缺省值
      return '1';//返回缺省值
    }
     
  }
~~~

## 参数的最终重置

~~~js
function lastSetParam(name,param_row){
	if(name=='branch_no')//如果参数名是branch_no ，那么最终参数就是改为 xxxxx,不管用户输入的是什么，都改
		return 'xxxxx';
}
~~~
## 数据集取数完成后执行的动作

可以定义\_after_calc_dataset_这个函数，使得在数据集取数完成后，执行特定动作：
``` js
function _after_calc_dataset_(){
   _zb_var_.my_ds_cnt= 部位2.count();// 将部位2 数据集的行数存到_zb_var_.my_ds_cnt
}

```
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
- 在组件中调用全局数据要使用 _this.context
~~~js
    _this.context.clickedEle['test'] //点击test 元素后选中的数据，这里的元素指的是页面上的可点击单元。
    //结构为:{data:deepClone(cur_data[0]),cell:cell.innerText,column}
    
    _this.context.report_result.dataSet //sql 结果数据，只有在设计预览状态，或设置变量_need_dataset_=True时才会有这个数据 
    // 内部为多个array ，每一个代表的都是数据集。如 context.report_result.dataSet['test'][0] 是数组。 里面才是真正的数据,第一行是表头，其他是数据
    // 可以简写：
	  _this.dataset('累计')
    
    _this.context.report_result.data['main'] //页面上名字叫main 的报表数据。
    // 格式为：{columns:[],tableData:[],colName_lines:[0,2],extend_lines:[4,22]} ,
    // tableData 存放的所有单元格的数据。colName_lines 列标题起止范围，extend_lines 明细行起止范围
    _this.context.queryForm //当前报表参数，可以修改，然后调用下面的submit提交
    _this.context.rpt_this.submit() //提交查询
    self 配置
    
~~~
::: tip
如果运行时需要数据集的数据，但没有被传给前台，请在后端运行前设置中，加代码：`var _need_dataset_=true; `
:::

``` tip
水印设置，请在后端运行前设置中，加代码`_zb_var_.watermark="abcdr"; //设置水印,可以动态赋值，方便设置工号姓名之类的动态水印`
```
**缺省水印配置**
``` js
_zb_var_.watermark={
        watermark_txt: "text",
        watermark_x: 20, //水印起始位置x轴坐标
        watermark_y: 20, //水印起始位置Y轴坐标
        watermark_rows: 20, //水印行数
        watermark_cols: 20, //水印列数
        watermark_x_space: 100, //水印x轴间隔
        watermark_y_space: 50, //水印y轴间隔
        watermark_color: '#aaa', //水印字体颜色
        watermark_alpha: 0.4, //水印透明度
        watermark_fontsize: '15px', //水印字体大小
        watermark_font: '微软雅黑', //水印字体
        watermark_width: 110, //水印宽度
        watermark_height: 40, //水印长度
        watermark_angle: 20 //水印倾斜度数
    }

```

## 前端动态模板数据设置
### 动态模板中可能会用到的数据转换
| 表达式 | 解释  |
|-------|-------|
|`dataset('累计')[0]`  | 取数据集：累计 的列名 |
| `dataset('累计').slice(1)` | 取数据集的数据 |
|`Enumerable.from(dataset('累计')).skip(1).select(x=> {return {'name':x[0],value:x[1]} }).toArray()` | 转换数据集累计中的数据为对象：name属性对应第一列，value对应第二列 ，最后转换为数组返回|



~~~html
<dv-scroll-board :config="{
            header: dataset('累计')[0],
            data: dataset('累计').slice(1)
          }" style="width:100%;height:100%;" />


<dv-capsule-chart :config="{
  data: Enumerable.from(dataset('累计')).skip(1).select(x=> {return {'name':x[0],value:x[1]} }).toArray()
}" style="width:100%;height:100%" /> 

<dv-conical-column-chart :config="{
  data: Enumerable.from(dataset('累计')).skip(1).select(x=> {
      return {'name':x[0],'value':x[1]} 
    }).toArray()
}" style="width:100%;height:100%" /> 
~~~

### charts中可能会用到的数据转换

- 内置了已经转换好的数据：valid_data （有效数据，参看chart文档中的dataset）
- series_type 自动转换过来的序列类型

## 前端页面css和js脚本

style标签包起来的部分，将会在报表展现前注入当前页面的样式表中
```
<style>
  #report_app .vue-grid-item:not(.vue-grid-placeholder) {
    background: rgb(255, 254, 254);
    border: 0px solid black;
}
#report_app {
  background-color:#fff ;
}
#report_app .data-progress{
  background-color:#fff ;
}
</style>
```

- script标签包起来的部分，将会在报表展现前执行，如果script中定义了函数`after_report_show_hook`,那么这个函数将会在报表显示后执行
- 可以访问变量_this来动态修改里面的内容。如果不知道结构，我们可以在这个里面加入console.infp(_this)，查看控制台就可以了解内部结构。
- _this.result 代表的就是报表查询结果。
- _this.result.pc_form 如果定义了该变量，那么pc端显示的form将会使用这个定义来显示
- _this.result.mobile_form 如果定义了该变量，那么移动端显示的form将会使用这个定义来显示
- _this.result.pager_template 如果定义了该变量，报表的分页器将使用模板
- 
```
<script> 
window.cellreport.after_show_report_hook=function(that){ //这个函数会在显示完报表后调用
  	console.info("function report_after_show exec")
}
window.cellreport.after_run_before_show_report_hook=function(that){ //这个函数会在后端取数完毕显示报表前调用
  	console.info("function after_run_before_show_report_hook exec")
}
if(_this.crisMobile)
  window.cellreport.convert_col_to_button=true //如果是移动端，那么如果只有一个报表，并且 是多行列头的情况下，设置这个参数控制将列转换为标签按钮的形式
console.info(_this) //d打印_this的内容到控制台。这仅仅是测试，生产期间最好不要执行
</script>
```
::: warning
如果在pc_form或mobile_form中也需要script，那么将form内的script改为dyn_script。否则正则匹配script将会匹配不正确从而导致脚本失效。
:::

### 定时刷新
点报表设置，选 前端页面css和js脚本 ，添加内容，：
``` js
<script>
  _this.setTimeout_second=10 //刷新间隔10秒
  _this.setTimeout_function=function(p_this){
       //p_this.queryForm._fresh_ds=JSON.stringify(['数据集:累计','表格:main']) //只刷新: 数据集:累计，前面的数据集冒号不能省略
       p_this.submit({noloading:true})
      console.info("xxx")
 }
</script>
```

## 前端动态模板
- 在页面上添加的动态模板，内部脚本是经过简化的vue格式。主要区别是：script中定义的data、methods、computed会直接注入当前模板中，其他vue属性暂时不支持。
- 由于是内置脚本模式，所以不支持import语句，支持data使用函数返回。
- style 将是scoped的，style的处理是将每个css前动态加上 了id名称，所以对模板外的其他网页部分没有影响。
- 为避免data、methods中的名字和系统内部定义的名字冲突，最好将data、methods中的名字加上一个固定前缀，如： my_ 。
- 如果设置依赖数据集名称（this.self.dataSource），this.cur_ds 表示的将是这个数据集对应的二维数组json，第一行是列名，其他行是数据
- template中可使用`<t>text</t>` 代替配置中self.option.text中输入的公式(以等号开始的字符串将被认为是公式)。例如self.option.text的内容为：=cur_ds?cur_ds[1][4]:14 ，等号后面的内容将会插入到占位符中。通常这种输入是在可视化配置中配置（暗红色字体通常就是可输入模板公式的属性）。

``` vue
<template>
<div class="cr-data-box">
  <div class="item"  @click="my_sayHi2">
    <div class="item-icon" style="background-color: rgb(49, 180, 141);">
        <i class="el-icon-warning"></i>
    </div> 
    <div class="item-info">
        <span class="title" style="color: rgb(49, 180, 141);">12,332</span>
        <div class="info">{{my_test_computed}}日志{{my_t_data1 }}</div>
    </div> 
  </div>
</div>  
</template>
<script>  
    if( window.AVUE==undefined){ // 载入外部的css和js 
       tool.load_css_file("cdn/avue/2.8.1/index.css")
       tool.seriesLoadScripts("cdn/avue/2.8.1/avue.min.js",null,function(){
           _this.refresh()
           console.info("success")
       })
   }
   export default {
     data:{ 
       my_t_data1:'test_data1',
       my_t_data2:'test_data2',
       my_cnt:0,
     }, 
     computed:{
       my_test_computed(){
        return this.my_t_data1+'_'+this.my_cnt 
       }
     },
     methods:{
         my_sayHi2() { 
            this.my_t_data1='test_'+this.my_cnt;
            this.my_cnt++
        }
     }
   }
</script>
<style>
.cr-data-box{
  height: 100%;
}
</style>
```
## 自定义组件设计

在模块组件管理中，我们可以修改或自定义新的供报表使用的组件。
在编辑组件总，有两个tab页：组件内容、可视化配置器。组件内容将会在将该组件插入到报表时复制到报表中；可视化配置器是为了辅助内容输入而提供的快捷内容录入组件。管理的选项内容通常配置在option中。《组件内容》使用self.option.xxx来引用属性xxx，《可视化配置器》中使用edit_item.option.xxx来引用属性xxx。
可视化配置器的格式通常如下：
``` js
<template>
  <div v-if="hasOption">   
    <el-form-item label="名称颜色">
      <avue-input-color v-model="edit_item.option.color1">
      </avue-input-color> 
    </el-form-item>
  </div>    
</template> 
<script>
  
  export default {
    computed:{
      hasOption(){
        if(this.edit_item.option==undefined)
          this.edit_item.option={}
        return true
      }
    }
  }
</script>
```
hasOption 是为了动态初始化option，他总是返回true。
在这里缺省组件使用的通常都是avue组件构造的录入界面。

为了标记可做公式替换的字段，我们通常使用以下方式构造录入选项：
``` js
    <el-form-item label="文字">
      <template slot="label">
        <el-tooltip placement="top">
          <div slot="content"><div v-html="context.templateGuide"/></div>
          <el-button  style="color: darkred;">文字<span class="guide">
         <i class="el-icon-warning-outline" title="查看文档"></i>
        </span></el-button>
        </el-tooltip>        
      </template>       
      <avue-input v-model="edit_item.option.text">
      </avue-input> 
    </el-form-item>
```
组件内容通常格式：
``` js
<dv-decoration-11 style="width:100%;height:100%;" v-bind="styleArr" >
  {{ <t>text</t> }}
</dv-decoration-11>
```  
或：
``` js
<dv-water-level-pond :config=" {data: [<t>value</t>]}" style="width:100%;height:100%;" />

```          
::: warning
1、标签间的模板一定要用{{  }} 包起来
2、标签属性中使用模板，一定使用双引号。因为在做模板替换的时候，字符串将会用单引号。
:::

## 前端调用后端的自定义函数

如果已定义后端自定义函数：
``` js
  //这类函数只接收一个参数。如果是多个参数，可以打包多个参数到一个对象中传递
  function test_func(para){
    __env__.logger.info(" 前端调用后端的测试:"+json_stringify(para));
    return  {a:2,b:3,para};// 测试将这个数据重新传回给前端
  }
```
前端任意可以使用js 的地方，都可以通过call_server_func直接调用到后端函数：
``` js
  cellreport.call_server_func(`test_func`,{a:1,desc:'前端'},`/run:example?reportName=/`).then(data=>{
    console.info(data) // 输出 : {a: 2, b: 3, para: {…}}
  })
  
```
`call_server_func(func_name,func_params,_this,get_post='post')`
第一个参数 func_name: 后端已定义的函数名称
第二个参数 func_params：后端函数需要的参数,必须是一个对象，如：{a:1,b:[1,2,]},后端将以同样的方式取出
第三个参数 ：如果是字符串，就是将当前字符串作为url 传递给后端(通过这种方式手动执行指定报表组中的函数)，否则，就从_this 中解析出当前网页的url(组件中调用的话，直接传this就行)，传递给后端. 
第四个参数 get_post : 提交给后台时使用的http 提交方式

## 前端使用js的一些控制选项

- window.cellreport.show_tips 是否显示右上角的提示信息，这个信息是后台传过来的。

- ```window.cellreport.cr_login_verfiy_code_type='text';```  设计器登陆验证方式：
  text，纯前端（已经显示了。重输入一遍就可以）。
  img:`${baseUrl}/VerifyCode` 后端要编写这个代码
  其他:用其他方式（如手机验证码）验证，需要后端代码配合。也是修改 UserController.cs中的VerifyCode

- ```window.cellreport["expand_form"]``` 手机端是否显示收缩查询输入图标（控制查询输入是否显示）
- ```window.cellreport.cr_export_excel_func``` 导出excel 时调用的监控函数。通常需要传给后端记录
- ```window.cellreport[`cr_click_${gridName}`](p_data,this)``` 点击某个组件后调用的函数，p_data 是传递的数据，this表示的是调用函数的组件.
只有报表、echarts 有缺省的点击事件，可以直接调用click事件。如果是其他组件，需要自己写有关的click，如果需要刷新数据集，自己组装_this.context.clickedEle以及调用click_fresh.

- window.cellreport.hn_old 控制列表头上的链接是否有用
- window.cellreport.cr_close_fresh_message=true 关闭组件刷新提示 
- window.cellreport.cr_hover_row   鼠标悬停时使用的格式 缺省值：'{background-color:lightgray!important;}'
- window.cellreport.cr_active_row  鼠标点选后时使用的格式  缺省值：'{background-color: #7cbcfc!important;}'
- window.cellreport.call_server_func 不要修改。这是调用后端使用的函数入口
- window.cellreport.map_url 地图地址。格式：`${default_map_url}/${code}_full.json` 。如果地图存放到了static/GeoJSON下，可以设置为static/GeoJSON
- window.cellreport.pdf_print  pdf预览时，如果为true直接显示打印预览，不设置或false，将显示中间预览，以便调整或另存到本地
- window.cellreport.form_validate(queryForm)  form提交时的表单校验。queryForm的属性就是报表用到的参数,返回true表示校验通过，false或字符串表示校验不通过，返回字符串时将作为错误信息显示到浏览器
- window.cellreport.convert_col_to_button 手机端是否将多层表头转换为按钮显示
- window.cellreport.cfc_max_line 缺省值1000。在设计器使用条件格式菜单设置的条件格式化计算的最大行数，超过这个行数就不计算。
- window.cellreport.after_run_before_show_report_hook=function(that) 这个函数会在后端取数完毕显示报表前调用
- window.cellreport.after_show_report_hook=function(that) 这个函数会在显示完报表后调用
## 查找组件和显示组件对话框
``` js
this.findElelment("line_832",{parent_obj:null,dialog_params:{title:'标题'},params:{style:"height:50vh"} }) 
this.showDialog("line_832",{parent_obj:null,dialog_params:{title:'标题'},params:{style:"height:50vh"} })
```
第一个参数是组件ID。
第二个参数在显示组件的对话框中，可以通过self访问。dialog_params 是el-dialog的参数。params是包裹组件的div的参数 。可以通过slot属性定制对话框样式，method添加方法。
``` js
let slot={footer:`<span slot="footer" class="dialog-footer"><el-button type="primary" @click="exportExcel">导出excel</el-button></span>`};
    let methods={
      exportExcel(){
        console.info("exportExcel===============",p_this)
        tool.seriesLoadScripts('cdn/xlsx/dist/xlsx.full.min.js',null,function (){
            let ws= XLSX.utils.aoa_to_sheet(_this.result.data.report_518.tableData)
            let wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws,'data');
            let wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };//
            tool.saveAs(new Blob([tool.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream"}),
                `${p_data.data.worker_no}(${p_data.data.name})明细.xlsx`);
          })
      }
    }
    p_this.showDialog("comp_518",{t_data:{xxx:2},dialog_params:{title:`${p_data.data.worker_no}(${p_data.data.name})明细`} ,slot,methods,})
    // showDialog 中的第二个参数在comp_518中访问时对应为self。如： this.self.t_data.xxx 
```
``` js 
//showDialog 的定义为：
function  showDialog (ele_name, data,_this) {
    let dync_item=findElelment(ele_name,data,_this)
    return showDialog2(`<widget-form-item  :self="dync_item"  >  </widget-form-item>`,dync_item,_this);
}
```

如果不使用组件，也可以直接使用字符串构建显示内容
``` js
    window.cellreport.cr_click_main=function(p_data,p_this){// p_data={xxx:1 }
    window.cellreport.tool.showDialog2(`<pre style="overflow: scroll;height: calc(100% - 40px);width: calc(100% - 20px);">{{ self.xxx }}</pre>`
      ,p_data,p_this);
    } //self 对应的showDialog2 的第二个参数
```
