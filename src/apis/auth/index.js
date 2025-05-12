import { get, post, put, del } from '@/util/request.js'

// 登录
export const login = (user) => {
  return post('/auth/login', user)
}

export const logout = () => {
  return post('/auth/logout')
}