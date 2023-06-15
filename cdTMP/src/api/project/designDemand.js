import { request } from "@/api/request"

export default {
    /**
     * 根据项目id、round信息，请求详细designDemand数据
     * @returns 设计需求数组数据
     */
    getDesignDemandList(params = {}) {
        return request({
            url: `project/getDesignDemandList`,
            method: "get",
            params
        })
    }
}
