import { request } from "@/api/request"

export default {
    /**
     * 根据项目id、round、designDemand、testDemand、case信息，请求问题单列表
     * @returns 属于case的问题单列表
     */
    getProblemList(params = {}) {
        return request({
            url: `project/getProblemList`,
            method: "get",
            params
        })
    }
}
