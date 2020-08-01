<template>
  <div>
    <el-drawer
      title="发起人设置"
      :append-to-body="true"
      :visible.sync="promoterDrawer"
      direction="rtl"
      class="set_copyer"
      size="550px"
      :before-close="resetForm"
    >
      <div class="cc-people-box">
        <div class>
          <!-- <el-cascader
            collapse-tags
            size="small"
            ref="promoterRef"
            :options="allUsers"
            v-model="promoter"
            :props="optionsUser"
            :show-all-levels="false"
            clearable
            placeholder="请选择发起人"
            @change="getPromoter"
          ></el-cascader> -->
          <el-input
            type="textarea"
            readonly
            autosize
            placeholder="请选择"
            v-model="ruleForm.txt"
            @focus="showSelectDom()"
          >
          </el-input>
        </div>
        <div class="btn-box">
          <el-button size="small" @click="resetForm">关闭</el-button>
        </div>

        <select-departments-and-people
          :visible.sync="duVisible"
          @updateUser="updateUser"
          :originalData="ruleForm"
        ></select-departments-and-people>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'

export default {
  props: {
    promoterConfig: Object,
    promoterDrawer: Boolean,
    allUsers: Array //所有的企业成员
  },

  data() {
    return {
      duVisible: false,
      ruleForm: {
        department: [],
        user: [],
        nameArr: [],
        txt: ''
      },
      promoter: [], //发起人完整id
      promoter_name: '', //发起人名
      optionsUser: {
        multiple: true,
        value: 'department_id',
        label: 'department_name'
      }
    }
  },
  watch: {
    completeRouteUserStore(newVal) {
      this.promoter = newVal
    },
    promoterInfo(newVal) {
      Object.assign(this.ruleForm, newVal)
      this.ruleForm.txt = newVal.nameArr.join('、')
    }
  },
  computed: {
    ...mapGetters(['completeRouteUserStore', 'promoterInfo'])
  },
  methods: {
    ...mapActions([
      'setCompleteRouteUserStore',
      'setPromoterNameStore',
      'setPromoterInfo'
    ]),
    showSelectDom() {
      this.duVisible = true
    },
    updateUser(obj) {
      Object.assign(this.ruleForm, obj)
      this.ruleForm.txt = obj.nameArr.join('、')
      this.setPromoterInfo(obj)
      this.$emit('saveSponsor', {
        promoter: obj
      })
    },
    // getPromoter(val) {
    //   let selectNodes = this.$refs.promoterRef.getCheckedNodes()
    //   this.promoter_name = selectNodes.map(el => `${el.label} `).join('')
    //   this.setPromoterNameStore(this.promoter_name)
    //   this.setCompleteRouteUserStore(val)
    //   this.$emit('saveSponsor', {
    //     promoter: this.promoter,
    //     promoter_name: this.promoter_name
    //   })
    // },
    resetForm() {
      this.$emit('update:promoterDrawer', false)
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
  ::v-deep .el-cascader {
    width: 100%;
  }
  .btn-box {
    margin-top: 50px;
  }
}
</style>
