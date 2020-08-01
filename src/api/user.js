import axios from '@/utils/axios'
//用户模块

// 登陆
export function login(data = {}) {
  return axios({
    url: `/login/login`,
    method: 'post',
    data
  })
}
// 获取用户信息
export function userInfo(data) {
  return axios({
    url: `/user/info`,
    method: 'get',
    params: data
  })
}

// 获取登录用户角色权限
export function getUserAuth() {
  return axios({
    url: `/auth/get-user-auth`,
    method: 'post'
  })
}

// // 退出登陆
// export function logout(data = {}) {
//   return axios({
//     url: `/logout`,
//     method: "get"
//   });
// }

//获取用户列表（分页 ,详情
export function departmentUserList(data = {}) {
  return axios({
    // url: `/user/department-user-list`,
    url: `/department/user-list`,
    method: 'get',
    params: data
  })
}
//免密修改用户密码
export function modifyPassword(data) {
  return axios({
    url: `/user/modify-password-with-auth`,
    method: 'post',
    data
  })
}
//用户列表
export function userList(data) {
  return axios({
    url: `/user/list`,
    method: 'get',
    params: data
  })
}
//停用/激活用户
export function setUserStatus(data) {
  return axios({
    url: `/user/set-user-status`,
    method: 'post',
    data
  })
}
