import {get, post, put, del} from '@/util/request.js'

const baseUrl = '/common'

export const getIndexInfo = () => {
    return get(baseUrl + '/getIndexInfo')
}

export const getRecentlyApply = () => {
    return get(baseUrl + '/getRecently/applyReservation')
}

export const getEmailCode = (params) => {
    return get(baseUrl + '/getEmailCode', params)
}

export const getPhoneCode = (params) => {
    return get(baseUrl + '/getPhoneCode', params)
}

export const sendVerificationCode = (params) => {
    return get(baseUrl + '/sendVerificationCode', params)
}

export const getSystemLog = (params) => {
    return get(baseUrl + '/getSystemLog', params)
}
