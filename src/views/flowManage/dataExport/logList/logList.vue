<template>
  <div class="log-list">
    <div class="table">
      <el-table :data="list.tableData" style="width: 100%">
        <!-- <el-table-column prop="action" label="导出文件名称" width="160"></el-table-column> -->
        <el-table-column
          prop="user_name"
          label="导出人员"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="created_at"
          label="导出时间"
          width="160"
        ></el-table-column>
        <el-table-column prop="remark" label="导出说明"></el-table-column>
        <!-- <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click>删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
import { listExportLog } from '@/api/flowManage'
export default {
  data() {
    return {
      list: {
        params: {
          page: 1,
          pageSize: 10
        },
        tableData: [],
        total: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      delete this.list.params.export
      try {
        const { data, paginator } = await listExportLog(this.list.params)
        this.list.tableData = data
        this.list.total = paginator.totalCount
        console.log(data, 111)
      } catch (error) {
        this._message(error)
      }
    },
    handleSizeChange(val) {
      this.list.params.pageSize = val
      this.list.params.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.list.params.page = val
      this.getList()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/mixin.scss';
.log-list {
  //  @include scrollBar();
  .table {
    border-top: 1px solid #eee;
    margin-top: 20px;
    height: calc(100% - 400px);
    overflow: auto;
    box-sizing: border-box;
    // @include scrollBar();
  }
  .page {
    background-color: #fff;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
