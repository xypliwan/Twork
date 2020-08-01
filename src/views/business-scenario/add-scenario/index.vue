<template>
  <div class="add-scenario" v-loading="dataLoading">
    <ul>
      <li>
        <i class="el-icon-arrow-left back-icon" @click="backHistory"></i>
        {{ processName }}
      </li>
      <li>
        <span
          class="pointer"
          :class="{ current: currentIndex == 1 }"
          @click="currentIndex = 1"
        >
          <label class="step-num">1</label> 任务设置
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 2 }"
          @click="toCondition"
        >
          <label class="step-num">2</label>条件设置
        </span>
      </li>
      <li>
        <el-button size="mini" @click="vilidata">保存</el-button>
      </li>
    </ul>
    <div class="add-scenario-content">
      <task-setting
        ref="TaskSetting"
        v-show="currentIndex == 1"
        :productList="productList"
        :groupData="groupData"
        :detailData="detailData"
        :scenarioGroupData="scenarioGroupData"
        @updateSyatemCode="updateSyatemCode"
      />
      <condition-setting
        v-show="currentIndex == 2"
        :systemCode="systemCode"
        :detailData="detailData"
        :productList="productList"
        ref="conditionRef"
      />
    </div>
  </div>
</template>

<script>
import TaskSetting from './components/TaskSetting'
import ConditionSetting from './components/ConditionSetting'
import { groupList } from '@/api/flowManage'
import { getProduct } from '@/api/common'
import {
  settingAdd,
  settingDetail,
  settingUpdate,
  settingGroupList
} from '@/api/business-scenario'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddScenario',
  components: { TaskSetting, ConditionSetting },
  data() {
    return {
      currentIndex: 1,
      setting_id: '',
      allUsers: [],
      dataLoading: false,
      processName: '', //流程名称
      groupData: [], //流程分组
      scenarioGroupData: [], //业务场景分组
      productList: [], //系统列表
      detailData: {},
      systemCode: ''
    }
  },
  computed: {
    ...mapGetters(['tabList', 'currentPage'])
    // setting_id() {
    //   return this.$route.query.setting_id
    // }
  },
  created() {
    this.getProduct()
  },
  async mounted() {
    window.onbeforeunload = e => {
      if (this.$route.fullPath == '/add-scenario') {
        e = e || window.event
        // 兼容IE8和Firefox 4之前的版本
        if (e) {
          e.returnValue = '确定关闭吗？关闭后表单数据不会保存'
        }
        // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
        return '关闭提示'
      } else {
        window.onbeforeunload = null
      }
    }
  },
  watch: {
    systemCode(newVal) {
      if (newVal !== '') {
        this.groupList()
      }
    }
  },
  methods: {
    ...mapActions(['deleteTablist']),
    toCondition() {
      if (this.systemCode == '') {
        this._message('请先选择系统类型', 'warning')
        return
      }
      this.currentIndex = 2
    },
    updateSyatemCode(code) {
      this.systemCode = code
      this.groupData = []
    },
    changeProcessName(name) {
      this.processName = name
    },
    async getProduct() {
      try {
        let { data } = await getProduct()
        this.productList = data
      } catch (error) {
        this._message(error)
      }
    },
    // 业务场景分组列表
    async settingGroupList() {
      try {
        let { data } = await settingGroupList()
        this.scenarioGroupData = data
      } catch (error) {
        this._message(error)
      }
    },

    // 流程分组列表
    async groupList() {
      try {
        let { data } = await groupList({ product_code: this.systemCode })
        this.groupData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 新增业务场景
    async vilidata() {
      let taskData = this.$refs.TaskSetting.getParams()
      let conditionData = await this.$refs.conditionRef.vilidata()
      if (!taskData) {
        this.$message.warning('请把任务设置填写完整')
        return
      } else if (!conditionData || !conditionData.flg) {
        this.$message.warning('请把条件设置填写完整')
        return
      }
      let params = {
        ...taskData,
        system_setting_config: conditionData.data,
        setting_code: conditionData.setting_code
      }

      this.setting_id == '' ? this.addSetting(params) : this.editSetting(params)

      // console.log(params, 'params')
    },
    async addSetting(params) {
      this.dataLoading = true
      try {
        await settingAdd(params)
        this.$message.success('新增业务场景成功')
        this.deleteTablist(
          this.tabList.filter(el => el.name == this.currentPage)
        )
        this.$router.push({
          path: '/business-scenario',
          query: {
            refresh: true
          }
        })
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    // 业务场景详情
    async getDetail(setting_id) {
      this.dataLoading = true
      try {
        let { data } = await settingDetail({ setting_id: setting_id })
        this.detailData = data
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    // 编辑业务场景
    async editSetting(params) {
      // let params = this.$refs.TaskSetting.getParams()
      // if (!params) {
      //   this.$message.warning('信息填写完整')
      //   return
      // }
      try {
        await settingUpdate(params)
        this.$message.success('更新成功')
        this.deleteTablist(
          this.tabList.filter(el => el.name == this.currentPage)
        )
        this.$router.push({
          path: '/business-scenario',
          query: {
            refresh: true
          }
        })
      } catch (error) {
        this._message(error)
      }
    },

    backHistory() {
      this.$confirm('系统可能不会保存您所做的更改，确定退出码?', '提示', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '直接退出',
        type: 'warning'
      })
        .then(() => {
          if (this.setting_id) {
            this.editSetting()
          } else {
            this.addSetting()
          }
        })
        .catch(() => {
          this.deleteTablist(
            this.tabList.filter(el => el.name == this.currentPage)
          )
          this.$router.push({
            path: '/business-scenario',
            query: {
              refresh: true
            }
          })
        })
    }
  },
  async activated() {
    // 编辑
    await this.settingGroupList()
    await this.groupList()
    if (this.$route.query.setting_id) {
      this.setting_id = this.$route.query.setting_id
      this.$route.meta.title = '编辑业务场景'
      this.$nextTick(async () => {
        await this.getDetail(this.$route.query.setting_id)
      })
    }
    // 新增
    if (this.$route.query.titleType == 'create' && this.setting_id) {
      this.$route.meta.title = '新增业务场景'
      this.$refs.TaskSetting.clearParams()
      this.$refs.conditionRef.initData()
      this.setting_id = ''
    }
  },
  beforeDestroy() {}
}
</script>

<style scoped lang="scss">
.add-scenario {
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
  .add-scenario-content {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
</style>
