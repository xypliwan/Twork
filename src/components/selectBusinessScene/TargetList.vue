<template>
  <div class="">
    <div class="architecture-box">
      <el-row
        v-for="(item, j) in list"
        :key="j + timestamp + j"
        class="item-box"
      >
        <el-col :span="19">
          {{ item.label }}
        </el-col>
        <el-col :span="4" :offset="1" style="text-align:right;">
          <i class="el-icon-error close-icon" @click="clear(item)"></i>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array
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
    clear(item) {
      this.$emit('clearItem', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.item-box {
  padding: 6px 0;
  .close-icon {
    cursor: pointer;
  }
}
</style>
