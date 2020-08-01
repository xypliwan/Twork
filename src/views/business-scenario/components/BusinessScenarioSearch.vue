<template>
  <div>
    <div class="business-scenario-search">
      <el-input
        class="search-input"
        size="small"
        placeholder="请输入内容"
        v-model="params.title"
        @keyup.enter.native="search"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search"
        ></i>
      </el-input>
      <span class="high-search theme-color" @click="isShow = !isShow"
        >高级搜索
        <span
          class="el-icon-arrow-down"
          :class="{ 'arrow-down': isShow }"
        ></span>
      </span>
    </div>
    <div class="high-search-box" :class="{ 'high-search-box-active': isShow }">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="high-search-item">
            <span>场景状态：</span>
            <el-radio-group
              v-model="params.setting_status"
              size="mini"
              @change="search"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="2">停用</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="high-search-item">
            <span class="search-item-label">流程模板类型：</span>
            <el-select
              class="item-select1"
              v-model="group_id"
              clearable
              filterable
              placeholder="请选择"
              size="mini"
              @change="groupChange"
            >
              <el-option
                v-for="(item, index) in groupData"
                :key="index"
                :label="item.group_name"
                :value="item.group_id"
                @click.native="getProcess(item)"
              ></el-option>
            </el-select>
            <el-select
              v-model="params.process_id"
              clearable
              filterable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="(item, index) in processData"
                :key="index"
                :label="item.name"
                :value="item.process_id"
              ></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="high-search-item">
            <span>场景类型：</span>
            <el-select
              class="item-select1"
              v-model="params.type3"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="params.type4"
              clearable
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="high-search-item">
            <span class="search-item-label">创建时间：</span>
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :format="'yyyy-MM-dd HH:mm:ss'"
              :value-format="'yyyy-MM-dd HH:mm:ss'"
            >
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="high-search-item">
            <el-button type="primary" size="mini" @click="search"
              >搜索</el-button
            >
            <el-button size="mini" @click="reset">清除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    groupData: Array
  },
  data() {
    return {
      isShow: false,
      processData: [],
      time: '',
      group_id: '',
      params: {
        title: '',
        setting_status: '', //1 启用 2停用
        process_id: '', //流程id
        create_start: '',
        create_end: ''
      },
      options: []
    }
  },
  methods: {
    // 流程
    groupChange() {
      this.params.process_id = ''
      this.processData = []
    },
    getProcess(item) {
      this.processData = item.process || []
    },
    search() {
      if (this.time) {
        this.params.create_start = this.time[0]
        this.params.create_end = this.time[1]
      } else {
        this.params.create_start = ''
        this.params.create_end = ''
      }
      this.$emit('search', this.params)
    },
    reset() {
      this.params = Object.assign(this.params, this.$options.data().params)
      this.time = ''
      this.group_id = ''
      this.search()
    }
  }
}
</script>

<style scoped lang="scss">
.business-scenario-search {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  .search-input {
    width: 300px;
    margin-right: 20px;
  }
  .high-search {
    font-weight: bold;
    cursor: pointer;
    .el-icon-arrow-down {
      font-weight: bold;
      transition: all 0.5s ease-in;
      &.arrow-down {
        transform: rotate(180deg);
      }
    }
  }
}
.high-search-box {
  height: 0;
  overflow: hidden;
  border-bottom: 1px solid #eee;
  transition: all 0.5s ease-in;
  &.high-search-box-active {
    height: 155px;
  }
  .el-row {
    padding: 20px 10px;
    .el-col {
      margin-bottom: 15px;
      .high-search-item {
        display: flex;
        align-items: center;
        .search-item-label {
          width: 100px;
        }
        .item-select1 {
          width: 150px;
          margin-right: 10px;
        }
        .el-range-editor--mini.el-input__inner {
          width: 354px;
        }
      }
    }
  }
}
</style>
