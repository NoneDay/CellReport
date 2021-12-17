# 快速上手

## 依赖环境

- [net6 sdk 或 runtime](https://nodejs.org/)
- [redis](https://classic.yarnpkg.com/zh-Hans/) （可选）

::: tip
- 使用 [pnpm](https://pnpm.io/zh/) 时，你需要在 [`.npmrc`](https://pnpm.io/zh/npmrc#shamefully-hoist) 文件中设置 `shamefully-hoist=true` 。
- 使用 [yarn 2](https://yarnpkg.com/) 时，你需要在 [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) 文件中设置 `nodeLinker: 'node-modules'` 。
:::

## 手动安装

这一章节会帮助你从头搭建一个 CellReport 设计和运行网站。

- **步骤1**: 下载
下载并安装 net6sdk 或 runtime 
下载Redis（可选）。如果需要对最终报表结果缓存，请下载
下载解压本软件的release到一个目录。假设下载解压到了d:\\cellReport
运行：
```bash
cd cellReport
//启动
reportWeb.exe  --urls "http://*:8090" --webroot "D:\cellReport\wwwroot"
//或 linux 下以这种方式启动
dotnet reportWeb.dll  --urls "http://*:8090" --webroot "D:\cellReport\wwwroot"
// 指定启动端口为8090 和 静态文件存放路径
```
如果不指定urls参数，将运行在端口5000 ，如果不指定webroot ，缺省就是当前目录的wwwroot

- **步骤2**: 首次运行和测试
使用chrome （版本81 以后的才可以）或最新的 edge 浏览器,登陆网址：
```
http://127.0.0.1:8090
```
缺省的管理员用户名口令在appsetting.json中，查找admin_user 和 admin_password

选中《报表组管理》，添加测试组，设置测试报表存放目录、添加测试数据源,名称testsqliite 。测试期间，可将管理员设置为admin。
如果需要新的数据源，请在这里添加。
```
测试数据源的连接串
Data Source=E:\my_app\test.db

sql server 连接串
Data Source=ip地址;Initial Catalog=数据库名字;Persist Security Info=True;User ID=用户;Password=口令;Min Pool Size=1;Max Pool Size=50;Connect Timeout=15000;Application Name=报表连接
```
配置完毕后，按F5 刷新页面，点报表目录，正常的话，这是应该能看到所有的测试报表了。

- **步骤3**: 自己的第一张报表
在报表目录页面，点新增报表，进入设计页面后，选
<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
yarn add -D vuepress@next
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
npm install -D vuepress@next
```

  </CodeGroupItem>
</CodeGroup>

- **步骤4**: 在 `package.json` 中添加一些 [scripts](https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts)

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

- **步骤5**: 将默认的临时目录和缓存目录添加到 `.gitignore` 文件中

```bash
echo 'node_modules' >> .gitignore
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```

- **步骤6**: 创建你的第一篇文档

```bash
mkdir docs
echo '# Hello VuePress' > docs/README.md
```

- **步骤7**: 在本地启动服务器来开发你的文档网站

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
yarn docs:dev
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
npm run docs:dev
```

  </CodeGroupItem>
</CodeGroup>

  VuePress 会在 [http://localhost:8080](http://localhost:8080) 启动一个热重载的开发服务器。当你修改你的 Markdown 文件时，浏览器中的内容也会自动更新。

现在，你应该已经有了一个简单可用的 VuePress 文档网站。接下来，了解一下 VuePress [配置](./configuration.md) 相关的内容。