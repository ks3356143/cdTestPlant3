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
    },
    /**
     * 传入id以及data编辑设计需求
     * @returns 成功编辑或失败
     */
    editDesignDemand(id, data = {}) {
        return request({
            url: `project/editDesignDemand/` + id,
            method: "put",
            data
        })
    }
}
