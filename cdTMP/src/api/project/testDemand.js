import { request } from "@/api/request"
export default {
    /**
     * 根据项目id、round、designDemand信息，请求详细testDemand数据
     * @returns 测试需求数据
     */
    getTestDemandList(params = {}) {
        return request({
            url: `project/getTestDemandList`,
            method: "get",
            params
        })
    },
    // 修改测试项信息
    editTestDemand(id, data = {}) {
        return request({
            url: `project/editTestDemand/` + id,
            method: "post",
            data
        })
    }
}
