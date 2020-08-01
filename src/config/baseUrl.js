/* eslint-disable */

let baseURL = {
  requestUrl: '', //twork客户端接口地址
  receptionUrl: '' //返回前台地址
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.VUE_APP_FLAG === 'pro') {
    //production 生产环境(正式)
    baseURL.requestUrl = 'http://tw-api.ecgtool.com'
    baseURL.receptionURL = 'http://tw.ecgtool.com/#/home'
  } else if (process.env.VUE_APP_FLAG === 'test') {
    //test 测试环境
    baseURL.requestUrl = 'http://tw-api-test.ecgtool.com'
    baseURL.receptionURL = 'http://tw-test.ecgtool.com/#/home'
  }
} else {
  //dev 开发环境
  baseURL.requestUrl = 'http://tw-api-test.ecgtool.com'
  baseURL.receptionURL = '自行打开项目填写跳转地址'
}
/* eslint-disable */
export default baseURL
