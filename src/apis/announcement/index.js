import {get, post, put, del} from '@/util/request.js'

const baseUrl = '/announcement'

export const getAnnouncementPage = (params) => {
  return get(baseUrl+'/getAll/page', params)
}

export const addAnnouncement = (params) => {
  return post(baseUrl+'/add', params)
}

export const updateAnnouncement = (params) => {
  return put(baseUrl+'/update', params)
}

export const deleteAnnouncement = (params) => {
  return del(baseUrl+'/delete', params)
}