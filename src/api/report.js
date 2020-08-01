import axios from '@/utils/axios'
//汇报 模块

// 添加分组
export function addReportGroup(data = {}) {
  return axios({
    url: `/report-group/add`,
    method: 'post',
    data
  })
}

//获取分组列表
export function getReportList(data = {}) {
  return axios({
    url: `/report-group/list`,
    method: 'get',
    params: data
  })
}

// 添加汇报模板
export function addReport(data = {}) {
  return axios({
    url: `/report/add`,
    method: 'post',
    data
  })
}

// 更新模板信息
export function updateReport(data = {}) {
  return axios({
    url: `/report/update`,
    method: 'post',
    data
  })
}

// 更新分组名
export function updateGrounpName(data = {}) {
  return axios({
    url: `/report-group/update-name`,
    method: 'post',
    data
  })
}

// 删除分组
export function delGrounp(data = {}) {
  return axios({
    url: `/report-group/del`,
    method: 'post',
    data
  })
}

// 移动汇报分组
export function moveGrounp(data = {}) {
  return axios({
    url: `/report/move-group`,
    method: 'post',
    data
  })
}

// 删除/停用/启用 汇报
export function updateReportStatus(data = {}) {
  return axios({
    url: `/report/update-status`,
    method: 'post',
    data
  })
}

// 汇报模板详情
export function reportDetail(data = {}) {
  return axios({
    url: `/report/detail`,
    method: 'get',
    params: data
  })
}

// 更新汇报人员
export function updateReportPeople(data = {}) {
  return axios({
    url: `/report/update-create-report-people`,
    method: 'post',
    data
  })
}
