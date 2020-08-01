<template>
  <div class="flow-manage">
    <div class="tabs">
      <el-button
        size="mini"
        class="back-left"
        icon="el-icon-arrow-left"
        @click="backHistory"
        >返回</el-button
      >
      <ul>
        <li :class="{ active: active == 1 }" @click="toTarget(1)">流程管理</li>
        <li :class="{ active: active == 2 }" @click="toTarget(2)">数据导出</li>
      </ul>
    </div>
    <div class="content scrollbar" :class="{ content2: active == 2 }">
      <flow-module v-show="active == 1"></flow-module>
      <data-export v-show="active == 2"></data-export>
    </div>
  </div>
</template>

<script>
import flowModule from './flowModule/Index'
import dataExport from './dataExport/Index'
export default {
  name: 'FlowManage',
  components: { flowModule, dataExport },
  data() {
    return {
      active: 1
    }
  },
  created() {},
  methods: {
    backHistory() {
      this.$router.go(-1)
    },
    toTarget(val) {
      this.active = val
    }
  }
}
</script>

<style scoped lang="scss">
.flow-manage {
  height: 100%;
  padding: 10px;
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  .tabs {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    position: relative;
    .back-left {
      position: absolute;
      z-index: 9;
      top: 8px;
      left: 5px;
    }
    ul {
      margin: 0 auto;
      width: 200px;
      height: 50px;
      line-height: 50px;
      display: flex;
      font-size: 20px;
      font-weight: bold;
      align-items: center;
      justify-content: center;
      li {
        text-align: center;
        flex: 1;
        cursor: pointer;
        font-size: 15px;
        &.active {
          color: $themeColor;
          transition: all 0.3s ease-in;
          box-shadow: $themeColor 0px -2px 0px inset;
        }
      }
    }
  }
  .content {
    height: calc(100% - 70px);
    overflow-y: auto;
  }
  .content2 {
    height: calc(100% - 110px);
  }
}
</style>
