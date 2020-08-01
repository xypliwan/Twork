<template>
  <div class="flow-box">
    <div class="fd-nav-content">
      <section class="dingflow-design">
        <div class="zoom">
          <div
            :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')"
            @click="zoomSize(1)"
          ></div>
          <span>{{ nowVal }}%</span>
          <div
            :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')"
            @click="zoomSize(2)"
          ></div>
        </div>
        <div
          class="box-scale"
          id="box-scale"
          :style="
            'transform: scale(' +
              nowVal / 100 +
              '); transform-origin: 50% 0px 0px;'
          "
        >
          <nodeWrap
            :allUsers="allUsers"
            :nodeConfig.sync="nodeConfig"
            :isTried.sync="isTried"
            :userList="allUserList"
          ></nodeWrap>
          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import testJson from './../../../../../../public/data.json'
import { userList } from '@/api/common'
import { mapGetters } from 'vuex'
export default {
  props: {
    allUsers: Array
  },
  components: {},
  data() {
    return {
      isTried: false, //流程是否设置完整
      tipList: [], //为设置未完整时的提示
      tipVisible: false, //提示flg
      nowVal: 100, //缩放初始值
      processConfig: {},
      nodeConfig: {},
      allUserList: [] //用户列表
    }
  },
  created() {
    this.userList()
    this.resetTreeData()
  },
  computed: {
    ...mapGetters(['promoterInfo'])
  },
  watch: {
    promoterInfo(newVal) {
      if (this.nodeConfig.type == 0) {
        Object.assign(this.nodeConfig.promoter, newVal)
      }
    }
  },
  activated() {
    let query = this.$route.query.titletype
    if (query && query == 'create') {
      this.resetTreeData()
    }
  },
  methods: {
    resetTreeData() {
      this.processConfig = JSON.parse(JSON.stringify(testJson.data))
      this.nodeConfig = this.processConfig
    },
    reErr(data) {
      if (data.child_node) {
        if (data.child_node.type == 1) {
          //审批人
          if (data.child_node.error) {
            this.tipList.push({
              name: data.child_node.node_name,
              type: '审核人'
            })
          }
          this.reErr(data.child_node)
        } else if (data.child_node.type == 2) {
          if (data.child_node.error) {
            this.tipList.push({
              name: data.child_node.node_name,
              type: '抄送人'
            })
          }
          this.reErr(data.child_node)
        } else if (data.child_node.type == 3) {
          this.reErr(data.child_node.child_node)
        } else if (data.child_node.type == 4) {
          this.reErr(data.child_node)
          for (var i = 0; i < data.child_node.condition_nodes.length; i++) {
            if (data.child_node.condition_nodes[i].error) {
              this.tipList.push({
                name: data.child_node.condition_nodes[i].node_name,
                type: '条件'
              })
            }
            this.reErr(data.child_node.condition_nodes[i])
          }
        }
      } else {
        data.child_node = null
      }
    },
    getFlowConfig() {
      return this.processConfig
    },
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return
        }
        this.nowVal -= 10
      } else {
        if (this.nowVal == 300) {
          return
        }
        this.nowVal += 10
      }
    },
    async userList() {
      try {
        let { data } = await userList()
        this.allUserList = data
      } catch (error) {
        this._message(error)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import './../../../../../assets/styles/flowCss/workflow.css';
.error-modal-list {
  width: 455px;
}
</style>
