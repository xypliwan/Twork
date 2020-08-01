<template>
  <div>
    <!-- nodeConfig.type!=4  类型为 ：审批人、抄送人时   0为发起人-->
    <div class="node-wrap" v-if="nodeConfig.type != 4">
      <div
        class="node-wrap-box"
        :class="
          (nodeConfig.type == 0 ? 'start-node ' : '') +
            (isTried && nodeConfig.error ? 'active error' : '')
        "
      >
        <div>
          <div
            class="title"
            :style="
              'background: rgb(' +
                ['87, 106, 149', '255, 148, 62', '85, 113, 205'][
                  nodeConfig.type
                ] +
                ');'
            "
          >
            <span class="iconfont" v-show="nodeConfig.type == 1"></span>
            <span class="iconfont" v-show="nodeConfig.type == 2"></span>
            {{ nodeConfig.node_name }}
            <!-- 删除当前node -->
            <i
              class="anticon anticon-close close"
              v-if="nodeConfig.type != 0"
              @click="delNode()"
            ></i>
          </div>
          <div class="content" @click="setPerson">
            <div class="text" v-if="nodeConfig.type == 0">
              <!-- <span :title="nodeConfig.promoter_name">{{nodeConfig.promoter_name.length > 0 ? nodeConfig.promoter_name : '请选择发起人'}}</span> -->

              <!-- <span :title="promoterNameStore">{{
                promoterNameStore.length > 0
                  ? promoterNameStore
                  : '请选择发起人'
              }}</span> -->
              <span :title="promoterInfo.nameArr.join('、')">{{
                promoterInfo.nameArr.length > 0
                  ? promoterInfo.nameArr.join('、')
                  : '请选择发起人'
              }}</span>
            </div>
            <div class="text" v-if="nodeConfig.type == 1">
              <span>{{
                nodeConfig.approver_name.trim().length &lt;= 0
                  ? '请选择处理人'
                  : nodeConfig.approver_name
              }}</span>
            </div>
            <div class="text" v-if="nodeConfig.type == 2">
              <span :title="nodeConfig.cc_people.nameArr.join('、')">{{
                nodeConfig.cc_people.nameArr.length > 0
                  ? nodeConfig.cc_people.nameArr.join('、')
                  : '请选择抄送人'
              }}</span>
            </div>
            <i class="anticon anticon-right arrow"></i>
          </div>
        </div>
      </div>
      <addNode :childNodeP.sync="nodeConfig.child_node"></addNode>
    </div>

    <!-- nodeConfig.type=4  类型为 ：条件时 -->
    <div class="branch-wrap" v-if="nodeConfig.type == 4">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button class="add-branch" @click="addTerm">添加条件</button>
          <div
            class="col-box"
            v-for="(item, index) in nodeConfig.condition_nodes"
            :key="index"
          >
            <div class="condition-node">
              <div class="condition-node-box">
                <div
                  class="auto-judge"
                  :class="isTried && item.error ? 'error active' : ''"
                >
                  <!-- 条件左移动 -->
                  <div
                    class="sort-left"
                    title="左移动"
                    v-if="index != 0"
                    @click="arrTransfer(index, -1)"
                  >
                    &lt;
                  </div>
                  <div class="title-wrapper">
                    <!-- {{ item.node_name }} -->
                    <el-input
                      class="condition-name"
                      v-model="item.node_name"
                    ></el-input>
                    <span
                      class="priority-title"
                      @click="setPerson(item.priority_level)"
                      >优先级{{ item.priority_level }}</span
                    >
                    <!-- 删除节点 -->
                    <i
                      class="anticon anticon-close close"
                      @click="delTerm(index)"
                    ></i>
                  </div>

                  <!-- 条件右移动 -->
                  <div
                    class="sort-right"
                    title="右移动"
                    v-if="index != nodeConfig.condition_nodes.length - 1"
                    @click="arrTransfer(index)"
                  >
                    &gt;
                  </div>
                  <!-- <div class="content" @click="setPerson(item.priority_level)">{{conditionStr(item,index)}}</div> -->
                  <div
                    class="content"
                    @click="setPerson(item.priority_level)"
                    v-html="
                      item.condition_content_txt
                        ? item.condition_content_txt
                        : '请设置条件'
                    "
                  >
                    <!-- {{
                      item.condition_content_txt
                        ? item.condition_content_txt
                        : '请设置条件'
                    }} -->
                  </div>
                </div>
                <addNode :childNodeP.sync="item.child_node"></addNode>
              </div>
            </div>

            <!-- 递归调用 -->
            <!-- 作用：条件下面添加审批人等等 -->
            <nodeWrap
              v-if="item.child_node && item.child_node"
              :nodeConfig.sync="item.child_node"
              :isTried.sync="isTried"
              :userList="userList"
            ></nodeWrap>

            <!-- 条件线条 -->
            <div class="top-left-cover-line" v-if="index == 0"></div>
            <div class="bottom-left-cover-line" v-if="index == 0"></div>
            <div
              class="top-right-cover-line"
              v-if="index == nodeConfig.condition_nodes.length - 1"
            ></div>
            <div
              class="bottom-right-cover-line"
              v-if="index == nodeConfig.condition_nodes.length - 1"
            ></div>
          </div>
        </div>

        <!-- 添加节点类型：审批人、抄送人、条件 -->
        <addNode :childNodeP.sync="nodeConfig.child_node"></addNode>
      </div>
    </div>

    <!-- 发起人 -->
    <sponsor
      :promoterDrawer.sync="promoterDrawer"
      :promoterConfig="promoterConfig"
      :allUsers="allUsers"
      @saveSponsor="saveSponsor"
    ></sponsor>

    <!-- 处理人设置 -->
    <approver
      :approverDrawer.sync="approverDrawer"
      :userList="userList"
      :approverConfig="approverConfig"
      @saveApprover="saveApprover"
    ></approver>

    <!-- 抄送人设置 -->
    <cc-people
      :copyerDrawer.sync="copyerDrawer"
      :userList="userList"
      :copyerConfig="copyerConfig"
      @saveCcpeople="saveCcpeople"
    ></cc-people>

    <condition
      :conditionDrawer.sync="conditionDrawer"
      :conditionConfig="conditionConfig"
      @saveCondition="saveCondition"
    ></condition>

    <!-- 递归调用 -->
    <!-- 作用：添加审批人等等 -->
    <nodeWrap
      v-if="nodeConfig.child_node && nodeConfig.child_node"
      :nodeConfig.sync="nodeConfig.child_node"
      :isTried.sync="isTried"
      :userList="userList"
    ></nodeWrap>
  </div>
</template>
<script>
// 节点类型  0发起人  1处理人  2抄送人 3条件  4条件路由

//发起人
import Sponsor from './sponsor'
//抄送人
import CcPeople from './ccPeople'
//审批人
import Approver from './approver'
//条件
import Condition from './condition'

import { mapGetters } from 'vuex'
export default {
  props: ['nodeConfig', 'isTried', 'userList', 'allUsers'],
  data() {
    return {
      placeholderList: ['发起人', '审核人', '抄送人'],
      isInput: false,
      promoterDrawer: false,
      approverDrawer: false,
      copyerDrawer: false,
      promoterConfig: {}, //发起人配置
      approverConfig: {}, //审批人配置
      copyerConfig: {}, //抄送人配置

      conditionDrawer: false, //条件弹框
      conditionConfig: {},
      conditionsConfig: {
        //当前条件配置
        condition_nodes: [] //点击的当前的条件数组
      },
      condition_list: [],
      bPriorityLevel: ''
    }
  },
  mounted() {},
  components: {
    CcPeople,
    Approver,
    Sponsor,
    Condition
  },
  computed: {
    ...mapGetters(['promoterNameStore', 'produceCodeStore', 'promoterInfo'])
  },
  methods: {
    savePromoter() {
      this.promoterDrawer = false
    },
    saveSponsor(obj) {
      Object.assign(this.nodeConfig, obj)
    },
    //保存审批人时
    saveApprover(obj) {
      console.log(obj, '22')
      Object.assign(this.nodeConfig, obj)
      this.approverDrawer = false
    },
    //保存抄送人
    saveCcpeople(obj) {
      Object.assign(this.nodeConfig, obj)
    },
    conditionStr() {
      // var { condition_list, node_user_list } = item;
      // if (condition_list.length == 0) {
      //   return index == this.nodeConfig.condition_nodes.length - 1 &&
      //     this.nodeConfig.condition_nodes[0].condition_list.length != 0
      //     ? "其他条件进入此流程"
      //     : "请设置条件";
      // } else {
      //   let str = "";
      //   for (var i = 0; i < condition_list.length; i++) {
      //     var { columnId, zdy1, zdy2 } = condition_list[i];
      //     if (columnId == 0) {
      //       if (node_user_list.length != 0) {
      //         str += "发起人属于：";
      //         str +=
      //           node_user_list
      //             .map(item => {
      //               return item.name;
      //             })
      //             .join("或") + " 并且 ";
      //       }
      //     }
      //   }
      //   return str ? str.substring(0, str.length - 4) : "请设置条件";
      // }
    },
    saveCondition(obj) {
      this.conditionConfig.condition_form_config = obj.list
      if (this.conditionConfig.condition_form_config.length > 0) {
        this.conditionConfig.condition_content_txt = obj.dec
      } else {
        this.conditionConfig.condition_content_txt = '请设置条件'
      }

      // this.conditionDrawer = false;
      // for (var i = 0; i < this.conditionsConfig.condition_nodes.length; i++) {
      //   this.conditionsConfig.condition_nodes[i].error =
      //     this.conditionStr(this.conditionsConfig.condition_nodes[i], i) ==
      //       "请设置条件" &&
      //     i != this.conditionsConfig.condition_nodes.length - 1;
      // }
      // this.$emit("update:nodeConfig", this.conditionsConfig);

      // this.conditionDrawer = false;
      // var a = this.conditionsConfig.conditionNodes.splice(
      //   this.bPriorityLevel - 1,
      //   1
      // ); //截取旧下标
      // this.conditionsConfig.conditionNodes.splice(
      //   this.conditionConfig.priorityLevel - 1,
      //   0,
      //   a[0]
      // ); //填充新下标
      // this.conditionsConfig.conditionNodes.map((item, index) => {
      //   item.priorityLevel = index + 1;
      // });
      // for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
      //   this.conditionsConfig.conditionNodes[i].error =
      //     this.conditionStr(this.conditionsConfig.conditionNodes[i], i) ==
      //       "请设置条件" &&
      //     i != this.conditionsConfig.conditionNodes.length - 1;
      // }
      this.$emit('update:nodeConfig', this.conditionsConfig)
    },
    //删除审批人/发起人等等
    delNode() {
      this.$emit('update:nodeConfig', this.nodeConfig.child_node)
    },
    //添加条件
    addTerm() {
      // this.nodeConfig.condition_nodes.push({
      //   node_name: "条件",
      //   type: 3,
      //   condition_list: [],
      //   node_user_list: [],
      //   child_node: null
      // });
      // this.$emit("update:nodeConfig", this.nodeConfig);

      let len = this.nodeConfig.condition_nodes.length + 1
      this.nodeConfig.condition_nodes.push({
        node_name: '条件' + len,
        type: 3,
        priority_level: len,
        condition_list: [],
        node_user_list: [],
        child_node: null,
        condition_form_config: [],
        condition_content_txt: ''
      })

      // for (var i = 0; i < this.nodeConfig.condition_nodes.length; i++) {
      //   this.nodeConfig.condition_nodes[i].error =
      //     this.conditionStr(this.nodeConfig.condition_nodes[i], i) ==
      //       "请设置条件" && i != this.nodeConfig.condition_nodes.length - 1;
      // }
      this.$emit('update:nodeConfig', this.nodeConfig)
    },
    //删除条件数组的节点
    delTerm(index) {
      this.nodeConfig.condition_nodes.splice(index, 1)
      for (var i = 0; i < this.nodeConfig.condition_nodes.length; i++) {
        this.nodeConfig.condition_nodes[i].error =
          this.conditionStr(this.nodeConfig.condition_nodes[i], i) ==
            '请设置条件' && i != this.nodeConfig.condition_nodes.length - 1
      }
      this.$emit('update:nodeConfig', this.nodeConfig)
      if (this.nodeConfig.condition_nodes.length == 1) {
        if (this.nodeConfig.child_node) {
          if (this.nodeConfig.condition_nodes[0].child_node) {
            this.reData(
              this.nodeConfig.condition_nodes[0].child_node,
              this.nodeConfig.child_node
            )
          } else {
            this.nodeConfig.condition_nodes[0].child_node = this.nodeConfig.child_node
          }
        }
        this.$emit(
          'update:nodeConfig',
          this.nodeConfig.condition_nodes[0].child_node
        )
      }
    },
    reData(data, addData) {
      if (!data.child_node) {
        data.child_node = addData
      } else {
        this.reData(data.child_node, addData)
      }
    },
    //点击流程item时
    setPerson(priority_level) {
      var { type } = this.nodeConfig
      //点击发起人时
      if (type == 0) {
        if (this.produceCodeStore.length > 0) return
        this.promoterDrawer = true
        this.promoterConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      } else if (type == 1) {
        //点击为审批人
        this.approverDrawer = true
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      } else if (type == 2) {
        //点击为抄送人
        this.copyerDrawer = true
        this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      } else {
        //条件
        this.conditionDrawer = true
        this.bPriorityLevel = priority_level
        this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig))
        this.conditionConfig = this.conditionsConfig.condition_nodes[
          priority_level - 1
        ]
      }
    },
    //条件左右移动
    arrTransfer(index, type = 1) {
      //向左-1,向右1
      this.nodeConfig.condition_nodes[
        index
      ] = this.nodeConfig.condition_nodes.splice(
        index + type,
        1,
        this.nodeConfig.condition_nodes[index]
      )[0]
      this.nodeConfig.condition_nodes.map((item, index) => {
        item.priority_level = index + 1
      })
      for (var i = 0; i < this.nodeConfig.condition_nodes.length; i++) {
        this.nodeConfig.condition_nodes[i].error =
          this.conditionStr(this.nodeConfig.condition_nodes[i], i) ==
            '请设置条件' && i != this.nodeConfig.condition_nodes.length - 1
      }
      this.$emit('update:nodeConfig', this.nodeConfig)
    }
  }
}
</script>
<style scoped lang="scss">
.title-wrapper {
  display: flex;
  align-items: center;
  .condition-name {
    flex: 1;
    margin-right: 5px;
    ::v-deep .el-input__inner {
      height: 25px;
      font-size: 12px;
      border: 1px solid #fff;
      padding: 0 5px;
      &:hover {
        color: #3296fa;
        border: 1px solid #dcdfe6;
      }
    }
  }
}
</style>
