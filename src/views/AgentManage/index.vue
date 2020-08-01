<template>
  <div class="agent-box">
    <div class="agent-header">
      <router-link class="item" tag="div" to="initiationPprocess"
        >发起流程</router-link
      >
      <router-link class="item" tag="div" to="pend">待我处理的</router-link>
      <router-link class="item" tag="div" to="processed"
        >我已处理的</router-link
      >
      <router-link class="item" tag="div" to="initiated">我发起的</router-link>
      <router-link class="item" tag="div" to="copyme">抄送我的</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'agentManage'
}
</script>

<style lang="scss" scoped>
.agent-box {
  background: #fff;
  height: 100%;
  .agent-header {
    height: 60px;
    display: flex;
    justify-items: center;
    border-bottom: 2px solid #f1f1f1;
    align-items: center;
    .item {
      flex: 1;
      text-align: center;
      font-size: 18px;
      color: #999;
      font-weight: 600;
      cursor: pointer;
      &.router-link-active {
        color: #539fff;
      }
    }
  }
}
</style>
