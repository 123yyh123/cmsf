import {get, post, put, del} from '@/util/request.js'

const baseUrl = '/reservation'

export const getReservationPageList = (params) => {
    return get(baseUrl + '/page/pending', params)
}

export const reviewReservation = (params) => {
    return put(baseUrl + '/review', params)
}