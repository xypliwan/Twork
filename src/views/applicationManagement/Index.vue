<template>
  <div class="application-management">
    <keep-alive :include="keepAliveArr">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ApplicationManagement',
  data() {
    return {
      input: ''
    }
  },
  computed: {
    ...mapGetters(['keepAliveArr'])
  }
}
</script>

<style scoped lang="scss">
.application-management {
  height: 100%;
}
</style>
