<template>
  <div class="report-management">
    <div class="report-header">
      <span class="report-txt">汇报管理</span>
      <add-report-grounp
        id="add-report-group"
        @addOk="getReportListFn"
      ></add-report-grounp>
      <el-input
        size="small"
        style="width:250px;"
        clearable
        placeholder="请输入内容"
        v-model="keyworks"
        @keyup.enter.native="getReportListFn"
        @clear="clearKeyword"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="getReportListFn"
        ></i>
      </el-input>
      <el-button
        id="add-report-model"
        slot="reference"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        class="fr"
        @click="addReport"
        >新建模板</el-button
      >
    </div>
    <div class="list-content" v-loading="listLoading">
      <report-list
        :reportList="reportList"
        ref="listRef"
        @moveOk="getReportListFn"
      ></report-list>
    </div>
  </div>
</template>
<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import AddReportGrounp from './components/AddReportGrounp'
import ReportList from './components/ReportList'
import { getReportList } from '@/api/report'
import { closeTip } from '@/api/common'
import { userInfo } from '@/api/user'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ReportManagement',
  data() {
    return {
      addGrounpVisible: false,
      listLoading: false,
      reportList: [],
      keyworks: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    userInfo(val) {
      if (val && val.close_report === 0) {
        this.guide()
      }
    }
  },
  created() {
    this.getReportListFn()
  },
  activated() {
    if (this.$route.query.refresh) {
      this.getReportListFn()
    }
  },
  mounted() {
    this.driver = new Driver({
      className: 'driver-popover',
      doneBtnText: '不再提示', // 结束按钮的文字
      animate: true,
      opacity: '0.6',
      padding: 10,
      allowClose: false, // 是否可以通过点击遮罩层关闭指引
      stageBackground: '#ffffff', // 突出显示元素的背景颜色
      nextBtnText: '下一步', // 下一步按钮的文字
      prevBtnText: '上一步', // 上一步按钮的文字
      closeBtnText: '关闭', // 关闭按钮的文字
      keyboardControl: false, // 是否允许键盘操控
      xCloseButton: false, // 将关闭按钮作为X放在弹出
      onNext: el => {
        if (el.options.element == '#add-report-model') {
          this.closeTip()
        }
      }
    })
    if (this.userInfo && this.userInfo.close_report === 0) {
      this.guide()
    }
  },
  methods: {
    ...mapActions(['setUserInfo']),
    guide() {
      this.$nextTick(() => {
        this.driver.defineSteps(steps)
        this.driver.start()
      })
    },
    async closeTip() {
      try {
        await closeTip({ column: 'close_report' })
        let { data } = await userInfo({ auth: 'manageAuth' })
        this.setUserInfo(data) //用户信息保存到vuex
      } catch (error) {
        this._message(error)
      }
    },
    async getReportListFn() {
      this.listLoading = true
      try {
        let { data } = await getReportList({ report_name: this.keyworks })
        this.reportList = data

        this.reportList.forEach(el => {
          el.isExpend = false
        })

        if (this.keyworks.length > 0) {
          const snapActiveNames = []
          this.reportList.forEach((el, i) => {
            snapActiveNames.push(i + 1)
          })
          this.$refs.listRef.handleChange(snapActiveNames)
          // this.handleChange(this.activeNames)
        }
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    addReport() {
      this.$router.push('/report/add-report?titletype=create')
    },
    clearKeyword() {
      this.keyworks = ''
      this.getReportListFn()
    }
  },
  components: {
    AddReportGrounp,
    ReportList
  }
}
</script>
<style lang="scss" scoped>
.report-management {
  .report-header {
    .report-txt {
      font-size: 17px;
      font-weight: 600;
      color: #333;
      margin-right: 20px;
    }
  }
  .list-content {
    margin-top: 20px;
    min-height: 200px;
  }
}
</style>
