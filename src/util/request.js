import axios from 'axios'
import {baseUrl} from '@/config/index.js'
import router from '@/router'
import qs from 'qs'

// get请求
export const get = (url, params) => {
    return axios({
        method: 'get',
        baseURL: baseUrl,
        url,
        params,
        paramsSerializer: (params) => {
            return qs.stringify(params, {arrayFormat: 'repeat'});
        },
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
        params,
        paramsSerializer: (params) => {
            return qs.stringify(params, {arrayFormat: 'repeat'});
        },
    })
}

// 下载文件
export const download = (url, params) => {
    return axios({
        method: 'get',
        baseURL: baseUrl,
        url,
        params,
        responseType: 'blob'
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
        const code = response.data.code
        if (code === 401 || code === 402 || code === 403) {
            localStorage.clear()
        }
        // 如果响应头里面有refresh-token字段且不为空，将其存入localStorage，覆盖掉token
        if (response.headers['refresh-token']) {
            localStorage.setItem('token', response.headers['refresh-token'])
        }
        return response
    },
    error => {
        if (error.response) {
            const status = error.response.status
            if (status === 404) {
                this.$message.error("请求的资源不存在")
                // 跳转到自定义 404 页面
                router.push('/404')
            }
        }
        return Promise.reject(error)
    },
)