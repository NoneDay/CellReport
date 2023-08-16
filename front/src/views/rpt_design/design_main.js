//import Vue from 'vue'
import App from './designApp.vue'
//import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import CellReportFormDesign from './index';

let ElementUI=window.ELEMENT
import elDragDialog from './utils/el-drag-dialog' // 引入移动事件（el-drag-dialog.js的内容为上面的代码块）
Vue.directive('el-drag-dialog', elDragDialog);//添加标签事件绑定 可以放大移动弹窗
//弹窗默认点击遮罩改为不关闭 为了防止和拖拽冲突 ，这句需要放在use ElementUI之前（也可以不加这句，自己测试区别）
ElementUI.Dialog.props.closeOnClickModal.default = false;


Vue.use(ElementUI, {size: 'small'})
//Vue.use(window.AVUE)
Vue.use(CellReportFormDesign)
Vue.config.productionTip = false

import axios from 'axios'
import { Message } from 'element-ui'
import website from '@/config/website';
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  if(config.headers['needType']==undefined)
    config.headers['needType']='json'
  config.headers['worker_no']='xxxx'
  config.headers['Authorization']='Bearer d2762dbd'
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
      config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
axios.interceptors.response.use(res => {
  const status = Number(res.status) || 200;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.message || '未知错误'+res.data.toString();
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
      Message({
          message: message,duration:10000,showClose: true,
          type: 'error'
      })
      return Promise.reject(res.data)
  }
  return res.data;
}, error => {
  Message({
      message: error,duration:10000,showClose: true,
      type: 'error'
  })
  return Promise.reject(new Error(error));
})

new Vue({
  render: h => h(App),
}).$mount('#app')
