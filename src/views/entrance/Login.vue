<template>
  <div class="account-login">
    <div class="login-container">
      <div class="container-top">
        <div class="flex">
          <img src="../../assets/images/new_logo.png" alt />
          <span>Twork协同</span>
        </div>
        <p>提高跨部门协同办公效率，规范不同岗位管理和考核</p>
      </div>
      <div class="container-section">
        <h3 class="text-center">账号登录</h3>
        <div class="login">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                autocomplete="off"
                clearable
                placeholder="请输入您的注册账号"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="ruleForm.password"
                autocomplete="off"
                clearable
                placeholder="请输入您的密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="company_code">
              <el-input
                v-model="ruleForm.company_code"
                clearable
                placeholder="请输入企业编码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                v-loading="loginLoading"
                type="primary"
                style="width:100%"
                @click="submitForm('ruleForm')"
                >登&nbsp;录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-divider></el-divider>
        <div class="des">
          <p>1、支持使用易仓科技公司 其它系统平台（已授权的帐号/密码）登录</p>
          <p>2、若忘记密码，请联系公司系统管理员重置密码</p>
        </div>
        <el-alert
          v-if="checked"
          :title="errorTip"
          type="error"
          show-icon
        ></el-alert>
      </div>
      <div class="container-footer text-center">
        <p>版本：V0.0.01</p>
        <p>Copyright ©2019 深圳市易仓科技有限公司</p>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { encrypt } from '@/utils/crypto'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loginLoading: false,
      errorTip: '', //错误信息提示
      checked: false,
      ruleForm: {
        username: '',
        password: '',
        company_code: '', //企业代码
        timestamp: '' //时间戳
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        company_code: [
          { required: true, message: '请输入企业编码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
  mounted() {
    // let loginParams = getLocalStorage('remember');
    // if (loginParams) {
    //   loginParams = JSON.parse(loginParams);
    //   this.ruleForm.username = loginParams.username;
    //   this.ruleForm.password = loginParams.password; //解密
    //   this.ruleForm.password = decrypt(loginParams.password); //解密
    //   this.checked = true;
    // }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.goLogin()
        } else {
          return false
        }
      })
    },
    ...mapActions(['setToken']),
    async goLogin() {
      this.checked = false
      this.errorTip = ''
      let loginParams = {
        username: this.ruleForm.username, //获取账号
        password: encrypt(this.ruleForm.password).encrypted, //获取密码 加密
        company_code: this.ruleForm.company_code, //企业编码
        timestamp: encrypt(this.ruleForm.password).nowTime //获取密码 加密
      }
      // 记住密码设置
      //   if (this.checked) {
      //     setLocalStorage('remember', JSON.stringify(loginParams));
      //   } else {
      //     removeLocalStorage('remember');
      //   }
      this.loginLoading = true
      try {
        let res = await login(loginParams)
        if (res.error == 0) {
          this._message('登录成功', 'success')
          this.setToken(res.data.access_token)
          setTimeout(() => {
            this.$router.push('/')
          }, 300)
        } else if (res.error == 2000) {
          this.checked = true
          this.errorTip = res.message
        }
        this.loginLoading = false
      } catch (error) {
        this._message(error)
        this.loginLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.account-login {
  background-color: #e8ecf2;
  color: #878d99;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .login-container {
    height: 100%;
    overflow-y: auto;
    width: 50%;
    min-width: 470px;
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;
    .container-top {
      margin-top: 10%;
      margin-bottom: 30px;
      text-align: center;
      .flex {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #555;
        img {
          width: 40px;
          margin-right: 10px;
        }
      }
    }
    .container-section {
      background-color: #fff;
      // box-shadow: 0px 0px 5px #ccc ;
      padding-top: 20px;
      .login {
        padding: 20px 50px;
      }
      .des {
        padding: 0 20px 20px;
        line-height: 20px;
      }
    }
    .container-footer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      p {
        line-height: 20px;
      }
    }
    p {
      font-size: 14px;
    }
  }
  ::v-deep .el-alert {
    border-radius: 0px;
  }
}
</style>
