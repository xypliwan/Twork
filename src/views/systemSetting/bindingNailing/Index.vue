<template>
  <div class="binding-nailing">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      size="mini"
      class="ruleForm"
    >
      <el-form-item label="ding_appkey" prop="ding_appkey">
        <el-input v-model="ruleForm.ding_appkey" clearable></el-input>
      </el-form-item>
      <el-form-item label="ding_appsecret" prop="ding_appsecret">
        <el-input v-model="ruleForm.ding_appsecret" clearable></el-input>
      </el-form-item>
      <el-form-item class="tips">
        <a
          class="orange"
          target="_blanck"
          href="https://ding-doc.dingtalk.com/doc#/bgb96b/aw3h75"
          >如何获取钉钉appKey和appSecret ？</a
        >
      </el-form-item>
      <el-form-item v-if="_menuPermission('dingding-save')">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { bindingDingding } from '@/api/companyInfo'
import { mapGetters } from 'vuex'
export default {
  name: 'BindingNailing',
  data() {
    return {
      ruleForm: {
        ding_appkey: '',
        ding_appsecret: ''
      },
      rules: {
        ding_appkey: [
          { required: true, message: '请填写钉钉ding_appkey', trigger: 'blur' }
        ],
        ding_appsecret: [
          {
            required: true,
            message: '请填写钉钉ding_appsecret',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyData'])
  },
  watch: {
    companyData(val) {
      this.ruleForm.ding_appkey = val.ding_appkey || ''
      this.ruleForm.ding_appsecret = val.ding_appsecret || ''
    }
  },
  methods: {
    async bandingNailing() {
      try {
        let { message } = await bindingDingding(this.ruleForm)
        this.$message.success(message)
      } catch (error) {
        this._message(error)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bandingNailing()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.binding-nailing {
  padding: 20px;
  .ruleForm {
    width: 400px;
    .tips {
      margin-top: -10px;
    }
  }
}
</style>
