import axios from '@/utils/axios'
//企业信息

// 企业信息
export function companyInfo(data) {
  return axios({
    url: `/company/info`,
    method: 'get',
    params: data
  })
}

// 获取企业信息
export function companySimpleInfo(data) {
  return axios({
    url: `/company/simple-info`,
    method: 'get',
    params: data
  })
}

//编辑企业信息
export function companyUpdate(data) {
  return axios({
    url: `/company/update`,
    method: 'post',
    data
  })
}
//绑定钉钉
export function bindingDingding(data) {
  return axios({
    url: `/company/binding-dingding`,
    method: 'post',
    data
  })
}
