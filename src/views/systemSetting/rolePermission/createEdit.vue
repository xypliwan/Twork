<template>
  <!-- 添加编辑角色 -->
  <div class="create-edit">
    <el-dialog
      :title="title[titleType]"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="beforeClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="角色名称" prop="role_name">
          <div class="role-name">
            <el-input v-model="ruleForm.role_name" clearable></el-input>
          </div>
        </el-form-item>
        <el-form-item label="角色类型" prop="role_type">
          <el-radio-group v-model="ruleForm.role_type">
            <el-radio
              v-for="(item, index) in baseData.roleType"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="ruleForm.role_desc"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLocalStorage } from '@/utils/localStorage'
import { roleAdd, roleUpdate } from '@/api/role'
export default {
  name: 'RolePermission',
  props: {
    dialogVisible: Boolean,
    titleType: String,
    baseData: Object,
    roleDetail: Object
  },
  data() {
    return {
      title: {
        create: '添加角色',
        edit: '编辑角色'
      },
      ruleForm: {
        company_id: getLocalStorage('userinfo').company_id || '', //企业id
        role_name: '', //角色名称
        role_type: 0, // 角色类型   0-用户创建角色 1-系统角色
        role_desc: '', //描述
        role_id: '' //角色ID
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        role_type: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (val && this.titleType == 'edit')
        this.mixinObjAssign(this.ruleForm, this.roleDetail)
    }
  },
  methods: {
    //  添加角色
    async addRole() {
      try {
        this.ruleForm.role_id = '' //角色ID
        let { message } = await roleAdd(this.ruleForm)
        this.$message.success(message)
        this.$emit('refreshList', true)
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
    },
    async editRole() {
      try {
        let { message } = await roleUpdate(this.ruleForm)
        this.$message.success(message)
        this.$emit('refreshList', true)
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.titleType == 'create') {
            this.addRole()
          } else if (this.titleType == 'edit') {
            this.editRole()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消按钮
    handleClose() {
      this.$refs.ruleForm.resetFields()
      this.ruleForm = Object.assign(
        this.ruleForm,
        this.$options.data().ruleForm
      )
      this.$emit('update:dialogVisible', false)
    },
    beforeClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.create-edit {
  .dialog-footer {
    text-align: center;
  }
  .role-name {
    width: 100%;
    overflow: hidden;
  }
  ::v-deep .el-dialog {
    background: #fff;
  }
}
</style>
