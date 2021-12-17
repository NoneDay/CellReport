import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache';//页面缓冲
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import ElementUI from 'element-ui';
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env';
import i18n from './lang' // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);
Vue.use(router)
Vue.use(VueAxios, axios)
axios.defaults.timeout = 600*1000;
Vue.use(ElementUI, {size: 'mini',
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(window.AVUE, {size: 'mini',
  i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('basicBlock', basicBlock)
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
})

// 动态加载阿里云字体库
//iconfontVersion.forEach(ele => {
//  loadStyle(iconfontUrl.replace('$key', ele));
//})

//import CellReportFormDesign from './views/rpt_design/index';
//Vue.use(CellReportFormDesign)

import DlgDraggable from "vue-element-dialog-draggable"
Vue.use(DlgDraggable, {
  containment: true //Constrains dragging to within the bounds of the window.  Default: false.
});
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

if (String.prototype.replaceAll===undefined){
String.prototype.replaceAll = function (targetStr, newStr) {
  var sourceStr = this.valueOf();
  while (sourceStr.indexOf(targetStr) !== -1) {
    sourceStr = sourceStr.replace(targetStr, newStr);
  }
  return sourceStr;
};
}