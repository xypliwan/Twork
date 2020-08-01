<template>
  <div v-loading="loading">
    <el-dialog
      :title="'将“' + moveTargetName + '”移动到'"
      :visible="visible"
      width="500px"
      @close="handleClose"
    >
      <div style="margin-top: -20px">
        <div
          v-for="(item, index) in reportList"
          :key="index"
          class="move-content"
        >
          <el-radio v-model="move_params.group_id" :label="item.group_id">
            <i class="header-icon el-icon-menu"></i>
            {{ item.name }}
          </el-radio>

          <span v-show="currentGrounpId == item.group_id" class="fr orange"
            >当前所在分组</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="mini" @click="moveGroup"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { moveGrounp } from '@/api/report'
export default {
  props: {
    visible: Boolean,
    currentId: String,
    reportList: Array
  },
  data() {
    return {
      move_params: {
        group_id: '',
        report_id: ''
      },
      currentGrounpId: '',
      moveTargetName: '',
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.move_params.report_id = this.currentId
        this.reportList.forEach(el => {
          el.report.forEach(ev => {
            if (ev.report_id == this.currentId) {
              this.moveTargetName = ev.report_name
              this.currentGrounpId = el.group_id
              this.move_params.group_id = el.group_id
            }
          })
        })
      }
    }
  },
  methods: {
    async moveGroup() {
      this.loading = true
      try {
        const { message } = await moveGrounp(this.move_params)
        this._message(message, 'success')
        this.$emit('moveOk')
        this.handleClose()
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.move-content {
  padding: 10px 0px;
  border-bottom: 1px solid #eee;
}
</style>
