import { get, post, put, del } from '@/util/request.js'

const baseUrl = '/building'
// 获取所有楼宇列表
export const getAllBuilding = () => {
  return get(baseUrl+'/all')
}

// 分页获取楼宇列表
export const getBuildingList = (params) => {
  return get(baseUrl+'/pageList', params)
}