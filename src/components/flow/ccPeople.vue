<template>
  <div>
    <el-drawer
      title="抄送人设置"
      :append-to-body="true"
      :visible.sync="copyerDrawer"
      direction="rtl"
      class="set_copyer"
      size="550px"
      :before-close="resetForm"
    >
      <div class="cc-people-box">
        <el-form
          :model="ruleForm"
          size="small"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="抄送人" prop="cc_people.txt">
            <!-- <el-select
              v-model="ruleForm.cc_people"
              filterable
              multiple
              placeholder="请选择抄送人"
            >
              <el-option
                :label="item.username"
                :value="item.user_id"
                :key="item.user_id"
                v-for="item in userList"
              ></el-option>
            </el-select> -->
            <el-input
              type="textarea"
              readonly
              autosize
              placeholder="请选择"
              v-model="ruleForm.cc_people.txt"
              @focus="showSelectDom()"
            >
            </el-input>
          </el-form-item>
          <el-form-item label prop="can_select_cc_people">
            <el-checkbox
              :disabled="produceCodeStore.length > 0"
              v-model="ruleForm.can_select_cc_people"
              :true-label="1"
              :false-label="0"
              >允许发起人自选抄送人</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveCopyer">保存</el-button>&nbsp;
            &nbsp; &nbsp;
            <el-button @click="resetForm">关闭</el-button>
          </el-form-item>
        </el-form>
        <select-departments-and-people
          :canSelectDepartment="false"
          :visible.sync="duVisible"
          @updateUser="updateUser"
          :originalData="ruleForm.cc_people"
        ></select-departments-and-people>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
export default {
  props: {
    userList: Array,
    copyerConfig: Object,
    copyerDrawer: Boolean
  },

  data() {
    return {
      duVisible: false,
      ruleForm: {
        // cc_people: [],
        cc_people: {
          department: [],
          user: [],
          nameArr: [],
          txt: ''
        },
        can_select_cc_people: 0
      },
      rules: {
        'cc_people.txt': [{ required: true, message: '请选择抄送人' }]
      }
    }
  },
  computed: {
    ...mapGetters(['produceCodeStore'])
  },
  watch: {
    copyerDrawer(newVal) {
      if (newVal) {
        Object.assign(this.ruleForm.cc_people, this.copyerConfig.cc_people)
        this.ruleForm.can_select_cc_people = Number(
          this.copyerConfig.can_select_cc_people
        )
      }
    }
  },
  methods: {
    showSelectDom() {
      this.duVisible = true
    },
    updateUser(obj) {
      Object.assign(this.ruleForm.cc_people, obj)
      this.ruleForm.cc_people.txt = obj.nameArr.join('、')
      // this.setPromoterInfo(obj)
      // this.$emit('saveSponsor', {
      //   promoter: obj
      // })
    },
    saveCopyer() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // this.ruleForm.cc_people_name = ''
          // this.ruleForm.cc_people.forEach(el => {
          //   this.userList.forEach(ev => {
          //     if (el == ev.user_id) {
          //       this.ruleForm.cc_people_name += ` ${ev.username} `
          //     }
          //   })
          // })
          this.$emit('saveCcpeople', this.ruleForm)
          this.resetForm()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.ruleForm.cc_people = this.$options.data().ruleForm.cc_people
      this.$refs.ruleForm.resetFields()
      this.$emit('update:copyerDrawer', false)
    }
  },
  components: {
    SelectDepartmentsAndPeople
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  font-size: 16px;
}
.cc-people-box {
  padding: 0 15px;
  ::v-deep .el-select {
    display: block;
  }
}
</style>
