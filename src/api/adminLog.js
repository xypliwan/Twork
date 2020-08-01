import axios from '@/utils/axios'
//管理日志

// // 列表 废弃
// export function adminLogList(data) {
//   return axios({
//     url: `/administration-log/list`,
//     method: "post",
//     data
//   });
// }

// //日志基础数据 废弃
// export function logQueryData() {
//   return axios({
//     url: `/administration-log/get-query-data`,
//     method: "get"
//   });
// }

// 列表
export function operationLogList(data) {
  return axios({
    url: `/operation-log/list`,
    method: 'get',
    params: data
  })
}
// 查看操作日志条件
export function getListFilter() {
  return axios({
    url: `/operation-log/get-list-filter`,
    method: 'get'
  })
}
