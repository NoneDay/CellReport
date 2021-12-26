# 概述

本节主要讲解与报表制作非直接相关的配置

## 安装数据库驱动
- 缺省安装了sqlite 和 sqlServer 驱动。如果需要其他驱动，打开reportWeb目录下的appsetting.json,将合适的驱动加上就可以了.如果没有下面列出的驱动，请自行下载添加即可。
```js

{
    "name": "Npgsql",
    "dllName": "Npgsql",
    "FactoryClass": "Npgsql.NpgsqlFactory",
    "InstanceName": "Instance"
},

{
    "name": "MySql",
    "dllName": "MySql.Data",
    "FactoryClass": "MySql.Data.MySqlClient.MySqlClientFactory",
    "InstanceName": "Instance"
},
{
    "name": "odbc",
    "dllName": "System.Data.Odbc",
    "FactoryClass": "System.Data.Odbc.OdbcFactory",
    "InstanceName": "Instance"
}
```