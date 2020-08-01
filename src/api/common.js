import axios from '@/utils/axios'
//公共接口

// 企业用户列表
export function userList() {
  return axios({
    url: `/user/list`,
    method: 'get'
  })
}

// 部门信息和相关人员
export function getDepartmentInfo(data = {}) {
  return axios({
    url: `/department/info`,
    method: 'get',
    params: data
  })
}

//获取产品信息
export function getProduct(data = {}) {
  return axios({
    url: `/common/get-product`,
    method: 'get',
    params: data
  })
}

//前台及后台管理系统首页广告
export function listAllUrl() {
  return axios({
    url: `/ad/list-all-url`,
    method: 'get'
  })
}

//添加广告访问量
export function adAddLog(data = {}) {
  return axios({
    url: `/ad/add-log`,
    method: 'post',
    data
  })
}
//关闭用户提示框 close_wx_tips  微信  close_process 流程  close_setting 业务场景  close_report汇报
export function closeTip(data = {}) {
  return axios({
    url: `/user/close-tips`,
    method: 'post',
    data
  })
}
