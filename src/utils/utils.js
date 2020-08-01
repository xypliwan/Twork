import axios from '@/utils/exportAxios'

//获取地址栏参数
export function getUrlKey(name) {
  return (
    decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(
        location.href
      ) || [, ''])[1].replace(/\+/g, '%20')
    ) || null
  )
}

export function isPone(phone) {
  let phones = Number(phone)
  let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!myreg.test(phones)) {
    return false
  } else {
    return true
  }
}

export function formatMessage(data) {
  let message = ''
  if (Array.isArray(data)) {
    data.forEach(el => {
      message += `<p>${el}</p>`
    })
  } else {
    message = `<p>${data}</p>`
  }
  return message
}

//根据数组的某个key值去重
export function arrDeWeight(arr, key) {
  let result = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      result.push(arr[i])
      obj[arr[i][key]] = true
    }
  }
  return result
}

export function formateExcl(url, methods, data = {}, title) {
  axios({
    method: methods,
    url, // 请求地址
    params: data,
    data, // 参数
    responseType: 'blob' //  表明返回服务器返回的数据类型  这里注意要加上responseType
  })
    .then(res => {
      // 处理返回的文件流
      // 注意 返回的res 无需做任何处理，有时在用框架封装的请求之后会出现返回response.text() 等情况导致文件流下载失败。
      const content = res
      const blob = new Blob([content])
      const fileName = title + '.csv'
      const alink = document.createElement('a')
      alink.download = fileName
      alink.style.display = 'none'
      alink.href = URL.createObjectURL(blob) // 这里是将文件流转化为一个文件地址
      document.body.appendChild(alink)
      alink.click()
      URL.revokeObjectURL(alink.href) // 释放URL 对象
      document.body.removeChild(alink)
    })
    .catch(error => {
      this._message(error)
    })
}

//判断当前是上午、下午、还是晚上
//上午0  下午1  晚上2
export function isMorAorN() {
  let index = null
  let nowHours = new Date().getHours()
  if (nowHours > 6 && nowHours < 12) {
    index = 0
  } else if (nowHours >= 12 && nowHours < 18) {
    index = 1
  } else {
    index = 2
  }
  return index
}

export function deepClone(source) {
  //数组对象深克隆
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// function pushData(obj) {
//   let item = {
//     department_id: obj.user_id,
//     department_name: obj.username,
//     user_id: obj.user_id,
//     user_name: obj.username
//   }
//   return item
// }

// 处理企业成员信息
export function formateAllUser(arr) {
  arr.forEach(el => {
    el['select'] = false
    if (el.children) {
      if (el.people && el.people.length > 0) {
        el.people.forEach(peopleItem => {
          peopleItem['select'] = false
        })
      }
      formateAllUser(el.children)
    } else {
      if (el.people && el.people.length > 0) {
        el['children'] = []
        el['disabled'] = false
        el.people.forEach(peopleItem => {
          peopleItem['select'] = false
        })
      }
    }
  })
  return arr
}

/**
 * @arr { Array } 原始组织架构数据
 * @userData { Object } 用户的历史数据
 * { department部门: Array, user人员信息: Array, nameArr中文名: Array } = userData
 * @obj { Object } 返回最新的组织架构人员信息
 */
export function resetDepartmentAndUserFromId(arr, userData) {
  let obj = JSON.parse(JSON.stringify(userData))
  obj.nameArr = []
  recursiveFn(arr, obj)
  let departmentNamrArr = obj.department.map(el => el.department_name)
  let userNameArr = obj.user.map(el => el.username)
  obj.nameArr = [...departmentNamrArr, ...userNameArr]
  obj['txt'] = obj.nameArr.join('、')
  return obj
}

function recursiveFn(arr, obj) {
  arr.forEach(el => {
    if (el.people) {
      el.people.forEach(peopleItem => {
        obj.user.forEach(userItem => {
          if (peopleItem.user_id == userItem.user_id) {
            userItem.username = peopleItem.username
          }
        })
      })
    }
    obj.department.forEach(departmentItem => {
      if (el.department_id == departmentItem.department_id) {
        departmentItem.department_name = el.department_name
      }
    })
    if (el.children) {
      recursiveFn(el.children, obj)
    }
  })
}
