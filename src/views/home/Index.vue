<template>
  <div class="home">
    <div class="flex">
      <div class="flex-left">
        <div>
          <img :src="companyData.logo_path" alt />
          <div>
            <p>
              企业人数：
              <strong>{{ companyData.people_num }}人</strong>
            </p>
            <p>
              部门个数：
              <strong>{{ companyData.department_num }}个</strong>
            </p>
            <!-- <p>
              昨日使用人数：
              <strong>0人</strong>
            </p>-->
          </div>
          <div>
            超级管理员：<span class="fr">
              <el-tooltip
                class="item"
                effect="dark"
                :content="
                  companyData.admin_people
                    ? companyData.admin_people.join('，')
                    : ''
                "
                placement="top"
              >
                <el-tag type="success" size="mini" style="margin-left:0"
                  >{{ companyData.admin_people && companyData.admin_people[0] }}
                  <span
                    v-if="
                      companyData.admin_people &&
                        companyData.admin_people.length > 1
                    "
                    >+{{ companyData.admin_people.length - 1 }}</span
                  >
                </el-tag>
                <!-- <el-tag
                  v-if="companyData.admin_people.length == 1"
                  type="success"
                  size="mini"
                  style="margin-left:0"
                  >{{ companyData.admin_people[0] }}</el-tag
                > -->
              </el-tooltip>
            </span>
          </div>
          <div>
            套餐信息<span class="fr theme-color pointer" @click="openCombo">{{
              companyData.version_name
            }}</span>
          </div>
        </div>
      </div>
      <div class="flex-right">
        <div class="carousel">
          <el-carousel height="300px">
            <el-carousel-item v-for="(item, index) in imgs" :key="index">
              <a :href="item.redirect_url" target="_blank">
                <img
                  width="100%"
                  height="100%"
                  :src="item.img_url"
                  alt
                  @click="recordAd"
                />
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-divider></el-divider>
        <div class="convenient-entrance">
          <h4>快捷入口</h4>
          <el-row :gutter="20">
            <!-- <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer">
                <span class="iconfont iconzhongx"></span>
                <strong>Banner管理</strong>
              </div>
            </el-col>-->
            <!-- <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer">
                <span class="iconfont iconguanggaopai" style="color:#56bdfe"></span>
                <strong>广告管理</strong>
              </div>
            </el-col>-->
            <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div
                class="block-box pointer"
                @click="$router.push('/applicationManagement/flowManage')"
              >
                <!-- <span class="iconfont iconicon-liucheng" style="color:#528dff"></span> -->
                <i
                  class="iconfont icon--liuchengguanli"
                  style="font-size:30px; color:#2e5ed9"
                ></i>
                <strong>流程管理</strong>
              </div>
            </el-col>
            <!-- <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer">
                <span class="iconfont iconmubiao" style="color:red"></span>
                <strong>OKR</strong>
              </div>
            </el-col>-->
            <!-- <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer">
                <span class="iconfont icondianzan" style="color:#56bdfe"></span>
                <strong>认可</strong>
              </div>
            </el-col>-->
            <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer" @click="toRolePermission">
                <!-- <span class="iconfont iconshezhi" style="color:#56bdfe"></span> -->
                <i
                  class="iconfont icon--jiaoseguanli"
                  style="font-size:30px;color: #fd933d"
                ></i>
                <strong>角色权限</strong>
              </div>
            </el-col>
            <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div
                class="block-box pointer"
                @click="$router.push('/business-scenario')"
              >
                <i
                  class="iconfont icon-shichangsaomiao"
                  style="font-size:30px;color: #15bb83"
                ></i>
                <strong>业务场景</strong>
              </div>
            </el-col>
            <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="block-box pointer" @click="toReport">
                <i
                  class="iconfont icon-guanliyuanbidu"
                  style="font-size:30px;color: #2e5ed9"
                ></i>
                <strong>汇报管理</strong>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <combo-info :comboVisible.sync="comboVisible"></combo-info>
  </div>
</template>

<script>
import { companySimpleInfo } from '@/api/companyInfo'
import { listAllUrl, adAddLog } from '@/api/common'
import ComboInfo from './components/ComboInfo'

export default {
  name: 'Home',
  components: {
    ComboInfo
  },
  data() {
    return {
      comboVisible: false,
      companyData: {},
      imgs: []
    }
  },
  created() {
    this.getCompanyInfo()
    this.getAdList()
  },
  methods: {
    // 获取首页广告
    async getAdList() {
      try {
        let { data } = await listAllUrl()
        this.imgs = data
      } catch (error) {
        this._message(error)
      }
    },
    async getCompanyInfo() {
      try {
        let { data } = await companySimpleInfo()
        this.companyData = data
      } catch (error) {
        this._message(error)
      }
    },
    toReport() {
      this.$router.push('/report/report-management')
    },
    toRolePermission() {
      this.$router.push('/systemSetting/rolePermission')
    },
    async recordAd(item) {
      try {
        adAddLog({ ad_id: item.ad_id, type: 1 })
      } catch (error) {
        this._message(error)
      }
    },
    openCombo() {
      this.comboVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  box-sizing: border-box;
  height: 100%;
  .flex {
    display: flex;
    height: 100%;
    .flex-left {
      width: 250px;
      padding: 20px 30px;
      background-color: #fff;
      line-height: 30px;
      img {
        width: 100%;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
    }
    .flex-right {
      flex: 1;
      margin-left: 10px;
      background-color: #fff;
      .carousel {
        padding: 30px;
        width: 80%;
        margin: 0 auto;
        ::v-deep .el-carousel__container {
          border-radius: 5px;
          overflow: hidden;
        }
      }
      .convenient-entrance {
        padding: 0 20px;
        margin-top: -10px;
        h4 {
          margin-bottom: 10px;
        }
        .block-box {
          display: flex;
          align-items: center;
          padding: 10px;
          height: 60px;
          border: 1px solid #eee;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 20px;
          span {
            font-size: 18px;
            margin-right: 10px;
          }
          i {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
