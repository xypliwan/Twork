<template>
  <div class="move-group">
    <el-dialog
      :title="'将“' + move_target.name + '”移动到'"
      :visible.sync="moveVisible"
      width="500px"
      :show-close="false"
      :before-close="beforeClose"
    >
      <div style="margin-top: -20px">
        <div
          v-for="(item, index) in scenarioGroupData"
          :key="index"
          class="move-content"
        >
          <el-radio v-model="move_params.s_group_id" :label="item.s_group_id">
            <i class="header-icon el-icon-menu"></i>
            {{ item.name }}
          </el-radio>

          <span
            v-show="move_target_group.s_group_id == item.s_group_id"
            class="fr orange"
            >当前所在分组</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="beforeClose">取 消</el-button>
        <el-button type="primary" size="mini" @click="moveGroup"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { settingMoveToGroup } from '@/api/business-scenario'
export default {
  props: {
    moveVisible: Boolean,
    scenarioGroupData: Array,
    move_target: Object,
    move_target_group: Object
  },
  name: '',
  data() {
    return {
      move_params: {
        s_group_id: '',
        setting_id: ''
      }
    }
  },
  watch: {
    moveVisible(val) {
      if (val) {
        this.move_params.s_group_id = this.move_target_group.s_group_id
        this.move_params.setting_id = this.move_target.setting_id
      }
    }
  },
  methods: {
    // 移动
    async moveGroup() {
      try {
        await settingMoveToGroup(this.move_params)
        this.$message.success('移动成功')
        this.$emit('refreshList', true)
        this.beforeClose()
      } catch (error) {
        this._message(error)
      }
    },
    beforeClose() {
      this.$emit('update:moveVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.move-group {
  .move-content {
    padding: 10px 0px;
    border-bottom: 1px solid #eee;
  }
}
</style>
