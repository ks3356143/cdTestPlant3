import { request } from "@/api/request"
export default {
    /**
     *
     * @returns 测试用例数据
     */
    createTestDemand(params = {}) {
        return request({
            url: `/generate/create/testdemand`,
            method: "get",
            params
        })
    },
}
