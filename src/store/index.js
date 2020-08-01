import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './modules/user'
import cachedPage from './modules/cachedPage'
import flow from './modules/flow'
import report from './modules/report'

export default new Vuex.Store({
  modules: {
    user,
    cachedPage,
    flow,
    report
  }
})
