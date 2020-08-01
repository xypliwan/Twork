<template>
  <div>
    <el-drawer
      :append-to-body="true"
      :visible.sync="approverDrawer"
      direction="rtl"
      class="set_copyer"
      size="550px"
      :before-close="resetForm"
    >
      <div slot="title">
        <el-input size="small" type="text" v-model="ruleForm.node_name" />
      </div>
      <div class="cc-people-box">
        <el-tabs v-model="activeName">
          <el-tab-pane label="设置处理人" name="set">
            <div class="my-box">
              <el-radio-group v-model="ruleForm.deal_approver_type">
                <el-radio label="1">指定成员</el-radio>
                <el-radio label="2">发起人自己</el-radio>
                <el-radio label="3">发起人自选</el-radio>
              </el-radio-group>

              <!--
            <el-checkbox
              true-label="2"
              false-label
              v-model="ruleForm.deal_approver_type"
              @change="handleChangeMy"
              >发起人自己</el-checkbox
            >
            --></div>
            <!-- multiple -->
            <el-select
              v-show="ruleForm.deal_approver_type == '1'"
              size="small"
              :disabled="ruleForm.deal_approver_type == '2'"
              @change="handleChangeApprover"
              v-model="ruleForm.approverId"
              filterable
              multiple
              placeholder="请选择处理人"
              clearable
            >
              <el-option
                :label="item.username"
                :value="item.user_id"
                :key="item.user_id"
                v-for="item in userList"
              ></el-option>
            </el-select>

            <div
              class="no-approver"
              v-show="
                ruleForm.deal_approver_type == '1' ||
                  ruleForm.deal_approver_type == '3'
              "
            >
              <p class="no-approver-txt">多人处理时: 或签 / 会签</p>
              <p class="no-approver-txt">审批方式</p>
              <el-radio-group v-model="ruleForm.sign_method">
                <el-radio label="1">或签( 一名审批人同意或拒绝即可 )</el-radio>
                <el-radio label="2">会签( 需所有审批人同意 )</el-radio>
              </el-radio-group>
            </div>

            <div class="no-approver">
              <p class="no-approver-txt">处理人不可用时</p>
              <el-radio-group v-model="ruleForm.deal_approver">
                <el-radio :label="1"
                  >自动转交发起人，由发起人处理（仅针对人工发起有效）</el-radio
                >
                <el-radio :label="2">自动通过</el-radio>
              </el-radio-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="处理事项" name="nothing">
            <approver-handl-matters
              ref="handlMattersRef"
            ></approver-handl-matters>
          </el-tab-pane>
        </el-tabs>

        <div class="btn-box">
          <el-button size="small" type="primary" @click="saveApprover"
            >保存</el-button
          >&nbsp; &nbsp; &nbsp;
          <el-button size="small" @click="resetForm">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import ApproverHandlMatters from './approverHandlMatters'
export default {
  props: {
    userList: Array,
    approverConfig: Object,
    approverDrawer: Boolean
  },

  data() {
    return {
      activeName: 'set',
      ruleForm: {
        node_name: '',
        deal_approver_type: '', //1是指定人员 2是发起人自己  3发起人自选
        approver: [], //处理人用户id
        approverId: [],
        deal_approver: 2, //处理人为空时候  1自动转交发起人处理  2 自动通过
        approver_name: '',
        sign_method: '1', //1或签  2会签
        optionalMethod: ''
      }
    }
  },
  watch: {
    approverDrawer(newVal) {
      if (newVal) {
        this.ruleForm.deal_approver = Number(this.approverConfig.deal_approver)
        this.ruleForm.deal_approver_type = this.approverConfig.deal_approver_type
        this.ruleForm.node_name = this.approverConfig.node_name
        if (this.approverConfig.deal_approver_type == '1') {
          if (this.approverConfig.approver.length <= 0) {
            this.ruleForm.deal_approver = 1
          } else {
            // this.ruleForm.approverId = this.approverConfig.approver[0]
            this.ruleForm.approverId = this.approverConfig.approver
            this.ruleForm.approver = this.approverConfig.approver
          }
        } else if (this.approverConfig.deal_approver_type == '2') {
          this.ruleForm.approver_name = '发起人自己'
        }

        this.$nextTick(() => {
          this.$refs.handlMattersRef.setData(this.approverConfig)
        })
      }
    }
  },
  methods: {
    // handleChangeMy() {
    //   if (this.ruleForm.deal_approver_type == '2') {
    //     this.ruleForm.approver = []
    //     this.ruleForm.approverId = ''
    //     this.ruleForm.approver_name = '发起人自己'
    //   }
    // },
    handleChangeApprover() {
      this.ruleForm.approver = []
      if (this.ruleForm.approverId.length <= 0) {
        this.ruleForm.deal_approver = 1
        this.ruleForm.deal_approver_type = ''
      } else {
        this.ruleForm.deal_approver_type = '1'
        this.ruleForm.approver = this.ruleForm.approverId
      }
    },
    saveApprover() {
      if (this.ruleForm.deal_approver_type == '') {
        this._message('请选择处理人！', 'warning')
        return
        // this.ruleForm.approver_name =
        //   this.ruleForm.deal_approver == 2
        //     ? "自动通过"
        //     : "自动转交发起人，由发起人处理";
      } else {
        if (
          this.ruleForm.deal_approver_type == '1' &&
          this.ruleForm.approver.length <= 0
        ) {
          this._message('请选择处理人！', 'warning')
          return
        }
      }
      let handlMattersRefData = this.$refs.handlMattersRef.getData()

      let flg = false
      for (let i = 0; i < handlMattersRefData.check.length; i++) {
        let item = handlMattersRefData.check[i]
        if (item.check_name.trim().length <= 0) {
          flg = true
          break
        }
      }

      if (flg) {
        this._message('请将新增事项填写完整，或删除！', 'warning')
        return
      }

      if (this.ruleForm.deal_approver_type == '1') {
        // let item = this.userList.find(
        //   el => el.user_id == this.ruleForm.approverId
        // )
        let nameArr = []
        this.userList.forEach(el => {
          this.ruleForm.approverId.forEach(ev => {
            if (el.user_id == ev) {
              nameArr.push(el.username)
            }
          })
        })
        this.ruleForm.approver_name = `指定成员: ${nameArr.join('、')}`
      } else if (this.ruleForm.deal_approver_type == '2') {
        this.ruleForm.approver_name = '发起人自己'
      } else if (this.ruleForm.deal_approver_type == '3') {
        this.ruleForm.approver_name = '发起人自选'
      }

      Object.assign(this.ruleForm, handlMattersRefData)
      this.$emit('saveApprover', this.ruleForm)
      this.resetForm()
    },
    resetForm() {
      this.$emit('update:approverDrawer', false)
    }
  },
  components: {
    ApproverHandlMatters
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  font-size: 16px;
}
.cc-people-box {
  padding: 0 15px;
  .my-box {
    margin-bottom: 20px;
  }
  ::v-deep .el-select {
    display: block;
  }
  .no-approver {
    margin-top: 30px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
    .no-approver-txt {
      margin-bottom: 10px;
    }
  }
  .btn-box {
    margin-top: 45px;
  }
}
</style>
