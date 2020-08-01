<template>
  <div class="form">
    <div class="box">
      <div class="box-left">
        <draggable
          :clone="cloneData"
          :list="initList"
          :options="{
            draggable: '.can-drag',
            sort: false,
            group: { name: falgs, pull: 'clone' },
            filter: '.undraggable',
            disabled: leftFormDisabled
          }"
          @end="end"
          class="dragArea11 pointer"
          @move="leftFormDisabled = true"
          @start="leftFormDisabled = true"
        >
          <div
            v-for="item in initList"
            :key="item.id"
            :class="{
              undraggable: item.flag,
              'can-drag': item.canDragClass,
              'disable-active': !item.canDragClass
            }"
            class="list-complete-item"
          >
            <div class="dialog-black" v-if="!item.canDragClass"></div>
            <div class="list-complete-item-handle2">
              <span class="txt">
                <el-tooltip
                  effect="dark"
                  content="设置必填后，该控件可作为条件"
                  placement="top"
                >
                  <i class="el-icon-info" v-if="item.condition"></i>
                </el-tooltip>
                {{ item.name }}
              </span>
              <i class="iconfont txt-icon" :class="item.icon"></i>
            </div>
          </div>
        </draggable>
      </div>
      <div class="box-center">
        <div class="tip-txt" v-if="!selectList.length">
          请将左侧表单控件拖拽至此处
        </div>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          label-width="100px"
          class="drag-ruleForm"
          size="small"
        >
          <draggable
            :clone="cloneData"
            :list="selectList"
            :options="{ group: 'article', disabled: disabled }"
            @start="startTw"
            @end="endTw"
            class="dragArea"
          >
            <div
              v-for="(item, index) in selectList"
              :key="index"
              class="center-item"
              :class="currentIndex == index ? 'item-active' : ''"
            >
              <div class="form-item pointer" @click="editItem(item)">
                <el-form-item
                  :label="
                    item.type == 'num' && item.unit
                      ? item.name + '(' + item.unit + ')'
                      : item.type == 'des'
                      ? ''
                      : item.name
                  "
                  :required="item.verify"
                >
                  <el-input
                    v-if="item.type == 'input' || item.type == 'money'"
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-if="item.type == 'textarea'"
                    type="textarea"
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    clearable
                  ></el-input>
                  <el-input
                    v-if="item.type == 'num'"
                    v-model.number="item.value"
                    :placeholder="item.placeholder"
                    clearable
                  ></el-input>
                  <el-select
                    v-if="item.type == 'select'"
                    v-model="item.value"
                    :placeholder="item.placeholder"
                    clearable
                  >
                    <el-option
                      v-for="(el, i) in item.options"
                      :key="i"
                      :label="el.label"
                      :value="el.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-if="item.type == 'selects'"
                    v-model="item.value"
                    disabled
                    multiple
                    :placeholder="item.placeholder"
                    clearable
                  >
                    <el-option
                      v-for="(el, i) in item.options"
                      :key="i"
                      :label="el.label"
                      :value="el.value"
                    ></el-option>
                  </el-select>
                  <el-date-picker
                    v-if="item.type == 'datetime'"
                    v-model="item.value"
                    type="datetime"
                    :format="item.format"
                    :value-format="item.format"
                    :placeholder="item.placeholder"
                  ></el-date-picker>
                  <el-date-picker
                    v-if="item.type == 'datetimerange'"
                    v-model="item.value"
                    type="datetimerange"
                    range-separator="~"
                    :start-placeholder="item.placeholder1"
                    :end-placeholder="item.placeholder2"
                    :format="item.format"
                    :value-format="item.format"
                  ></el-date-picker>
                  <div v-if="item.type == 'img'" class="imgs">
                    <span class="el-icon-picture"></span>
                    <span
                      style="margin-left:10px"
                      class="el-icon-circle-plus-outline blue"
                    ></span>
                    <span
                      style="margin-left:10px"
                      class="el-icon-remove-outline red"
                    ></span>
                  </div>
                  <div v-if="item.type == 'accessory'" class="imgs">
                    <span class="el-icon-document"></span>
                  </div>
                  <div v-if="item.type == 'relevance'" class="imgs">
                    <span class="el-icon-connection"></span>
                    <span
                      style="margin-left:10px"
                      class="el-icon-circle-plus-outline blue"
                    ></span>
                    <span
                      style="margin-left:10px"
                      class="el-icon-remove-outline red"
                    ></span>
                  </div>
                  <div v-if="item.type == 'department'">
                    <el-cascader
                      :options="departmentInfo"
                      v-model="item.value"
                      :props="{
                        multiple: item.radio_multiple == 'multiple',
                        checkStrictly: true,
                        value: 'department_id',
                        label: 'department_name'
                      }"
                      clearable
                    ></el-cascader>
                  </div>
                  <div v-if="item.type == 'richText'" class="edit-box">
                    <el-input
                      type="textarea"
                      v-model="item.value"
                      :placeholder="item.placeholder"
                      clearable
                    ></el-input>
                  </div>
                  <div v-if="item.type == 'flowOrder'" class="flow-order">
                    <!-- <div>{{ item.value.join('、') }}</div> -->
                    <div v-for="(item, index) in item.value" :key="index">
                      {{ item }}
                    </div>
                  </div>
                  <div v-if="item.type == 'contactPerson'" class="flow-order">
                    <el-select
                      v-model="item.value"
                      disabled
                      :placeholder="item.placeholder"
                      clearable
                    >
                      <el-option key="1" label="张三" value="1"></el-option>
                      <el-option key="2" label="李四" value="2"></el-option>
                      <el-option key="3" label="王五" value="3"></el-option>
                      <el-option key="4" label="刘能" value="4"></el-option>
                    </el-select>
                  </div>
                  <p v-if="item.type == 'des'">{{ item.des }}</p>
                </el-form-item>
              </div>
              <div class="del">
                <el-link
                  v-if="item.canDragClass"
                  type="danger"
                  :disabled="!item.canDel"
                  @click="handleDel(index, item.id)"
                  >移除</el-link
                >
              </div>
              <div class="no-del-txt">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    !item.canDel ? '该控件已设置成条件，不能移除' : '固定控件'
                  "
                  placement="top"
                >
                  <i
                    class="el-icon-info"
                    v-show="!item.canDel || !item.canDragClass"
                  ></i>
                </el-tooltip>
              </div>
            </div>
          </draggable>
        </el-form>
      </div>
      <div class="box-right">
        <div class="tip-txt" v-if="!selectList.length">控件描述</div>
        <drag-input
          v-show="selectList.length > 0"
          ref="draginput"
          :targetData="targetData"
          @getValue="getValue"
        ></drag-input>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import DragInput from './DragInput'
import { getDepartmentInfo } from '@/api/common'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Form',
  components: { draggable, DragInput },
  data() {
    return {
      radio: '',
      input: '',
      falgs: 'article',
      disabled: false,
      leftFormDisabled: false,
      selectList: [],
      initList: [
        {
          id: 3,
          name: '数字输入框',
          icon: 'icon-shuzi1',
          key: '',
          value: '',
          type: 'num',
          canDragClass: true, //指定可以拖动的类名
          placeholder: '请输入',
          unit: '',
          verify: false,
          print: false,
          isCheck: false,
          condition: true, //是否是条件
          isDisable: false, //用于不能重复选择条件，（是否禁用，只有成为条件时才有）
          canDel: true, //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
          numType: '0', //数字类型
          lessNumType: '0', //小于等于类型  0小于  1小于等于
          moreNumType: '0', //大于等于类型  0大于  1大于等于
          lessVal: 1, //小于数字
          moreVal: 1 //大于数字
        },
        // {
        //   id: 4,
        //   name: "金额",
        //   icon: "icon-jine4",
        //   key: "",
        //   value: "",
        //   type: "money",
        //   canDragClass: true,
        //   placeholder: "输入金额",
        //   verify: false,
        //   print: false,
        //   isCheck: false,
        //   condition: true, //是否是条件
        //   isDisable: false, //用于不能重复选择条件，（是否禁用，只有成为条件时才有）
        //   moneyType: "0", //金额类型
        //   lessMoneyType: "0", //小于等于类型  0小于  1小于等于
        //   moreMoneyType: "0", //大于等于类型  0大于  1大于等于
        //   lessVal: 1, //小于金额
        //   moreVal: 1, //大于金额
        //   canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        // },
        {
          id: 5,
          name: '单选框',
          icon: 'icon-radio',
          key: '',
          value: '',
          type: 'select',
          canDragClass: true,
          placeholder: '请选择',
          options: [],
          verify: false,
          print: false,
          isCheck: false,
          condition: true, //是否是条件
          isDisable: false, //用于不能重复选择条件，（是否禁用，只有成为条件时才有）
          checkVal: [], //放到条件设置需要绑定的值 （多选框组）
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 11,
          name: '部门',
          icon: 'icon-bumen2',
          key: '',
          value: [],
          type: 'department',
          canDragClass: true,
          placeholder: '部门',
          radio_multiple: 'radio',
          verify: false,
          print: false,
          isCheck: false,
          condition: true, //是否是条件
          isDisable: false, //用于不能重复选择条件，（是否禁用，只有成为条件时才有）
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 1,
          name: '单行输入框',
          icon: 'icon-danhangshurukuang1',
          key: '',
          value: '',
          type: 'input',
          canDragClass: true,
          placeholder: '请输入',
          verify: false, //是否必填
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 2,
          name: '多行输入框',
          icon: 'icon-duohangshurukuang',
          key: '',
          value: '',
          type: 'textarea',
          canDragClass: true,
          placeholder: '请输入',
          verify: false,
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 6,
          name: '多选框',
          icon: 'icon-duoxuankuang11',
          key: '',
          value: [],
          type: 'selects',
          canDragClass: true,
          placeholder: '请选择',
          options: [],
          verify: false,
          print: false,
          isCheck: false,
          condition: true, //是否是条件
          canDel: true, //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
          beforeValue: '', //条件设置前选择框绑定值
          afterValue: [] //条件设置后选择框绑定值
        },
        {
          id: 7,
          name: '日期',
          icon: 'icon-riqi1',
          key: '',
          value: '',
          type: 'datetime',
          canDragClass: true,
          placeholder: '选择日期',
          format: 'yyyy-MM-dd HH:mm:ss',
          verify: false,
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 8,
          name: '日期区间',
          icon: 'icon-shijianqujian',
          key: '',
          value: '',
          type: 'datetimerange',
          canDragClass: true,
          placeholder1: '开始时间',
          placeholder2: '截止时间',
          format: 'yyyy-MM-dd HH:mm:ss',
          verify: false,
          print: false,
          isCheck: false,
          condition: true, //是否是条件
          isDisable: false, //用于不能重复选择条件，（是否禁用，只有成为条件时才有）
          canDel: true, //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
          autoCalculationTime: false, //是否自动计算时长
          durationValue: '', //时长value
          numType: '0', //数字类型
          lessNumType: '0', //小于等于类型  0小于  1小于等于
          moreNumType: '0', //大于等于类型  0大于  1大于等于
          lessVal: 1, //小于数字
          moreVal: 1 //大于数字
        },
        {
          id: 9,
          name: '图片',
          icon: 'icon-shangchuantupian',
          key: '',
          value: '',
          type: 'img',
          canDragClass: true,
          placeholder: '图片',
          verify: false,
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 10,
          name: '附件',
          icon: 'icon-fujian3',
          key: '',
          value: '',
          type: 'accessory',
          canDragClass: true,
          placeholder: '附件',
          format: '',
          verify: false,
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },

        // {
        //   id: 12,
        //   name: "关联流程单",
        //   icon: "icon-guanlian4",
        //   key: "",
        //   value: "",
        //   type: "relevance",
        //   placeholder: "关联流程单",
        //   appoint: "",
        //   verify: false,
        //   print: false,
        //   condition: false //是否是条件
        // },
        {
          id: 13,
          name: '说明文字',
          icon: 'icon-shuomingwenzi',
          key: '',
          value: '',
          type: 'des',
          canDragClass: true,
          placeholder: '',
          des: '说明文字',
          show: false,
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 14,
          name: '富文本',
          icon: 'icon-fuwenben',
          key: '',
          value: '',
          type: 'richText',
          canDragClass: true,
          placeholder: '请输入',
          verify: false, //是否必填
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 15,
          name: '关联流程单',
          icon: 'icon-liucheng',
          key: '',
          value: [],
          allValue: [],
          type: 'flowOrder',
          canDragClass: true,
          placeholder: '请输入',
          verify: false, //是否必填
          print: false,
          condition: false, //是否是条件
          canDel: true //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
        },
        {
          id: 16,
          name: '联系人',
          icon: 'icon-fenzucopy',
          key: '',
          value: [],
          type: 'contactPerson',
          canDragClass: true,
          placeholder: '请输入',
          verify: false, //是否必填
          print: false,
          condition: false, //是否是条件
          canDel: true, //是否可以移除（适用于条件，并且在条件设置中添加了此条件）
          multiple: '0' //是否可以多选  0否  1是
        }
      ],
      targetData: {},
      ruleForm: {
        name: '',
        region: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      },
      departmentInfo: [],
      currentIndex: null
    }
  },
  computed: {
    ...mapGetters(['conditionListStore', 'produceCodeStore', 'selectForm']),
    targetKey() {
      return Object.keys(this.targetData)
    }
  },

  watch: {
    produceCodeStore(newVal) {
      this.selectList = []
      if (newVal.length > 0) {
        this.initList.forEach(el => {
          el.canDragClass = false
          if (el.type == 'richText') {
            this.selectList.push(JSON.parse(JSON.stringify(el)))
            this.editItem(el)
          }
        })
      } else {
        this.initList.forEach(el => {
          el.canDragClass = true
        })
      }
    },
    targetData(newVal) {
      this.setCurrentIndex(newVal)
    },
    conditionListStore(newVal) {
      this.selectList.forEach(el => {
        el.canDel = true
      })
      newVal.forEach(el => {
        this.selectList.forEach(ev => {
          if (el.key == ev.key && el.type == ev.type && el.name == ev.name) {
            ev.canDel = false
          }
        })
      })
    }
  },
  created() {
    //禁止火狐浏览器拖拽默认打开新窗口查询问题
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
    this.getDepartmentInfo()
  },
  methods: {
    ...mapActions(['getSelectForm', 'addConditionList']),
    checkFromCanDel(obj) {
      if (obj.child_node) {
        if (obj.child_node.type == 1) {
          //审批人
          this.checkFromCanDel(obj.child_node)
        } else if (obj.child_node.type == 2) {
          //抄送人
          this.checkFromCanDel(obj.child_node)
        } else if (obj.child_node.type == 4) {
          //条件
          this.checkFromCanDel(obj.child_node)
          for (let i = 0; i < obj.child_node.condition_nodes.length; i++) {
            let item = obj.child_node.condition_nodes[i]
            for (let j = 0; j < item.condition_form_config.length; j++) {
              this.addConditionList(item.condition_form_config[j])
            }
            this.checkFromCanDel(item)
          }
        }
      } else {
        obj.child_node = null
      }
    },
    setCurrentIndex(newVal) {
      this.selectList.forEach((item, i) => {
        if (item.key == newVal.key) {
          this.currentIndex = i
        }
      })
    },
    end(ev) {
      this.leftFormDisabled = false
      if (ev.to.className === 'dragArea11') {
        this.$set(this.initList[ev.oldIndex], 'flag', true)
      }
      this.setCurrentIndex(this.targetData)
    },
    cloneData(original) {
      let timestamp = new Date().getTime()
      let obj = JSON.parse(JSON.stringify(original))
      if (!obj.key) {
        obj.key = obj.type + '_' + timestamp
      }
      this.targetData = obj
      // 深拷贝对象，防止默认空对象被更改
      return obj
    },
    startTw() {
      this.falgs = '222222'
    },
    endTw() {
      this.falgs = 'article'
      this.setCurrentIndex(this.targetData)
    },
    handleDel(index, id) {
      this.selectList.splice(index, 1)
      if (this.selectList.length > 0) {
        this.targetData = this.selectList[index] || this.selectList[index - 1]
      }
      let q = this.initList.find(value => {
        return value.id === id
      })
      this.$set(q, 'flag', false)
    },
    getValue(key, val) {
      if (key == 'flowOrder') {
        this.$nextTick(() => {
          let nodeValue = this.$refs.draginput.$refs.cascader.getCheckedNodes()
          this.targetData.value = []
          nodeValue.forEach(el => {
            if (el.data.name) {
              this.targetData.value.push(el.data.name)
            }
          })
        })

        this.targetData.allValue = val
      } else {
        this.targetData[key] = val
        if (Array.isArray(val)) {
          val.forEach(el => {
            el.value = el.label
            el.label = el.label
          })
        }
      }

      let snapArr = this.selectList.filter(el => el.verify)
      snapArr.forEach((el, i) => {
        el.condition = true
        if (el.type == 'datetimerange' && !el.autoCalculationTime) {
          snapArr.splice(i, 1)
        }
      })
      this.getSelectForm(JSON.parse(JSON.stringify(snapArr)))
    },
    editItem(item) {
      this.targetData = item
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let parentArr = JSON.parse(JSON.stringify(data))
        this.departmentInfo = this.formateDepartment(parentArr)
        // this.defaultExpandedKeys = this.departmentInfo[0].department_id;
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
  }
}
</script>

<style scoped lang="scss">
.form {
  height: 100%;
  .box {
    display: flex;
    height: 100%;
    overflow-y: auto;
    .box-left {
      overflow-y: auto;
      width: 325px;
      background-color: #fff;
    }
    .box-right {
      width: 350px;
      background-color: #fff;
    }
    .box-center {
      overflow-y: auto;
      flex: 1;
      padding: 20px;
      margin: 0px 10px;
      .tip-txt {
        margin-top: 50px;
        text-align: center;
        color: #999;
      }
    }
    .box-right {
      padding: 20px;
      .tip-txt {
        margin-top: 50px;
        text-align: center;
        color: #999;
      }
    }
  }
  .dragArea11,
  .dragArea {
    height: 100%;
    padding: 13px 0;
  }
  .list-complete-item {
    display: inline-block;
    width: calc(50% - 20px);
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #ecebeb;
    border-radius: 4px;
    font-size: 13px;
    padding: 0 10px;
    text-align: left;
    overflow: hidden;
    margin-left: 13px;
    margin-bottom: 5px;
    position: relative;
    &.disable-active {
      cursor: no-drop;
    }
    .txt-icon {
      float: right;
    }
    .dialog-black {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background: rgba(222, 215, 215, 0.5);
    }
  }
  .drag-ruleForm {
    height: 100%;
  }
  .center-item {
    margin: 0 auto;
    width: 450px;
    display: flex;
    align-items: center;
    padding: 10px 10px;
    border-radius: 4px;
    position: relative;
    &:hover {
      background: rgba(226, 226, 226, 0.6);
    }
    &.item-active {
      background: rgba(226, 226, 226, 0.8);
    }
    .form-item {
      flex: 1;
      .el-select,
      .el-date-picker {
        width: 100%;
      }
      ::v-deep .el-input--small .el-input__inner,
      .el-range-editor--small.el-input__inner {
        width: 100%;
      }
      ::v-deep .el-form-item {
        margin-bottom: 0;
      }
      ::v-deep .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }
      ::v-deep .el-cascader {
        width: 100%;
      }
    }
    .del {
      font-size: 20px;
      margin-left: 15px;
    }
    .edit-box {
      img {
        width: 100%;
      }
    }
    .imgs {
      font-size: 24px;
    }
    .no-del-txt {
      position: absolute;
      right: -20px;
      top: 17px;
      z-index: 9;
    }
  }
  .box-center::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
  }
  .box-center::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #d4dce6;
  }
  .box-center::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
}
</style>
