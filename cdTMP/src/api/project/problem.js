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
    },
    /**
     * 添加问题单
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/problem/save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新问题单
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "/project/problem/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 删除问题单
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/problem/delete",
            method: "delete",
            data
        })
    },
}
