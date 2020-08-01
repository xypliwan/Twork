<template>
  <el-dialog
    title="分组重命名"
    :visible="visible"
    width="350px"
    @close="handleClose"
    v-loading="loading"
  >
    <el-input
      placeholder="请输入"
      v-model="groupName"
      size="small"
      clearable
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="mini" @click="confirmRename"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { updateGrounpName } from '@/api/report'
export default {
  props: {
    visible: Boolean,
    id: String,
    renameName: String
  },
  data() {
    return {
      groupName: '',
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.groupName = this.renameName
      }
    }
  },
  methods: {
    async confirmRename() {
      if (this.groupName.length == 0) {
        this._message('请输入分组名称', 'warning')
        return
      }
      this.loading = true
      try {
        const { message, data } = await updateGrounpName({
          group_id: this.id,
          name: this.groupName
        })
        this._message(message, 'success')
        this.$emit('renameOk', data)
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    handleClose() {
      this.groupName = ''
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped></style>
