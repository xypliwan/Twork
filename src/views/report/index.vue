<template>
  <div class="report-manage">
    <div class="tabs">
      <ul>
        <li
          :class="{ active: active == 'ReportManagement' }"
          @click="active = 'ReportManagement'"
        >
          汇报管理
        </li>
        <!-- <li
          :class="{ active: active == 'ReportStatistics' }"
          @click="active = 'ReportStatistics'"
        >
          汇报统计
        </li> -->
      </ul>
    </div>
    <div class="report-content">
      <keep-alive>
        <component :is="active"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import ReportManagement from './report-management'
import ReportStatistics from './report-statistics'
export default {
  name: 'ReportIndex',
  components: {
    ReportManagement,
    ReportStatistics
  },
  data() {
    return {
      active: 'ReportManagement'
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.report-manage {
  height: 100%;
  padding: 10px;
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  .tabs {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    position: relative;
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
  .report-content {
    padding: 10px;
    height: calc(100% - 70px);
    overflow-y: auto;
  }
}
</style>
