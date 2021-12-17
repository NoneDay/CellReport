//侧边栏
module.exports = {
    '/dotnetcore/examples/': [
        {
            title: '.NET Core示例',
            collapsable: true,
            children: [
                'console-hello-world',
                'console-news-types',
                'freesql-in-aspnetcore-webapi-how-to-use',
                'freesql-sample-blog-restful-use-automapper',
                'identityserver4',
                'qiniu-object-storage',
                'imcore-chat'
            ]
        }
    ],
    '/dotnetcore/lin-cms/': [{
        title: '起步',
        collapsable: true,
        children: [
            'dotnetcore-start.md',
            'cms-start.md',
            'technology.md',
            'vue-start.md',
            'open-source-road.md',
            'pm-design-modules.md',
            'production-design.md',
            'github-actions.md',
        ]
    }, {
        title: '.NET Core',
        collapsable: true,
        children: [
            'file-upload.md',
            'logger.md',
            'table.md',
            'authorize.md',
            'lincms-scaffolding.md'
        ]
    }, {
        title: '开发者文档',
        collapsable: true,
        children: [
            'dev-start',
            'newtonsoft-json-question',
            'dependency-injection-scrutor',
            'dynamic-authorization-in-aspnetcore',
            'reflex-assembly-get-controller-methods-attribute',
            'identityserver4-jwt',
            'stopwords',
            'spa-github-login',
            'qq-login',
            'rabbitmq',
            'scribanREADME.md'
        ]
    }],
    '/colorui/': [
        {
            title: 'ColorUI文档',
            collapsable: true,
            children: [
                'docs/button',
                'docs/text',
            ]
        }
    ],
}
