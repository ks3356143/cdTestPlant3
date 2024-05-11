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
    /**
     * 请求一个项目的所有测试需求（即测试项）
     * @returns
     */
    getRelatedTestDemand(params = {}) {
        return request({
            url: "/project/testDemand/getRelatedTestDemand",
            method: "get",
            params
        })
    },
    /**
     * 设计需求关联测试需求（测试项）的接口请求
     * @returns
     */
    solveRelatedTestDemand(params = {}) {
        return request({
            url: "/project/testDemand/solveRelatedTestDemand",
            method: "post",
            data: params
        })
    },
    /**
     * 根据当前设计需求design，找出已关联非自己的测试项
     * @returns
     */
    getExistRelatedTestDemand(params = {}) {
        return request({
            url: "/project/testDemand/getExistRelatedTestDemand",
            method: "post",
            data: params
        })
    },
    /**
     * 复制demand到指定design下面
     * @returns 复制是否成功
     */
    copyToDesign(params = {}) {
        return request({
            url: "/project/testDemand/copy_to_design",
            method: "post",
            data: params
        })
    }
}
