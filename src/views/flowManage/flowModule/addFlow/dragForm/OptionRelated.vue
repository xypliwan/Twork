<template>
  <div>
    <el-dialog
      :title="form.name + '-选项关联'"
      :append-to-body="false"
      :visible.sync="visible"
      width="700px"
      :before-close="handleClose"
    >
      <div class="txt">
        根据选择的选项，显示其他控件。
      </div>
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="label" label="当选项为" width="180">
        </el-table-column>
        <el-table-column label="显示以下控件">
          <template slot-scope="scope">
            <div>
              <el-select
                style="width:100%"
                size="mini"
                v-model="scope.row.attr"
                multiple
                placeholder="请选择"
              >
                <el-option
                  :disabled="item.key == form.key || item.relatedDisabled"
                  v-for="(item, i) in selectList"
                  :key="i"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer-btn">
        <el-button size="mini" @click="handleClose">取消</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    form: {
      type: Object,
      default: () => {}
    },
    selectList: Array
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.list = JSON.parse(JSON.stringify(this.form.options))
      }
    }
  },
  methods: {
    save() {
      this.$emit('saveRelatedInfo', this.list)
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-btn {
  text-align: right;
  margin-top: 50px;
}
</style>
