import { get, post, put, del } from '@/util/request.js'

// 登录
export const login = (user) => {
  return post('/auth/login', user)
}

export const loginWithCode = (user) => {
  return post('/auth/login/code', user)
}

export const logout = () => {
  return post('/auth/logout')
}

export const forgetPassword = (params) => {
  return post('/auth/forget', params)
}