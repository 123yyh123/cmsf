import { get, post, put, del } from '@/util/request.js'

const baseUrl = '/user'

export const getTeacherPageList = (params) => {
  return get(baseUrl+'/getTeacherPage', params)
}

export const deleteTeacher = (params) => {
  return del(baseUrl+'/deleteTeacher', params)
}

export const editTeacher = (params) => {
  return put(baseUrl+'/editTeacher', params)
}

export const getStudentPageList = (params) => {
  return get(baseUrl+'/getStudentPage', params)
}

export const deleteStudent = (params) => {
  return del(baseUrl+'/deleteStudent', params)
}

export const editStudent = (params) => {
  return put(baseUrl+'/editStudent', params)
}

export const getUserInfo = (params) => {
  return get(baseUrl+'/getUserInfo', params)
}

export const updateUserInfo = (params) => {
  return put(baseUrl+'/updateUserInfo', params)
}

export const updatePassword = (params) => {
  return put(baseUrl+'/updatePassword', params)
}
