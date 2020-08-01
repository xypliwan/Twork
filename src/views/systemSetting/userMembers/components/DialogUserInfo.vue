<template>
  <!-- 添加编辑角色 -->
  <div class="dialog-user-info">
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div slot="title">设置账户</div>
      <div class="dialog-user-info-content">
        <div class="dialog-user-info-content-item">
          <div class="item-title">
            <span>
              <strong>未激活账户</strong>
            </span>
            <el-input
              class="item-title-input"
              v-model="unactivatedUsername"
              @change="unactivatedSearch"
              @keyup.enter.native="unactivatedSearch"
              size="mini"
              suffix-icon="el-icon-search"
              placeholder="enter键查询名字"
            ></el-input>
          </div>
          <div class="item-table" v-loading="loading">
            <el-table
              ref="unactivatedTable"
              :data="unactivatedFilterData"
              height="300"
              style="width: 100%"
              @selection-change="unactivatedChange"
              :row-key="getRowKeys"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="date" label="部门"></el-table-column>
              <el-table-column prop="address" label="电话"></el-table-column>
            </el-table>
            <div class="item-table-btn">
              <el-button type="primary" size="mini" @click="handleAccount('10')"
                >激活账户</el-button
              >
            </div>
          </div>
        </div>
        <div class="dialog-user-info-content-item">
          <div class="item-title">
            <span>
              <strong>已激活账户</strong>
            </span>
            <el-input
              class="item-title-input"
              v-model="activatedUsername"
              @change="activatedSearch"
              @keyup.enter.native="activatedSearch"
              size="mini"
              placeholder="enter键查询名字"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="item-table" v-loading="loading">
            <el-table
              ref="activatedTable"
              :data="activatedFilterData"
              height="300"
              style="width: 100%"
              @selection-change="activatedChange"
              :row-key="getActivatedRowKeys"
            >
              <el-table-column
                :reserve-selection="true"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column prop="username" label="姓名"></el-table-column>
              <el-table-column prop="date" label="部门"></el-table-column>
              <el-table-column prop="address" label="电话"></el-table-column>
            </el-table>
            <div class="item-table-btn">
              <el-button type="primary" size="mini" @click="handleAccount('9')"
                >停用账户</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-user-info-footer">
        <el-button size="mini" @click="beforeClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { userList, setUserStatus } from '@/api/user'
export default {
  name: 'DialogUserInfo',
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      loading: false,
      activatedParams: {
        status: '10', //10已激活
        join_department: ''
      },
      activatedUsername: '',
      activatedData: [], //原始的
      activatedFilterData: [], //过滤后的
      activatedSelected: [],
      unactivatedParams: {
        status: '9', //9 未激活
        join_department: ''
      },
      unactivatedUsername: '',
      unactivatedData: [], //原始
      unactivatedFilterData: [], //过滤后的
      unactivatedSelected: []
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.getUserList(this.activatedParams)
        this.getUserList(this.unactivatedParams)
      }
    }
  },
  methods: {
    unactivatedSearch() {
      this.unactivatedFilterData = this.unactivatedData.filter(el =>
        el.username
          .toLowerCase()
          .includes(this.unactivatedUsername.toLowerCase())
      )
    },
    activatedSearch() {
      this.activatedFilterData = this.activatedData.filter(el =>
        el.username.toLowerCase().includes(this.activatedUsername.toLowerCase())
      )
    },
    // 数组去重
    uniqObjInArray(objarray) {
      let len = objarray.length
      let tempJson = {}
      let res = []
      for (let i = 0; i < len; i++) {
        //取出每一个对象
        tempJson[JSON.stringify(objarray[i])] = true
      }
      let keyItems = Object.keys(tempJson)
      for (let j = 0; j < keyItems.length; j++) {
        res.push(JSON.parse(keyItems[j]))
      }
      return res
    },
    async getUserList(params) {
      this.loading = true
      try {
        let { data } = await userList(params)
        if (params.status == 9)
          this.unactivatedFilterData = this.unactivatedData = this.uniqObjInArray(
            data
          )

        if (params.status == 10)
          this.activatedFilterData = this.activatedData = this.uniqObjInArray(
            data
          )
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    // 停用或激活
    async handleAccount(status) {
      let params = {
        status,
        user_id:
          status == 9
            ? this.activatedSelected
            : status == 10
            ? this.unactivatedSelected
            : []
      }
      if (params.user_id.length == 0) {
        this.$message.warning('请选择账户')
        return
      }
      try {
        let { message } = await setUserStatus(params)
        this.activatedParams = Object.assign(
          this.activatedParams,
          this.$options.data().activatedParams
        )
        this.unactivatedParams = Object.assign(
          this.unactivatedParams,
          this.$options.data().unactivatedParams
        )
        this.getUserList(this.activatedParams)
        this.getUserList(this.unactivatedParams)
        this.$emit('refreshList', true)
        this.$message.success(message)
      } catch (error) {
        this._message(error)
      }
    },
    unactivatedChange(val) {
      this.unactivatedSelected = val.map(el => el.user_id)
    },
    getRowKeys(row) {
      return row.user_id
    },
    activatedChange(val) {
      this.activatedSelected = val.map(el => el.user_id)
    },
    getActivatedRowKeys(row) {
      return row.user_id
    },
    beforeClose() {
      this.activatedParams = Object.assign(
        this.activatedParams,
        this.$options.data().activatedParams
      )
      this.unactivatedParams = Object.assign(
        this.unactivatedParams,
        this.$options.data().unactivatedParams
      )
      this.$refs.unactivatedTable.clearSelection()
      this.$refs.activatedTable.clearSelection()
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-user-info {
  .dialog-user-info-content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    height: 400px;
    .dialog-user-info-content-item {
      width: 48%;
      .item-table {
        border: 1px solid #eee;
        .item-table-btn {
          margin: 10px;
        }
      }
    }
    .item-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      span {
        flex: 1;
        padding-left: 5px;
        border-left: 3px solid #526ecc;
      }
      .item-title-input {
        width: 200px;
      }
    }
  }
  .dialog-user-info-footer {
    margin-top: 20px;
    text-align: center;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #eee;
    font-weight: bold;
    padding: 20px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px;
  }
}
</style>
