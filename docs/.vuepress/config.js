const sidebar = require('./config/sidebar')
const nav = require('./config/nav')
module.exports = {
    title: 'CellReport',
    description: '我的个人网站',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/CellReport/', // 这是部署到github相关的配置 /CellReport/ 
    markdown: {
      //lineNumbers: false // 代码块显示行号
    },

    themeConfig: {
      huawei: true,
      lastUpdated: '最后更新时间',
      search: true,
      searchMaxSuggestions: 10,
      activeHeaderLinks: true,
      displayAllHeaders: true,
      startYear: '2022',
      author: 'NoneDay',
      record: '',
      recordLink: '',
      // 文档仓库
      docsRepo: 'https://github.com/NoneDay/CellReport',
      // 假如文档不是放在仓库的根目录下：
      docsDir: 'docs',
      // 假如文档放在一个特定的分支下：
      docsBranch: 'master',
      // 默认是 false, 设置为 true 来启用
      editLinks: true,
      // 默认为 "Edit this page"
      editLinkText: '在 GitHub 上编辑此页',
      //sidebarDepth: 2,
      nav: nav,
      sidebar: sidebar,
    },
    plugins: [
        [
            '@vuepress/pwa',
            {
                serviceWorker: true,
                updatePopup: {
                    message: "发现新内容可用",
                    buttonText: "刷新"
                }
            }
        ],
        // [
        //     '@vuepress/google-analytics',
        //     {
        //         ga: 'UA-149716079-1'
        //     }
        // ],
        // [
        //     '@vuepress/plugin-register-components',
        //     {
        //         components: [
        //             {
        //                 name: 'reco-home-page-one',
        //                 path: path.resolve(__dirname, './components/HomePageOne.vue')
        //             }
        //         ],
        //         componentsDir: path.resolve(__dirname, './demo')
        //     }
        // ],
        '@vuepress-reco/extract-code',
        'flowchart',
        ['sitemap', {
            hostname: 'https://igeekfan.cn'
        }],
        // require('./plugins/notification/index')
    ]
  };
