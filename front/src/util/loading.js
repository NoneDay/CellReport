import { Loading } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const loading = {
}
let loadingInstance = null

let lastRequest = new Date('2018')

loading.show = function(config) {
  config.loading = {
    type: 'loading',
    options: {
      fullscreen: true,
      lock: true,
      text: '正在载入...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)'
    }
  }
  if (config && config.loading && config.noloading==undefined) {
    const now = new Date()
    const ms = now - lastRequest
    lastRequest = now
    if (ms >= (config.loading.interval || 0)) { // 默认相隔超过两秒的请求才重新显示loading
      if (config.loading.type === 'loading') {
        loadingInstance = Loading.service(config.loading.options)
      } else if (config.loading.type === 'nprogress') {
        NProgress.start()
      }
    }
  }
}

loading.hide = function(config) {
  if (config && config.loading) {
    if (config.loading.type === 'loading' && loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    } else if (config.loading.type === 'nprogress') {
      NProgress.done()
    }
  }
} 

export default loading
