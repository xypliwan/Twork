<template>
  <div class="task-setting scrollbar">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      size="small"
      class="demo-ruleForm"
    >
      <div style="margin-bottom: 5px;">
        <span class="red">*</span> 场景标题
        <span style="color:#bbb;font-size:12px">不超过20个字</span>
      </div>
      <el-form-item label prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="请输入场景标题"
          clearable
        />
      </el-form-item>
      <div style="margin-bottom: 5px;"><span class="red">*</span>选择分组</div>
      <el-form-item label prop="s_group_id">
        <el-select
          filterable
          v-model="ruleForm.s_group_id"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in scenarioGroupData"
            :key="index"
            :label="item.name"
            :value="item.s_group_id"
          />
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 5px;">
        系统类型
      </div>
      <el-form-item label prop="product_code">
        <el-select
          filterable
          v-model="ruleForm.product_code"
          placeholder="请选择"
          @change="handleSystem"
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.product_name"
            :value="item.product_code"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 5px;"><span class="red">*</span>流程模板</div>
      <el-form-item label prop="process_id">
        <div class="form-item-flex">
          <el-select
            filterable
            clearable
            v-model="ruleForm.group_id"
            placeholder="请选择流程分组"
            @change="groupChange"
          >
            <el-option
              v-for="(item, index) in groupData"
              :key="index"
              :label="item.group_name"
              :value="item.group_id"
              @click.native="getProcess(item)"
              :disabled="!item.process.length"
            >
              <span>{{ item.group_name }}</span>
              <span style="color: #8492a6; font-size: 13px"
                >( {{ item.process.length }} )</span
              >
            </el-option>
          </el-select>
          <el-select
            v-model="ruleForm.process_id"
            filterable
            clearable
            placeholder="请选择流程模板"
          >
            <el-option
              v-for="(item, index) in processData"
              :key="index"
              :label="item.name"
              :value="item.process_id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <div style="margin-bottom: 5px;">
        <span class="red">*</span>任务通知时间
      </div>
      <el-form-item label prop="time_type">
        <el-select
          filterable
          v-model="ruleForm.time_type"
          placeholder="请选择"
          @change="timeChange"
        >
          <el-option
            v-for="(item, index) in dateType"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="5" v-if="ruleForm.time_type == 1">
          <el-form-item label prop="short_desc">
            <el-select
              filterable
              v-model="ruleForm.short_desc"
              placeholder="请选择"
              @change="timeChange"
            >
              <el-option label="每日" value="每日"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="ruleForm.time_type == 2">
          <el-form-item label prop="short_desc">
            <el-select
              filterable
              v-model="ruleForm.short_desc"
              placeholder="请选择"
              @change="timeChange"
            >
              <el-option label="每周" value="每周"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="ruleForm.time_type == 2">
          <el-form-item label prop="week_day">
            <el-select
              filterable
              v-model="ruleForm.week_day"
              placeholder="请选择"
              @change="timeChange"
            >
              <el-option
                v-for="(item, index) in weekData"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="ruleForm.time_type == 3">
          <el-form-item label prop="short_desc">
            <el-select
              filterable
              v-model="ruleForm.short_desc"
              placeholder="请选择"
              @change="timeChange"
            >
              <el-option label="每月" value="每月"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="ruleForm.time_type == 3">
          <el-form-item label prop="month_day">
            <el-select
              filterable
              v-model="ruleForm.month_day"
              placeholder="请选择"
              @change="timeChange"
            >
              <el-option
                v-for="(item, index) in 31"
                :key="index"
                :label="item < 10 ? '0' + item : item + ''"
                :value="item < 10 ? '0' + item : item + ''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label prop="hour_min">
            <el-time-picker
              class="form-time-picker"
              v-model="ruleForm.hour_min"
              placeholder="任意时间点"
              :clearable="false"
              format="HH:mm"
              value-format="HH:mm"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" size="small" @click="addTime"
              >添加通知时间</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="任务通知时间" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.short_desc }}</span>
              <span v-if="scope.row.time_set == 3">
                {{ scope.row.month_day }}日
              </span>
              <span v-if="scope.row.time_set == 2">
                {{ getMappingVal(weekData, 'id', scope.row.week_day, 'name') }}
              </span>
              <span>{{ scope.row.hour }}:{{ scope.row.min }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="long_desc" label="说明"> </el-table-column>
          <el-table-column prop="address" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="delInform(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    productList: Array,
    groupData: Array,
    scenarioGroupData: Array,
    detailData: Object
  },
  name: '',
  data() {
    return {
      processData: [], //流程数据
      tableData: [],
      month_day: 0,
      dateType: [
        { id: '1', name: '按日' },
        { id: '2', name: '按周' },
        { id: '3', name: '按月' }
      ],
      weekData: [
        { id: '1', name: '周一' },
        { id: '2', name: '周二' },
        { id: '3', name: '周三' },
        { id: '4', name: '周四' },
        { id: '5', name: '周五' },
        { id: '6', name: '周六' },
        { id: '0', name: '周日' }
      ],
      ruleForm: {
        title: '',
        s_group_id: '',
        group_id: '',
        process_id: '',
        product_code: '',
        time_type: '1',
        short_desc: '每日',
        month_day: '01', //月份天
        week_day: '1', //0-6 周日到周六
        hour_min: '00:00',
        hour: '',
        min: ''
        // time_set: [
        //   {
        //     time_set: '',
        //     month_day: '', //月份天
        //     week_day: '', //0-6 周日到周六
        //     hour: '',
        //     min: '',
        //     long_desc: '',
        //     short_desc: ''
        //   }
        // ] //id
      },
      rules: {
        title: [{ required: true, message: '请输入场景标题', trigger: 'blur' }],
        s_group_id: [{ required: true, message: '请选择', trigger: 'change' }],
        process_id: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {},
  created() {},
  watch: {
    detailData(val) {
      // console.log(val, 'val')
      Object.assign(this.ruleForm, val)
      // console.log(this.ruleForm, 'ruleForm')
      this.tableData = val.time_set
      const arr = this.groupData.find(el => el.group_id == val.group_id)
      // console.log(arr, 'arr')
      // console.log(val, 'val')
      this.processData = arr ? arr.process : []
    },
    productList(newVal) {
      if (newVal.length) {
        this.ruleForm.product_code = newVal[0].product_code
        this.$emit('updateSyatemCode', this.ruleForm.product_code)
      }
    },
    groupData() {
      this.ruleForm.group_id = ''
      this.ruleForm.process_id = ''
    }
  },
  methods: {
    handleSystem() {
      this.$emit('updateSyatemCode', this.ruleForm.product_code)
      this.processData = []
    },
    // 流程
    groupChange() {
      this.ruleForm.process_id = ''
      this.processData = []
    },
    getProcess(item) {
      this.processData = item.process || []
    },
    timeChange(val) {
      switch (val) {
        case '1':
          this.ruleForm.short_desc = '每日'
          break
        case '2':
          this.ruleForm.short_desc = '每周'
          break
        case '3':
          this.ruleForm.short_desc = '每月'
          break

        default:
          break
      }
    },
    // 添加通知时间
    addTime() {
      const timeArr = this.ruleForm.hour_min.split(':')
      let long_desc = ''
      if (this.ruleForm.time_type == 1) {
        long_desc = '每个工作日的' + this.ruleForm.hour_min + '点开始通知'
      } else if (this.ruleForm.time_type == 2) {
        long_desc =
          '每个工作周的' +
          this.getMappingVal(
            this.weekData,
            'id',
            this.ruleForm.week_day,
            'name'
          ) +
          this.ruleForm.hour_min +
          '点开始通知'
      } else if (this.ruleForm.time_type == 3) {
        long_desc =
          '每个工作月的' +
          this.ruleForm.month_day +
          '日' +
          this.ruleForm.hour_min +
          '点开始通知'
      }
      let time_set = {
        time_set: this.ruleForm.time_type,
        month_day: this.ruleForm.time_type == 3 ? this.ruleForm.month_day : '', //月份天
        week_day: this.ruleForm.time_type == 2 ? this.ruleForm.week_day : '', //0-6 周日到周六
        hour: timeArr[0],
        min: timeArr[1],
        long_desc: long_desc,
        short_desc: this.ruleForm.short_desc
      }
      this.tableData.unshift(time_set)
    },
    delInform(index) {
      this.tableData.splice(index, 1)
    },
    // 数据格式处理
    getParams() {
      let flag = false
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          flag = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
      if (flag) {
        let params = {
          setting_id: '',
          title: '',
          s_group_id: '',
          group_id: '',
          process_id: '',
          product_code: ''
        }
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            params[key] = this.ruleForm[key]
          }
        }
        if (!this.detailData.setting_id) {
          delete params.setting_id
        }
        params.time_set = this.tableData
        // this.clearParams()
        return params
      }
    },
    // 清除数据
    clearParams() {
      this.$refs.ruleForm.resetFields()
      this.tableData = []
    }
  }
}
</script>

<style scoped lang="scss">
.task-setting {
  height: 100%;
  width: 50%;
  // min-width: 500px;
  // max-width: 700px;
  min-width: 700px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  .demo-ruleForm {
    margin: 0 auto;
    width: 500px;
    .form-item-flex {
      display: flex;
      .el-select + .el-select {
        margin-left: 20px;
      }
    }
    .el-select {
      width: 100%;
    }
    .form-time-picker {
      width: 150px;
    }
  }
}
</style>
