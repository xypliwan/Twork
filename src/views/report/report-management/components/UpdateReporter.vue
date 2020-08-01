<template>
  <el-dialog
    title="更新汇报人员"
    :visible="visible"
    width="1200px"
    @close="handleClose"
    v-loading="loading"
    custom-class="test"
  >
    <el-cascader-panel
      filterable
      collapse-tags
      :options="formatUser"
      v-model="idUrlOwn"
      :props="optionsUser"
      :show-all-levels="false"
      clearable
      placeholder="请选择汇报人员"
    ></el-cascader-panel>

    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="mini" @click="update">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { formateAllUser } from '_u/utils'
import { updateReportPeople } from '@/api/report'
export default {
  props: {
    visible: Boolean,
    id: String,
    idUrl: Array
  },
  data() {
    return {
      idUrlOwn: [],
      loading: false,
      optionsUser: {
        multiple: true,
        checkStrictly: true,
        value: 'department_id',
        label: 'department_name'
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.idUrlOwn = this.idUrl
      }
    }
  },
  computed: {
    ...mapGetters(['architectList']),
    formatUser() {
      let userArr = JSON.parse(JSON.stringify(this.architectList))
      return formateAllUser(userArr)
    }
  },
  methods: {
    update() {
      if (!this.idUrlOwn.length) {
        this._message('请选择汇报人员', 'warning')
        return
      }
      let params = {
        report_id: this.id,
        create_report_people_params: this.idUrlOwn,
        create_report_people: []
      }
      this.idUrlOwn.forEach(el => {
        params.create_report_people.push(el[el.length - 1])
      })
      this.updateReportPeopleFn(params)
    },
    async updateReportPeopleFn(params) {
      this.loading = true
      try {
        let { message } = await updateReportPeople(params)
        this._message(message, 'success')
        this.$emit('updateOk', {
          idUrl: this.idUrlOwn,
          id: this.id
        })
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
<style lang="scss" scoped></style>
