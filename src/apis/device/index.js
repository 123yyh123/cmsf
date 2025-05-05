import { get, post, put, del } from '@/util/request.js'

const baseUrl = '/device'

export const getDevicePageList = (params) => {
  return get(baseUrl+'/listByPage', params)
}

export const deleteDevice = (params) => {
  return del(baseUrl+'/delete', params)
}

export const editDevice = (params) => {
  return put(baseUrl+'/edit', params)
}