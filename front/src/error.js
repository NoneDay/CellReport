import Vue from 'vue';
import store from './store'
Vue.config.errorHandler = function (err, vm, info) {

  Vue.nextTick(() => {
    store.commit('ADD_LOGS', {
      type: 'error',
      message: err.message,
      stack: err.stack,
      info
    })
    if (process.env.NODE_ENV === 'development') {
      console.group('>>>>>> 错误信息 >>>>>>')
      console.error(info)
      console.groupEnd();
      console.group('>>>>>> Vue 实例 >>>>>>')
      console.log(vm)
      console.groupEnd();
      console.group('>>>>>> Error >>>>>>')
      console.log(err)
      console.groupEnd();
    }
  })
}