
## 介绍

CellReport 前端代码

## 文档

## 开发

```
# 克隆项目

# 进入项目

# 安装依赖
npm i
修改node_modules 下的x2js 目录下的x2js.js 文件,需要修改212行的 escapeXmlChars(),添加
.replace(/\n/g, '&#xA;') 
   
# 启动服务
npm run serve
# 前端构建打包
npm run build
```
## 功能

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2021-present, Noneday