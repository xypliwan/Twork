<template>
  <div class="template-base">
    <slot></slot>
    <div class="fr">
      <el-input
        v-show="activeName == 'first'"
        clearable
        size="mini"
        placeholder="请输入内容"
        v-model="name"
        @keyup.enter.native="search"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search"
        ></i>
      </el-input>
      <el-input
        v-show="activeName == 'second'"
        clearable
        size="mini"
        placeholder="请输入内容"
        v-model="name1"
        @keyup.enter.native="search1"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search1"
        ></i>
      </el-input>
    </div>
    <div class="flow-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="模板库" name="first">
          <div class="no-data" v-if="!baseData.length">暂无数据</div>
          <ul class="scrollbar">
            <li v-for="(item, index) in baseData" :key="index">
              <div class="left">
                <div class="icon">
                  <!-- <div class="el-icon-s-claim"></div> -->
                  <img
                    class="guide-icon"
                    src="@/assets/images/guide_icon.png"
                    alt
                  />
                </div>
              </div>
              <div class="right">
                <h5>{{ item.name }}</h5>
                <p class="grayb">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="复制已有模板" name="second">
          <div class="no-data" v-if="!copyData.length">暂无数据</div>
          <ul class="scrollbar">
            <li v-for="(item, index) in copyData" :key="index">
              <div class="left">
                <div class="icon">
                  <img
                    class="guide-icon"
                    src="@/assets/images/guide_icon.png"
                    alt
                  />
                  <!-- <div class="el-icon-s-claim"></div> -->
                </div>
              </div>
              <div class="right">
                <h5>{{ item.name }}</h5>
                <p class="grayb">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    processData: Array
  },
  data() {
    return {
      activeName: 'first',
      baseData: [],
      copyData: [],
      name: '',
      name1: ''
    }
  },
  methods: {
    search() {
      if (this.name) {
        this.baseData = this.processData.filter(
          el => !el.name.indexOf(this.name)
        )
      } else {
        this.baseData = this.processData
      }
    },
    search1() {
      if (this.name1) {
        this.copyData = this.processData.filter(
          el => !el.name.indexOf(this.name1)
        )
      } else {
        this.copyData = this.processData
      }
    }
  }
}
</script>

<style scoped lang="scss">
.template-base {
  height: 100%;
  .flow-box {
    margin-top: 10px;
    ul {
      max-height: 400px;
      overflow-x: hidden;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      // justify-content: space-between;
      li {
        width: 155px;
        border: 1px solid #eee;
        border-radius: 5px;
        padding: 5px;
        margin-left: 10px;
        margin-top: 10px;
        display: flex;
        .left {
          width: 40px;
          margin-right: 5px;
          .icon {
            margin: 0 auto;
            width: 35px;
            height: 35px;
            line-height: 35px;
            border-radius: 8px;
            font-size: 30px;
            text-align: center;
            color: #fff;
            .guide-icon {
              width: 35px;
              height: 35px;
            }
          }
        }
        .right {
          flex: 1;
          h5,
          p {
            width: 75px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
          }
        }
      }
    }
  }
  .no-data {
    text-align: center;
    font-size: 13px;
    color: #999;
    margin-top: 30px;
  }
  .scrollbar {
  }
}
</style>
