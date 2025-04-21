import axios from 'axios'
import { baseUrl } from '@/config/index.js'
import router from '@/router'

// get请求
export const get = (url, params) => {
  return axios({
    method: 'get',
    baseURL: baseUrl,
    url,
    params
  })
}
// post请求
export const post = (url, data) => {
  return axios({
    method: 'post',
    baseURL: baseUrl,
    url,
    data
  })
}
// put请求
export const put = (url, data) => {
  return axios({
    method: 'put',
    baseURL: baseUrl,
    url,
    data
  })
}
// delete请求
export const del = (url, params) => {
  return axios({
    method: 'delete',
    baseURL: baseUrl,
    url,
    params
  })
}

// 每次在请求头上加上token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code === 401 || response.data.code === 402 || response.data.code === 403) {
        localStorage.clear()
        // 清空并跳转到登录页
        router.replace('/login').then(() => {
          location.reload()
        })
      }
      // 如果响应头里面有refresh-token字段且不为空，将其存入localStorage，覆盖掉token
      if (response.headers['refresh-token']) {
        localStorage.setItem('token', response.headers['refresh-token'])
      }
      return response
    }
  },
)