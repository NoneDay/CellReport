/**
 * 全站http配置
 *
 * axios 参数说明
 * isSerialize 是否开启form表单提交
 * isToken 是否需要token
 */

import store from '@/store/';
import router from '@/router/router'
import { serialize } from '@/util/util'
import { getStore } from '@/util/store'
import { Message } from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { baseUrl } from '@/config/env';

import loading from "@/util/loading"
axios.defaults.timeout = 1000*1000;
axios.defaults.baseURL = baseUrl;

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
    showSpinner: true
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    loading.show(config)
    
    const meta = (config.meta || {});
    const isToken = meta.isToken === false;
    const token=getStore({name:"token"})
    if ( token && !isToken) {
        if(config.headers['Authorization']==undefined)
            config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    //headers中配置serialize为true开启序列化
    if (config.method === 'post' && meta.isSerialize === true) {
        config.data = serialize(config.data);
    }
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(async res => {
    NProgress.done();
    
    const status = Number(res.status) || 200;
    
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.message || '未知错误'+res.data.toString();
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    //如果是401则跳转到登录页面
    if (status === 401){
        if(res.headers['token-expired']=='true' || message.indexOf("过期")>=0 ){
             // Create new promise to handle exponential backoff
            await store.dispatch("RefreshToken")
            delete res.config.headers.Authorization
            let ret=await axios(res.config)
            return ret
        }
        loading.hide(res.config)
        store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
    }
    loading.hide(res.config)
    
    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
        Message({
            message: message,duration:100000,showClose: true,
            type: 'error'
        })
        return Promise.reject(res.data)
    }

    if(res.data.task_id!=undefined){
        if(res.data.task_status!="SUCCESS"){
            loading.show(res.config)
            await sleep(2000);  
            loading.hide(res.config)
        }
        let ret=await axios({url: `/mg/getResultByTaskId/`,
            method: 'post',
            data:res.data,
            loading: res.config.loading}
        )
        return ret
    }

    return res.data;
}, error => {
    
    NProgress.done();
    loading.hide(error.config)
    let ret_msg=error.message
    if (error.response?.data?.message)
        ret_msg=error.response.data.message
    Message({
        message: ret_msg,duration:100000,showClose: true,
        type: 'error'
    })
    return Promise.reject(new Error(error));
})

export default axios;