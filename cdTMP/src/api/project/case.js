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
    /**
     * 添加测试用例
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/case/save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新测试用例
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "/project/case/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 删除测试用例
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/case/delete",
            method: "delete",
            data
        })
    },
}
