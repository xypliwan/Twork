<template>
  <el-popover placement="right-start" width="350" v-model="visible">
    <div v-loading="loading">
      <div class="add-title">新建分组</div>
      <div class="add-content">
        <el-input
          placeholder="请输入分组名称"
          v-model="grounpName"
          size="small"
          clearable
        ></el-input>
      </div>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="groupAdd">新建</el-button>
      </div>
    </div>
    <el-button
      slot="reference"
      style="margin-right:10px"
      icon="el-icon-document-add"
      size="small"
      >新建分组</el-button
    >
  </el-popover>
</template>
<script>
import { addReportGroup } from '@/api/report'
export default {
  data() {
    return {
      visible: false,
      loading: false,
      grounpName: ''
    }
  },
  methods: {
    async addReportGroup() {
      this.loading = true
      try {
        const { message } = await addReportGroup({ name: this.grounpName })
        this._message(message, 'success')
        this.cancel()
        this.$emit('addOk')
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    cancel() {
      this.visible = false
      this.grounpName = ''
      this.loading = false
    },
    groupAdd() {
      if (this.grounpName.trim().length === 0) {
        this._message('请输入分组名称', 'warning')
        return
      }
      this.addReportGroup()
    }
  }
}
</script>
<style lang="scss" scoped>
.add-title {
  border-bottom: 1px solid #f1f1f1;
  font-size: 16px;
  color: #333;
  padding-bottom: 15px;
}
.add-content {
  padding: 20px 0px;
}
</style>
