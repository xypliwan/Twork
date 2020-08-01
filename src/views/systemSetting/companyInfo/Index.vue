<template>
  <div class="company-info">
    <div class="title-info">
      <span class="title">企业信息</span>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      size="small"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="企业简称" prop="company_abbreviation">
            <el-input v-model="ruleForm.company_abbreviation"></el-input>
          </el-form-item>
          <el-form-item label="企业全称" prop="company_name">
            <el-input v-model="ruleForm.company_name"></el-input>
          </el-form-item>
          <el-form-item label="联系人名" prop="contacts_user_id">
            <el-input v-model="ruleForm.contacts_user_name"></el-input>
            <!-- <el-select style="width: 100%" v-model="ruleForm.contacts_user_id" placeholder="请选择">
              <el-option v-for="(item,index) in userData" :key="index" :label="item.username" :value="item.user_id"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="ruleForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="addres">
            <el-input type="textarea" v-model="ruleForm.addres"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label-width="120px"
            label="企业LOGO上传"
            prop="logo_path"
          >
            <img
              width="100px"
              v-if="ruleForm.logo_path.length"
              :src="ruleForm.logo_path"
            />
            <upload
              @upload="successImgOk"
              accept="image/png, image/jpeg, image/jpg, image/x-icon"
            >
              <el-link type="primary">上传LOGO</el-link>
            </upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button
          v-if="_menuPermission('save_company')"
          type="primary"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Upload from '_c/common/Upload'
import { companyInfo, companyUpdate } from '@/api/companyInfo'
import { userList } from '@/api/common'
import { mapGetters, mapActions } from 'vuex'
import { getLocalStorage } from '@/utils/localStorage'

export default {
  name: 'CompanyInfo',
  components: { Upload },
  data() {
    return {
      userData: [], //企业用户信息
      ruleForm: {
        company_id: '', //企业ID
        company_name: '', //企业全称
        company_abbreviation: '', //企业简称
        contacts_user_name: '', //企业联系人
        telephone: '', //企业联系电话
        email: '', //企业邮箱
        logo_path: '', //企业LOGO
        addres: '' //地址
      },
      rules: {
        company_name: [
          { required: true, message: '请填写企业全称', trigger: 'blur' }
        ],
        company_abbreviation: [
          { required: true, message: '请填写企业简称', trigger: 'blur' }
        ],
        contacts_user_name: [
          { required: true, message: '请填写企业联系人', trigger: 'change' }
        ],
        telephone: [
          { required: true, message: '请填写企业联系电话', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请填写企业邮箱', trigger: 'blur' }],
        logo_path: [
          { required: true, message: '请上传企业LOGO', trigger: 'change' }
        ],
        addres: [{ required: true, message: '请填写地址', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyData', 'userInfo'])
  },
  watch: {},
  created() {
    this.getCompanyInfo(
      this.userInfo.company_id || getLocalStorage('userinfo').company_id
    )
    this.getUserInfo()
  },
  methods: {
    ...mapActions(['setCompanyInfo']),
    async getUserInfo() {
      try {
        let { data } = await userList()
        this.userData = data
      } catch (error) {
        this._message(error)
      }
    },
    async getCompanyInfo(id) {
      try {
        let { data } = await companyInfo({ company_id: id })
        this.assignVal(data)
        this.setCompanyInfo(data)
      } catch (error) {
        this._message(error)
      }
    },
    // 上传图片
    successImgOk(data) {
      this.ruleForm.logo_path = data.url
    },
    // 赋值
    assignVal(val) {
      if (Object.keys(val).length > 0) {
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = val[key]
        })
      }
    },
    async companyUpdate() {
      try {
        let { message } = await companyUpdate(this.ruleForm)
        this.$message.success(message)
        this.getCompanyInfo(
          this.userInfo.company_id || getLocalStorage('userinfo').company_id
        )
      } catch (error) {
        this._message(error)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.companyUpdate()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.company-info {
  padding: 10px;
  .title-info {
    margin-bottom: 20px;
    .title {
      font-weight: bold;
      color: #444;
      padding-left: 10px;
      border-left: 3px solid #72b2ff;
    }
  }
}
</style>
