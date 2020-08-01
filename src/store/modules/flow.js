// 流程

const flow = {
  state: {
    completeRouteUserStore: [], //完整的发起人路径,
    promoterNameStore: '', //选择的发起人人名
    promoterInfo: {
      //发起人信息
      department: [], //部门信息
      user: [], //人信息
      nameArr: [] //名字集合
    },

    selectForm: [], //表单设计中已选中且必填的条件表单，（条件选择）
    conditionListStore: [], //已选中的条件（当前流程所有的条件列表）

    produceCodeStore: '', //基础设置的系统代码
    isProcessDetail: false, //当前新增流程是否时流程详情
    flowIconList: [
      { url: 'flow1.png' },
      { url: 'flow2.png' },
      { url: 'flow3.png' },
      { url: 'flow4.png' },
      { url: 'flow5.png' },
      { url: 'flow6.png' },
      { url: 'flow7.png' },
      { url: 'flow8.png' },
      { url: 'flow9.png' },
      { url: 'flow10.png' },
      { url: 'flow11.png' },
      { url: 'flow12.png' },
      { url: 'flow13.png' },
      { url: 'flow14.png' },
      { url: 'flow15.png' },
      { url: 'flow16.png' }
    ]
  },
  mutations: {
    SET_COMPLETEROUTERUSER: (state, user) => {
      state.completeRouteUserStore = user
    },
    SET_PROMOTERNAMESTORE: (state, name) => {
      state.promoterNameStore = name
    },
    SET_PROMOTERINFO: (state, obj) => {
      state.promoterInfo = obj
    },
    CLEAR_PROMOTERINFO: state => {
      state.promoterInfo.department = []
      state.promoterInfo.user = []
      state.promoterInfo.nameArr = []
    },
    GET_SELECTFORM: (state, list) => {
      state.selectForm = list
    },
    DEL_SELECTFORM: state => {
      state.selectForm = []
    },
    ADD_CONDITIONLIST: (state, item) => {
      state.conditionListStore.push(item)
    },
    DEL_CONDITIONLIST: state => {
      state.conditionListStore = []
    },
    SET_PRODUCT: (state, code) => {
      state.produceCodeStore = code
    },
    SET_ISPROCESSDETAIL: (state, flg) => {
      state.isProcessDetail = flg
    }
  },
  actions: {
    setCompleteRouteUserStore: ({ commit }, user) => {
      return commit('SET_COMPLETEROUTERUSER', user)
    },
    setPromoterNameStore: ({ commit }, name) => {
      return commit('SET_PROMOTERNAMESTORE', name)
    },
    setPromoterInfo: ({ commit }, obj) => {
      return commit('SET_PROMOTERINFO', obj)
    },
    clearPromoterInfo: ({ commit }) => {
      return commit('CLEAR_PROMOTERINFO')
    },
    getSelectForm: ({ commit }, list) => {
      return commit('GET_SELECTFORM', list)
    },
    delSelectFrom: ({ commit }) => {
      return commit('DEL_SELECTFORM')
    },
    addConditionList: ({ commit }, item) => {
      return commit('ADD_CONDITIONLIST', item)
    },
    delConditionList: ({ commit }) => {
      return commit('DEL_CONDITIONLIST')
    },
    setProduct: ({ commit }, code) => {
      return commit('SET_PRODUCT', code)
    },
    setIsProcessDetail: ({ commit }, flg) => {
      return commit('SET_ISPROCESSDETAIL', flg)
    }
  },
  getters: {
    completeRouteUserStore: state => state.completeRouteUserStore,
    promoterNameStore: state => state.promoterNameStore,
    promoterInfo: state => state.promoterInfo,
    selectForm: state => state.selectForm,
    conditionListStore: state => state.conditionListStore,
    produceCodeStore: state => state.produceCodeStore,
    isProcessDetail: state => state.isProcessDetail,
    flowIconList: state => state.flowIconList
  }
}

export default flow
