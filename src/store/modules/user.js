// 用户信息
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage
} from '_u/localStorage'
import { getDepartmentInfo } from '@/api/common'
const user = {
  state: {
    access_token: getLocalStorage('access_token') || '',
    userInfo: {}, //用户信息
    companyData: {}, //企业信息
    userAuth: [], //权限信息
    architectList: [] //公司部门架构人员
  },
  mutations: {
    SET_USERINFO: (state, user) => {
      state.userInfo = user
      setLocalStorage('userinfo', user)
    },
    CLEAR_USERINFO: state => {
      state.userInfo = {}
      removeLocalStorage('userinfo')
    },
    SET_COMPANYINFO: (state, company) => {
      state.companyData = company
    },
    SET_TOKEN: (state, token) => {
      state.access_token = token
      setLocalStorage('access_token', token)
    },
    CLEAR_TOKEN: state => {
      state.access_token = ''
      removeLocalStorage('access_token')
    },
    GET_USERAUTH: (state, userAuth) => {
      state.userAuth = userAuth
    },
    SET_ARCHITECTLIST: (state, list) => {
      state.architectList = list
    }
  },
  actions: {
    setUserInfo: ({ commit }, user) => {
      return commit('SET_USERINFO', user)
    },
    clearUserInfo: ({ commit }) => {
      return commit('CLEAR_USERINFO')
    },
    setCompanyInfo: ({ commit }, company) => {
      return commit('SET_COMPANYINFO', company)
    },
    setToken: ({ commit }, token) => {
      return commit('SET_TOKEN', token)
    },
    clearToken: ({ commit }) => {
      return commit('CLEAR_TOKEN')
    },
    getAuth: ({ commit }, userAuth) => {
      return commit('GET_USERAUTH', userAuth)
    },
    getArchitectList: async ({ commit }) => {
      let { data } = await getDepartmentInfo({ 'get-people': 1 })
      commit('SET_ARCHITECTLIST', data)
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    companyData: state => state.companyData,
    userAuth: state => state.userAuth,
    architectList: state => state.architectList
  }
}

export default user
