import {get, post, put, del} from '@/util/request.js'

const baseUrl = '/reservation'

export const getReservationPageList = (params) => {
    return get(baseUrl + '/page/pending', params)
}

export const getReservationRecordPageList = (params) => {
    return get(baseUrl + '/page/record', params)
}

export const reviewReservation = (params) => {
    return put(baseUrl + '/review', params)
}

export const getReservationDetail = (params) => {
    return get(baseUrl + '/record/detail', params)
}

export const getSelfReservation = (params) => {
    return get(baseUrl + '/record/my', params)
}

export const addReservation = (params) => {
    return post(baseUrl + '/add', params)
}

export const getMySchedule = (params) => {
    return get(baseUrl + '/schedule/my', params)
}

export const cancelSchedule = (params) => {
    return del(baseUrl + '/schedule/cancel', params)
}

export const cancelReservation = (params) => {
    return del(baseUrl + '/record/cancel', params)
}