<template>
  <div class="drag-input">
    <h3 class="htitle">{{ title }}</h3>
    <ul class="box">
      <li v-if="!['des'].find(el => el == form.type)">
        <div class="des">
          标题
          <span style="font-size:12px;color:#bbb;">最多20字</span>
        </div>
        <el-input
          v-model="form.name"
          size="small"
          clearable
          @change="$emit('getValue', 'name', form.name)"
        ></el-input>
      </li>
      <li
        v-if="
          !['datetimerange', 'img', 'department', 'accessory', 'des'].find(
            el => el == form.type
          )
        "
      >
        <div class="des">
          提示文字
          <span style="font-size:12px;color:#bbb;">最多50字</span>
        </div>
        <el-input
          v-model="form.placeholder"
          size="small"
          clearable
          @change="$emit('getValue', 'placeholder', form.placeholder)"
        ></el-input>
      </li>
      <li v-if="form.type == 'num'">
        <div class="des">单位</div>
        <el-input
          v-model="form.unit"
          size="small"
          @change="$emit('getValue', 'unit', form.unit)"
        ></el-input>
      </li>
      <li v-if="form.type == 'datetimerange'">
        <div class="des">提示文字1</div>
        <el-input
          v-model="form.placeholder1"
          clearable
          size="small"
          @change="$emit('getValue', 'placeholder1', form.placeholder1)"
        ></el-input>
      </li>
      <li v-if="form.type == 'datetimerange'">
        <div class="des">提示文字2</div>
        <el-input
          v-model="form.placeholder2"
          size="small"
          clearable
          @change="$emit('getValue', 'placeholder2', form.placeholder2)"
        ></el-input>
      </li>
      <li v-if="form.type == 'datetime' || form.type == 'datetimerange'">
        <div class="des">日期类型</div>
        <el-radio-group
          v-model="form.format"
          size="small"
          @change="$emit('getValue', 'format', form.format)"
        >
          <el-radio label="yyyy-MM-dd HH:mm:ss">年-月-日 时:分:秒</el-radio>
          <el-radio label="yyyy-MM-dd">年-月-日</el-radio>
        </el-radio-group>
      </li>
      <li v-if="form.type == 'datetimerange'">
        <div class="des">自动计算时长</div>
        <el-checkbox
          v-model="form.autoCalculationTime"
          size="small"
          :disabled="!canSetRequired"
          @change="
            $emit('getValue', 'autoCalculationTime', form.autoCalculationTime)
          "
          >开启</el-checkbox
        >
      </li>
      <li v-if="form.type == 'select' || form.type == 'selects'">
        <div class="des">选项</div>
        <div
          class="select-box"
          v-for="(item, index) in form.options"
          :key="index"
        >
          <el-input
            v-model="item.label"
            size="small"
            clearable
            @change="$emit('getValue', 'options', form.options)"
          ></el-input>
          <span
            class="el-icon-remove-outline red pointer"
            @click="handleDel(index)"
          ></span>
          <span
            class="el-icon-circle-plus-outline blue pointer"
            @click="handleAdd(index)"
          ></span>
        </div>
      </li>
      <li v-if="form.type == 'select'" class="select-related">
        <span @click="handleRelated">选项关联</span>
        <el-popover
          placement="top"
          width="400"
          trigger="manual"
          v-model="batchVisible"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 6 }"
            placeholder="请输入选项内容,换行区分"
            v-model="batchOptions"
          >
          </el-input>
          <div style="margin-top:15px;text-align:center;">
            <el-button size="mini" @click="batchVisible = false"
              >关闭</el-button
            >
            <el-button
              type="primary"
              :disabled="batchOptions.trim().length == 0"
              size="mini"
              @click="batchAdd"
              >添加</el-button
            >
          </div>
          <span
            slot="reference"
            class="related-item"
            @click="batchVisible = !batchVisible"
            >批量添加</span
          >
        </el-popover>
      </li>
      <li v-if="form.type == 'des'">
        <div class="des">说明文字</div>
        <el-input
          type="textarea"
          v-model="form.des"
          size="small"
          clearable
          @change="$emit('getValue', 'des', form.des)"
        ></el-input>
      </li>
      <!-- <li v-if="['relevance'].find(el => el == form.type)">
        <div class="des">指定关联审批单类型</div>
        <el-input
          v-model="form.appoint"
          size="small"
          clearable
          @change="$emit('getValue', 'appoint', form.appoint)"
        ></el-input>
        <p style="margin-top:5px;color:#bbb;">
          不设置时默认可选择所有任意类型的审批单
        </p>
      </li> -->
      <li v-if="['flowOrder'].find(el => el == form.type)">
        <div class="des">
          指定关联审批单类型
        </div>
        <el-cascader
          ref="cascader"
          :show-all-levels="false"
          v-model="form.allValue"
          size="small"
          placeholder="选择流程类型"
          :options="groupData"
          :props="{
            multiple: true,
            children: 'process',
            value: 'group_id',
            label: 'group_name'
          }"
          clearable
          filterable
          @change="$emit('getValue', 'flowOrder', form.allValue)"
        ></el-cascader>
        <!-- @remove-tag="$emit()" -->
        <div class="tip">不设置时默认可选择所有任意类型的审批单</div>
      </li>
      <li v-if="!['des'].find(el => el == form.type)">
        <div class="des">验证</div>
        <el-checkbox
          v-model="form.verify"
          :disabled="!canSetRequired"
          size="small"
          @change="$emit('getValue', 'verify', form.verify)"
          >必填</el-checkbox
        >
        <span style="color:#3ba8f3;margin-left:10px;" v-if="form.condition"
          >勾选后可作为流程条件</span
        >
        <div style="color:#e2593a;" v-show="!canSetRequired">
          (该控件已被设置为审批条件，不可取消勾选)
        </div>
      </li>
      <li v-if="form.type == 'contactPerson'">
        <div class="des">是否多选</div>
        <el-radio
          @change="$emit('getValue', 'multiple', form.multiple)"
          v-model="form.multiple"
          label="0"
          >只能选择一人</el-radio
        >
        <el-radio
          @change="$emit('getValue', 'multiple', form.multiple)"
          v-model="form.multiple"
          label="1"
          >可同时选择多人</el-radio
        >
      </li>
      <li v-if="form.type == 'datetimerange'">
        <el-link :underline="false" type="warning"
          >当同时开启自动计算时长，和验证必填时，可以作为流程条件</el-link
        >
      </li>
      <li v-if="['des'].find(el => el == form.type)">
        <div class="des">显示</div>
        <el-checkbox
          v-model="form.show"
          size="small"
          @change="$emit('getValue', 'show', form.show)"
          >不在审批页显示</el-checkbox
        >
      </li>
      <li v-if="!['relevance'].find(el => el == form.type)">
        <div class="des">打印</div>
        <el-checkbox
          v-model="form.print"
          size="small"
          @change="$emit('getValue', 'print', form.print)"
          >参与打印</el-checkbox
        >
      </li>
      <li v-if="['department'].find(el => el == form.type)">
        <div class="des">选项</div>
        <el-radio-group
          v-model="form.radio_multiple"
          size="small"
          @change="$emit('getValue', 'radio_multiple', form.radio_multiple)"
        >
          <el-radio label="radio">只能选择一个部门</el-radio>
          <el-radio label="multiple">可选择多个部门</el-radio>
        </el-radio-group>
      </li>
    </ul>

    <option-related
      :selectList="$parent.selectList"
      :visible.sync="optionRelatedVisible"
      :form="form"
      @saveRelatedInfo="saveRelatedInfo"
    ></option-related>
  </div>
</template>

<script>
import OptionRelated from './OptionRelated'
import { groupList } from '@/api/flowManage'
import { mapGetters } from 'vuex'
export default {
  name: '',
  props: {
    targetData: Object
  },
  data() {
    return {
      form: {
        // name:'',
        // placeholder:'',
        // verify:'',
        // print:'',
      },
      title: '',
      optionRelatedVisible: false,
      batchOptions: '',
      batchVisible: false,
      groupData: []
    }
  },
  computed: {
    ...mapGetters(['conditionListStore']),
    canSetRequired() {
      let canSet = true
      this.conditionListStore.forEach(el => {
        if (el.key == this.form.key) {
          canSet = false
        }
      })
      return canSet
    }
  },
  watch: {
    targetData(val) {
      this.batchVisible = false
      this.title = val.name
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          this.$set(this.form, key, val[key])
        }
        if (key == 'options' && this.form[key].length == 0) {
          this.form[key].push({
            value: '选项1',
            label: '选项1',
            attr: []
          })
          this.form[key].push({
            value: '选项2',
            label: '选项2',
            attr: []
          })
          this.form[key].push({
            value: '选项3',
            label: '选项3',
            attr: []
          })
        }
      }
    },
    batchVisible(newVal) {
      if (!newVal) {
        this.batchOptions = ''
      }
    }
  },
  created() {
    this.groupList()
  },
  methods: {
    batchAdd() {
      let arrs = this.batchOptions.split(/[\n,]/g)
      arrs.forEach(el => {
        this.form.options.push({
          value: el,
          label: el,
          attr: []
        })
      })
      this.batchOptions = ''
    },
    saveRelatedInfo(arr) {
      this.form.options = arr
      this.targetData.options = arr
    },
    handleRelated() {
      // relatedDisabled
      this.$parent.selectList.forEach(el => {
        if (el.type == 'select') {
          el['relatedDisabled'] = false
          if (el.key !== this.form.key) {
            el.options.forEach(ev => {
              // ev.attr
              if (ev.attr.includes(this.form.key)) {
                el['relatedDisabled'] = true
              }
            })
          }
        }
      })
      this.optionRelatedVisible = true
    },
    handleDel(index) {
      if (index == 0 && this.form.options.length == 1)
        return (this.form.options[index].label = '')
      this.form.options.splice(index, 1)
    },
    handleAdd(index) {
      if (!this.form.options[index].label)
        return this.$message.warning('请输入选项内容')
      this.form.options.splice(index + 1, 0, { value: index + 1, label: '' })
    },
    async groupList() {
      this.loading = true
      try {
        let { data } = await groupList()
        data.forEach(el => {
          if (el.process.length) {
            el.process.forEach(ev => {
              ev.group_name = ev.name
              ev.group_id = ev.process_id
            })
          }
        })
        this.groupData = data
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    }
  },
  components: {
    OptionRelated
  }
}
</script>

<style scoped lang="scss">
.drag-input {
  height: 100%;
  li {
    margin-bottom: 15px;
    .des {
      margin-bottom: 5px;
    }
    .tip {
      font-size: 12px;
      margin-top: 5px;
    }
    .select-box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span {
        margin-left: 10px;
        font-size: 18px;
      }
    }
  }
  .select-related {
    color: #5571cd;
    cursor: pointer;
    .related-item {
      margin-left: 15px;
    }
  }
}
</style>
