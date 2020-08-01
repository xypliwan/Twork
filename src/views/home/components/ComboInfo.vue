<template>
  <el-dialog
    :visible="comboVisible"
    width="1000px"
    @close="handleClose"
    v-loading="loading"
    custom-class="test"
  >
    <div class="combo-info-content">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in comboData" :key="index" :span="8">
          <div class="col-box">
            <div class="col-box-top" :style="{ '--bgc': item.bgc }">
              <strong>{{ item.versions }}</strong>
              <p>{{ item.range_decs }}</p>
              <span class="ver_desc">{{ item.ver_desc }}</span>
            </div>
            <div class="col-box-center">
              <p class="col-box-center-money">￥ {{ item.money }}</p>
              <strong>{{ item.time_range }}</strong>
              <p class="gray">{{ item.range }}</p>
            </div>
            <div class="col-box-bottom">
              <span>应用支持</span>
              <ul>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon-wodemubiao theme-color"></i>
                  <span class="theme-color">OKR管理</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">流程管理(集成ERP业务推送)</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">协同动态</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">支持小程序</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">日程</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon-guanliyuanbidu theme-color"></i>
                  <span class="theme-color">汇报</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">推送跨境资源</span>
                </li>
                <li>
                  <i class="el-icon-check"></i>
                  <i class="iconfont icon--liuchengguanli theme-color"></i>
                  <span class="theme-color">集成易仓客户服务</span>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="sys-desc">
        <p>您可以在这里进行公司内部的流程闭环...</p>
        <p>您可以在这里实时关注运营情况，及时提醒及时闭环...</p>
        <p>您可以在这里享受易仓软件服务服务闭环，提工单、需求、客诉...</p>
        <p>您可以在这里找易仓的联合资源（平台、资源、物流）...</p>
        <p>您可以在这里衡量自己的行业健康指标，找服务（顾问服务）...</p>
        <p>...</p>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    comboVisible: Boolean
  },
  data() {
    return {
      loading: false,
      comboData: [
        {
          versions: '免费版本',
          range_decs: '适合5人以下团队应用',
          money: '0',
          time_range: '人/年',
          range: '5人以下免费',
          bgc: '#8bcfaf',
          ver_desc: 'FREE'
        },
        {
          versions: '标准版本',
          range_decs: '适合规模5-20的团队应用',
          money: '399',
          time_range: '人/年',
          range: '>5人以上',
          bgc: '#ce8f8b',
          ver_desc: '标准'
        },
        {
          versions: '旗舰版本',
          range_decs: '适合规模大于30人的精细化管理',
          money: '8800',
          time_range: '/年',
          range: '人数不限',
          bgc: '#e1794c',
          ver_desc: '旗舰'
        }
      ]
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:comboVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.combo-info-content {
  .col-box {
    display: flex;
    flex-direction: column;
    border: 1px solid #eee;
    &:hover {
      box-shadow: 0px 0px 10px;
    }
    .col-box-top {
      line-height: 20px;
      text-align: center;
      padding: 10px;
      background-color: #4c68d4;
      position: relative;
      color: #fff;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border: 23px solid #4c68d4;
        border-right-color: var(--bgc); //
        border-top-color: var(--bgc); //
        // height: 20px;
        // width: 10px;
        // transform: rotate(-50deg);
      }
      .ver_desc {
        position: absolute;
        top: 6px;
        right: 0;
        z-index: 1;
        transform: rotate(45deg);
        font-size: 12px;
      }
    }
    .col-box-center {
      line-height: 24px;
      padding: 20px;
      text-align: center;
      position: relative;
      &::after {
        width: 96%;
        height: 1px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 5px;
        clear: both;
        content: '';
        display: block;
        background-color: #eee;
        // background-color: var(--bgc);
      }
      .col-box-center-money {
        font-weight: bolder;
        font-size: 22px;
      }
    }
    .col-box-bottom {
      flex: 1;
      padding: 10px;
      line-height: 24px;
      color: #808080;
      ul {
        li {
          i {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .sys-desc {
    padding: 30px 20px;
    text-align: center;
    font-weight: bold;
    line-height: 30px;
  }
  .el-icon-check {
    color: #7ab594;
    font-weight: bolder;
  }
}
</style>
