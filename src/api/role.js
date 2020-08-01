import axios from '@/utils/axios'
//角色权限 模块

// 角色列表
export function roleList() {
  return axios({
    url: `/role/list`,
    method: 'get'
  })
}
//企业角色基础数据
export function getQueryData(data) {
  return axios({
    url: `/role/get-query-data`,
    method: 'get',
    params: data
  })
}
//添加企业角色
export function roleAdd(data) {
  return axios({
    url: `/role/add`,
    method: 'post',
    data
  })
}
//编辑企业角色
export function roleUpdate(data) {
  return axios({
    url: `/role/update`,
    method: 'post',
    data
  })
}
//删除企业角色
export function roleDel(data) {
  return axios({
    url: `/role/del`,
    method: 'get',
    params: data
  })
}

//添加绑定角色成员
export function roleBindingUser(data) {
  return axios({
    url: `/role/binding-user`,
    method: 'post',
    data
  })
}
//获取角色成员
export function getRoleUser(data) {
  return axios({
    url: `/role/get-role-user`,
    method: 'get',
    params: data
  })
}
//获取角色权限
export function getRoleAuth(data) {
  return axios({
    url: `/role/get-role-auth`,
    method: 'get',
    params: data
  })
}
//编辑角色权限
export function bindingRoleAuth(data) {
  return axios({
    url: `/role/binding-auth`,
    method: 'post',
    data
  })
}

//获取企业权限列表(tree树)
export function authList() {
  return axios({
    url: `/auth/list`,
    method: 'get'
  })
}
