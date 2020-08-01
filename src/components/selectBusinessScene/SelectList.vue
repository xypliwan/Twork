<template>
  <div class="">
    <div class="architecture-box" v-show="list.length">
      <div
        class="select-item"
        v-for="(item, j) in list"
        :key="j + timestamp + j"
        v-show="item.show"
      >
        <el-checkbox
          v-model="item.select"
          @change="
            e => {
              handleChangeUser(item, e)
            }
          "
        >
          <span>
            {{ item.label }}
          </span>
        </el-checkbox>
      </div>
    </div>
    <div class="no-data" v-show="!list.length">暂无数据</div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    keywords: String
  },
  data() {
    return {}
  },
  computed: {
    timestamp() {
      return new Date().getTime()
    }
  },
  methods: {
    hanldNext(item) {
      this.$emit('nextDepartment', item)
    },
    handleChangeUser(item, flg) {
      this.$delete(item, 'select')
      this.$set(item, 'select', flg)
      this.$emit('changeSelect', { item, flg })
    }
  }
}
</script>
<style lang="scss" scoped>
.select-item {
  padding: 6px 0;
}
.no-data {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #888;
}
</style>
