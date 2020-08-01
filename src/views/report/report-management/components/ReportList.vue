<template>
  <div v-loading="listLoading">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="(item, index) in reportList"
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
            <label class="group-length">( {{ item.report.length }} )</label>
            <span class="fr" style="margin-right:10px">
              <el-dropdown>
                <span class="el-dropdown-link" @click.stop>
                  编辑
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native.stop="rename(item)"
                    >重命名</el-dropdown-item
                  >
                  <el-dropdown-item @click.native.stop="delGrounpFn(item)"
                    >删除该组</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
        </template>
        <div class="no-data" v-show="item.report.length <= 0">暂无数据</div>
        <div class="collapse-box" v-for="(el, i) in item.report" :key="i">
          <div class="left">
            <div class="icon">
              <i
                class="iconfont guide-icon"
                :class="el.icon"
                :style="{ color: getIconColor(el.icon) }"
              ></i>
            </div>
          </div>
          <div class="center">
            <p>
              <strong style="font-size: 14px">{{ el.report_name }}</strong>
              &nbsp;
              <span style="font-size: 12px" class="gray"
                >({{ el.status == '1' ? '已启用' : '已停用' }})</span
              >
            </p>
            <p class="gray">创建于:{{ el.created_at }}</p>
          </div>
          <div class="belong-area">
            <p>汇报人员</p>
            <p class="gray">
              <el-tooltip
                effect="dark"
                :content="el.create_report_people.nameArr.join('、')"
                placement="top"
              >
                <span v-if="el.create_report_people.nameArr.length >= 3">
                  {{ el.create_report_people.nameArr[0] }}
                  {{ el.create_report_people.nameArr[1] }}
                  {{ el.create_report_people.nameArr[2] }}
                  等
                  {{ el.create_report_people.nameArr.length }} 人
                </span>
                <span v-else>
                  {{ el.create_report_people.nameArr.join(' ') }}
                  {{ el.create_report_people.nameArr.length }} 人
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
            <el-button type="text" size="small" @click="editReport(el)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="openMove(el)"
              >移动</el-button
            >
            <el-dropdown>
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="changeStatus(el.report_id, el.status)"
                  >{{ el.status == '1' ? '停用' : '启用' }}</el-dropdown-item
                >
                <el-dropdown-item
                  @click.native="changeStatus(el.report_id, '0')"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <grounp-rename
      :visible.sync="renameNameVisible"
      :id="grounpId"
      :renameName="renameName"
      @renameOk="renameOk"
    ></grounp-rename>

    <move-grounp
      :reportList="reportList"
      :visible.sync="moveVisible"
      :currentId="moveCurrentId"
      @moveOk="moveOk"
    ></move-grounp>

    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateReportPeopleFn"
      :originalData="selectObj"
    ></select-departments-and-people>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { delGrounp, updateReportStatus, updateReportPeople } from '@/api/report'
import GrounpRename from './GrounpRename'
import MoveGrounp from './MoveGrounp'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'

export default {
  props: {
    reportList: Array
  },
  data() {
    return {
      activeNames: [],
      renameNameVisible: false,
      renameName: '',
      grounpId: '',
      listLoading: false,
      moveVisible: false,
      moveCurrentId: '',
      duVisible: false,
      selectObj: {
        department: [],
        user: []
      },
      reportId: ''
    }
  },
  computed: {
    ...mapGetters(['iconList', 'architectList'])
  },
  methods: {
    updateReporter(item) {
      this.reportId = item.report_id
      this.selectObj.department = item.create_report_people.department
      this.selectObj.user = item.create_report_people.user
      this.duVisible = true
    },
    updateUser(obj) {
      this.reportList.forEach(el => {
        el.report.forEach(ev => {
          if (ev.report_id == this.reportId) {
            Object.assign(ev.create_report_people, obj)
          }
        })
      })
    },
    async updateReportPeopleFn(params) {
      let info = {
        report_id: this.reportId,
        create_report_people: params
      }
      info.create_report_people.create_report_people_txt = params.nameArr.join(
        '、'
      )
      this.listLoading = true
      try {
        let { message } = await updateReportPeople(info)
        this.updateUser(params)
        this._message(message, 'success')
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    editReport(item) {
      this.$router.push(`/report/add-report?reportid=${item.report_id}`)
    },
    moveOk() {
      this.$emit('moveOk')
    },
    renameOk(data) {
      const item = this.reportList.find(el => el.group_id == data.group_id)
      item.name = data.name
    },
    changeStatus(id, status) {
      /* eslint-disable */
      let snapStatus
      if (status !== '0') {
        snapStatus = status == '1' ? '2' : '1'
      } else {
        snapStatus = status
      }
      this.updateReportStatusFn(id, snapStatus)
      /* eslint-disable */
    },
    async updateReportStatusFn(id, status) {
      this.listLoading = true
      try {
        let { message } = await updateReportStatus({ report_id: id, status })
        this._message(message, 'success')

        this.reportList.forEach(el => {
          el.report.forEach((ev, j) => {
            if (ev.report_id == id) {
              if (status == '0') {
                el.report.splice(j, 1)
              } else {
                ev.status = status
              }
            }
          })
        })
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    openMove(el) {
      this.moveVisible = true
      this.moveCurrentId = el.report_id
    },
    delGrounpFn(item) {
      this.$confirm(`删除分组 (${item.name}), 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delGrounp(item.group_id)
        })
        .catch(() => {})
    },
    async delGrounp(id) {
      this.listLoading = true
      try {
        const { message } = await delGrounp({ group_id: id })
        this._message(message, 'success')
        this.reportList.splice(
          this.reportList.findIndex(el => el.group_id == id),
          1
        )
      } catch (error) {
        this._message(error)
      }
      this.listLoading = false
    },
    rename(item) {
      this.renameNameVisible = true
      this.renameName = item.name
      this.grounpId = item.group_id
    },
    handleChange(val) {
      this.reportList.forEach(el => {
        this.$set(el, 'isExpend', false)
      })
      val.forEach(el => {
        this.$set(this.reportList[el - 1], 'isExpend', true)
      })
    },
    getIconColor(icon) {
      return this.iconList.find(el => el.icon == icon).color
    }
  },
  components: {
    GrounpRename,
    MoveGrounp,
    SelectDepartmentsAndPeople
  }
}
</script>
<style lang="scss" scoped>
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
::v-deep .el-collapse-item__header {
  margin-bottom: 5px;
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
      width: 50px;
      height: 50px;
      border-radius: 8px;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .guide-icon {
        font-size: 40px;
      }
    }
  }
  .center {
    width: 300px;
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
</style>
