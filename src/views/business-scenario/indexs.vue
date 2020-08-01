<template>
  <div class="business-scenario">
    <div class="business-scenario-box scrollbar">
      <business-scenario-search
        :groupData="groupData"
        @search="search"
      ></business-scenario-search>
      <section>
        <div class="add-btn">
          <span id="add-business-group">
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
                <el-button type="primary" size="mini" @click="settingGroupAdd"
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
            id="add-business-scene"
            class="fr"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="$router.push('/add-scenario?titleType=create')"
            >新增业务场景</el-button
          >
        </div>
        <div class="business-scenario-content" v-loading="loading">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item
              v-for="(item, index) in scenarioGroupData"
              :key="index"
              :name="index + 1"
            >
              <template slot="title">
                <div class="collapse_title">
                  <i
                    class="el-icon-arrow-right right-icon"
                    :class="item.isExpend ? 'right-icon-active' : ''"
                  ></i>
                  {{ item.name }}
                  <label class="group-length"
                    >( {{ item.setting.length }} )</label
                  >
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
              <div class="no-data" v-show="item.setting.length <= 0">
                暂无数据
              </div>
              <div
                class="collapse-box"
                v-for="(el, i) in item.setting"
                :key="i"
              >
                <div class="left">
                  <div class="icon">
                    <img
                      class="guide-icon"
                      src="@/assets/images/guide_icon.png"
                      alt
                    />
                  </div>
                  <div class="left-info">
                    <p>
                      <strong style="font-size: 14px">{{ el.name }}</strong>
                      &nbsp;
                      <span style="font-size: 12px" class="gray"
                        >({{ el.status_name }})</span
                      >
                    </p>
                    <p class="gray">
                      流程模块类型：<span class="theme-color">{{
                        el.process_name
                      }}</span>
                    </p>
                    <p class="gray">创建于:{{ el.created_at }}</p>
                  </div>
                </div>
                <div class="center">
                  <div>场景状态</div>
                  <el-switch
                    v-model="el.setting_status"
                    active-color="#13ce66"
                    inactive-color="#bfbfbf"
                    active-value="active"
                    inactive-value="stop"
                    @change="switchChange(el)"
                  >
                  </el-switch>
                </div>
                <div class="right">
                  <el-button
                    type="text"
                    size="small"
                    @click="
                      $router.push('/add-scenario?setting_id=' + el.setting_id)
                    "
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="openMove(item, el)"
                    >移动</el-button
                  >
                  >
                  <el-button type="text" size="small" @click="delScenario(el)"
                    >删除</el-button
                  >
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </section>
    </div>
    <el-dialog title="分组重命名" :visible.sync="dialogVisible" width="350px">
      <el-input
        placeholder="请输入"
        v-model="rename_params.name"
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
    <move-group
      :moveVisible.sync="moveVisible"
      :scenarioGroupData="scenarioGroupData"
      :move_target_group="move_target_group"
      :move_target="move_target"
      @refreshList="settingGroupList"
    ></move-group>
  </div>
</template>

<script>
//
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import {
  settingGroupAdd,
  settingGroupList,
  settingGroupUpdate,
  settingGroupDel,
  settingDelOrStopOrActive
} from '@/api/business-scenario'
import { groupList } from '@/api/flowManage'
import { closeTip } from '@/api/common'
import { userInfo } from '@/api/user'
import { mapGetters, mapActions } from 'vuex'
import BusinessScenarioSearch from './components/BusinessScenarioSearch'
import MoveGroup from './components/MoveGroup'
export default {
  name: 'BusinessScenario',
  components: { BusinessScenarioSearch, MoveGroup },
  data() {
    return {
      loading: false,
      visible: false,
      dialogVisible: false,
      moveVisible: false,
      move_target_group: {},
      move_target: {},
      activeNames: [],
      groupData: [],
      scenarioGroupData: [],
      group_name: '',
      rename_params: {
        name: '',
        s_group_id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    userInfo(val) {
      if (val && val.close_setting === 0) {
        this.guide()
      }
    }
  },
  created() {
    this.settingGroupList()
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
        if (el.options.element == '#add-business-scene') {
          this.closeTip()
        }
      }
    })
    if (this.userInfo && this.userInfo.close_setting === 0) {
      this.guide()
    }
  },
  methods: {
    ...mapActions(['setUserInfo']),
    guide() {
      this.$nextTick(() => {
        this.driver.defineSteps(steps)
        this.driver.start()
      })
    },
    async closeTip() {
      try {
        await closeTip({ column: 'close_setting' })
        let { data } = await userInfo({ auth: 'manageAuth' })
        this.setUserInfo(data) //用户信息保存到vuex
      } catch (error) {
        this._message(error)
      }
    },
    // 流程分组列表
    async groupList() {
      try {
        let { data } = await groupList()
        this.groupData = data
      } catch (error) {
        this._message(error)
      }
    },
    // 添加分组
    async settingGroupAdd() {
      try {
        await settingGroupAdd({ name: this.group_name })
        this.$message.success('新建分组成功')
        this.visible = false
        this.group_name = ''
        this.settingGroupList()
      } catch (error) {
        this._message(error)
      }
    },
    // 取消
    cancelAdd() {
      this.visible = false
      this.group_name = ''
    },
    // 重命名
    rename(item) {
      this.dialogVisible = true
      this.rename_params.name = item.name
      this.rename_params.s_group_id = item.s_group_id
    },
    // 确认
    async confirmRename() {
      try {
        await settingGroupUpdate(this.rename_params)
        this.$message.success('重命名成功')
        this.dialogVisible = false
        this.rename_params.name = ''
        this.settingGroupList()
      } catch (error) {
        this._message(error)
      }
    },
    // 分组删除接口
    async settingGroupDel(id) {
      try {
        await settingGroupDel({ s_group_id: id })
        this.$message.success('分组删除成功')
        this.settingGroupList()
      } catch (error) {
        this._message(error)
      }
    }, // 删除分组
    delGrounp(item) {
      this.$confirm(`删除分组(${item.name}), 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.settingGroupDel(item.s_group_id)
        })
        .catch(() => {})
    },
    // 分组列表
    search(params) {
      this.settingGroupList(params)
    },
    async settingGroupList(params) {
      this.loading = true
      try {
        let { data } = await settingGroupList(params)
        this.scenarioGroupData = data
        this.loading = false
      } catch (error) {
        this.loading = false
        this._message(error)
      }
    },
    handleChange(val) {
      this.scenarioGroupData.forEach(el => {
        delete el.isExpend
        this.$set(el, 'isExpend', false)
      })
      val.forEach(el => {
        this.$set(this.scenarioGroupData[el - 1], 'isExpend', true)
      })
    },
    //  stop 为停用 del 为删除 active 为启用
    async changeStatus(setting_id, action_code) {
      try {
        await settingDelOrStopOrActive({ setting_id, action_code })
        action_code == 'active' && this.$message.success('已激活')
        action_code == 'stop' && this.$message.warning('已停用')
        action_code == 'del' && this.$message.warning('已删除')
        this.settingGroupList()
      } catch (error) {
        this._message(error)
      }
    },
    // 开关
    switchChange(el) {
      this.changeStatus(el.setting_id, el.setting_status)
    },
    openMove(item, el) {
      this.move_target_group = item
      this.move_target = el
      this.moveVisible = true
    },

    delScenario(el) {
      this.$confirm('删除该业务场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.changeStatus(el.setting_id, 'del')
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss">
.business-scenario {
  height: 100%;
  overflow: hidden;
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  .business-scenario-box {
    height: 100%;
  }
  .add-btn {
    padding: 10px;
  }
  .business-scenario-content {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
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
        width: 300px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        .icon {
          margin: 0 auto;
          width: 50px;
          height: 50px;
          border-radius: 8px;
          font-size: 30px;
          text-align: center;
          color: #fff;
          .guide-icon {
            width: 50px;
            height: 50px;
          }
        }
        .left-info {
          flex: 1;
          margin-left: 10px;
          line-height: 16px;
          p {
            line-height: 20px;
          }
        }
      }
    }
    .collapse-box + .collapse-box {
      border-top: 1px solid #eee;
    }
    .center {
      flex: 1;
      padding: 0 20px;
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
    ::v-deep .el-collapse-item__header {
      margin-bottom: 5px;
    }
    ::v-deep .el-collapse-item__arrow {
      display: none;
    }
  }
}
.add-title {
  border-bottom: 1px solid #f1f1f1;
  font-size: 16px;
  color: #333;
  padding-bottom: 10px;
}
.add-content {
  padding: 20px 0px;
}
</style>
