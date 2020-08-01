<template>
  <div class="add-flow" v-loading="dataLoading">
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
          <label class="step-num">1</label> 基础设置
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 2 }"
          @click="currentIndex = 2"
        >
          <label class="step-num">2</label>表单设计
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 3 }"
          @click="currentIndex = 3"
        >
          <label class="step-num">3</label>
          流程设计
        </span>
        <span
          class="pointer"
          :class="{ current: currentIndex == 4 }"
          @click="currentIndex = 4"
        >
          <label class="step-num">4</label>高级设置
        </span>
      </li>
      <li>
        <el-button v-if="!params.process_id" size="mini" @click="addFlow"
          >保存</el-button
        >
        <el-button v-if="params.process_id" size="mini" @click="editFlow"
          >保存</el-button
        >
      </li>
    </ul>
    <div class="content">
      <base-setting
        :productList="productList"
        ref="baseSetting"
        @getAllUser="getAllUser"
        @changeProcessName="changeProcessName"
        v-show="currentIndex == 1"
      ></base-setting>
      <drag-form ref="dragForm" v-show="currentIndex == 2"></drag-form>
      <flow-design
        ref="flowDesign"
        v-show="currentIndex == 3"
        :allUsers="allUsers"
      ></flow-design>
      <advanced-setup
        ref="advancedSetup"
        v-show="currentIndex == 4"
        :groupList="groupList"
      ></advanced-setup>
    </div>
  </div>
</template>

<script>
import DragForm from './dragForm/index'
import BaseSetting from './baseSetting/Index'
import AdvancedSetup from './advancedSetup/Index'
import FlowDesign from './flowDesign/Index'
import {
  processAdd,
  processDetail,
  processUpdate,
  groupList
} from '@/api/flowManage'
import { mapActions, mapGetters } from 'vuex'
import { getProduct } from '@/api/common'
import { resetDepartmentAndUserFromId } from '_u/utils'

export default {
  name: 'AddFlow',
  components: { DragForm, BaseSetting, AdvancedSetup, FlowDesign },
  data() {
    return {
      currentIndex: 1,
      params: {
        process_id: '',
        base_setting: {},
        form_setting: [],
        step_setting: [],
        advanced_setting: {}
      },
      errorList: [],
      allUsers: [],
      dataLoading: false,
      processName: '', //流程名称
      productList: [], //系统列表
      groupList: [] //流程列表
    }
  },
  computed: {
    ...mapGetters([
      'tabList',
      'currentPage',
      'conditionListStore',
      'architectList'
    ])
  },
  created() {
    this.getProduct()
    this.groupListFn()
    // if (this.$route.query.process_id) {
    //   this.params.process_id = this.$route.query.process_id;
    //   this.getDetail(this.params.process_id);
    // }
  },
  mounted() {
    window.onbeforeunload = e => {
      if (
        this.$route.fullPath == '/applicationManagement/flowManage/add-flow'
      ) {
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
    currentIndex(newVal) {
      if (newVal == 2) {
        this.delConditionList()
        this.$refs.dragForm.checkFromCanDel(
          this.$refs.flowDesign.getFlowConfig()
        )
        this.$refs.baseSetting.handleChangeProduct()
      }
    }
  },
  methods: {
    ...mapActions([
      'deleteTablist',
      'setCompleteRouteUserStore',
      'setPromoterNameStore',
      'delConditionList',
      'getSelectForm',
      'delSelectFrom',
      'setIsProcessDetail',
      'setPromoterInfo',
      'clearPromoterInfo'
    ]),
    async groupListFn() {
      try {
        const { data } = await groupList()
        this.groupList = data
      } catch (error) {
        this._message(error)
      }
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
    backHistory() {
      this.$confirm('系统可能不会保存您所做的更改，确定退出吗?', '提示', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '直接退出',
        type: 'warning'
      })
        .then(() => {
          if (this.params.process_id) {
            this.editFlow()
          } else {
            this.addFlow()
          }
        })
        .catch(() => {
          this.deleteTablist(
            this.tabList.filter(el => el.name == this.currentPage)
          )
          this.$router.push({
            path: '/applicationManagement/flowManage',
            query: {
              refresh: true
            }
          })
        })
    },
    getAllUser(users) {
      this.allUsers = users
    },

    async getParams() {
      //基础设置
      let snap = []
      let handlerPeople = []
      let { data, valid } = await this.$refs.baseSetting.submitForm()
      this.params.base_setting = data

      //表单设置
      this.params.form_setting = this.$refs.dragForm.selectList

      this.params.step_setting = this.$refs.flowDesign.getFlowConfig()
      this.params.advanced_setting = this.$refs.advancedSetup.ruleForm

      this.checkFromHandler(this.params.step_setting, handlerPeople)
      if (!valid) {
        snap.push('基础设置')
      } else if (this.params.form_setting.length <= 0) {
        snap.push('表单设计')
      } else if (handlerPeople.includes(true)) {
        snap.push('流程设置-处理人')
      }
      return snap
    },

    // 添加流程
    async addFlow() {
      let veData = await this.getParams()
      if (veData.length > 0) {
        this._message(`请把 ${veData.join(' ')} 设置完整`, 'warning')
        return
      }
      this.dataLoading = true
      try {
        let { message } = await processAdd(this.params)
        this.$message.success(message)
        this.clearPromoterInfo()
        this.deleteTablist(
          this.tabList.filter(el => el.name == this.currentPage)
        )
        this.$router.push({
          path: '/applicationManagement/flowManage',
          query: {
            refresh: true
          }
        })
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    // 流程详情
    async getDetail(id) {
      this.dataLoading = true
      try {
        let { data } = await processDetail({ process_id: id })
        this.$nextTick(() => {
          // this.setCompleteRouteUserStore(data.base_setting.promoter_params)
          // this.setPromoterNameStore(data.base_setting.promoter)
          // resetDepartmentAndUserFromId()
          let promoterParams = resetDepartmentAndUserFromId(
            this.architectList,
            data.base_setting.promoter_params
          )
          // this.setPromoterInfo(data.base_setting.promoter_params)
          this.setPromoterInfo(promoterParams)

          this.$refs.baseSetting.ruleForm = data.base_setting || {}

          this.$refs.dragForm.selectList = data.form_setting || []
          let snapArr = this.$refs.dragForm.selectList.filter(el => el.verify)
          this.getSelectForm(JSON.parse(JSON.stringify(snapArr)))

          this.$refs.advancedSetup.ruleForm = data.advanced_setting
          this.$refs.flowDesign.processConfig = data.step_setting
          this.$refs.flowDesign.nodeConfig = data.step_setting
          this.$refs.advancedSetup.initProcessId()
        })
      } catch (error) {
        this._message(error)
      }
      this.dataLoading = false
    },
    checkFromHandler(obj, arr) {
      if (obj.child_node) {
        if (obj.child_node.type == 1) {
          //处理人
          if (obj.child_node.approver_name.length <= 0) {
            arr.push(true)
          }
          this.checkFromHandler(obj.child_node, arr)
        } else if (obj.child_node.type == 2) {
          //抄送人
          this.checkFromHandler(obj.child_node, arr)
        } else if (obj.child_node.type == 4) {
          //条件
          this.checkFromHandler(obj.child_node, arr)
          for (let i = 0; i < obj.child_node.condition_nodes.length; i++) {
            let item = obj.child_node.condition_nodes[i]
            this.checkFromHandler(item, arr)
          }
        }
      } else {
        obj.child_node = null
      }
    },
    // 编辑流程
    async editFlow() {
      let veData = await this.getParams()
      if (veData.length > 0) {
        this._message(`请把 ${veData.join(' ')} 设置完整`)
        return
      }

      try {
        let { message } = await processUpdate(this.params)
        this.$message.success(message)
        this.clearPromoterInfo()
        this.deleteTablist(
          this.tabList.filter(el => el.name == this.currentPage)
        )
        this.$router.push({
          path: '/applicationManagement/flowManage',
          query: {
            refresh: true
          }
        })
      } catch (error) {
        this._message(error)
      }
    }
  },
  activated() {
    this.setPromoterNameStore('')
    if (this.$route.query.process_id) {
      this.params.process_id = this.$route.query.process_id
      this.$route.meta.title = '编辑流程'
      this.getDetail(this.params.process_id)
    }

    if (this.$route.query.titletype == 'create') {
      this.delConditionList()
      this.delSelectFrom()
      this.params.process_id = ''
      this.$route.meta.title = '新增流程'
      this.$refs.baseSetting.ruleForm = this.$refs.baseSetting.$options.data().ruleForm
      this.$refs.dragForm.selectList = this.$refs.dragForm.$options.data().selectList
      this.$refs.advancedSetup.ruleForm = this.$refs.advancedSetup.$options.data().ruleForm
      this.$refs.flowDesign.resetTreeData()
    }

    if (this.params.process_id !== '') {
      this.setIsProcessDetail(true)
    } else {
      this.setIsProcessDetail(false)
    }
  },
  beforeDestroy() {
    this.delConditionList()
    this.delSelectFrom()
  }
}
</script>

<style scoped lang="scss">
.add-flow {
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
    min-width: 1200px;
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
