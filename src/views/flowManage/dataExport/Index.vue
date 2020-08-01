<template>
  <div class="data-export">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="数据导出" name="first">
        <export-list></export-list>
      </el-tab-pane>
      <el-tab-pane label="数据导出记录" name="second">
        <log-list v-if="active"></log-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import exportList from './exportList/exportList'
import logList from './logList/logList'
export default {
  name: 'dataExport',
  components: {
    exportList,
    logList
  },
  data() {
    return {
      active: false,
      activeName: 'first'
    }
  },
  created() {},
  methods: {
    handleClick() {
      if (this.activeName == 'second') this.active = true
    }
  }
}
</script>

<style scoped lang="scss">
.data-export {
}
</style>
