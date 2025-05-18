import { get, post, put, del } from '@/util/request.js'

const baseUrl = '/device'

export const getDevicePageList = (params) => {
    return get(baseUrl + '/listByPage', params)
}

export const deleteDevice = (params) => {
    return del(baseUrl + '/delete', params)
}

export const editDevice = (params) => {
    return put(baseUrl + '/edit', params)
}

export const getDeviceBindTrace = (params) => {
    return get(baseUrl + '/deviceBindStatus/trace', params)
}

export const updateDeviceBindStatus = (params) => {
    return put(baseUrl + '/deviceBindStatus/update', params)
}

export const deleteDeviceBatch = (params) => {
    return del(baseUrl + '/deleteBatch', params)
}

export const getDeviceByCodeOrName = (params) => {
    return get(baseUrl + '/getByCodeOrName', params)
}

export const getDeviceRepairPage = (params) => {
    return get(baseUrl + '/repair/listByPage', params)
}

export const updateDeviceRepairStatus = (params) => {
    return put(baseUrl + '/repair/updateStatus', params)
}

export const createDeviceRepair = (params) => {
    return post(baseUrl + '/repair/create', params)
}

export const getRepairDeviceBySelf = (params) => {
    return get(baseUrl + '/repair/listMyPage', params)
}