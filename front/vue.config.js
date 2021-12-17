const  path = require('path')

function resolve(dir){
    return path.join(__dirname, dir)
}
// 基础路径 注意发布之前要先修改这里
let baseUrl = './'
const port = process.env.port || process.env.npm_config_port || 8080 // dev port
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  publicPath: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: false,
    productionSourceMap: true,
    // configureWebpack: config => {
    //     if (process.env.NODE_ENV === 'production') {
    //         return {
    //             plugins: [
    //                 new BundleAnalyzerPlugin()
    //             ]
    //         }
    //     }
    // },
    devServer: {
        port: port,
        //open: true,
        //overlay: {
        //  warnings: false,
        //  errors: true
        //},before: require('./mock/mock-server.js')
        //,
        proxy: { 
            "/aps/report5": {
                target: "http://127.0.0.1:5000/",
                changeOrigin: true,//是否允许跨域
                ws: true,
                pathRewrite: {
                    "^/aps/report5": ""
                }
            },
            "/report5": {
                target: "http://127.0.0.1:5000/",
                changeOrigin: true,//是否允许跨域
                ws: true,
                pathRewrite: {
                    "^/report5": ""
                }
            },
            "/aps": {
                target: "http://127.0.0.1:5050/",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/aps": ""
                }
            },

        }
    },//*
    pages: {
      //（1）输出一个页面
          main: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
          },
      //（2）输出多个页面
      design: {
        template: "public/design_index.html",
        entry: "src/views/rpt_design/design_main.js",
        filename: "design_index.html"
      },
      run: {
        template: "public/run_index.html",
        entry: "src/views/rpt_design/run_main.js",
        filename: "run.html"
      }
    },//*/
    chainWebpack: (config) => {
      // 移除 prefetch 插件
      //config.plugins.delete('prefetch');
      // 移除 preload 插件，避免加载多余的资源
      //config.plugins.delete('preload');

      //config.optimization.minimize(true);

      //config.optimization.splitChunks({chunks: 'all'})
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
            'CodeMirror':'CodeMirror',
            'vue-grid-layout':'VueGridLayout',
            "xlsx":"xlsx",//很大的一个包
            'monaco-editor':'monaco-editor',
            'echarts':'echarts',
        })
        config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

        //const entry = config.entry('app')
        //entry
        //    .add('babel-polyfill')
        //    .end()
        //entry
        //    .add('classlist-polyfill')
        //    .end()
        //entry
        //    .add('@/mock')
        //    .end()
    },
    configureWebpack:config => {
        return
        // config.plugins.push(["equire"]);
        if (process.env.NODE_ENV !== 'development') {
          config.output.filename = 'assets/[name].[hash:8].js'
          config.output.chunkFilename = 'assets/[name].[hash:8].js'
        }
        // 公共代码抽离
        config.optimization = {
          // 分割代码块
          splitChunks: {
            cacheGroups: {
              //公用模块抽离
              common: {
                chunks: 'initial',
                minSize: 0, //大于0个字节
                minChunks: 2, //抽离公共代码时，这个代码块最小被引用的次数
              },
              //第三方库抽离
              vendor: {
                priority: 1, //权重
                test: /node_modules/,
                chunks: 'initial',
                minSize: 0, //大于0个字节
                minChunks: 2, //在分割之前，这个代码块最小应该被引用的次数
              },
            },
          }
        }
    }
}