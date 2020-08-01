import Vue from 'vue'
import VueRouter from 'vue-router'
import { getLocalStorage } from '@/utils/localStorage'
Vue.use(VueRouter)
import common from './common' //公共
import applicationMarket from './applicationMarket' //应用市场
import applicationManagement from './applicationManagement' //应用管理
import systemSetting from './systemSetting' //系统设置
import Layout from '@/layout/Index'
import agentManage from './agentManage' //流程模块
import BusinesScenario from './businessScenario' //业务场景
import Report from './report' //汇报模块

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

//authentication: true, 需要登录成功才能访问的页面

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  ...common,
  ...applicationMarket,
  ...applicationManagement,
  ...systemSetting,
  ...agentManage,
  ...BusinesScenario,
  ...Report,
  {
    path: '*',
    component: Layout,
    children: [
      {
        path: '*',
        name: 'ErrorPage',
        component: () => import('@/views/404/Index.vue'),
        meta: {
          title: '404',
          name: 'ErrorPage',
          authentication: false
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.authentication && !getLocalStorage('access_token')) {
    next({ path: '/404' })
  } else {
    next()
  }
})
export default router
