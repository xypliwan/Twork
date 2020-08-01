<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="0px"
      size="small"
      label-position="top"
      class="ruleForm"
      :rules="rules"
    >
      <!-- multiple -->
      <el-form-item label="周期" prop="period">
        <el-select clearable filterable v-model="ruleForm.period">
          <el-option
            v-for="(ev, evI) in getList('period')"
            :key="evI"
            :label="ev.label"
            :value="ev.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台 (不设置则默认为全部)" prop="platform">
        <div class="select-dom" @click="showSelectDom('platform')">
          {{ setName(getList('platform'), ruleForm.platform) }}
        </div>
      </el-form-item>
      <el-form-item label="账号 (不设置则默认为全部)" prop="userAccounts">
        <div class="select-dom" @click="showSelectDom('userAccounts')">
          {{ setName(getList('userAccounts'), ruleForm.userAccounts) }}
        </div>
      </el-form-item>
      <el-form-item label="站点 (不设置则默认为全部)" prop="site">
        <div class="select-dom" @click="showSelectDom('site')">
          {{ setName(getList('site'), ruleForm.site) }}
        </div>
      </el-form-item>
      <el-form-item
        label="仓库运营方式 (不设置则默认为全部)"
        prop="warehouseVirtual"
      >
        <div class="select-dom" @click="showSelectDom('warehouseVirtual')">
          {{ setName(getList('warehouseVirtual'), ruleForm.warehouseVirtual) }}
        </div>
      </el-form-item>
      <el-form-item
        label="仓库 (不设置则默认为全部)"
        prop="warehouseOrderCodes"
      >
        <div class="select-dom" @click="showSelectDom('warehouseOrderCodes')">
          {{
            setName(
              getList('warehouseOrderCodes'),
              ruleForm.warehouseOrderCodes
            )
          }}
        </div>
      </el-form-item>
      <el-form-item label="订单状态 (不设置则默认为全部)" prop="status">
        <div class="select-dom" @click="showSelectDom('status')">
          {{ setName(getList('status'), ruleForm.status) }}
        </div>
      </el-form-item>
    </el-form>
    <select-business-scene
      :visible.sync="visible"
      :list="formList"
      :originalData="originalData"
      :multiple="multiple"
      @saveOk="saveOk"
    ></select-business-scene>
  </div>
</template>

<script>
import SelectBusinessScene from '_c/selectBusinessScene'
export default {
  props: {
    list: Array,
    scenesType: [String, Number]
  },
  components: { SelectBusinessScene },
  data() {
    return {
      ruleForm: {
        period: '', //周期
        platform: [], //平台
        userAccounts: [], //账号
        site: [], //站点
        warehouseVirtual: [], //仓库运营方式
        warehouseOrderCodes: [], //仓库
        status: [], //订单状态
        setting_code: ''
      },
      rules: {
        period: [{ required: true, message: '必填', trigger: 'change' }]
      },
      formList: [], //传入的数组
      originalData: [], //选中的数据
      selectTxt: '',
      visible: false,
      multiple: false //是否多选
    }
  },
  watch: {
    list() {
      // this.resetForm()
    }
  },
  computed: {
    getList() {
      return flg => {
        if (this.list.length) {
          return this.list.find(el => el.value == flg).data
        }
        return []
      }
    },
    setName() {
      return (initArr, selectArr) => {
        let names = []
        selectArr.forEach(el => {
          initArr.forEach(ev => {
            if (el == ev.val) {
              names.push(ev.label)
            }
          })
        })
        return names.join('、')
      }
    }
  },
  methods: {
    saveOk(selectList) {
      switch (this.selectTxt) {
        case 'platform':
          this.ruleForm.platform = selectList.map(el => el.val)
          break
        case 'userAccounts':
          this.ruleForm.userAccounts = selectList.map(el => el.val)
          break
        case 'site':
          this.ruleForm.site = selectList.map(el => el.val)
          break
        case 'warehouseVirtual':
          this.ruleForm.warehouseVirtual = selectList.map(el => el.val)
          break
        case 'warehouseOrderCodes':
          this.ruleForm.warehouseOrderCodes = selectList.map(el => el.val)
          break
        case 'status':
          this.ruleForm.status = selectList.map(el => el.val)
          break
      }
    },
    showSelectDom(txt) {
      this.selectTxt = txt
      this.visible = true
      this.formList = this.getList(txt)
      switch (txt) {
        case 'platform':
          this.multiple = false
          this.originalData = this.ruleForm.platform
          break
        case 'userAccounts':
          this.multiple = true
          this.originalData = this.ruleForm.userAccounts
          break
        case 'site':
          this.multiple = true
          this.originalData = this.ruleForm.site
          break
        case 'warehouseVirtual':
          this.multiple = false
          this.originalData = this.ruleForm.warehouseVirtual
          break
        case 'warehouseOrderCodes':
          this.multiple = true
          this.originalData = this.ruleForm.warehouseOrderCodes
          break
        case 'status':
          this.multiple = true
          this.originalData = this.ruleForm.status
          break
      }
    },
    initData(obj) {
      Object.assign(this.ruleForm, obj)
    },
    submitForm() {
      this.ruleForm.setting_code = this.scenesType
      return new Promise(resolve => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({ flg: true, data: this.ruleForm })
          } else {
            resolve({ flg: false, data: this.ruleForm })
            return false
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$refs.ruleForm.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-form-item__label {
  padding: 0;
}
.select-dom {
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  padding: 0 15px;
  min-height: 32px;
  max-height: 80px;
  overflow-y: auto;
}
</style>
