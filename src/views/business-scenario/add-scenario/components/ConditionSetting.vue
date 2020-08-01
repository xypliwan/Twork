<template>
  <div class="condition-setting" v-loading="formLoading">
    <header>
      <el-button
        type="primary"
        size="mini"
        :disabled="!typeData.length"
        @click="asyncSystemDataFn"
        >同步{{ systemName }}数据</el-button
      >
      <span class="el-icon-time color9"> 上次同步时间：{{ asyncTime }}</span>
    </header>
    <section>
      <div class="section-left">
        <!-- <el-input
          class="search-input"
          size="small"
          placeholder="请输入内容"
          v-model="title"
          @keyup.enter.native="search"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="search"
          ></i>
        </el-input> -->
        <div
          class="section-left-type"
          v-for="(item, index) in typeData"
          :key="index"
        >
          <div
            class="section-left-type-title pointer"
            @click="item.isRotate = !item.isRotate"
          >
            <span
              class="rotate el-icon-caret-bottom"
              :class="{ 'rotate-active': item.isRotate }"
            ></span>
            {{ item.name }}
          </div>
          <ul :class="{ 'ul-close ': item.isRotate }">
            <li v-for="(el, i) in item.types" :key="i">
              <el-radio v-model="scenesType" :label="el.value">{{
                el.name
              }}</el-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="section-right" v-loading="rightLoading">
        <div class="no-data" v-if="scenesType == ''">请先选择业务场景</div>
        <!-- 销售统计 saleStatistic -->
        <sales-statistics
          v-if="scenesType == 'saleStatistic'"
          :list="formList"
          :scenesType="scenesType"
          ref="salesStatisticsRef"
        ></sales-statistics>
      </div>
    </section>
  </div>
</template>

<script>
import {
  getSystemSetting,
  getSystemSettingArr,
  asyncSystemData
} from '@/api/business-scenario'
import SalesStatistics from './comdition-type/SalesStatistics'
export default {
  name: '',
  props: {
    systemCode: String,
    detailData: Object,
    productList: Array
  },

  data() {
    return {
      isRotate: false,
      title: '',
      typeData: [
        // {
        //   name: '订单',
        //   isRotate: false,
        //   types: [
        //     { id: 1, name: '订单状态超时提醒', value: xxx },
        //     { id: 2, name: '发货超期提醒' },
        //     { id: 3, name: '订单待发货超时' }
        //   ]
        // }
      ],
      formLoading: false,
      scenesType: '',
      rightLoading: false,
      formList: [],
      formData: {},
      asyncTime: ''
    }
  },
  computed: {
    systemName() {
      if (this.productList.length && this.systemCode !== '') {
        return this.productList.find(el => el.product_code == this.systemCode)
          .product_name
      }
      return ''
    }
  },
  watch: {
    systemCode() {
      this.scenesType = ''
      this.getSystemSetting()
    },
    scenesType(newVal) {
      if (newVal == '') return
      this.getSystemSettingArr()
    },
    detailData(newVal) {
      this.scenesType = newVal.system_setting_config.setting_code
      if (this.scenesType == 'saleStatistic') {
        this.$nextTick(() => {
          this.$refs.salesStatisticsRef.initData(newVal.system_setting_config)
        })
      }
    }
  },
  methods: {
    async asyncSystemDataFn() {
      this.formLoading = true
      try {
        await asyncSystemData({ product_code: this.systemCode })
        this.getSystemSetting()
        this.scenesType = ''
      } catch (error) {
        this._message(error)
      }
      this.formLoading = false
    },
    async vilidata() {
      if (this.scenesType == 'saleStatistic') {
        this.formData = await this.$refs.salesStatisticsRef.submitForm()
      }
      return this.formData
    },
    async getSystemSettingArr() {
      this.rightLoading = true
      try {
        let { data } = await getSystemSettingArr({
          product_code: this.systemCode,
          setting_code: this.scenesType
        })
        this.formList = data
      } catch (error) {
        this._message(error)
      }
      this.rightLoading = false
    },
    async getSystemSetting() {
      this.formLoading = true
      this.typeData = []
      try {
        let {
          data: { arr, time }
        } = await getSystemSetting({ product_code: this.systemCode })
        this.typeData = arr
        this.asyncTime = time
      } catch (error) {
        this._message(error)
      }
      this.formLoading = false
    },
    search() {},
    initData() {
      this.scenesType = ''
      this.formList = []
    }
  },
  components: {
    SalesStatistics
  }
}
</script>

<style scoped lang="scss">
.condition-setting {
  height: 100%;
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  header {
    margin-bottom: 15px;
    span {
      margin-left: 15px;
    }
  }
  section {
    border: 1px solid #eee;
    border-radius: 6px;
    height: calc(100% - 45px);
    display: flex;
    .section-left {
      width: 280px;
      padding: 20px;
      border-right: 1px solid #eee;
      .search-input {
        margin-bottom: 20px;
      }
      .section-left-type {
        .section-left-type-title {
          font-weight: bold;
          margin: 10px 0px 5px;
          .rotate {
            transition: all 0.2s ease-in;
          }
          .rotate-active {
            transform: rotate(180deg);
          }
        }
        ul {
          border-left: 1px solid #eee;
          padding-left: 10px;
          transition: all 0.2s ease-in;
          max-height: 200px;
          overflow: hidden;
          li {
            padding: 5px;
          }
          &.ul-close {
            max-height: 0px;
          }
        }
      }
    }
    .section-right {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      .no-data {
        text-align: center;
        margin-top: 50px;
        color: #999;
        font-size: 13px;
      }
    }
  }
}
</style>
