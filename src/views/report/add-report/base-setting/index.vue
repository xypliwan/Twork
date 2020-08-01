<template>
  <div class="base-setting">
    <el-form
      :model="ruleForm"
      ref="baseRuleForm"
      label-width="0px"
      size="small"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-row>
        <el-col :span="18">
          <div style="margin-bottom: 5px;">
            <span class="red">*</span> 汇报名称
            <span style="color:#bbb;font-size:12px">最多20字</span>
          </div>
          <el-form-item
            label
            prop="report_name"
            :rules="[{ required: true, message: '请输入' }]"
          >
            <el-input
              clearable
              v-model="ruleForm.report_name"
              placeholder="请输入汇报名称"
              maxlength="20"
              @input="handleReportName"
            ></el-input>
          </el-form-item>
          <div style="margin-bottom: 5px;">
            <span class="red">*</span>汇报分组
          </div>
          <el-form-item label prop="group_id" :rules="[{ required: true }]">
            <el-select
              filterable
              v-model="ruleForm.group_id"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in grounpList"
                :key="index"
                :label="item.name"
                :value="item.group_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-form-item
            label
            prop="icon"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <div class="select-icon">
              <div class="icon-box">
                <i
                  style="font-size:40px"
                  class="iconfont"
                  :class="ruleForm.icon"
                  :style="{ color: ruleForm.color }"
                ></i>
              </div>
              <el-popover placement="right-start">
                <i
                  v-for="(iconItem, i) in iconList"
                  :key="i"
                  class="iconfont report-icon"
                  style="font-size:40px;margin: 0 5px;cursor: pointer;"
                  :class="iconItem.icon"
                  :style="{ color: iconItem.color }"
                  @click="handleIcon(iconItem)"
                ></i>
                <el-button plain size="mini" slot="reference"
                  >选择图标</el-button
                >
              </el-popover>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label prop="create_report_people.create_report_people_txt">
        <div style="margin-bottom: 5px;">汇报人员</div>
        <el-input
          type="textarea"
          readonly
          autosize
          placeholder="请选择"
          v-model="ruleForm.create_report_people.create_report_people_txt"
          @focus="showSelectDom('create_report_people')"
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label
        prop="receive_report_people.receive_report_people_txt"
      >
        <div style="margin-bottom: 5px;">
          汇报固定对象
        </div>
        <el-input
          type="textarea"
          readonly
          autosize
          placeholder="请选择"
          v-model="ruleForm.receive_report_people.receive_report_people_txt"
          @focus="showSelectDom('receive_report_people')"
        >
        </el-input>
      </el-form-item>

      <el-form-item label prop="check_report_people.check_report_people_txt">
        <div style="margin-bottom: 5px;">
          汇报查阅人
          <span style="color:#bbb;font-size:12px">指定汇报查阅人</span>
        </div>
        <el-input
          type="textarea"
          readonly
          autosize
          placeholder="请选择"
          v-model="ruleForm.check_report_people.check_report_people_txt"
          @focus="showSelectDom('check_report_people')"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="selectObj"
    ></select-departments-and-people>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'
export default {
  props: {
    grounpList: Array
  },
  components: {
    SelectDepartmentsAndPeople
  },
  data() {
    return {
      belongWhoComs: '', // 'create_report_people'汇报人员 'receive_report_people'查阅固定对象 'check_report_people'汇报查阅人
      ruleForm: {
        color: '',
        report_name: '', //汇报名
        group_id: '', // 汇报组
        icon: '', //图标
        create_report_people: {
          // 汇报人员
          department: [],
          user: [],
          nameArr: [],
          create_report_people_txt: '' //汇报人员中文
        },
        receive_report_people: {
          //汇报固定对象
          department: [],
          user: [],
          nameArr: [],
          receive_report_people_txt: '' //汇报固定对象中文
        },
        check_report_people: {
          //汇报查阅人
          department: [],
          user: [],
          nameArr: [],
          check_report_people_txt: '' //汇报查阅人中文
        }
      },
      duVisible: false,
      rules: {
        'receive_report_people.receive_report_people_txt': [
          { required: true, message: '请选择' }
        ],
        'create_report_people.create_report_people_txt': [
          { required: true, message: '请选择' }
        ]
      },
      selectObj: {
        department: [],
        user: []
      }
    }
  },
  computed: {
    ...mapGetters(['iconList', 'architectList'])
  },
  watch: {
    duVisible(newVal) {
      if (!newVal) {
        this.selectObj.department = []
        this.selectObj.user = []
      }
    }
  },
  methods: {
    updateUser(obj) {
      if (this.belongWhoComs == 'create_report_people') {
        //汇报人员
        Object.assign(this.ruleForm.create_report_people, obj)
        this.ruleForm.create_report_people.create_report_people_txt = obj.nameArr.join(
          '、'
        )
      } else if (this.belongWhoComs == 'receive_report_people') {
        //查阅固定对象
        Object.assign(this.ruleForm.receive_report_people, obj)
        this.ruleForm.receive_report_people.receive_report_people_txt = obj.nameArr.join(
          '、'
        )
      } else if (this.belongWhoComs == 'check_report_people') {
        //汇报查阅人
        Object.assign(this.ruleForm.check_report_people, obj)
        this.ruleForm.check_report_people.check_report_people_txt = obj.nameArr.join(
          '、'
        )
      }
    },
    showSelectDom(txt) {
      this.belongWhoComs = txt
      if (this.belongWhoComs == 'create_report_people') {
        //汇报人员
        this.selectObj
        Object.assign(this.selectObj, this.ruleForm.create_report_people)
      } else if (this.belongWhoComs == 'receive_report_people') {
        //查阅固定对象
        Object.assign(this.selectObj, this.ruleForm.receive_report_people)
      } else if (this.belongWhoComs == 'check_report_people') {
        //汇报查阅人
        Object.assign(this.selectObj, this.ruleForm.check_report_people)
      }
      this.duVisible = true
    },
    handleReportName() {
      this.$emit('changeName', this.ruleForm.report_name)
    },
    initData(obj) {
      Object.assign(this.ruleForm, obj)
      this.ruleForm.color = this.iconList.find(el => el.icon == obj.icon).color
    },
    vilidata() {
      return new Promise(resolve => {
        this.$refs.baseRuleForm.validate(flg => {
          if (!flg) {
            this.$refs.baseRuleForm.clearValidate()
            resolve({ hasError: true, data: this.ruleForm })
            return
          }
          resolve({ hasError: false, data: this.ruleForm })
        })
      })
    },
    reset() {
      this.$refs.baseRuleForm.resetFields()
      setTimeout(() => {
        this.$refs.baseRuleForm.resetFields()
      }, 80)
    },
    handleIcon(item) {
      this.ruleForm.icon = item.icon
      this.ruleForm.color = item.color
    }
  }
}
</script>
<style lang="scss" scoped>
.base-setting {
  height: 100%;
  width: 50%;
  width: 700px;
  padding: 20px 100px;
  margin: 0 auto;
  background-color: #fff;
  .select-icon {
    height: 100px;
    text-align: center;
    border: 1px solid #f1f1f1;
    border-radius: 3px;
    margin-top: 23px;
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
    }
  }
  .demo-ruleForm {
    margin: 0 auto;
    width: 500px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
}
</style>
