import { get, post, put, del } from '@/util/request.js'

// 测试
export const test = (name, age) => {
  return get('/test', { 'name': name, 'age': age })
}

// 登录
export const login = (user) => {
  return post('/auth/login', user)
}
