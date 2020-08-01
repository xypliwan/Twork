<template>
  <div class="user-members">
    <div class="box-left">
      <!-- <div class="importMembers">
        <el-button size="mini" type="primary" @click="dialogVisible = true"
          >上传成员</el-button
        >
      </div> -->
      <el-tree
        :data="departmentInfo"
        :props="defaultProps"
        node-key="department_id"
        :default-expanded-keys="[defaultExpandedKeys]"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <div class="box-right">
      <div class="set-user-status">
        <el-button size="mini" type="primary" @click="setStatusVisible = true"
          >设置账户</el-button
        >
        <span>系统将只能通过可用账户进行登陆系统操作</span>
      </div>
      <el-table
        :data="list.tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
        <el-table-column label="部门" prop="department_name"></el-table-column>
        <el-table-column label="姓名" prop="name_alies"></el-table-column>
        <!-- <el-table-column label="职位" prop=""></el-table-column> -->
        <el-table-column label="性别" prop="sex">
          <!-- <template slot-scope="scope">
            <span>{{scope.row.sex==1?'男':scope.row.sex==2?'女':'未知'}}</span>
          </template>-->
        </el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!-- <el-table-column label="用户组" prop=""></el-table-column> -->
        <el-table-column
          label="状态"
          prop="status"
          width="100"
        ></el-table-column>
        <el-table-column label="登录账号" prop="username"></el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-input
              v-model="list.params.username"
              size="mini"
              placeholder="输入姓名搜索"
              @keyup.enter.native="search(1)"
            />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openDialog(scope.row)"
              >修改密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="search"
          :current-page="list.params.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="list.params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="passwordVisible"
      width="400px"
      center
      :show-close="false"
    >
      <el-input
        v-model="pwParam.new_password"
        placeholder="请输入新密码"
        show-password
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="passwordVisible = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click="editPassword"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <import-members :dialogVisible.sync="dialogVisible"></import-members>
    <dialog-user-info
      :dialogVisible.sync="setStatusVisible"
      @refreshList="refreshList"
    ></dialog-user-info>
  </div>
</template>

<script>
import { departmentUserList, modifyPassword } from '@/api/user'
import { getDepartmentInfo } from '@/api/common'
import importMembers from './importMembers/importMembers'
import DialogUserInfo from './components/DialogUserInfo'
export default {
  name: 'UserMembers',
  components: { importMembers, DialogUserInfo },
  data() {
    return {
      dialogVisible: false,
      setStatusVisible: false,
      departmentInfo: [],
      defaultProps: {
        children: 'children',
        label: 'department_name'
      },
      defaultExpandedKeys: '', //默认展开的节点
      list: {
        params: {
          page: 1,
          pageSize: 10,
          department_id: '',
          username: ''
        },
        tableData: [],
        total: null
      },
      passwordVisible: false,
      pwParam: {
        user_id: '',
        new_password: ''
      }
    }
  },
  created() {
    // this.getList();
    this.getDepartmentInfo()
  },
  methods: {
    async getList() {
      try {
        let { data, paginator } = await departmentUserList(this.list.params)
        this.list.tableData = data
        this.list.total = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    search(page) {
      this.list.params.page = page || this.list.params.page
      this.getList()
      console.log(`当前页: ${page}`)
    },
    handleSizeChange(val) {
      this.list.params.pageSize = val
      this.list.params.page = 1
      this.getList()
    },
    // 点击树形图
    handleNodeClick(data) {
      this.list.params.department_id = data.department_id
      this.search(1)
      console.log(data)
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
        this.defaultExpandedKeys = this.departmentInfo[0].department_id
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    },

    openDialog(item) {
      this.pwParam.new_password = ''
      this.pwParam.user_id = item.user_id
      this.passwordVisible = true
    },
    async editPassword() {
      try {
        await modifyPassword(this.pwParam)
        this.passwordVisible = false
        this.$message.success('密码修改成功')
      } catch (error) {
        this._message(error)
      }
    },
    refreshList() {
      this.list.params.page = 1
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.user-members {
  display: flex;
  height: 100%;
  .box-left {
    width: 260px;
    background-color: #eee;
    .el-tree {
      margin-top: 10px;
      background-color: #eee;
    }
  }
  .box-right {
    flex: 1;
    padding: 10px;
    margin-bottom: 52px;
    overflow-x: hidden;
    // width: calc(100% - 260px);
    @include scrollBar();
    .set-user-status {
      padding: 10px 0px;
      span {
        margin-left: 10px;
        color: #999;
      }
    }
  }

  .page {
    padding-top: 10px;
    text-align: right;
    width: calc(100% - 230px);
    border-top: 1px solid #eee;
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}
</style>
