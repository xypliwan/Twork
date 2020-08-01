<template>
  <div>
    <el-drawer
      title="条件设置"
      :append-to-body="true"
      :visible.sync="conditionDrawer"
      direction="rtl"
      class="set_copyer"
      size="800px"
      :before-close="resetForm"
    >
      <div class="cc-people-box">
        <div class="no-data" v-if="conditionList.length <= 0">
          未设置条件，请先添加条件
        </div>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="150px"
          size="small"
        >
          <div
            v-for="(item, index) in conditionList"
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
                    <el-row>
                      <el-col :span="12">
                        <el-select
                          v-model="item.moneyType"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(moneyItem, i) in typeList"
                            :key="i"
                            :label="moneyItem.txt"
                            :value="moneyItem.type"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12" v-show="item.moneyType !== '5'">
                        <el-input
                          v-model="item.value"
                          :placeholder="item.placeholder"
                        ></el-input>
                      </el-col>
                      <el-col
                        :span="24"
                        style="margin-top:25px;"
                        v-show="item.moneyType == '5'"
                      >
                        <el-col :span="6">
                          <el-input-number
                            size="mini"
                            v-model="item.moreVal"
                            controls-position="right"
                            :min="1"
                            :max="100000"
                          ></el-input-number> </el-col
                        >&nbsp;
                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="item.moreMoneyType"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(moreitem, i) in moreTypeList"
                              :key="i"
                              :label="moreitem.txt"
                              :value="moreitem.type"
                            ></el-option>
                          </el-select> </el-col
                        >&nbsp;
                        <el-col :span="4" style="text-align:center"
                          >金额（元）</el-col
                        >&nbsp;
                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="item.lessMoneyType"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(lessitem, i) in lessTypeList"
                              :key="i"
                              :label="lessitem.txt"
                              :value="lessitem.type"
                            ></el-option>
                          </el-select> </el-col
                        >&nbsp;
                        <el-col :span="6">
                          <el-input-number
                            size="mini"
                            v-model="item.lessVal"
                            controls-position="right"
                            :min="1"
                            :max="100000"
                          ></el-input-number>
                        </el-col>
                      </el-col>
                    </el-row>
                  </div>

                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div>

                <!-- 数字 -->
                <div
                  class="t-box"
                  v-if="
                    (item.type == 'num' ||
                      (item.type == 'datetimerange' &&
                        item.autoCalculationTime &&
                        item.verify)) &&
                      item.condition
                  "
                >
                  <div class="l-box">
                    <!-- <el-input type="number" v-model.number="item.value" :placeholder="item.placeholder" clearable></el-input> -->

                    <el-row>
                      <el-col :span="12">
                        <el-select v-model="item.numType" placeholder="请选择">
                          <el-option
                            v-for="(numItem, i) in typeList"
                            :key="i"
                            :label="numItem.txt"
                            :value="numItem.type"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12" v-show="item.numType !== '5'">
                        <el-input
                          v-if="item.type == 'datetimerange'"
                          v-model="item.durationValue"
                          :placeholder="item.placeholder"
                        ></el-input>
                        <el-input
                          v-else
                          v-model="item.value"
                          :placeholder="item.placeholder"
                        ></el-input>
                      </el-col>
                      <el-col
                        :span="24"
                        style="margin-top:25px;"
                        v-show="item.numType == '5'"
                      >
                        <el-col :span="6">
                          <el-input-number
                            size="mini"
                            v-model="item.moreVal"
                            controls-position="right"
                            :min="1"
                            :max="100000"
                          ></el-input-number> </el-col
                        >&nbsp;
                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="item.moreNumType"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(moreitem, i) in moreTypeList"
                              :key="i"
                              :label="moreitem.txt"
                              :value="moreitem.type"
                            ></el-option>
                          </el-select> </el-col
                        >&nbsp;
                        <el-col :span="4" style="text-align:center">数字</el-col
                        >&nbsp;
                        <el-col :span="4">
                          <el-select
                            size="mini"
                            v-model="item.lessNumType"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(lessitem, i) in lessTypeList"
                              :key="i"
                              :label="lessitem.txt"
                              :value="lessitem.type"
                            ></el-option>
                          </el-select> </el-col
                        >&nbsp;
                        <el-col :span="6">
                          <el-input-number
                            size="mini"
                            v-model="item.lessVal"
                            controls-position="right"
                            :min="1"
                            :max="100000"
                          ></el-input-number>
                        </el-col>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div>

                <!-- 单选框 -->
                <div
                  class="t-box"
                  v-if="item.type == 'select' && item.condition"
                >
                  {{ item.value }}
                  <div class="l-box">
                    <el-checkbox-group v-model="item.checkVal">
                      <el-checkbox
                        :label="el.label"
                        v-for="(el, i) in item.options"
                        :key="i"
                      ></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div>

                <!-- //多选框 -->
                <div
                  class="t-box"
                  v-if="item.type == 'selects' && item.condition"
                >
                  {{ item.value }}
                  <div class="l-box">
                    <el-row :gutter="12">
                      <el-col :span="8">
                        <el-select
                          size="mini"
                          v-model="item.beforeValue"
                          placeholder="请选择"
                        >
                          <el-option label="完全等于" value="1"></el-option>
                          <el-option label="包含任意" value="2"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="16">
                        <el-select
                          size="mini"
                          v-model="item.afterValue"
                          placeholder="请选择"
                          multiple
                        >
                          <el-option
                            v-for="(selectsItem, i) in item.options"
                            :key="i"
                            :label="selectsItem.label"
                            :value="selectsItem.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div>

                <!-- 时长 -->

                <!-- 日期区间 -->
                <!-- <div
                  class="t-box"
                  v-if="item.type == 'datetimerange' && item.condition"
                >
                  <div class="l-box">
                    <el-date-picker
                      v-model="item.value"
                      type="datetimerange"
                      range-separator="~"
                      :start-placeholder="item.placeholder1"
                      :end-placeholder="item.placeholder2"
                      :format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                      :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
                      :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                  </div>
                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div> -->

                <!-- 部门 -->
                <div
                  class="t-box"
                  v-if="item.type == 'department' && item.condition"
                >
                  <div class="l-box">
                    <el-cascader
                      filterable
                      :options="departmentInfo"
                      ref="departmentRef"
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
                  <div class="check-box">
                    <el-link type="danger" @click="handleDel(index)"
                      >移除</el-link
                    >
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <div class="opren-box">
          <el-button size="small" type="primary" @click="handleSaveCondition"
            >保存</el-button
          >
          <el-button size="small" type="primary" @click="resetForm"
            >关闭</el-button
          >
          <el-button
            style="float:right;"
            size="small"
            type="primary"
            @click="conditionVisible = true"
            >添加条件</el-button
          >
        </div>

        <add-condition
          @selectCondition="selectCondition"
          :conditionVisible.sync="conditionVisible"
          :departmentInfo="departmentInfo"
          :conditionList="conditionList"
        ></add-condition>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import AddCondition from './addCondition'
import { getDepartmentInfo } from '@/api/common'
export default {
  props: {
    // userList: Array,
    conditionConfig: Object,
    conditionDrawer: Boolean
  },

  data() {
    return {
      ruleForm: {},
      rules: {},
      conditionVisible: false,
      departmentInfo: [], //部门信息
      conditionList: [], //条件列表
      typeList: [
        //金额 和 数字
        { txt: '小于', type: '0' },
        { txt: '小于等于', type: '1' },
        { txt: '大于', type: '2' },
        { txt: '大于等于', type: '3' },
        { txt: '等于', type: '4' },
        { txt: '介于两个数之间', type: '5' }
      ],
      moreTypeList: [
        //金额 和 数字
        //大于等于
        { txt: '<', type: '0' },
        { txt: '<=', type: '1' }
      ],
      lessTypeList: [
        //金额 和 数字
        //小于等于
        { txt: '<', type: '0' },
        { txt: '<=', type: '1' }
      ]
    }
  },
  watch: {
    conditionDrawer(newVal) {
      if (newVal) {
        this.conditionList = JSON.parse(
          JSON.stringify(this.conditionConfig.condition_form_config)
        )
      }
    }
  },
  created() {
    this.getDepartmentInfo()
  },
  methods: {
    handleSaveCondition() {
      let snapArr = []
      for (let i = 0; i < this.conditionList.length; i++) {
        let item = this.conditionList[i]
        if (item.type == 'num') {
          if (Number(item.numType) < 5) {
            if (item.value == '' || item.value == null) {
              snapArr.push(false)
            }
          } else {
            if (
              item.moreVal == '' ||
              item.moreVal == null ||
              item.lessVal == '' ||
              item.lessVal == null
            ) {
              snapArr.push(false)
            }
          }
        } else if (
          //日期区间，判断时长的值durationValue
          item.type == 'datetimerange' &&
          item.verify &&
          item.autoCalculationTime
        ) {
          if (Number(item.numType) < 5) {
            if (item.durationValue == '' || item.durationValue == null) {
              snapArr.push(false)
            }
          } else {
            if (
              item.moreVal == '' ||
              item.moreVal == null ||
              item.lessVal == '' ||
              item.lessVal == null
            ) {
              snapArr.push(false)
            }
          }
        } else if (item.type == 'select') {
          if (item.checkVal.length <= 0) {
            snapArr.push(false)
          }
        } else if (item.type == 'datetimerange') {
          if (!item.value) {
            snapArr.push(false)
          }
        } else if (item.type == 'department') {
          if (item.value.length <= 0) {
            snapArr.push(false)
          }
        } else if (item.type == 'money') {
          if (item.moneyType !== '5') {
            if (!item.value) {
              snapArr.push(false)
            }
          } else {
            if (!item.moreVal || !item.lessVal) {
              snapArr.push(false)
            }
          }
        } else if (item.type == 'selects') {
          if (item.beforeValue == '' || !item.afterValue.length) {
            snapArr.push(false)
          }
        }
      }

      if (snapArr.includes(false)) {
        this._message('请把添加的条件填写完整', 'warning')
        return
      }

      let snapData = JSON.parse(JSON.stringify(this.conditionList))
      let dec = this.setConditionTxt(snapData)
      this.$emit('saveCondition', {
        list: snapData,
        dec
      })
      this.resetForm()
    },
    setConditionTxt(list) {
      /* eslint-disable */
      let strArr = []
      list.forEach(el => {
        // 单选框
        if (el.type == 'select') {
          strArr.push(`${el.name}: ${el.checkVal.join('、')} <br/> `)
        } else if (el.type == 'selects') {
          let snapVal = ''
          if (el.beforeValue == '1') {
            snapVal = '完全相等'
          } else if (el.beforeValue == '2') {
            snapVal = '包含任意'
          }
          strArr.push(
            `${el.name}: ${snapVal} ${el.afterValue.join('、')} <br/> `
          )
        } else if (el.type == 'department') {
          let labelName = this.$refs['departmentRef'][0].getCheckedNodes()[0]
            .label
          strArr.push(`${el.name}: ${labelName} <br/> `)
        } else if (
          el.type == 'num' ||
          (el.type == 'datetimerange' && el.verify && el.autoCalculationTime)
        ) {
          let numStr = ''
          let listItem = this.typeList.find(
            listItem => listItem.type == el.numType
          )
          if (Number(el.numType) < 5) {
            // numStr = el.value
            if (el.type == 'num') {
              numStr = el.value
            } else if (el.type == 'datetimerange') {
              numStr = el.durationValue
            }
          } else {
            // 小于等于
            let lessItem = this.lessTypeList.find(
              lessItem => lessItem.type == el.lessNumType
            )
            //大于等于
            let moreItem = this.lessTypeList.find(
              moreItem => moreItem.type == el.moreNumType
            )
            numStr = `${el.moreVal} ${moreItem.txt} 【数字】 ${lessItem.txt} ${el.lessVal}`
          }

          if (el.type == 'num') {
            strArr.push(`${el.name}: ${listItem.txt} ${numStr} <br/> `)
          } else if (el.type == 'datetimerange') {
            strArr.push(
              `${el.name} (时长/${el.format == 'yyyy-MM-dd' ? '天' : '时'}): ${
                listItem.txt
              } ${numStr} <br/> `
            )
          }
        }
      })

      return strArr.join(' ')
      /* eslint-disable */
    },

    handleDel(i) {
      this.conditionList.splice(i, 1)
    },
    selectCondition(list) {
      this.conditionList = [...this.conditionList, ...list]
    },
    resetForm() {
      this.$emit('update:conditionDrawer', false)
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
      } catch (error) {
        this._message(error)
      }
    },
    formateDepartment(arr) {
      arr.forEach(el => {
        if (el.children) {
          this.formateDepartment(el.children)
        } else {
          delete el.people
        }
      })
      return arr
    }
  },
  components: {
    AddCondition
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  font-size: 16px;
}
::v-deep .el-drawer__body {
  overflow: scroll;
}
.cc-people-box {
  padding: 0 15px;
  ::v-deep .el-select {
    display: block;
  }
}
.t-box {
  display: flex;
  .l-box {
    flex: 1;
  }
  .check-box {
    width: 70px;
    text-align: center;
    padding-top: 5px;
    cursor: pointer;
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
.opren-box {
  margin-top: 50px;
}
.no-data {
  text-align: center;
  font-size: 13px;
  color: #666;
}
</style>
