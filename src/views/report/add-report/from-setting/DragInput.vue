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
      <li v-if="!['accessory'].find(el => el == form.type)">
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
      <li v-if="form.type == 'datetime'">
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
      <li v-if="form.type == 'selects'">
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
      <li v-if="!['des'].find(el => el == form.type)">
        <div class="des">验证</div>
        <el-checkbox
          v-model="form.verify"
          size="small"
          @change="$emit('getValue', 'verify', form.verify)"
          >必填</el-checkbox
        >
      </li>
    </ul>
  </div>
</template>

<script>
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
      title: ''
    }
  },
  watch: {
    targetData(val) {
      this.title = val.name
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          this.$set(this.form, key, val[key])
        }
        if (key == 'options' && this.form[key].length == 0) {
          this.form[key].push({ value: '选项1', label: '选项1' })
          this.form[key].push({ value: '选项2', label: '选项2' })
          this.form[key].push({ value: '选项3', label: '选项3' })
        }
      }
    }
  },
  methods: {
    handleDel(index) {
      if (index == 0 && this.form.options.length == 1)
        return (this.form.options[index].label = '')
      this.form.options.splice(index, 1)
    },
    handleAdd(index) {
      if (!this.form.options[index].label)
        return this.$message.warning('请输入选项内容')
      this.form.options.splice(index + 1, 0, { value: index + 1, label: '' })
    }
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
}
</style>
