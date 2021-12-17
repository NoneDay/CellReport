/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router';
import i18n from '@/lang' // Internationalization
import Store from '../store/';
Vue.use(VueRouter)
//vue-router.min.js:6 Uncaught (in promise) Error
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

//创建路由
export const createRouter = () => new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [...PageRouter, ...ViewsRouter]
})
const Router = createRouter()


AvueRouter.install(Vue, Router, Store, i18n);
Router.$avueRouter.formatRoutes(Store.state.user.menuAll, true);
Router.addRoutes([...PageRouter, ...ViewsRouter]);
export function resetRouter () {
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher // reset router
  AvueRouter.install(Vue, Router, Store, i18n);
}
export default Router