<template>
  <div id="app">
    <!-- 新增测试2 -->
    <router-view />
  </div>
</template>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm('当前页面数据未保存，确定要离开？')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
</script>

<style lang="scss">
html,
body {
  background: #eff1f6;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #666;
  // color: #2c3e50;
  font-size: 14px;
  background: #eff1f6;
  height: 100vh;
  width: 100%;
  // overflow: hidden;
}
</style>
