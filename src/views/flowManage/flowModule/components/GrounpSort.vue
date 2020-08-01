<template>
  <div>
    <el-dialog
      title="分组排序 (可拖拽排序)"
      :append-to-body="true"
      :visible.sync="visible"
      width="500px"
      :before-close="handleClose"
      v-loading="loading"
    >
      <draggable :list="listOwn">
        <div class="sort-item" v-for="(item, i) in listOwn" :key="i">
          <i class="header-icon el-icon-menu"></i>
          <span class="grounp-name">{{ item.group_name }}</span>
        </div>
      </draggable>
      <div class="footer-box">
        <el-button size="mini" @click="handleClose">关闭</el-button>
        <el-button size="mini" type="primary" @click="setSortListFn"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { setSortList } from '@/api/flowManage'
export default {
  props: {
    visible: Boolean,
    list: Array
  },
  components: { draggable },
  data() {
    return {
      listOwn: [],
      loading: false
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.listOwn = JSON.parse(JSON.stringify(this.list))
      }
    }
  },
  methods: {
    async setSortListFn() {
      let arrs = this.listOwn.map(el => el.group_id)

      this.loading = true
      try {
        const { message } = await setSortList({ update_arr: arrs })
        this._message(message, 'success')
        this.$emit('saveOk')
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
.sort-item {
  padding: 12px 0;
  border-bottom: 1px solid #f1f1f1;
  font-size: 15px;
  color: #333;
  .grounp-name {
    margin-left: 15px;
  }
}
.footer-box {
  margin-top: 20px;
  text-align: right;
}
</style>
