---
home: true
heroImage: /logo.png
heroText: CellReport
tagline: CellReport
actionText: 快速上手 →
actionLink: /zh/guide/
features:
- title: 高效 灵活
  details: 内部以专门为报表设计的 类js语言 为中心，以最少的配置帮助你专注于报表开发。
- title: Net6驱动 高性能
  details: 享受 Net6 的高效运行，占用极少的内存（300M左右），运行各种复杂的中国式报表。
- title: 中国式报表
  details: 专为常年制作报表的人士提供基于集合运算的多数据集支持，实现高效、快捷的完成报表制作。
- title: 多组件展现
  details: 基于dashborad 的单页面多组件展现，预置了30 多个为展现数据定制的组件（echart图、avue数据展现等）。
- title: 自由扩展
  details: 报表引擎可添加自定义函数，前端可自定义展现组件，通过内置语言自由扩展认证和权限接入。
- title:  通用数据源
  details: 数据源支持各种.net支持的数据库、excel文件、api服务、本软件制作的报表、其他报表软件的报表（如：reporting service 等）
  
footer: MIT Licensed | Copyright © 2022-present
---

## Getting Started
### 需要安装的软件
- 下载安装NETCORE6 SDK 或 RUNTIME.[Download .NET (Linux, macOS, and Windows)](https://dotnet.microsoft.com/download)
- 下载安装redis（可选）。最好安装 [https://github.com/MicrosoftArchive/redis/releases](https://github.com/MicrosoftArchive/redis/releases)
- [github下载release](https://github.com/NoneDay/CellReport/releases/download/1.0.1/cellreport.zip) 。


### 运行和配置
假设解压安装到了d:\cellReport。
- 1. 执行 start.bat
- 2. 浏览器输入地址:  http://127.0.0.1:5000
- 3. 缺省用户名密码:admin/database!123 。管理员用户在appsetting.json中存有（最后面可以找到），可以自行修改。

### 报表组管理
- 点报表目录，,选example，能看到所有的测试报表,可以学习基本使用方法.
- 缺省已经有了一个default组和example组。第一次登录，选报表组管理做基本的配置报表存放路径和数据库链接。可以根据不同的应用建立不同的组。报表组可以添加协助管理人员，多个用户中间用英文逗号分割。
 
 当前预安装的数据库驱动程序有:sqlServer、sqlite、Mysql、Pgsql、odbc。需要其他驱动的自行下载安装。
![](https://atts.w3cschool.cn/attachments/image/20211125/1637815124338385.png)

配置完毕后，按F5 刷新页面，点报表目录，正常的话，这是应该能看到所有的测试报表了.
