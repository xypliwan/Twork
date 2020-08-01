<template>
  <div class="add-report" v-loading="dataLoading">
    <ul>
      <li>
        <i class="el-icon-arrow-left back-icon" @click="backHistory"></i>
        {{ reportName }}
      </li>
      <li>
        <span
          class="pointer"
          :class="{ current: currentIndex == 1 }"
          @click="currentIndex = 1"
        >
          <label class="step-num">1</label> 基础设置
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 2 }"
          @click="currentIndex = 2"
        >
          <label class="step-num">2</label>汇报方式
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 3 }"
          @click="currentIndex = 3"
        >
          <label class="step-num">3</label>
          表单设计
        </span>
      </li>
      <li>
        <el-button size="mini" @click="save">保存</el-button>
        <!-- <el-button size="mini">保存</el-button> -->
      </li>
    </ul>
    <div class="content">
      <base-setting
        v-show="currentIndex == 1"
        :grounpList="grounpList"
        ref="baseRef"
        @changeName="
          name => {
            reportName = name
          }
        "
      ></base-setting>
      <report-methods
        v-show="currentIndex == 2"
        ref="methodsRef"
      ></report-methods>
      <from-setting v-show="currentIndex == 3" ref="fromRef"></from-setting>
    </div>
  </div>
</template>
<script>
import BaseSetting from './base-setting'
import FromSetting from './from-setting'
import ReportMethods from './report-methods'
import {
  getReportList,
  addReport,
  reportDetail,
  updateReport
} from '@/api/report'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'AddReport',
  components: {
    BaseSetting,
    FromSetting,
    ReportMethods
  },
  data() {
    return {
      dataLoading: false,
      currentIndex: 1,
      reportName: '',
      grounpList: [], //分组列表
      reportId: ''
    }
  },
  async activated() {
    // 刷新
    await this.getReportListFn()
    if (this.$route.query.reportid) {
      this.reportId = this.$route.query.reportid
      this.$route.meta.title = '编辑汇报'
      this.getReportDetail(this.$route.query.reportid)
    }

    if (this.$route.query.titletype == 'create') {
      this.$route.meta.title = '新增汇报'
      this.$refs.baseRef.reset()
      this.$refs.methodsRef.reset()
      this.$refs.fromRef.reset()

      this.reportId = ''
    }
  },
  computed: {
    ...mapGetters(['tabList', 'currentPage'])
  },
  methods: {
    ...mapActions(['deleteTablist']),
    backHistory() {
      this.$confirm('系统可能不会保存您所做的更改，确定退出吗?', '提示', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '直接退出',
        type: 'warning'
      })
        .then(() => {
          this.save()
        })
        .catch(() => {
          this.backPage()
        })
    },
    backPage() {
      this.deleteTablist(this.tabList.find(el => el.name == this.currentPage))
      this.$router.push({
        name: 'ReportIndex',
        query: {
          refresh: true
        }
      })
    },
    async getReportDetail(id) {
      this.dataLoading = true
      try {
        let {
          data: { base, set_method, fromat }
        } = await reportDetail({ report_id: id })
        this.reportName = base.report_name
        this.$refs.baseRef.initData(base)
        this.$refs.methodsRef.initData(set_method)
        this.$refs.fromRef.initData(fromat)
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    async save() {
      let baseData = await this.$refs.baseRef.vilidata()
      let methodsData = await this.$refs.methodsRef.vilidata()
      let fromData = this.$refs.fromRef.vilidata()
      if (baseData.hasError) {
        this._message('请把 基础设置 设置完整', 'warning')
        return
      } else if (methodsData.hasError) {
        this._message('请把 汇报方式 设置完整', 'warning')
        return
      } else if (fromData.hasError) {
        this._message('请把 表单设计 设置完整', 'warning')
        return
      }
      let params = {
        base: baseData.data,
        set_method: methodsData.data,
        fromat: fromData.data,
        report_id: this.reportId == '' ? undefined : this.reportId
      }
      this.reportId == ''
        ? this.addReportFn(params)
        : this.updateReportFn(params)
    },
    async updateReportFn(params) {
      this.dataLoading = true
      try {
        let { message } = await updateReport(params)
        this._message(message, 'success')

        this.backPage()
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    async addReportFn(params) {
      this.dataLoading = true
      try {
        let { message } = await addReport(params)
        this._message(message, 'success')

        this.backPage()
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    //获取分组
    async getReportListFn() {
      try {
        let { data } = await getReportList()
        this.grounpList = data
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.add-report {
  height: 100%;
  overflow-y: auto;

  ul {
    padding: 0 10px;
    height: 50px;
    margin-bottom: 10px;
    align-items: center;
    display: flex;
    color: #fff;
    background-color: #5571cd;
    li {
      flex: 1;
      .back-icon {
        cursor: pointer;
      }
    }
    li:nth-child(2) {
      flex: 1;
      display: flex;
      margin: 0 15px;
      height: 100%;
      span {
        flex: 1;
        text-align: center;
        line-height: 50px;
        color: #dadada;
        display: flex;
        align-items: center;
        justify-content: center;
        .step-num {
          line-height: 16px;
          display: inline-block;
          width: 17px;
          height: 17px;
          margin-right: 5px;
          border-radius: 50%;
          font-size: 12px;
          color: #fff;
          border: 1px solid #fff;
        }
      }
    }
  }
  .current {
    background: rgba(255, 255, 255, 0.2);
    color: #fff !important;
    .step-num {
      background: #fff;
      color: #5571cd !important;
    }
  }
  .content {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
</style>
