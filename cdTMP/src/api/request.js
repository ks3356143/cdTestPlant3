import axios from "axios"
import { Message } from "@arco-design/web-vue"
import tool from "@/utils/tool"
import { get, isEmpty } from "lodash"
import qs, { stringify } from "qs"
import { h } from "vue"
import { IconFaceFrownFill } from "@arco-design/web-vue/dist/arco-vue-icon"

// createService
function createService() {
    // 创建axios实例
    const service = axios.create()

    // 实例的request请求拦截器
    service.interceptors.request.use(
        (config) => config,
        (error) => {
            return Promise.reject(error)
        }
    )
    // 实例的response响应拦截器
    service.interceptors.response.use(
        (res) => {
            // 如果发现响应头有文件传输扩展，或则响应头为application/json，或者直接status=200
            if (
                (res.headers["content-disposition"] || !/^application\/json/.test(res.headers["content-type"])) &&
                res.status === 200
            ) {
                return res
                // 如果发现data中有size字段直接报错
            } else if (res.data.size) {
                res.data.code = 500
                res.data.message = "服务器内部错误"
                res.data.success = false
            } else if (res.data.code && res.data.code !== 200) {
                Message.error({
                    content: res.data.message,
                    // 注意奇怪的用法
                    icon: () => h(IconFaceFrownFill)
                })
            }
            return res.data
        },
        (error) => {
            // 其实基本逻辑是有message写message
            // 没用message再去找默认的response的status
            const err = (text) => {
                Message.error({
                    content:
                        error.response && error.response.data && error.response.data.message
                            ? error.response.data.message
                            : text,
                    icon: () => h(IconFaceFrownFill)
                })
            }
            if (error.response && error.response.data) {
                switch (error.response.status) {
                    case 404:
                        err("服务器资源不存在")
                        break
                    case 500:
                        err("服务器内部错误")
                        break
                    case 401:
                        err("登录状态已过期，需要重新登录")
                        // 清楚本地localStorage
                        tool.local.clear()
                        // 移动到网站的根目录
                        window.location.href = "/"
                        break
                    case 403:
                        err("没有权限访问该资源")
                        break
                    default:
                        err("未知错误！")
                }
            } else {
                err("请求超时，服务器无响应！")
            }
            return Promise.reject(error.response && error.response.data ? error.response.data : null)
        }
    )
    return service
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest(service) {
    return function (config) {
        const env = import.meta.env
        // localStorage获取token信息
        const token = tool.local.get(env.VITE_APP_TOKEN_PREFIX)
        const configDefault = {
            headers: {
                Authorization: "Bearer " + token,
                "Accept-Language": "zh_CN",
                "Content-Type": get(config, "headers.Content-Type", "application/json;charset=UTF-8")
            },
            timeout: 10000,
            baseURL: env.VITE_APP_OPEN_PROXY === "true" ? env.VITE_APP_PROXY_PREFIX : env.VITE_APP_BASE_URL,
            data: {}
        }
        // option是configDefault和传入的config合并
        const option = Object.assign(configDefault, config)
        // lodash的isEmpty函数可以判断对象属性是否为空/数组是否为空->为空则返回true
        // qs中stringfy作用是urlencode
        // { c: 'b', a: 'd' } -> 'c=b&a=d'
        // 如果有params就转为urlencode样子
        if (!isEmpty(option.params)) {
            option.url = option.url + "?" + stringify(option.params)
            option.params = {}
        }
        return service(option)
    }
}

// 上面两个函数一个为增加实例拦截器，一个是传入实例后请求
export const service = createService()
// 返回的是一个函数，这个函数传入config然后添加上默认config然后发出实例的请求
export const request = createRequest(service)
