<template>
  <div class="admin-log">
    <div class="search">
      <span>
        <el-date-picker
          v-model="times"
          @change="changeTimes"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          size="mini"
          clearable
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </span>
      <span>
        <el-select
          v-model="list.params.module_code"
          placeholder="事件类型"
          size="mini"
          filterable
          clearable
          @change="search(1)"
        >
          <el-option
            v-for="(item, index) in baseData.modules"
            :key="index"
            :label="item.module_name"
            :value="item.module_code"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-select
          v-model="list.params.user_id"
          placeholder="管理员"
          size="mini"
          filterable
          clearable
          @change="search(1)"
        >
          <el-option
            v-for="(item, index) in allUsers"
            :key="index"
            :label="item.username"
            :value="item.user_id"
          ></el-option>
        </el-select>
      </span>
      <span>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-download"
          @click="exportList"
          >导出</el-button
        >
      </span>
    </div>

    <div class="table">
      <el-table :data="list.tableData" style="width: 100%">
        <el-table-column prop="module_code_name" label="事件类型" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.module_code_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="事件详情"></el-table-column>
        <el-table-column
          prop="user_name"
          label="管理员"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="created_at"
          label="日期"
          width="150"
        ></el-table-column>
        <!-- <el-table-column prop="address" label="IP地址"></el-table-column> -->
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
  </div>
</template>

<script>
import { operationLogList, getListFilter } from '@/api/adminLog'
import { userList } from '@/api/common'
import { formateExcl } from '@/utils/utils'
export default {
  name: 'AdminLog',
  data() {
    return {
      times: [],
      list: {
        params: {
          page: 1,
          pageSize: 10,
          start_time: '',
          end_time: '',
          module_code: '', //类型
          user_id: '' //用户ID
        },
        tableData: [],
        total: null
      },
      baseData: {},
      allUsers: []
    }
  },
  created() {
    this.getList()
    this.getBaseData()
  },
  methods: {
    changeTimes(val) {
      if (val && val.length > 0) {
        this.list.params.start_time = val[0]
        this.list.params.end_time = val[1]
        this.list.params.page = 1
        this.getList()
      } else {
        this.list.params.start_time = ''
        this.list.params.end_time = ''
        this.list.params.page = 1
        this.getList()
      }
      console.log(val)
    },
    async getBaseData() {
      try {
        let { data } = await getListFilter()
        this.baseData = data
        let userRes = await userList()
        this.allUsers = userRes.data || []
      } catch (error) {
        this._message(error)
      }
    },
    async getList() {
      this.list.params.export = 0
      try {
        let { data, paginator } = await operationLogList(this.list.params)
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
    exportList() {
      this.list.params.export = 1
      formateExcl('/operation-log/list', 'get', this.list.params, '操作日志')
    }
    // handleCurrentChange(val) {
    //   this.list.params.page = val;
    //   this.getList();
    //   console.log(`当前页: ${val}`);
    // }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.admin-log {
  padding: 20px;
  overflow: hidden;
  .search {
    span {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
  .table {
    margin-top: 20px;
    height: calc(100vh - 269px);
    overflow: auto;
    box-sizing: border-box;
    @include scrollBar();
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
