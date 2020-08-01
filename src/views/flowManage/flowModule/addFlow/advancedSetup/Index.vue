<template>
  <div class="base-setting">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="0px"
      class="demo-ruleForm"
    >
      <!-- <div style="margin-bottom: 5px;">处理人去重</div> -->
      <!-- <el-form-item label>
        <el-select v-model="ruleForm.deal_people_auto_duplicate_removal_type" placeholder="请选择" >
          <el-option :value="0" label="不启用自动去重"></el-option>
          <el-option :value="1" label="同一处理人仅在连续出现时去重"></el-option>
          <el-option :value="2" label="一处理人在流程中出现多次时，仅保留第一个"></el-option>
        </el-select>
        <el-checkbox v-model="ruleForm.deal_people_auto_duplicate_removal" :true-label="1" :false-label="0">对发起人审批时自动去重</el-checkbox>
      </el-form-item> -->
      <div style="margin-bottom: 5px;">
        处理人意见提示&nbsp;
        <span style="color:#bbb;font-size:12px">最多1000字</span>
      </div>
      <el-form-item label>
        <el-input v-model="ruleForm.deal_content_tips"></el-input>
      </el-form-item>
      <div style="margin-bottom: -5px;">处理意见</div>
      <el-form-item label>
        <el-checkbox
          v-model="ruleForm.deal_content_is_must"
          :true-label="1"
          :false-label="0"
          >必填</el-checkbox
        >
        <el-checkbox
          v-model="ruleForm.promoter_can_not_see_deal_content"
          :true-label="1"
          :false-label="0"
          >对发起人不可见</el-checkbox
        >
      </el-form-item>
      <el-form-item label>
        <div>是否允许撤销已通过的审批</div>
        <el-checkbox
          v-model="ruleForm.is_set_cancel_process"
          true-label="1"
          false-label="0"
          >允许撤销</el-checkbox
        >
        <el-input
          style="width:100px;margin-left:20px"
          size="mini"
          type="number"
          v-model="ruleForm.cancel_process_days"
          :min="0"
        ></el-input>
        天内通过的审批
        <div class="dec">
          勾选后，员工可申请撤销已通过的审批 （配置前已通过的审批不可撤销）
        </div>
      </el-form-item>

      <el-form-item label>
        <div>绑定流程</div>
        <el-cascader
          style="width:100%"
          ref="cascader"
          :show-all-levels="false"
          v-model="groupListId"
          size="small"
          placeholder="选择流程"
          :options="formatGroupList"
          :props="{
            multiple: true,
            children: 'process',
            value: 'group_id',
            label: 'group_name'
          }"
          clearable
          filterable
          @change="changeProcess"
        ></el-cascader>
      </el-form-item>
      <!-- <div style="margin-bottom: -5px;">打印模板</div>
      <el-form-item label>
        <el-radio v-model="ruleForm.radio" label="1">默认模板</el-radio>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    groupList: Array
  },
  name: '',
  data() {
    return {
      ruleForm: {
        deal_people_auto_duplicate_removal: '', //是否开启处理人自动去重 1启用 0不启用
        deal_people_auto_duplicate_removal_type: 0, //0不启用 1同一处理人仅在连续出现时去重 2同一处理人在流程中出现多次时，仅保留第一个
        deal_content_is_must: '', //1处理意见必填
        deal_content_tips: '', //处理意见填写提示
        promoter_can_not_see_deal_content: '', //处理意见对发起人不可见 1是 0 否
        is_set_cancel_process: '0',
        cancel_process_days: '', //可以撤销流程的天数
        bind_process: [] //绑定流程 process_id  name
      },
      groupListId: []
    }
  },
  computed: {
    formatGroupList() {
      this.groupList.forEach(el => {
        if (el.process.length) {
          el.process.forEach(ev => {
            ev.group_name = ev.name
            ev.group_id = ev.process_id
          })
        }
      })
      return this.groupList
    }
  },
  methods: {
    changeProcess() {
      this.$nextTick(() => {
        let nodeValue = this.$refs.cascader.getCheckedNodes()
        this.ruleForm.bind_process = []
        nodeValue.forEach(el => {
          if (el.data.name) {
            this.ruleForm.bind_process.push({
              process_id: el.data.process_id,
              name: el.data.name
            })
          }
        })
      })
    },
    initProcessId() {
      this.$nextTick(() => {
        this.groupListId = []
        this.groupList.forEach(el => {
          el.process.forEach(ev => {
            this.ruleForm.bind_process.forEach(ec => {
              if (ev.process_id == ec.process_id) {
                let item = []
                item.push(el.group_id)
                item.push(ec.process_id)
                this.groupListId.push(item)
              }
            })
          })
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.base-setting {
  height: 100%;
  width: 50%;
  min-width: 500px;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  .demo-ruleForm {
    margin: 0 auto;
    width: 500px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
