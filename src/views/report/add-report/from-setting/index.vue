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
                      : item.name
                  "
                  :required="item.verify"
                >
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
                    v-if="item.type == 'selects'"
                    v-model="item.value"
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
                  <div v-if="item.type == 'accessory'" class="imgs">
                    <span class="el-icon-document"></span>
                  </div>
                </el-form-item>
              </div>
              <div class="del">
                <el-link
                  v-if="item.canDragClass"
                  type="danger"
                  @click="handleDel(index, item.id)"
                  >移除</el-link
                >
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
          value: null,
          type: 'num',
          canDragClass: true, //指定可以拖动的类名
          placeholder: '请输入',
          unit: '',
          verify: false,
          isCheck: false,
          numType: '0' //数字类型
        },
        {
          id: 2,
          name: '多行输入框',
          icon: 'icon-duohangshurukuang',
          key: '',
          value: '', // 前台汇报快捷录入时使用
          realValue: '', // 前台汇报快捷录入时使用
          type: 'textarea',
          canDragClass: true,
          placeholder: '请输入',
          verify: false
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
          verify: false
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
          verify: false
        },
        {
          id: 10,
          name: '附件',
          icon: 'icon-fujian3',
          key: '',
          value: [], // { url:xxx, file_name: xxx }
          type: 'accessory',
          canDragClass: true,
          placeholder: '附件',
          format: '',
          verify: false
        }
      ],
      targetData: {},
      ruleForm: {
        name: '',
        region: ''
      },
      currentIndex: null
    }
  },
  computed: {
    targetKey() {
      return Object.keys(this.targetData)
    }
  },

  watch: {
    targetData(newVal) {
      this.setCurrentIndex(newVal)
    }
  },
  created() {
    //禁止火狐浏览器拖拽默认打开新窗口查询问题
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    initData(obj) {
      this.selectList = obj
    },
    reset() {
      this.selectList = []
    },
    vilidata() {
      const fromData = {}
      fromData.hasError = !this.selectList.length ? true : false
      fromData.data = this.selectList
      return fromData
    },
    getList() {
      console.log(this.selectList)
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
    endDraggable() {
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
      this.targetData[key] = val
      if (Array.isArray(val)) {
        val.forEach((el, index) => {
          el.value = index + 1
        })
      }
    },
    editItem(item) {
      this.targetData = item
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
    .imgs {
      font-size: 24px;
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
