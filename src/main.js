import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/global.scss'
import './assets/font/iconfont.css'

//流程设计css
import './utils/flow/element.js'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/element-variables.scss'
Vue.use(ElementUI)

import NProgress from 'nprogress' //页面加载进度
import 'nprogress/nprogress.css'
// NProgress.inc(0.2);
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})

// import Node from 'workflow-ui/src/components/Generator/node'
// Vue.component('Node', Node)

import Vue2OrgTree from 'vue2-org-tree'
Vue.use(Vue2OrgTree)

import mixin from '@/utils/mixin'
Vue.mixin(mixin)

import nodeWrap from '@/components/flow/nodeWrap'
Vue.use(nodeWrap)
Vue.component('nodeWrap', nodeWrap) //初始化组件
import addNode from '@/components/flow/addNode'
Vue.use(addNode)
Vue.component('addNode', addNode) //初始化组件

Vue.config.productionTip = false

Vue.directive('enterNumber', {
  bind: function(el, { value = 2 }) {
    el = el.nodeName == 'INPUT' ? el : el.children[0]
    var RegStr =
      value == 0
        ? `^[\\+\\-]?\\d+\\d{0,0}`
        : `^[\\+\\-]?\\d+\\.?\\d{0,${value}}`
    el.addEventListener('keyup', function() {
      el.value = el.value.match(new RegExp(RegStr, 'g'))
      el.dispatchEvent(new Event('input'))
    })
  }
})

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el) {
    el.focus()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
