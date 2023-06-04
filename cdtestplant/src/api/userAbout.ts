import axios from 'axios'
import qs from 'query-string'

export interface PolicyParams {
    current: number
    pageSize: number
}

// 请求用户列表接口
export function getUserList(params: PolicyParams) {
    return axios.get<any>('/api/user/list', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj)
        },
    })
}

// 请求用户列表删除接口
export function deleteUserList(data: any) {
    return axios.post<any>('/api/user/delete', data)
}

// 全条件搜索接口
export function getUserListAll(data: any) {
    return axios.post<any>('/api/user/all', data)
}
