import App from './runApp.vue'
import install_component from './install_component';
//import ElementUI from 'element-ui';
let ElementUI=window.ELEMENT
Vue.use(ElementUI, {size: 'mini'})
Vue.use(install_component)
Vue.config.productionTip = false
import loading from "@/util/loading"
import axios from 'axios'

//axios.defaults.timeout = 100*1000;

//axios.defaults.baseURL = baseUrl;

import { Message } from 'element-ui'
import website from '@/config/website';
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['needType']='json'
  //config.headers['worker_no']='14100298'
  config.headers['Authorization']='Bearer d2762dbd'
  if(window.__real_referer)
    config.headers['realReferer']=window.__real_referer
  if(window.__Authorization)
    config.headers['realAuthorization']=window.__Authorization
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
      config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

axios.interceptors.response.use(async res => {
  const status = Number(res.status) || 200;
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.message || '未知错误'+res.data.toString();
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
  if(res.data.message!=undefined && res.data.message.search('正在刷新缓存')){
      {
          loading.show(res.config)
          await sleep(5000);  
          loading.hide(res.config)
      }
      let ret=await axios(res.config)
      return ret
  }
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
  let err_txt=error.response.data?.message||error.response.statusText
  Message({
      message: err_txt,duration:10000,showClose: true,
      type: 'error'
  })
  return Promise.reject(new Error(err_txt));
})
new Vue({
  render: h => h(App),
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