<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" v-model="visible">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType(1)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>处理人</p>
          </a>
          <a class="add-node-popover-item notifier" @click="addType(2)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>抄送人</p>
          </a>
          <a
            class="add-node-popover-item condition"
            @click="addType(4)"
            v-show="produceCodeStore.length <= 0"
          >
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <button class="btn" type="button" slot="reference">
          <span class="iconfont"></span>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: ['childNodeP'],
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters(['produceCodeStore'])
  },
  methods: {
    addType(type) {
      this.visible = false
      if (type != 4) {
        var data
        if (type == 1) {
          data = {
            node_name: '处理人',
            type: 1,
            child_node: this.childNodeP,
            node_user_list: [],
            approver: [],
            deal_approver: 2,
            approver_name: '',
            have_check: 1,
            can_add_check: 1,
            check: []
          }
        } else if (type == 2) {
          data = {
            node_name: '抄送人',
            type: 2,
            child_node: this.childNodeP,
            node_user_list: [],
            cc_people: {
              department: [],
              user: [],
              nameArr: []
            },
            can_select_cc_people: 1
          }
        }
        this.$emit('update:childNodeP', data)
      } else {
        this.$emit('update:childNodeP', {
          node_name: '路由',
          type: 4,
          child_node: null,
          condition_nodes: [
            {
              node_name: '条件1',
              type: 3,
              priority_level: 1,
              condition_list: [],
              node_user_list: [],
              child_node: this.childNodeP,
              condition_form_config: [],
              condition_content_txt: '' //条件秒速
            },
            {
              node_name: '条件2',
              type: 3,
              priority_level: 2,
              condition_list: [],
              node_user_list: [],
              child_node: null,
              condition_form_config: [],
              condition_content_txt: ''
            }
          ]
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.condition {
  position: relative;
}
</style>
