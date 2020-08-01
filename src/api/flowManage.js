import axios from '@/utils/axios'
//流程管理

// 添加分组
export function groupAdd(data) {
  return axios({
    url: `/process-group/add`,
    method: 'post',
    data
  })
}

// 分组列表
export function groupList(data) {
  return axios({
    url: `/process-group/list`,
    method: 'get',
    params: data
  })
}

// 更新分组/重命名
export function groupUpdate(data) {
  return axios({
    url: `/process-group/update`,
    method: 'post',
    data
  })
}

// 删除分组
export function groupDel(data) {
  return axios({
    url: `/process-group/del`,
    method: 'post',
    data
  })
}
// 组件列表
export function processFromat() {
  return axios({
    url: `/common/process-fromat`,
    method: 'get'
  })
}

// 添加流程
export function processAdd(data) {
  return axios({
    url: `/process/add`,
    method: 'post',
    data
  })
}

//流程详情
export function processDetail(data) {
  return axios({
    url: `/process/detail`,
    method: 'get',
    params: data
  })
}
//流程编辑
export function processUpdate(data) {
  return axios({
    url: `/process/update`,
    method: 'post',
    data
  })
}

// 修改流程分组
export function updateGroup(data) {
  return axios({
    url: `/process/update-group`,
    method: 'post',
    data
  })
}
// 删除/停用流程
export function updateStatus(data) {
  return axios({
    url: `/process/update-status`,
    method: 'post',
    data
  })
}

/**
 * 数据导出模块
 */

// 查看(导出)审批列表
export function getList(data) {
  return axios({
    url: `/process-list/get-list`,
    method: 'get',
    params: data
  })
}

// 查看审批列表条件
export function getListFilter(data) {
  return axios({
    url: `/process-list/get-list-filter`,
    method: 'get',
    params: data
  })
}
// 导出审批列表文件操作日志
export function listExportLog(data) {
  return axios({
    url: `/operation-log/list-export-log`,
    method: 'get',
    params: data
  })
}

//设置分组排序
export function setSortList(data) {
  return axios({
    url: `process-group/set-sort`,
    method: 'post',
    data
  })
}

//更新发起人
export function updatePromoter(data) {
  return axios({
    url: `/process/update-promoter`,
    method: 'post',
    data
  })
}
