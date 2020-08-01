<template>
  <div class="role-permission">
    <el-row>
      <el-col :span="6">
        <div class="col-left">
          <div class="title">角色列表</div>
          <ul>
            <li
              class="pointer"
              v-for="(item, index) in roleList"
              :key="index"
              @click="clickRole(item, index)"
            >
              <span
                class="el-icon-s-custom"
                :class="{ 'li-sctive': currentRole == index }"
              >
                <strong>&nbsp;{{ item.role_name }}</strong>
              </span>
              <span class="role-handle fr">
                <el-link
                  v-if="
                    _menuPermission('save_role') && item.role_name != '普通成员'
                  "
                  type="primary"
                  @click="openEditRole(item)"
                  >编辑</el-link
                >&nbsp;
                <el-link
                  v-if="
                    _menuPermission('del_role') && item.role_name != '普通成员'
                  "
                  type="danger"
                  @click="handleDel(item)"
                  >删除</el-link
                >
              </span>
              <p class="gray">
                {{
                  item.role_name == '普通成员'
                    ? '系统默认角色，不可删除'
                    : item.role_desc || '没有描述'
                }}
              </p>
            </li>
          </ul>
          <span
            v-if="_menuPermission('add_role')"
            class="el-icon-plus add-role pointer li-sctive"
            @click="openAddRole"
          >
            &nbsp;
            <strong>添加新的角色</strong>
          </span>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="col-right">
          <div class="right-top">
            <strong>角色成员</strong> &nbsp;
            <span class="gray" style="font-size:12px">{{
              roleUserData.length || 0
            }}</span>
            <el-popover
              ref="popover"
              placement="bottom"
              width="600"
              trigger="click"
            >
              <el-cascader
                :options="allVisibleUser"
                v-model="selectUser"
                :props="optionsUser"
                :show-all-levels="false"
                clearable
                filterable
                size="mini"
                placeholder="请选择成员"
              ></el-cascader
              >&nbsp;
              <!-- filterable -->
              <el-button type="primary" size="mini" @click="saveRoleUser"
                >保存成员</el-button
              >
              <span
                v-if="role_name != '普通成员'"
                slot="reference"
                class="el-icon-plus add-role blue pointer"
              >
                &nbsp;
                <strong>编辑成员</strong>
              </span>
            </el-popover>

            <span class="fr blue pointer" @click="showHidden">
              <strong>{{ isActive ? '收起成员' : '展开成员' }}</strong>
            </span>
          </div>
          <ul class="role-members" :class="{ active: isActive }">
            <li v-for="(item, index) in roleUserData" :key="index">
              <div class="flex">
                <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
                <span>{{ item.username }}</span>
              </div>
            </li>
          </ul>
          <div class="permission">
            <div style="margin-bottom:10px">
              <strong>权限管理</strong>
            </div>
            <ul v-for="item in menuData" :key="item.auth_id">
              <li>
                <el-checkbox
                  v-model="item.checkValue"
                  :true-label="item.auth_id"
                >
                  {{ item.name }}
                  <span class="gray menu-font">1级</span>
                </el-checkbox>
                <div
                  class="btn-permission"
                  v-for="el in item._child"
                  :key="el.auth_id"
                >
                  <el-checkbox v-model="el.checkValue" :true-label="el.auth_id">
                    {{ el.name }}
                    <span class="gray menu-font">2级</span>
                  </el-checkbox>
                  <div class="btn-permission">
                    <el-checkbox
                      v-model="v.checkValue"
                      v-for="v in el._child"
                      :key="v.auth_id"
                      :true-label="v.auth_id"
                      >{{ v.name }}</el-checkbox
                    >
                  </div>
                </div>
              </li>
            </ul>
            <div class="btn-save" v-if="_menuPermission('role-save')">
              <el-button
                type="primary"
                size="mini"
                v-show="menuData.length > 0"
                @click="saveRolePermission"
                >保存权限</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <create-edit
      :dialogVisible.sync="createEditVisible"
      :titleType="titleType"
      :baseData="baseData"
      :roleDetail="roleDetail"
      @refreshList="getRoleList"
    ></create-edit>
  </div>
</template>

<script>
import {
  roleList,
  getQueryData,
  roleDel,
  getRoleUser,
  authList,
  roleBindingUser,
  getRoleAuth,
  bindingRoleAuth
} from '@/api/role'
import { getDepartmentInfo } from '@/api/common'
import CreateEdit from './createEdit'
export default {
  name: 'RolePermission',
  components: {
    CreateEdit
  },
  data() {
    return {
      currentRole: 0,
      isActive: false,
      createEditVisible: false,
      baseData: {},
      roleList: [], //角色列表
      role_name: '',
      titleType: '', //create添加角色，edit编辑角色
      roleDetail: {}, //角色详情
      roleUserData: [], //角色成员
      role_id: '', //角色id
      optionsUser: {
        multiple: true,
        value: 'department_id',
        label: 'department_name'
      },
      allVisibleUser: [], //企业成员
      selectUser: [], //选中企业成员

      menuData: [], //菜单
      defaultProps: {
        children: '_child',
        label: 'name'
      },
      flag: true,
      btnData: [], //按钮
      checkArr: [] //选中的菜单或按钮
    }
  },
  async created() {
    this.getBaseData()
    this.getDepartmentInfo()
    this.getMenu()
    await this.getRoleList()
    this.role_id = this.roleList[0].role_id //页面打开默认赋值角色列表中第一个角色id
    this.getRoleUsers(this.roleList[0].role_id) //页面打开默认去角色列表中第一个角色成员id获取角色成员
    this.getRoleAuth(this.role_id)
  },
  methods: {
    //   基础数据
    async getBaseData() {
      try {
        let { data } = await getQueryData()
        this.baseData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 角色列表
    async getRoleList() {
      try {
        let { data } = await roleList()
        this.roleList = data
      } catch (error) {
        this._message(error)
      }
    },
    // 角色成员
    async getRoleUsers(id) {
      try {
        let { data } = await getRoleUser({ role_id: id })
        this.roleUserData = data.user || []
        this.selectUser = data.level || {}
      } catch (error) {
        this._message(error)
      }
    },
    // 菜单
    async getMenu() {
      try {
        let { data } = await authList()
        this.menuData = data
        this.addMenuAttributes(this.menuData)
        console.log(this.menuData, data)
      } catch (error) {
        this._message(error)
      }
    },
    addMenuAttributes(data) {
      data.forEach(el => {
        this.$set(el, 'checkValue', '')
        if (el._child && el._child.length > 0) {
          this.addMenuAttributes(el._child)
        }
      })
    },
    // 递归赋值选中菜单或按钮权限
    assignmentSelect(data, id) {
      data.forEach(el => {
        if (el.auth_id == id && !el.checkValue) {
          this.$set(el, 'checkValue', id)
        } else {
          if (!el.checkValue) this.$set(el, 'checkValue', '')
        }
        if (el._child && el._child.length > 0) {
          this.assignmentSelect(el._child, id)
        }
      })
    },
    // 获取角色权限
    async getRoleAuth(id) {
      try {
        let { data } = await getRoleAuth({ role_id: id })
        if (data.length > 0) {
          data.forEach(el => {
            this.assignmentSelect(this.menuData, el.auth_id)
          })
        } else {
          this.addMenuAttributes(this.menuData)
        }

        console.log(data)
      } catch (error) {
        this._message(error)
      }
    },
    //
    //点击角色触发
    async clickRole(item, index) {
      this.currentRole = index
      this.role_id = item.role_id
      this.role_name = item.role_name
      this.getRoleUsers(item.role_id)
      await this.getMenu()
      this.getRoleAuth(item.role_id)
    },
    openAddRole() {
      this.titleType = 'create'
      this.createEditVisible = true
    },
    openEditRole(item) {
      this.titleType = 'edit'
      this.createEditVisible = true
      this.roleDetail = item
    },
    async delRole(id) {
      try {
        let { message } = await roleDel({ role_id: id })
        this.$message.success(message)
        this.getRoleList()
      } catch (error) {
        this._message(error)
      }
    },
    handleDel(item) {
      this.$confirm(`确定删除${item.role_name}角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delRole(item.role_id)
        })
        .catch(() => {})
    },
    // 保存角色成员
    async saveRoleUser() {
      if (this.selectUser.length > 0) {
        let user_ids = this.selectUser.map(el => el[el.length - 1])
        let params = {
          role_id: this.role_id,
          user_ids: Array.from(new Set(user_ids)), //数组去重
          user_department_level: this.selectUser
        }
        try {
          let { message } = await roleBindingUser(params)
          this.$message.success(message)
          this.getRoleUsers(this.role_id)
        } catch (error) {
          this._message(error)
        }
      } else {
        this.$message.warning('请选择角色成员')
      }
    },
    // 递归获取选中的菜单或按钮权限
    addAttributes(data) {
      data.forEach(el => {
        if (el.checkValue) this.checkArr.push(el.checkValue)
        if (el._child && el._child.length > 0) {
          this.addAttributes(el._child)
        }
      })
    },
    // 保存角色权限
    async saveRolePermission() {
      this.checkArr = []
      this.addAttributes(this.menuData)
      try {
        let { message } = await bindingRoleAuth({
          role_id: this.role_id,
          auth_ids: this.checkArr
        })
        this.$message.success(message)
        this.getRoleAuth(this.role_id)
      } catch (error) {
        this._message(error)
      }
    },

    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let userArr = JSON.parse(JSON.stringify(data))
        this.allVisibleUser = this.formateAllVisibleUser(userArr)
      } catch (error) {
        this._message(error)
      }
    },
    pushData(obj) {
      let item = {
        department_id: obj.user_id,
        department_name: obj.username,
        user_id: obj.user_id,
        user_name: obj.username
      }
      return item
    },
    // 处理企业成员信息
    formateAllVisibleUser(arr) {
      arr.forEach(el => {
        if (el.children) {
          if (el.people && el.people.length > 0) {
            el.people.forEach(peopleItem => {
              el.children.push(this.pushData(peopleItem))
            })
          }
          this.formateAllVisibleUser(el.children)
        } else {
          if (el.people && el.people.length > 0) {
            el['children'] = []
            el['disabled'] = false
            el.people.forEach(peopleItem => {
              el['children'].push(this.pushData(peopleItem))
            })
          } else {
            if (el.user_id) {
              el['disabled'] = false
            } else {
              el['disabled'] = true
              el.department_name = `${el.department_name}(暂无成员)`
            }
          }
        }
      })

      return arr
    },

    showHidden() {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/mixin';
.role-permission {
  height: 100%;
  line-height: 20px;
  overflow-y: auto;
  .el-row,
  .el-col {
    height: 100%;
    box-sizing: border-box;
  }
  .col-left {
    height: 100%;
    margin-left: 5px;
    border: 1px solid #eee;
    background-color: #f9f9f9;
    .title {
      height: 40px;
      line-height: 40px;
      font-weight: bold;
      padding: 0 10px;
      border-bottom: 1px solid #eee;
    }
    ul li {
      padding: 5px 10px;
      line-height: 20px;
      border-bottom: 1px solid #eee;
      p {
        padding-left: 20px;
        font-size: 12px;
      }
      .role-handle {
        display: none;
      }
      &:hover .role-handle {
        display: block;
      }
    }
  }
  .col-right {
    padding: 0 20px;
    .right-top {
      height: 40px;
      line-height: 40px;
    }
    .role-members {
      height: 0;
      overflow-y: auto;
      background-color: #f8f8f8;
      @include scrollBar();
      @include transitons(0.5s);
      li {
        display: inline-block;
        padding: 10px;
        width: 130px;
        .flex {
          display: flex;
          align-items: center;
          span {
            margin-left: 10px;
          }
        }
      }
    }
    .active {
      height: 100px;
    }
    .permission {
      margin-top: 20px;
      ul {
        display: flex;
        line-height: 20px;
        padding: 5px 0px;
        border-bottom: 1px solid #eee;
        li {
          .btn-permission {
            margin-top: 5px;
            margin-left: 25px;
          }
        }
      }
    }
  }
  .menu-font {
    font-size: 12px;
  }
  .add-role {
    padding: 10px 30px;
    span {
      font-weight: bolder;
    }
  }
  .btn-save {
    margin-top: 20px;
    text-align: center;
  }
}
::v-deep .el-input--mini .el-input__inner {
  width: 480px;
}
.li-sctive {
  color: $themeColor;
}
</style>
