<template>
  <div class="flow-module">
    <div class="flow-top">
      <span class="flow-txt">流程管理</span>
      <span id="add-group">
        <el-popover placement="right-start" width="350" v-model="visible">
          <div class="add-title">新建分组</div>

          <div class="add-content">
            <el-input
              placeholder="请输入分组名称"
              v-model="group_name"
              size="small"
              clearable
            ></el-input>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="cancelAdd"
              >取消</el-button
            >
            <el-button type="primary" size="mini" @click="groupAdd"
              >新建</el-button
            >
          </div>
          <el-button
            slot="reference"
            style="margin-right:10px"
            icon="el-icon-document-add"
            size="small"
            >新建分组</el-button
          >
        </el-popover>
      </span>
      <el-button
        style="margin:0 10px"
        icon="el-icon-sort"
        size="mini"
        @click="sortVisible = true"
        >分组排序</el-button
      >
      <el-input
        size="small"
        style="width:250px;"
        clearable
        placeholder="请输入内容"
        v-model="name"
        @keyup.enter.native="groupList"
        @clear="clearKeyword"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="groupList"
        ></i>
      </el-input>
      <div class="fr">
        <!-- <el-popover placement="right-start" width="550" v-model="flowVisible">
          <div class="add-title">
            新建工作流程
            <span class="fr pointer" style="color:#409eff" @click="flowVisible=false">关闭</span>
          </div>
          <div class="add-content">
            <template-base ref="templateBase" :processData="processData">
              <el-button class="el-icon-plus" type="primary" size="mini" @click="flowAdd">自定义模板</el-button>
            </template-base>
        </div>-->
        <el-button
          id="add-flow"
          slot="reference"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="flowAdd"
          >新建工作流程</el-button
        >
        <!-- </el-popover> -->
      </div>
    </div>
    <div class="flow-content" v-loading="loading">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in groupData"
          :key="index"
          :name="index + 1"
        >
          <template slot="title">
            <div class="collapse_title">
              <i
                class="el-icon-arrow-right right-icon"
                :class="item.isExpend ? 'right-icon-active' : ''"
              ></i>
              {{ item.group_name }}
              <label class="group-length">( {{ item.process.length }} )</label>
              <span class="fr" style="margin-right:10px">
                <el-dropdown>
                  <span class="el-dropdown-link" @click.stop>
                    编辑
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="rename(item)"
                      >重命名</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="delGrounp(item)"
                      >删除该组</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>
          </template>
          <div class="no-data" v-show="item.process.length <= 0">暂无数据</div>
          <div class="collapse-box" v-for="(el, i) in item.process" :key="i">
            <div class="left">
              <div class="icon">
                <img
                  v-if="el.img.length > 0"
                  class="guide-icon"
                  :src="require(`@/assets/images/flowimg/${el.img}`)"
                  alt
                />
              </div>
            </div>
            <div class="center">
              <p>
                <strong style="font-size: 14px">{{ el.name }}</strong> &nbsp;
                <span style="font-size: 12px" class="gray"
                  >({{ el.status_name }})</span
                >
              </p>
              <p class="gray">{{ el.desc }}</p>
              <p class="gray">创建于:{{ el.created_at }}</p>
            </div>
            <div class="belong-area">
              <p>可见范围</p>
              <p class="gray">
                <el-tooltip
                  effect="dark"
                  :content="el.promoter_params.nameArr.join('、')"
                  placement="top"
                >
                  <span v-if="el.promoter_params.nameArr.length >= 3">
                    {{ el.promoter_params.nameArr[0] }}
                    {{ el.promoter_params.nameArr[1] }}
                    {{ el.promoter_params.nameArr[2] }}
                    等
                    {{ el.promoter_params.nameArr.length }} 人
                  </span>
                  <span v-else>
                    {{ el.promoter_params.nameArr.join(' ') }}
                    {{ el.promoter_params.nameArr.length }} 人
                  </span>
                </el-tooltip>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="updateReporter(el)"
                  >修改</el-link
                >
              </p>
            </div>
            <div class="right">
              <el-button type="text" size="small" @click="editProcess(el)"
                >编辑</el-button
              >
              <el-button type="text" size="small" @click="openMove(item, el)"
                >移动</el-button
              >
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-show="el.status_name != '停用'"
                    @click.native="changeStatus(el, 2)"
                    >停用</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-show="el.status_name == '停用'"
                    @click.native="changeStatus(el, 1)"
                    >启用</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="changeStatus(el, 0)"
                    >删除</el-dropdown-item
                  >
                  <!-- <el-dropdown-item @click.native="editProcess(el)">编辑</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog title="分组重命名" :visible.sync="dialogVisible" width="350px">
      <el-input
        placeholder="请输入"
        v-model="rename_params.group_name"
        size="small"
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmRename"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="'将“' + move_target.name + '”移动到'"
      :visible.sync="moveVisible"
      width="500px"
      :show-close="false"
    >
      <div style="margin-top: -20px">
        <div
          v-for="(item, index) in groupData"
          :key="index"
          class="move-content"
        >
          <el-radio v-model="move_params.group_id" :label="item.group_id">
            <i class="header-icon el-icon-menu"></i>
            {{ item.group_name }}
          </el-radio>

          <span v-show="current_id == item.group_id" class="fr orange"
            >当前所在分组</span
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="moveVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="moveGroup"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <grounp-sort
      :visible.sync="sortVisible"
      :list="groupData"
      @saveOk="groupList"
    ></grounp-sort>

    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateReportPeopleFn"
      :originalData="selectObj"
    ></select-departments-and-people>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import GrounpSort from './components/GrounpSort'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
import {
  groupAdd,
  groupList,
  groupUpdate,
  groupDel,
  updateGroup,
  updateStatus,
  updatePromoter
} from '@/api/flowManage'
import { closeTip } from '@/api/common'
import { userInfo } from '@/api/user'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: '',
  data() {
    return {
      loading: false,
      visible: false,
      flowVisible: false,
      dialogVisible: false,
      moveVisible: false,
      name: '',
      activeNames: [],
      group_name: '',
      groupData: [],
      processData: [], //模板库数据
      rename_params: {
        group_id: '',
        group_name: ''
      },
      current_id: '',
      move_target: {},
      move_params: {
        group_id: '',
        process_id: ''
      },
      driver: null,
      sortVisible: false,
      duVisible: false,
      selectObj: {
        department: [],
        user: []
      },
      groupId: ''
    }
  },
  components: { GrounpSort, SelectDepartmentsAndPeople },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    userInfo(val) {
      if (val && val.close_process === 0) {
        this.guide()
      }
    }
  },
  created() {
    this.groupList()
  },
  mounted() {
    this.driver = new Driver({
      className: 'driver-popover',
      doneBtnText: '不再提示', // 结束按钮的文字
      animate: true,
      opacity: '0.6',
      padding: 10,
      allowClose: false, // 是否可以通过点击遮罩层关闭指引
      stageBackground: '#ffffff', // 突出显示元素的背景颜色
      nextBtnText: '下一步', // 下一步按钮的文字
      prevBtnText: '上一步', // 上一步按钮的文字
      closeBtnText: '关闭', // 关闭按钮的文字
      keyboardControl: false, // 是否允许键盘操控
      xCloseButton: false, // 将关闭按钮作为X放在弹出
      onNext: el => {
        if (el.options.element == '#add-flow') {
          this.closeTip()
        }
      }
    })
    if (this.userInfo && this.userInfo.close_process === 0) {
      this.guide()
    }
  },
  methods: {
    ...mapActions(['setUserInfo']),
    async updateReportPeopleFn(obj) {
      this.loading = true
      try {
        const { message } = await updatePromoter({
          process_id: this.groupId,
          promoter_params: obj
        })
        this.groupList()
        this._message(message, 'success')
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    updateReporter(item) {
      this.groupId = item.process_id
      this.selectObj.department = item.promoter_params.department
      this.selectObj.user = item.promoter_params.user
      this.duVisible = true
    },
    guide() {
      this.$nextTick(() => {
        this.driver.defineSteps(steps)
        this.driver.start()
      })
    },
    async closeTip() {
      try {
        await closeTip({ column: 'close_process' })
        let { data } = await userInfo({ auth: 'manageAuth' })
        this.setUserInfo(data) //用户信息保存到vuex
      } catch (error) {
        this._message(error)
      }
    },
    handleChange(val) {
      this.groupData.forEach(el => {
        this.$set(el, 'isExpend', false)
      })

      val.forEach(el => {
        this.$set(this.groupData[el - 1], 'isExpend', true)
      })
    },
    clearKeyword() {
      this.name = ''
      this.groupList()
    },
    async groupList() {
      this.loading = true
      try {
        let { data } = await groupList({ name: this.name })
        this.groupData = data
        let arr = []
        data.forEach(el => {
          arr = arr.concat(el.process)
        })
        this.processData = arr
        this.groupData.forEach(el => {
          el.isExpend = false
        })

        if (this.name.trim().length > 0) {
          this.activeNames = []
          this.groupData.forEach((el, i) => {
            this.activeNames.push(i + 1)
          })
          this.handleChange(this.activeNames)
        }
      } catch (error) {
        this._message(error)
      }
      this.loading = false
    },
    async groupAdd() {
      try {
        await groupAdd({ group_name: this.group_name })
        this.$message.success('新建分组成功')
        this.visible = false
        this.group_name = ''
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    },
    flowAdd() {
      this.flowVisible = false
      this.$router.push({
        path: '/applicationManagement/flowManage/add-flow?titletype=create'
      })
    },
    cancelAdd() {
      this.visible = false
      this.group_name = ''
    },
    rename(item) {
      this.dialogVisible = true
      this.rename_params.group_name = item.group_name
      this.rename_params.group_id = item.group_id
    },
    // 重命名
    async confirmRename() {
      try {
        await groupUpdate(this.rename_params)
        this.$message.success('重命名成功')
        this.dialogVisible = false
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    },
    async groupDel(id) {
      try {
        await groupDel({ group_id: id })
        this.$message.success('删除成功')
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    },
    delGrounp(item) {
      this.$confirm(`删除分组(${item.group_name}), 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.groupDel(item.group_id)
        })
        .catch(() => {})
    },
    // 停用或删除
    async changeStatus(item, num) {
      try {
        let { message } = await updateStatus({
          process_id: item.process_id,
          status: num
        })
        this.$message.success(message)
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    },
    editProcess(item) {
      this.$router.push({
        path: '/applicationManagement/flowManage/add-flow',
        query: {
          process_id: item.process_id
        }
      })
    },
    // 移动
    async openMove(item, el) {
      this.moveVisible = true
      this.current_id = item.group_id
      this.move_target = el
      this.move_params.group_id = item.group_id
      this.move_params.process_id = el.process_id
    },
    async moveGroup() {
      try {
        let { message } = await updateGroup(this.move_params)
        this.$message.success(message)
        this.moveVisible = false
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    }
  },
  activated() {
    // 刷新
    if (this.$route.query.refresh) {
      this.groupList()
    }
  }
}
</script>

<style scoped lang="scss">
.flow-module {
  padding: 10px;
  background-color: #fff;
  .flow-txt {
    font-size: 17px;
    font-weight: 600;
    color: #333;
    margin-right: 20px;
  }
  .flow-content {
    margin-top: 20px;
  }
  ::v-deep .el-collapse-item__header {
    margin-bottom: 5px;
  }
  .collapse_title {
    width: 100%;
    box-shadow: #eee 0px -1px 0px inset;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    background: #f1f1f1;
    padding-left: 10px;
    .right-icon {
      margin-right: 5px;
      transform: rotate(0deg);
      transition: all 0.2s;
      &.right-icon-active {
        transform: rotate(90deg);
      }
    }
    .group-length {
      font-size: 14px;
      color: #888;
    }
  }
  .no-data {
    text-align: center;
    font-size: 13px;
    color: #999;
    margin-top: 15px;
  }
  .collapse-box {
    display: flex;
    margin-left: 10px;
    padding: 10px 0px;
    .left {
      width: 60px;
      margin-right: 10px;
      .icon {
        margin: 0 auto;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        font-size: 30px;
        text-align: center;
        .guide-icon {
          width: 40px;
          height: 40px;
        }
      }
    }
    .center {
      flex: 1;
      line-height: 16px;
      p {
        line-height: 20px;
      }
    }
    .belong-area {
      flex: 1;
      padding: 0 15px;
      border-left: 1px solid #eee;
    }
    .right {
      margin-right: 10px;
      .el-button--mini,
      .el-button--small {
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
  .collapse-box + .collapse-box {
    border-top: 1px solid #eee;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: $themeColor;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  ::v-deep .el-collapse-item__arrow {
    display: none;
  }
  .move-content {
    padding: 10px 0px;
    border-bottom: 1px solid #eee;
  }
}
.add-title {
  border-bottom: 1px solid #f1f1f1;
  font-size: 16px;
  color: #333;
  padding-bottom: 15px;
}
.add-content {
  padding: 20px 0px;
}
</style>
