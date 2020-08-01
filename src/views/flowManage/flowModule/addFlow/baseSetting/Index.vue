<template>
  <div class="base-setting">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0px"
      size="small"
      class="demo-ruleForm"
    >
      <div style="margin-bottom: 5px;">
        <span class="red">*</span> 流程名称
        <span style="color:#bbb;font-size:12px">最多50字</span>
      </div>
      <el-form-item label prop="name">
        <el-input v-model="ruleForm.name" @input="handleChangeName"></el-input>
      </el-form-item>
      <div style="margin-bottom: 5px;"><span class="red">*</span> 流程图标</div>
      <el-form-item label prop="img">
        <div class="icon-wrapper">
          <img
            v-if="ruleForm.img.length"
            :src="require(`@/assets/images/flowimg/${ruleForm.img}`)"
            alt=""
            class="select-icon"
          />
          <el-popover placement="right" width="400" trigger="click">
            <div class="icon-box">
              <img
                :src="require(`@/assets/images/flowimg/${urlItem.url}`)"
                v-for="urlItem in flowIconList"
                :key="urlItem.url"
                @click="handleIcon(urlItem)"
                alt=""
                class="select-icon"
              />
            </div>
            <el-link slot="reference" type="primary">图标选择</el-link>
          </el-popover>
        </div>
      </el-form-item>

      <div style="margin-bottom: 5px;"><span class="red">*</span>选择分组</div>
      <el-form-item label prop="group_id">
        <el-select filterable v-model="ruleForm.group_id" placeholder="请选择">
          <el-option
            v-for="(item, index) in this.groupData"
            :key="index"
            :label="item.group_name"
            :value="Number(item.group_id)"
          ></el-option>
          <div class="add-grounp" @click="addGrounp">
            <i class="iconfont icon-xinjian"></i>
            <span>新增分组</span>
          </div>
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 5px;">谁可以发起这个流程</div>
      <el-form-item label>
        <el-input
          type="textarea"
          readonly
          autosize
          placeholder="请选择"
          v-model="ruleForm.promoter_params.txt"
          @focus="showSelectDom()"
          :disabled="produceCodeStore.length > 0"
        >
        </el-input>
      </el-form-item>
      <div style="margin-bottom: 5px;">
        流程所属系统
        <el-tooltip
          class="item"
          effect="dark"
          content="选择所属系统后，表单设计默认只能为富文本控件,且无法设置流程条件"
          placement="top"
        >
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <el-form-item label prop="product_code">
        <el-select
          filterable
          @change="handleChangeProduct"
          :disabled="isProcessDetail"
          v-model="ruleForm.product_code"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.product_name"
            :value="item.product_code"
          ></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 5px;">
        流程说明
        <span style="color:#bbb;font-size:12px">最多1000字</span>
      </div>
      <el-form-item label>
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
    </el-form>
    <select-departments-and-people
      :visible.sync="duVisible"
      @updateUser="updateUser"
      :originalData="ruleForm.promoter_params"
    ></select-departments-and-people>
  </div>
</template>

<script>
import { getDepartmentInfo } from '@/api/common'
import { roleList } from '@/api/role'
import { groupList, groupAdd } from '@/api/flowManage'
import { mapActions, mapGetters } from 'vuex'
import SelectDepartmentsAndPeople from '_c/selectDepartmentsAndPeople'

export default {
  props: {
    productList: Array
  },
  name: '',
  components: {
    SelectDepartmentsAndPeople
  },
  data() {
    return {
      duVisible: false,
      selectObj: {
        department: [],
        user: []
      },
      groupData: [], //分组
      allVisibleUser: [], //企业成员
      roleList: [], //角色列表
      ruleForm: {
        name: '',
        group_id: '',
        promoter: [], //id
        // promoter_params: [],
        desc: '',
        product_code: '', //产品代码
        img: '',
        promoter_params: {
          department: [],
          user: [],
          nameArr: [],
          txt: ''
        }
      },
      rules: {
        name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
        group_id: [{ required: true, message: '请选择', trigger: 'change' }],
        img: [{ required: true, message: '请选择' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'completeRouteUserStore',
      'isProcessDetail',
      'produceCodeStore',
      'flowIconList',
      'promoterInfo'
    ]),
    iconColor() {
      const item = this.flowIconList.find(el => el.icon == this.ruleForm.img)
      return item ? item.color : ''
    }
  },
  created() {
    this.getDepartmentInfo()
    this.getRoleList()
    this.groupList()
  },
  watch: {
    completeRouteUserStore() {
      //设置流程发起人 同步更新 基础设置发起人
      // this.ruleForm.promoter_params = newVal
      // this.ruleForm.promoter = newVal.map(el => el[el.length - 1])
      // this.$nextTick(() => {
      // let selectNodes = this.$refs.baseCasederRef.getCheckedNodes()
      // let jionName = selectNodes.map(el => `${el.label} `).join('')
      // this.setPromoterNameStore(jionName)
      // })
    },
    produceCodeStore(newVal) {
      if (newVal.length > 0) {
        Object.assign(
          this.ruleForm.promoter_params,
          this.$options.data().ruleForm.promoter_params
        )
        this.setPromoterInfo(this.$options.data().ruleForm.promoter_params)
        let item = this.productList.find(el => el.product_code == newVal)
        if (item) {
          this.setPromoterNameStore(`所属系统:${item.product_name}`)
        }
      } else {
        this.setPromoterNameStore('')
      }
    },
    promoterInfo(newVal) {
      Object.assign(this.ruleForm.promoter_params, newVal)
      this.ruleForm.promoter_params.txt = newVal.nameArr.join('、')
    }
  },
  methods: {
    ...mapActions([
      'setCompleteRouteUserStore',
      'setPromoterNameStore',
      'setProduct',
      'setPromoterInfo'
    ]),
    async groupAdd(name) {
      try {
        await groupAdd({ group_name: name })
        this.$message.success('新建分组成功')
        this.groupList()
      } catch (error) {
        this._message(error)
      }
    },
    addGrounp() {
      this.$prompt('', '请输入分组名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入分组名'
      })
        .then(({ value }) => {
          this.groupAdd(value)
        })
        .catch(() => {})
    },
    updateUser(obj) {
      Object.assign(this.ruleForm.promoter_params, obj)
      this.ruleForm.promoter_params.txt = obj.nameArr.join('、')
      //还需更新store的setPromoterNameStore
      this.setPromoterInfo(obj)
    },
    showSelectDom() {
      this.duVisible = true
    },
    submitForm() {
      return new Promise(resolve => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve({ valid: true, data: this.ruleForm })
          } else {
            resolve({ valid: false, data: this.ruleForm })
            return false
          }
        })
      })
    },
    handleIcon(item) {
      this.ruleForm.img = item.url
    },
    handleChangeProduct() {
      this.setProduct(this.ruleForm.product_code)
    },
    handleChangeName() {
      this.$emit('changeProcessName', this.ruleForm.name)
    },
    async groupList() {
      this.loading = true
      try {
        let { data } = await groupList({ name: this.name })
        this.groupData = data
      } catch (error) {
        this._message(error, 'message')
      }
      this.loading = false
    },
    // 角色列表
    async getRoleList() {
      try {
        let { data } = await roleList()
        this.roleList = data
      } catch (error) {
        this._message(error)
      }
    },
    //获取部门和人员
    async getDepartmentInfo() {
      try {
        let { data } = await getDepartmentInfo({ 'get-people': 1 })
        let userArr = JSON.parse(JSON.stringify(data))
        this.allVisibleUser = this.formateAllVisibleUser(userArr)

        this.$emit('getAllUser', this.allVisibleUser)
      } catch (error) {
        this._message(error)
      }
    },
    pushData(obj) {
      let item = {
        department_id: obj.user_id,
        department_name: obj.username,
        user_id: obj.user_id,
        user_name: obj.username
      }
      return item
    },
    // 处理企业成员信息
    formateAllVisibleUser(arr) {
      arr.forEach(el => {
        if (el.children) {
          if (el.people && el.people.length > 0) {
            el.people.forEach(peopleItem => {
              el.children.push(this.pushData(peopleItem))
            })
          }
          this.formateAllVisibleUser(el.children)
        } else {
          if (el.people && el.people.length > 0) {
            el['children'] = []
            el['disabled'] = false
            el.people.forEach(peopleItem => {
              el['children'].push(this.pushData(peopleItem))
            })
          } else {
            if (el.user_id) {
              el['disabled'] = false
            } else {
              el['disabled'] = true
              el.department_name = `${el.department_name}(暂无成员)`
            }
          }
        }
      })

      return arr
    }
  }
}
</script>

<style scoped lang="scss">
.base-setting {
  height: 100%;
  width: 50%;
  width: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;

  .demo-ruleForm {
    margin: 0 auto;
    width: 500px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
  .icon-wrapper {
    display: flex;
    align-items: center;
    .select-icon {
      margin: 10px;
      width: 30px;
    }
  }
}
.icon-box {
  word-wrap: break-word;
  .select-icon {
    width: 30px;
    margin: 10px;
  }
}
.add-grounp {
  cursor: pointer;
  text-align: center;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  color: #444;
  border-top: 1px solid #f1f1f1;
  .iconfont {
    font-size: 13px;
    margin-right: 8px;
  }
}
</style>
