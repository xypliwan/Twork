<template>
  <div>
    <div class="check-select">
      <el-checkbox
        @change="handleChangeHaveCheck"
        v-model="ruleform.have_check"
        :true-label="1"
        :false-label="0"
        >处理事项</el-checkbox
      >
      <el-checkbox
        v-model="ruleform.can_add_check"
        :true-label="1"
        :false-label="0"
        >处理人可新增事项</el-checkbox
      >

      <el-button
        v-show="ruleform.have_check == 1"
        class="fr"
        size="mini"
        type="primary"
        plain
        @click="addItem"
        >新增事项</el-button
      >
    </div>
    <div class="handlin-matters" v-show="ruleform.have_check == 1">
      <div class="matters-item" v-for="(item, i) in ruleform.check" :key="i">
        <div class="item-info">
          <div class="indexs">{{ i + 1 }}</div>
          <div class="ipt-box">
            <el-input
              clearable
              v-model="item.check_name"
              placeholder="请输入处理事项"
              size="small"
            ></el-input>
          </div>

          <div class="icon-box">
            <i class="el-icon-remove" @click="delItem(i)"></i>
            <span @click="currentIndex = i">
              <el-tooltip
                class="item"
                effect="dark"
                content="文件上传"
                placement="top"
              >
                <upload @upload="successOk">
                  <i class="lod el-icon-paperclip"></i>
                </upload>
              </el-tooltip>
            </span>
          </div>
        </div>

        <div class="item-info">
          <div class="indexs"></div>
          <div class="ipt-box">
            <el-button
              v-show="!item.show"
              type="primary"
              size="mini"
              @click="handleSetTime(item, i)"
              >设置任务时间</el-button
            >
            <span v-show="item.show">
              <el-input
                style="width:200px"
                type="number"
                :min="0"
                v-model="item.hour"
                placeholder="请输入时间"
                size="mini"
              ></el-input>
              小时
              <el-link
                style="margin-left:15px"
                type="primary"
                @click="hadleCancelTime(item)"
                >取消</el-link
              >
            </span>
          </div>
        </div>

        <div class="item-file" v-for="(file, j) in item.files" :key="j">
          <a :href="file.url" target="_blank">{{ file.name }}</a>
          <i
            class="el-icon-error error-icon"
            @click="deleteFileItem(item.files, j)"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Upload from '_c/common/Upload'

export default {
  data() {
    return {
      ruleform: {
        have_check: 1, //是否有处理事项 1有 0没有
        can_add_check: 1, //处理人可新增事项  1可以 0不行
        check: [] //处理事项数组  {url:'',name:''}
        // { check_name: "", files: [], hour: "" }
      },
      currentIndex: null
    }
  },
  methods: {
    handleSetTime(item) {
      this.$set(item, 'show', true)
    },
    hadleCancelTime(item) {
      item.show = false
      item.hour = ''
    },
    handleChangeHaveCheck() {
      if (this.ruleform.have_check == 0) {
        this.ruleform.check = []
      }
    },
    deleteFileItem(item, i) {
      item.splice(i, 1)
    },
    getData() {
      return this.ruleform
    },
    setData(obj) {
      this.resetData()
      this.ruleform.have_check = Number(obj.have_check)
      this.ruleform.can_add_check = Number(obj.can_add_check)
      this.ruleform.check = obj.check
      this.ruleform.check.forEach(el => {
        this.$set(el, 'show', true)
      })
    },
    //重置
    resetData() {
      this.ruleform.have_check = 1
      this.ruleform.can_add_check = 1
      this.ruleform.check = []
    },
    successOk(data) {
      this.ruleform.check[this.currentIndex].files.push({
        url: data.url,
        name: data.file_name
      })
    },
    addItem() {
      this.ruleform.check.push({
        check_name: '',
        files: [],
        hour: '', //任务时间
        show: false
      })
    },
    delItem(i) {
      this.ruleform.check.splice(i, 1)
    }
  },
  components: {
    Upload
  }
}
</script>

<style lang="scss" scoped>
.check-select {
  margin: 20px 0;
  overflow: hidden;
}
.handlin-matters {
  .matters-item {
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
    .item-info {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .indexs {
        width: 30px;
        text-align: center;
      }
      .ipt-box {
        flex: 1;
      }
      .icon-box {
        width: 83px;
        text-align: center;
        display: flex;
        i {
          margin: 0 15px;
          font-size: 17px;
          color: #666;
          cursor: pointer;
        }
      }
    }
  }
  .item-file {
    padding: 5px 10px;
    padding-left: 32px;
    .error-icon {
      font-size: 14px;
      color: #666;
      margin-left: 15px;
      cursor: pointer;
    }
  }
  ::v-deep .el-drawer__body {
    overflow: auto;
    padding-bottom: 20px;
  }
}
</style>
