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
    /**
     * 添加被测件
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/testDemand/save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新dut
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "/project/testDemand/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 删除dut
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/testDemand/delete",
            method: "delete",
            data
        })
    },
}
