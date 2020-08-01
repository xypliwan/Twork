<template>
  <div class="system-settting">
    <div class="flex">
      <div class="flex-left">
        <!-- v-if="_menuPermission(item.path)" -->
        <div
          v-for="(item, index) in leftData"
          :key="index"
          class="flex-left-item"
          :class="{ 'item-active': item.path == currentIndex }"
          @click="clickTab(item, index)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="flex-right">
        <keep-alive :include="keepAliveArr">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SystemSetting',
  data() {
    return {
      input: '',
      currentIndex: this.$route.path || '/systemSetting/companyInfo',
      leftData: [
        { name: '企业信息', path: '/systemSetting/companyInfo' },
        { name: '用户成员', path: '/systemSetting/userMembers' },
        { name: '角色权限', path: '/systemSetting/rolePermission' },
        { name: '管理日志', path: '/systemSetting/adminLog' },
        { name: '绑定钉钉', path: '/systemSetting/bindingNailing' }
      ]
    }
  },
  computed: {
    ...mapGetters(['keepAliveArr'])
  },
  watch: {
    $route(val) {
      this.currentIndex = val.path
    }
  },
  methods: {
    clickTab(item) {
      this.currentIndex = item.path
      this.$router.push(item.path)
    }
  }
}
</script>

<style scoped lang="scss">
.system-settting {
  height: 100%;
  // background-color: #fff;
  .flex {
    width: 100%;
    height: 100%;
    display: flex;
    .flex-left {
      width: 200px;
      border-right: 1px solid #eee;
      background-color: #fff;
      .flex-left-item {
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
      .item-active {
        color: #586fcf;
        background-color: #e8f7ff;
        box-shadow: #586fcf 3px 0px 0 inset;
      }
    }
    .flex-right {
      margin-left: 10px;
      background-color: #fff;
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
