import Layout from '@/page/index/main_index'
export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/index')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
  }]
},  {
  path: '/form-detail',
  component: Layout,
  children: [{
    path: 'index',
    name: '详情页',
    meta: {
      i18n: 'detail'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/form-detail')
  }]
},{
  path: '/rpt-list',
  component: Layout,
  children: [{
    path: 'index',
    name: '报表目录', 
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views_rpt_desgin" */ '@/views/rpt_design/list')
  }]
},{
  path: '/manger',
  component: Layout,
  children: [{
    path: 'index',
    name: '报表组管理', 
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views_rpt_desgin" */ '@/views/rpt_design/manger')
  }]
}
,{
  path: '/crud_template',
  component: Layout,
  children: [{
    path: 'index',
    name: 'CRUD代码生成', 
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views_rpt_desgin" */ '@/views/rpt_design/crud_template')
  }]
}
,{
  path: '/widget',
  component: Layout,
  children: [{
    path: 'index',
    name: '组件管理', 
    meta: {
      keepAlive: false,
    },
    component: () =>
      import( /* webpackChunkName: "views_rpt_desgin" */ '@/views/rpt_design/widgetManger')
  }]
},{
  path: '/rpt-design',
  component: Layout,
  children: [{
    path: 'index',
    name: '报表设计', 
    meta: {
      keepAlive: true,
    },
    component: () =>
      import( /* webpackChunkName: "views_rpt_desgin" */ '@/views/rpt_design/design_index')
  }]
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/user/info')
  }, {
    path: 'setting',
    name: '个人设置',
    meta: {
      i18n: 'setting'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/user/setting')
  }]
}]