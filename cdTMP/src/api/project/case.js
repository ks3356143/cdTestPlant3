import { request } from "@/api/request"
export default {
    /**
     * 根据项目id、round、designDemand、testDemand信息，请求详细case数据
     * @returns 测试用例数据
     */
    getCaseList(params = {}) {
        return request({
            url: `project/getCaseList`,
            method: "get",
            params
        })
    },
}
