<template>
  <div class="search">
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="col-flex">
          <span class="flex-label">流程类型</span>
          <el-select
            v-model="params.process_id"
            size="mini"
            filterable
            clearable
            placeholder="请选择"
            @change="search"
          >
            <el-option
              v-for="item in processData"
              :key="item.value"
              :label="item.name"
              :value="item.process_id"
            ></el-option>
          </el-select>
          <el-select
            style="margin-left:10px;"
            v-model="params.list_status"
            placeholder="流程状态"
            size="mini"
            clearable
            @change="search"
          >
            <el-option label="进行中" value="1"></el-option>
            <el-option label="完成" value="2"></el-option>
            <el-option label="拒绝" value="3"></el-option>
            <el-option label="撤销" value="4"></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="col-flex">
          <span class="flex-label">标题</span>
          <el-input
            v-model="params.keyword"
            placeholder="请输入"
            size="mini"
            clearable
            @keyup.enter.native="search"
          ></el-input>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="9">
        <div class="col-flex">
          <span class="flex-label">发起时间</span>
          <el-date-picker
            v-model="time1"
            @change="changeTimes1"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            size="mini"
            clearable
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="col-flex">
          <span class="flex-label">完成时间</span>
          <el-date-picker
            v-model="time2"
            @change="changeTimes2"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            size="mini"
            clearable
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
      </el-col>
    </el-row>
    <div style="padding:10px;">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="search"
        >查询</el-button
      >
      <el-button size="mini" @click="reSearch">重置</el-button>
      <slot name="export"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dataExport',
  props: {
    processData: Array
  },
  data() {
    return {
      time1: '',
      time2: '',
      params: {
        keyword: '',
        create_start: '',
        create_end: '',
        create_user_id: '',
        finish_start: '',
        finish_end: '',
        list_status: '',
        process_id: ''
        // list_id: ''
      }
    }
  },
  created() {},
  methods: {
    changeTimes1(val) {
      if (val && val.length > 0) {
        this.params.create_start = val[0]
        this.params.create_end = val[1]
        this.search()
      } else {
        this.params.create_start = ''
        this.params.create_end = ''
        this.search()
      }
    },
    changeTimes2(val) {
      if (val && val.length > 0) {
        this.params.finish_start = val[0]
        this.params.finish_end = val[1]
        this.search()
      } else {
        this.params.finish_start = ''
        this.params.finish_end = ''
        this.search()
      }
    },
    search() {
      this.$emit('search', this.params)
    },
    reSearch() {
      this.params = this.$options.data().params
      this.time1 = ''
      this.time2 = ''
      this.$emit('search', this.params)
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  .col-flex {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .flex-label {
      width: 100px;
      text-align: right;
      padding-right: 10px;
    }
  }
}
</style>
