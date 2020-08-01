<template>
  <div class="top-navigation">
    <div class="flex-left">
      <img class="logo" src="../../assets/images/new_logo1.png" alt />&nbsp;
      <span style="color:#fff;font-size:15px;">Twork管理后台</span>
    </div>
    <div class="flex-center">
      <!-- #778dd7 -->
      <el-menu
        :router="true"
        :default-active="activeIndexUrl"
        mode="horizontal"
        background-color="#333854"
        text-color="#ffffff80"
        active-text-color="#ffffff"
      >
        <template v-for="(item, index) in userInfo.menu">
          <el-menu-item v-if="!item.child" :index="item.path" :key="index">{{
            item.name
          }}</el-menu-item>
          <el-submenu v-if="item.child" :index="item.path" :key="index">
            <template slot="title">{{ item.name }}</template>
            <el-menu-item
              v-for="(el, i) in item.child"
              :key="i"
              :index="el.path"
              >{{ el.name }}</el-menu-item
            >
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <div class="flex-right">
      <span style="margin-right:20px">
        <a
          style="text-decoration: none;color:#fff;"
          :href="receptionUrl"
          target="_blank"
          >返回前台</a
        >
      </span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- <i class="iconfont icon-zhanghao"></i> -->
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import baseURL from '@/config/baseUrl'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TopNavigation',
  props: {},
  data() {
    return {
      receptionUrl: baseURL.receptionURL,
      activeIndexUrl: '/home'
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tabList'])
  },
  methods: {
    ...mapActions(['clearUserInfo', 'clearToken']),
    loginOut() {
      this.clearToken()
      this.$router.push('/entrance/login')
    }
  }
}
</script>

<style scoped lang="scss">
$bgc: #333854;
$color: #adb0b8;
.top-navigation {
  overflow: hidden;
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  color: $color;
  background-color: $bgc;
  display: flex;
  font-size: 14px;
  .flex-left,
  .flex-right {
    padding: 0 20px;
    img {
      vertical-align: middle;
    }
  }
  .flex-center {
    flex: 1;
    min-width: 500px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
  }
  .logo {
    width: 24px;
    margin-right: 5px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  ::v-deep .el-menu.el-menu--horizontal {
    height: 50px;
    border: 0;
  }
  ::v-deep .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 0px solid #fff;
  }
  ::v-deep .el-menu.el-menu--horizontal .el-menu-item,
  ::v-deep .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 50px;
    line-height: 50px;
    border-bottom: 0px;
  }
  ::v-deep .is-active {
    background: rgba(255, 255, 255, 0.2) !important;
  }
}
</style>
