<template>
  <div class="base-setting">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      size="small"
      class="demo-ruleForm"
    >
      <div style="margin-bottom: 5px;">汇报方式</div>
      <el-form-item label prop="method">
        <el-select
          v-model="ruleForm.method"
          placeholder="请选择"
          @change="handleMethods"
        >
          <el-option
            v-for="(item, index) in reportMethods"
            :key="index"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label prop="week_set">
        <el-checkbox v-model="ruleForm.week_set" true-label="0" false-label="1"
          >周末不汇报</el-checkbox
        >
      </el-form-item>
      <el-form-item label prop="holiday_set">
        <el-checkbox
          v-model="ruleForm.holiday_set"
          true-label="0"
          false-label="1"
          >法定节假日不汇报</el-checkbox
        >
      </el-form-item>

      <div style="margin-bottom: 5px;">
        汇报截止时间
        <span style="color:#bbb;font-size:12px">( 请先选择汇报方式 )</span>
      </div>
      <el-form-item label>
        <el-form-item
          prop="deadline_set"
          ref="deadlineSetRef"
          style="display:inline-block"
        >
          <el-select
            :disabled="ruleForm.method == ''"
            style="width:150px;"
            v-model="ruleForm.deadline_set"
            placeholder="请选择"
          >
            <el-option
              label="当日"
              value="1"
              v-show="ruleForm.method == '1'"
            ></el-option>
            <el-option
              label="次日"
              value="2"
              v-show="ruleForm.method == '1'"
            ></el-option>
            <el-option
              label="本周"
              value="3"
              v-show="ruleForm.method == '2'"
            ></el-option>
            <el-option
              label="下周"
              value="4"
              v-show="ruleForm.method == '2'"
            ></el-option>
            <el-option
              label="本月"
              value="5"
              v-show="ruleForm.method == '3'"
            ></el-option>
            <el-option
              label="下月"
              value="6"
              v-show="ruleForm.method == '3'"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 本周 -->
        <el-form-item
          prop="deadline_time_week_day"
          ref="deadlineTimeWeekRef"
          style="display:inline-block"
          :rules="[{ required: ruleForm.method == '2', message: '请选择' }]"
        >
          <el-select
            v-if="ruleForm.method == '2'"
            style="width:150px;margin:0 10px;"
            v-model="ruleForm.deadline_time_week_day"
            placeholder="周"
          >
            <el-option
              v-for="(item, index) in weekList"
              :key="index"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 本月 -->
        <el-form-item
          prop="deadline_time_month_day"
          ref="deadlineTimeMonthRef"
          style="display:inline-block"
          :rules="[{ required: ruleForm.method == '3', message: '请选择' }]"
        >
          <el-select
            v-if="ruleForm.method == '3'"
            style="width:150px;margin:0 10px;"
            v-model="ruleForm.deadline_time_month_day"
            placeholder="天"
          >
            <el-option
              v-for="(item, index) in mounthList"
              :key="index"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 小时 -->
        <el-form-item
          v-if="ruleForm.method !== ''"
          prop="deadline_time_hour_and_min"
          style="display:inline-block"
          :rules="[
            {
              required: ruleForm.method !== '',
              message: '请选择',
              trigger: 'change'
            }
          ]"
        >
          <el-time-picker
            :style="ruleForm.method == '1' ? 'margin-left:10px' : ''"
            style="width:150px"
            v-model="ruleForm.deadline_time_hour_and_min"
            placeholder="时间"
            value-format="HH:mm"
            format="HH:mm"
            @change="changeHourMin"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="deadline_report">
          <el-checkbox
            v-model="ruleForm.deadline_report"
            true-label="1"
            false-label="0"
            >汇报截止时汇总通知汇报对象</el-checkbox
          >
        </el-form-item>
      </el-form-item>
      <div style="margin-bottom: 5px;">
        汇报提醒时间
        <span style="color:#bbb;font-size:12px">( 请先选择汇报方式 )</span>
      </div>
      <el-form-item label>
        <el-form-item
          prop="remind_set"
          ref="deadlineTimeMonthRef"
          style="display:inline-block"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <el-select
            style="width:150px;"
            v-model="ruleForm.remind_set"
            placeholder="是否提醒"
          >
            <el-option label="提醒" value="1"></el-option>
            <el-option label="不提醒" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- v-if="ruleForm.remind_set == '1'" -->
        <!-- 本周 -->
        <el-form-item
          v-if="ruleForm.remind_set == '1'"
          prop="remind_time_week_day"
          ref="remindTimeWeekRef"
          style="display:inline-block"
          :rules="[{ required: ruleForm.method == '2', message: '请选择' }]"
        >
          <el-select
            v-if="ruleForm.method == '2'"
            style="width:150px;margin:0 10px;"
            v-model="ruleForm.remind_time_week_day"
            placeholder="周"
          >
            <el-option
              v-for="(item, index) in weekList"
              :key="index"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 本月 -->
        <el-form-item
          v-if="ruleForm.remind_set == '1'"
          prop="remind_time_month_day"
          ref="remindTimeMonthRef"
          style="display:inline-block"
          :rules="[{ required: ruleForm.method == '3', message: '请选择' }]"
        >
          <el-select
            v-if="ruleForm.method == '3'"
            style="width:150px;margin:0 10px;"
            v-model="ruleForm.remind_time_month_day"
            placeholder="天"
          >
            <el-option
              v-for="(item, index) in mounthList"
              :key="index"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 小时 -->
        <el-form-item
          v-if="ruleForm.remind_set == '1'"
          prop="remind_time_hour_and_min"
          style="display:inline-block"
          :rules="[
            {
              required: ruleForm.method !== '',
              message: '请选择',
              trigger: 'change'
            }
          ]"
        >
          <el-time-picker
            :style="ruleForm.method == '1' ? 'margin-left:10px' : ''"
            style="width:150px"
            v-model="ruleForm.remind_time_hour_and_min"
            placeholder="时间"
            value-format="HH:mm"
            format="HH:mm"
            @change="changeRemindHourMin"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="remind_report">
          <el-checkbox
            v-model="ruleForm.remind_report"
            true-label="1"
            false-label="0"
            >收到汇报后提醒接收人</el-checkbox
          >
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reportMethods, weekList, mounthList } from './baseData'
export default {
  props: {},
  components: {},
  data() {
    return {
      optionsUser: {
        multiple: true,
        checkStrictly: true,
        value: 'department_id',
        label: 'department_name'
      },
      ruleForm: {
        method: '', //1日 2周 3月
        week_set: '0', //0 周末不汇报 1周末汇报
        holiday_set: '0', //0法定假日不汇报  1法定假日汇报
        deadline_set: '', //汇报截止时间 1当日  2次日  3本周 4下周 5本月 6下月
        deadline_time_hour_and_min: '', //截止>小时:分钟
        deadline_time_hour: '', //截止时间 小时
        deadline_time_min: '', //截止时间分钟
        deadline_time_week_day: '', //0-6 周日到周六
        deadline_time_month_day: '', //1-28 号
        deadline_report: '0', //1汇报截止时汇总通知汇报对象 0不通知
        remind_set: '', //汇报提醒 0不提醒 1提醒
        remind_time_hour_and_min: '', //提醒>小时:分钟
        remind_time_hour: '', //提醒时间小时
        remind_time_min: '', //提醒时间分钟
        remind_time_week_day: '', //0-6 周日到周六
        remind_time_month_day: '', //提醒时间 月份天
        remind_report: '1' // 收到汇报后提醒接收人 0不提醒 1提醒
      },
      rules: {
        method: [{ required: true, message: '请选择', trigger: 'change' }],
        deadline_set: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    reportMethods() {
      return reportMethods
    },
    weekList() {
      return weekList
    },
    mounthList() {
      return mounthList
    }
  },
  methods: {
    initData(obj) {
      Object.assign(this.ruleForm, obj)
      this.ruleForm.deadline_time_hour_and_min = `${this.ruleForm.deadline_time_hour}:${this.ruleForm.deadline_time_min}`
      this.ruleForm.remind_time_hour_and_min = `${this.ruleForm.remind_time_hour}:${this.ruleForm.remind_time_min}`
    },
    vilidata() {
      return new Promise(resolve => {
        this.$refs.ruleForm.validate(flg => {
          if (!flg) {
            this.$refs.ruleForm.clearValidate()
            resolve({ hasError: true, data: this.ruleForm })
            return
          }
          resolve({ hasError: false, data: this.ruleForm })
        })
      })
    },
    reset() {
      this.$refs.ruleForm.resetFields()
      setTimeout(() => {
        this.$refs.ruleForm.resetFields()
      }, 80)
    },
    handleMethods() {
      this.$refs.deadlineSetRef.resetField()
      this.$refs.deadlineTimeWeekRef.resetField()
      this.$refs.deadlineTimeMonthRef.resetField()
      this.$refs.remindTimeWeekRef.resetField()
      this.$refs.remindTimeMonthRef.resetField()
    },
    changeRemindHourMin() {
      if (!this.ruleForm.remind_time_hour_and_min) {
        this.ruleForm.remind_time_hour = ''
        this.ruleForm.remind_time_min = ''
      } else {
        this.ruleForm.remind_time_hour = this.ruleForm.remind_time_hour_and_min.split(
          ':'
        )[0]
        this.ruleForm.remind_time_min = this.ruleForm.remind_time_hour_and_min.split(
          ':'
        )[1]
      }
    },
    changeHourMin() {
      if (!this.ruleForm.deadline_time_hour_and_min) {
        this.ruleForm.deadline_time_hour = ''
        this.ruleForm.deadline_time_min = ''
      } else {
        this.ruleForm.deadline_time_hour = this.ruleForm.deadline_time_hour_and_min.split(
          ':'
        )[0]
        this.ruleForm.deadline_time_min = this.ruleForm.deadline_time_hour_and_min.split(
          ':'
        )[1]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.base-setting {
  height: 100%;
  width: 50%;
  width: 700px;
  padding: 20px 100px;
  margin: 0 auto;
  background-color: #fff;
  .demo-ruleForm {
    margin: 0 auto;
    width: 500px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
}
</style>
