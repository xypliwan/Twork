import axios from '@/utils/axios'
//业务场景模块

// 列表
export function settingGroupList(data) {
  return axios({
    url: `/setting-group/list`,
    method: 'get',
    params: data
  })
}
// 添加分组
export function settingGroupAdd(data) {
  return axios({
    url: `/setting-group/add`,
    method: 'post',
    data
  })
}
// 更新分组
export function settingGroupUpdate(data) {
  return axios({
    url: `/setting-group/update`,
    method: 'post',
    data
  })
}
// 删除分组
export function settingGroupDel(data) {
  return axios({
    url: `/setting-group/del`,
    method: 'post',
    data
  })
}
// 增加业务场景
export function settingAdd(data) {
  return axios({
    url: `/setting/add`,
    method: 'post',
    data
  })
}
// 业务场景详情
export function settingDetail(data) {
  return axios({
    url: `/setting/detail`,
    method: 'get',
    params: data
  })
}
// 编辑业务场景
export function settingUpdate(data) {
  return axios({
    url: `/setting/update`,
    method: 'post',
    data
  })
}
// 删除停用启用业务场景
export function settingDelOrStopOrActive(data) {
  return axios({
    url: `/setting/del-or-stop-or-active`,
    method: 'post',
    data
  })
}
// 修改业务场景分组
export function settingMoveToGroup(data) {
  return axios({
    url: `/setting/move-to-group`,
    method: 'post',
    data
  })
}

// 获取系统业务场景类型
export function getSystemSetting(data = {}) {
  return axios({
    url: `/setting/system-setting`,
    method: 'get',
    params: data
  })
}

// 获取系统业务场景数组
export function getSystemSettingArr(data = {}) {
  return axios({
    url: `/setting/system-setting-arr`,
    method: 'get',
    params: data
  })
}

//同步系统数据
export function asyncSystemData(data = {}) {
  return axios({
    url: `/setting/clear-cache`,
    method: 'get',
    params: data
  })
}
