# 快速上手

## 依赖环境

- [下载安装NETCORE6 SDK 或 RUNTIME.](https://dotnet.microsoft.com/download)
-  [下载安装redis（可选）。最好安装](https://github.com/MicrosoftArchive/redis/releases)
- 已打包好的压缩文件，[下载解压传输链接](https://cowtransfer.com/s/a21509df346642) 或 打开【奶牛快传】cowtransfer.com 使用传输口令：00qhci 提取；
::: tip
- 使用 [pnpm](https://pnpm.io/zh/) 时，你需要在 [`.npmrc`](https://pnpm.io/zh/npmrc#shamefully-hoist) 文件中设置 `shamefully-hoist=true` 。
- 使用 [yarn 2](https://yarnpkg.com/) 时，你需要在 [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) 文件中设置 `nodeLinker: 'node-modules'` 。
:::

## 安装编译好的版本

这一章节会帮助你从头搭建一个 CellReport 设计和运行网站。

- **步骤1**: 下载
下载并安装 net6sdk 或 runtime 
下载Redis（可选）。如果需要对最终报表结果缓存，请下载
下载解压本软件的release到一个目录。假设下载解压到了d:\\cellReport
运行：
```bash
cd cellReport
//windows下启动 dotnet reportWeb\reportWeb.dll  --urls http://*:5000 --ContentRoot . --WebRoot ..\wwwroot 
start.bat
//或 linux 下以这种方式启动
dotnet reportWeb/reportWeb.dll  --urls http://*:5000 --ContentRoot . --WebRoot ../wwwroot 
// 指定启动端口为5000 和 静态文件存放路径
```
如果不指定urls参数，将运行在端口5000 ，如果不指定webroot ，缺省就是当前目录的wwwroot

- **步骤2**: 首次运行和测试
使用chrome （版本81 以后的才可以）或最新的 edge 浏览器,登陆网址：
```
http://127.0.0.1:5000
```
缺省的管理员用户名口令在appsetting.json中，查找admin_user 和 admin_password

选中《报表组管理》，如果需要新的数据源，请在这里添加。
```
sql server 连接串
Data Source=ip地址;Initial Catalog=数据库名字;Persist Security Info=True;User ID=用户;Password=口令;Min Pool Size=1;Max Pool Size=50;Connect Timeout=15000;Application Name=报表连接
```
配置完毕后，按F5 刷新页面，点报表目录，正常的话，这是应该能看到所有的测试报表了。

- **步骤3**: 自己的第一张报表
参考操作视频（）

## 全手工构建

- 从github 下载压缩包或git clone
- 前端构建 node>=14
~~~bash
cd front
npm i
npm run build   //构建
mpm run server // 前端启动
~~~

- 后端构建 使用vs2022
在end 目录用 vs2022打开sln文件。执行生成或运行测试
 