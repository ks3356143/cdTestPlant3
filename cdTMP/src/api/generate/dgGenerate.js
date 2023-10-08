import { request } from "@/api/request"
export default {
    /**
     *
     * @returns 大纲测试项数据
     */
    createTestDemand(params = {}) {
        return request({
            url: `/generate/create/testdemand`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 大纲依据数据
     */
    createYiju(params = {}) {
        return request({
            url: `/generate/create/yiju`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成联系方式
     */
    createContact(params = {}) {
        return request({
            url: `/generate/create/contact`,
            method: "get",
            params
        })
    },
}
