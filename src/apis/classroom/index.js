import { get, post, put, del } from '@/util/request.js'

const baseUrl = '/classroom'

// 获取教室列表
export const getClassroomList = (params) => {
  return get(baseUrl+'/pageList', params)
}

// 删除教室
export const deleteClassroom = (params) => {
  return del(baseUrl+'/delete', params)
}

// 批量删除教室
export const deleteClassroomBatch = (params) => {
  return del(baseUrl+'/deleteBatch', params)
}

// 添加教室
export const addClassroom = (params) => {
  return post(baseUrl+'/add', params)
}

// 修改教室
export const updateClassroom = (params) => {
  return put(baseUrl+'/update', params)
}

//  获取教室与设备绑定关系
export const getClassroomBindDevice = (params) => {
  return get(baseUrl+'/getClassroomBindDevice', params)
}

// 解绑教室与设备
export const unbindClassroomBindDevice = (params) => {
  return put(baseUrl+'/unbindDevice', params)
}

export const bindClassroomBindDevice = (params) => {
  return put(baseUrl+'/bindDevice', params)
}

export const getClassroomDetail = (params) => {
  return get(baseUrl+'/getDetail', params)
}
