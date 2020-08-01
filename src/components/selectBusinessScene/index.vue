<template>
  <div>
    <el-dialog
      append-to-body
      :title="`请选择 (${multiple ? '多选' : '单选'})`"
      :visible="visible"
      width="800px"
      top="50px"
      @close="handleClose"
    >
      <div class="select-box">
        <div class="box">
          <div class="select-title">选择:</div>
        </div>
        <div class="box">
          <div class="select-title">
            已选: <span class="clear-all" @click="clearAll">清除</span>
          </div>
        </div>
      </div>
      <div class="select-box">
        <div class="box">
          <div class="area">
            <el-input
              clearable
              placeholder="请输入关键词"
              size="mini"
              prefix-icon="el-icon-search"
              v-model="keywords"
              @input="changeIpt"
            >
            </el-input>
            <el-checkbox
              v-show="multiple"
              style="margin: 10px 0"
              @change="changeAll"
              :indeterminate="indeterminateStatus"
              v-model="checkAll"
              >全选</el-checkbox
            >
            <div class="list-box">
              <select-list
                :keywords="keywords"
                :list="list"
                @changeSelect="changeSelect"
              ></select-list>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="area">
            <target-list
              :list="targetList"
              @clearItem="clearItem"
            ></target-list>
          </div>
        </div>
      </div>
      <div class="buttom-box">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SelectList from './SelectList'
import TargetList from './TargetList'
export default {
  props: {
    visible: Boolean,
    list: Array, //供选择的列表
    originalData: Array, //选中的列表
    multiple: {
      //是否多选
      type: Boolean,
      default: true
    }
  },
  components: { SelectList, TargetList },
  data() {
    return {
      keywords: '',
      indeterminateStatus: false,
      checkAll: false,
      targetList: []
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initList()
      }
    }
  },
  created() {},
  methods: {
    clearItem(item) {
      this.targetList = this.targetList.filter(el => el.val !== item.val)
      this.list.forEach(el => {
        if (el.val == item.val) {
          this.$delete(el, 'select')
          this.$set(el, 'select', false)
        }
      })
    },
    clearAll() {
      this.targetList = []
      this.list.forEach(el => {
        this.$delete(el, 'select')
        this.$set(el, 'select', false)
      })
    },
    changeSelect(info) {
      let { item, flg } = info
      if (this.multiple) {
        //多选
        if (flg) {
          this.targetList.push(item)
        } else {
          this.targetList = this.targetList.filter(el => el.val !== item.val)
          this.indeterminateStatus = true
        }
      } else {
        //单选
        this.targetList = []
        if (flg) {
          this.targetList.push(item)
          this.list.forEach(el => {
            if (el.val !== item.val) {
              el.select = false
            }
          })
        } else {
          this.indeterminateStatus = true
        }
      }
    },
    initList() {
      this.list.forEach(el => {
        el['select'] = false
        el['show'] = true
      })
      this.originalData.forEach(el => {
        this.list.forEach(ev => {
          if (el == ev.val) {
            this.$delete(ev, 'select')
            this.$set(ev, 'select', true)
            this.targetList.push(ev)
          }
        })
      })
    },
    save() {
      this.$emit('saveOk', this.targetList)
      this.handleClose()
    },
    changeIpt() {
      this.list.forEach(el => {
        this.$delete(el, 'show')
        if (el.label.indexOf(this.keywords) !== -1) {
          this.$set(el, 'show', true)
        } else {
          this.$set(el, 'show', false)
        }
      })
    },
    changeAll(e) {
      if (e) {
        this.indeterminateStatus = false
        this.list.forEach(el => {
          if (!el.select) {
            this.targetList.push(el)
            this.$delete(el, 'select')
            this.$set(el, 'select', true)
          }
        })
      } else {
        this.list.forEach(el => {
          this.$delete(el, 'select')
          this.$set(el, 'select', false)
          this.targetList.forEach((ev, j) => {
            if (el.val == ev.val) {
              this.targetList.splice(j, 1)
            }
          })
        })
      }
    },
    reretData() {
      this.checkAll = false
      this.keywords = ''
      this.indeterminateStatus = false
      this.targetList = []
    },
    handleClose() {
      this.reretData()
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-box {
  display: flex;
  .box {
    flex: 1;
    padding: 5px;
    margin: 0 5px;
    .select-title {
      color: #333;
      font-size: 15px;
      margin-bottom: 15px;
      .clear-all {
        float: right;
        margin-right: 20px;
        color: red;
        cursor: pointer;
      }
    }
    .area {
      background: #f1f1f1;
      padding: 10px;
      border-radius: 3px;
      height: 100%;
      height: 500px;
      overflow-y: auto;
    }
  }
}
.buttom-box {
  text-align: center;
  margin-top: 20px;
}
</style>
