<template>
  <div>
    <el-dialog
      title="请勾选条件"
      :append-to-body="true"
      :visible.sync="conditionVisible"
      width="700px"
      :before-close="handleClose"
    >
      <div class="customize-box">
        <div class="no-condition" v-if="selectForm.length <= 0">
          暂无条件，请先到表单设计中添加条件 ( 并将控件设置成必填 )
        </div>

        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="120px"
          size="small"
        >
          <div
            v-for="(item, index) in selectForm"
            :key="index"
            class="center-item"
          >
            <div class="form-item">
              <el-form-item
                v-if="item.condition"
                :label="
                  item.type == 'datetimerange'
                    ? `${item.name} (时长/${
                        item.format == 'yyyy-MM-dd' ? '天' : '时'
                      })`
                    : item.name
                "
                :required="item.verify"
              >
                <!-- 金钱 -->
                <div
                  class="t-box"
                  v-if="item.type == 'money' && item.condition"
                >
                  <div class="l-box">
                    <el-input
                      v-model="item.value"
                      :placeholder="item.placeholder"
                      clearable
                      disabled
                    ></el-input>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div>
                </div>

                <!-- 数字 -->
                <div class="t-box" v-if="item.type == 'num' && item.condition">
                  <div class="l-box">
                    <el-input
                      v-model.number="item.value"
                      :placeholder="item.placeholder"
                      clearable
                      disabled
                    ></el-input>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div>
                </div>

                <!-- 单选框 -->
                <div
                  class="t-box"
                  v-if="
                    (item.type == 'select' || item.type == 'selects') &&
                      item.condition
                  "
                >
                  <div class="l-box">
                    <el-select
                      v-model="item.value"
                      :placeholder="item.placeholder"
                      clearable
                      disabled
                    >
                      <el-option
                        v-for="(el, i) in item.options"
                        :key="i"
                        :label="el.label"
                        :value="el.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div>
                </div>

                <!-- 日期区间 -->
                <div
                  class="t-box"
                  v-if="
                    item.type == 'datetimerange' &&
                      item.verify &&
                      item.autoCalculationTime
                  "
                >
                  <div class="l-box">
                    <el-input
                      v-model.number="item.value"
                      :placeholder="item.placeholder"
                      clearable
                      disabled
                    ></el-input>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div>
                  <!-- <div class="l-box">
                    <el-date-picker
                      v-model="item.value"
                      type="datetimerange"
                      range-separator="~"
                      disabled
                      :start-placeholder="item.placeholder1"
                      :end-placeholder="item.placeholder2"
                    ></el-date-picker>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div> -->
                </div>

                <!-- 部门 -->
                <div
                  class="t-box"
                  v-if="item.type == 'department' && item.condition"
                >
                  <div class="l-box">
                    <el-cascader
                      disabled
                      :options="departmentInfo"
                      v-model="item.value"
                      :props="{
                        multiple: false,
                        checkStrictly: true,
                        value: 'department_id',
                        label: 'department_name'
                      }"
                      clearable
                    ></el-cascader>
                  </div>
                  <div class="check-box" @click="handleItem(item, index)">
                    <el-checkbox
                      v-model="item.isCheck"
                      :disabled="item.isDisable"
                    ></el-checkbox>
                    <div class="pos-box"></div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="footer-btn">
        <el-button size="small" @click="handleClose">关闭</el-button>
        <el-button size="small" type="primary" @click="confirmCondition"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    conditionVisible: Boolean,
    departmentInfo: Array,
    conditionList: Array
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: ''
      },
      rules: {}
    }
  },
  computed: {
    ...mapGetters(['selectForm'])
  },
  watch: {
    conditionVisible(newVal) {
      if (newVal) {
        this.conditionList.forEach(el => {
          this.selectForm.forEach(ev => {
            if (el.name == ev.name) {
              ev.isCheck = true
              ev.isDisable = true
            }
          })
        })
      }
    }
  },
  methods: {
    ...mapActions(['getSelectForm']),
    handleItem(item) {
      item.isCheck = !item.isCheck
    },
    confirmCondition() {
      let snap = this.selectForm.filter(
        item => item.isCheck && item.condition && !item.isDisable
      )
      if (!snap.length) {
        this._message('请先勾选条件', 'warning')
        return
      }
      this.$emit('selectCondition', JSON.parse(JSON.stringify(snap)))
      this.handleClose()
    },
    handleClose() {
      this.selectForm.forEach(el => {
        el.isCheck = false
        el.isDisable = false
      })
      this.$emit('update:conditionVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.t-box {
  display: flex;
  .l-box {
    flex: 1;
  }
  .check-box {
    width: 70px;
    text-align: center;
    padding-top: 5px;
    position: relative;
    cursor: pointer;
    .pos-box {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
  }
}

::v-deep .el-cascader {
  width: 100%;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-range-editor {
  width: 100%;
}
.footer-btn {
  text-align: center;
  margin-top: 40px;
}
.no-condition {
  text-align: center;
  margin: 50px 0;
  font-size: 13px;
  color: #666;
}
</style>
