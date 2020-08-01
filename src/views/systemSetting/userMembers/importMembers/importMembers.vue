<template>
  <!-- 添加编辑角色 -->
  <div class="import-members">
    <el-dialog
      title="上传成员"
      :visible.sync="dialogVisible"
      width="400px"
      :show-close="false"
      :before-close="beforeClose"
    >
      <div class="dialog-content">
        <ul>
          <li class="li-flex">
            <span class="li-flex-left">1、</span>
            <span class="li-flex-right">
              <p>
                点击
                <a
                  target="_blank"
                  href="http://img.ecgtool.com/twork/ec/xlsx/2020/03/31//vnd.openxmlformats-officedocument.spreadsheetml.sheet/twork_557/202003/31/twork_557_1585617891.xlsx"
                  >下载用户信息表</a
                >
              </p>
              <p class="orange">注意：原始表数据不可删除</p>
            </span>
          </li>
          <li class="li-flex">
            <span class="li-flex-left">2、</span>
            <span class="li-flex-right">
              <p>上传用户信息表</p>
              <p>
                <upload @upload="successImgOk">
                  <i class="iconfont icon-shangchuantupian"></i>
                </upload>
              </p>
            </span>
          </li>
        </ul>
      </div>
      <div class="dialog-footer">
        <!-- <el-button size="mini" type="primary" @click="submitForm('ruleForm')">确 定上传</el-button> -->
        <el-button size="mini" @click="beforeClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '_c/common/Upload'
export default {
  name: 'RolePermission',
  components: {
    Upload
  },
  props: {
    dialogVisible: Boolean
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    // 上传成功文件
    successImgOk(imgs) {
      console.log(imgs, 333)
      //   this.ruleForm.logo_path = imgs[0];
      //   this.list = imgs;
    },
    async editRole() {
      try {
        // let { data, message } = await roleUpdate(this.ruleForm);
        // this.$message.success(message);
        // this.$emit("refreshList", true);
        // this.handleClose();
      } catch (error) {
        this._message(error)
      }
    },
    // 提交
    submitForm() {
      this.editRole()
    },
    beforeClose() {
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.import-members {
  .dialog-content {
    margin-bottom: 20px;
    line-height: 20px;
    .li-flex {
      display: flex;
      margin-bottom: 10px;
      .li-flex-left {
        // width: 50px;
      }
      .li-flex-right {
        flex: 1;
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
