<template>
  <div id="layout" v-cloak>
    <div class="top-nav">
      <top-navigation></top-navigation>
      <menu-label></menu-label>
    </div>
    <div class="container">
      <keep-alive :include="keepAliveArr">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopNavigation from '_c/menu/TopNavigation'
import MenuLabel from '_c/menu/MenuLabel'
import { mapGetters, mapActions } from 'vuex'
import { userInfo } from '@/api/user'
import { getLocalStorage } from '@/utils/localStorage'
import { companyInfo } from '@/api/companyInfo'

export default {
  components: { TopNavigation, MenuLabel },
  data() {
    return {
      routerQuery: {}
    }
  },
  computed: {
    ...mapGetters(['keepAliveArr'])
  },
  watch: {
    $route(newVal) {
      if (newVal.meta) {
        this.addTablist(newVal.meta) //加入顶部标签数组中
      }
    }
  },
  async beforeCreate() {
    //页面刷新重新获取用户信息
    if (getLocalStorage('access_token')) {
      try {
        let { data } = await userInfo({ auth: 'manageAuth' })
        this.setUserInfo(data) //用户信息保存到vuex
        let arr = data.button.map(el => el.code)
        this.getAuth(arr) //按钮权限保存到vuex
      } catch (error) {
        this._message(error)
      }
    }
  },
  created() {
    if (this.$route.meta) this.addTablist(this.$route.meta) //页面刷新时添加当前页到顶部标签数组中
    this.routerQuery = this.$route.query
    if (this.routerQuery.access_token) {
      this.setToken(this.routerQuery.access_token)
    }
    let company_id =
      this.routerQuery.company_id || getLocalStorage('userinfo').company_id
    this.getCompanyInfo(company_id)
    this.getArchitectList()
    // this.getUserAuth();
  },
  methods: {
    ...mapActions([
      'setToken',
      'setUserInfo',
      'setCompanyInfo',
      'addTablist',
      'getAuth',
      'getArchitectList'
    ]),
    // 获取企业信息
    async getCompanyInfo(id) {
      try {
        let { data } = await companyInfo({ company_id: id })
        this.setCompanyInfo(data)
      } catch (error) {
        this._message(error)
      }
    }
    // // 获取用户权限
    // async getUserAuth() {
    //   try {
    //     let { data } = await getUserAuth();
    //     let arr = [];
    //     Object.keys(data).forEach(key => {
    //       arr.push(data[key].code);
    //     });
    //     this.getAuth(arr);
    //   } catch (error) {
    //     this._message(error);
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';

#layout {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  min-width: 800px;
  .container {
    padding: 10px;
    height: calc(100% - 80px);
    @include scrollBar();
  }
}
</style>
