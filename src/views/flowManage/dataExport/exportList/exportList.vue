<template>
  <div class="export-list">
    <div class="search">
      <search-condition :processData="processData" @search="search">
        <span slot="export">
          <el-popover
            placement="bottom"
            width="400"
            trigger="click"
            v-model="popoverVisible"
          >
            <el-form :model="ruleForm" ref="ruleForm">
              <el-form-item
                prop="export_remark"
                :rules="[
                  {
                    required: true,
                    message: '请备注说明导出内容',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请备注说明导出内容"
                  clearable
                  v-model="ruleForm.export_remark"
                ></el-input>
              </el-form-item>
            </el-form>
            <div style="margin-top:10px; text-align:center;">
              <el-button size="mini" @click="resetForm('ruleForm')"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="exportList('ruleForm')"
                >确认</el-button
              >
            </div>
            <el-button
              slot="reference"
              style="margin-left:10px"
              type="primary"
              size="mini"
              icon="el-icon-download"
              >导出</el-button
            >
          </el-popover>
        </span>
      </search-condition>
    </div>
    <div class="table">
      <el-table :data="list.tableData" style="width: 100%">
        <el-table-column prop="module_code_name" label="流程编号" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.list_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="list_title" label="标题"></el-table-column>
        <el-table-column
          prop="created_at"
          label="发起时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="finish_at"
          label="完成时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="list_status"
          label="审批状态"
          width="100"
        ></el-table-column>
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
import { getList, groupList } from '@/api/flowManage'
import { formateExcl } from '@/utils/utils'
import searchCondition from './components/searchCondition'
export default {
  name: 'dataExport',
  components: {
    searchCondition
  },
  data() {
    return {
      popoverVisible: false,
      ruleForm: {
        export_remark: ''
      },
      list: {
        params: {
          page: 1,
          pageSize: 10
        },
        tableData: [],
        total: null
      },
      processData: []
    }
  },
  created() {
    this.getList()
    this.groupList()
  },
  methods: {
    async groupList() {
      try {
        let { data } = await groupList()
        let arr = []
        data.forEach(el => {
          arr = arr.concat(el.process)
        })
        this.processData = arr
      } catch (error) {
        this._message(error)
      }
    },
    async getList() {
      delete this.list.params.export
      delete this.list.params.export_remark
      try {
        const { data, paginator } = await getList(this.list.params)
        this.list.tableData = data
        this.list.total = paginator.totalCount
      } catch (error) {
        this._message(error)
      }
    },
    search(params) {
      this.list.params = Object.assign(this.list.params, params)
      this.list.params.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.list.params.pageSize = val
      this.list.params.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.list.params.page = val
      this.getList()
    },
    exportList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.list.params.export_remark = this.ruleForm.export_remark
          this.list.params.export = 1
          formateExcl(
            '/process-list/get-list',
            'get',
            this.list.params,
            '数据导出'
          )
          this.resetForm(formName)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.popoverVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.export-list {
  .table {
    border-top: 1px solid #eee;
    margin-top: 20px;
    height: calc(100% - 400px);
    overflow: auto;
    box-sizing: border-box;
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
