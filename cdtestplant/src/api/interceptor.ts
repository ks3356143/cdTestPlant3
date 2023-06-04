import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Modal } from '@arco-design/web-vue'
import { useUserStore } from '@/store'
import { getToken } from '@/utils/auth'

export interface HttpResponse<T = unknown> {
    status: number
    msg: string
    code: number
    data: T
}

if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

// 添加请求拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 让每个请求携带令牌
        // 使用JWT token
        // 授权是一个自定义header密钥
        // 获取localStorage中token，如果有token，头没有则加上
        const token = getToken()
        if (token) {
            if (!config.headers) {
                config.headers = {}
            }
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        // 做点什么
        return Promise.reject(error)
    }
)
// 添加响应拦截器
axios.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {
        const res = response.data
        // 如果自定义代码不是20000，则判断为错误
        if (res.code !== 20000) {
            Message.error({
                content: res.msg || 'Error',
                duration: 5 * 1000,
            })
            // 50008: 非法令牌；50012:其他客户端登录；50014:令牌过期
            if ([50008, 50012, 50014].includes(res.code) && response.config.url !== '/api/user/info') {
                Modal.error({
                    title: 'Confirm logout',
                    content: '您已注销，您可以取消以留在此页面，也可以重新登录',
                    okText: 'Re-Login',
                    async onOk() {
                        const userStore = useUserStore()

                        await userStore.logout()
                        window.location.reload()
                    },
                })
            }
            return Promise.reject(new Error(res.msg || 'Error'))
        }
        return res
    },
    (error) => {
        Message.error({
            content: error.msg || '请求错误',
            duration: 5 * 1000,
        })
        return Promise.reject(error)
    }
)
