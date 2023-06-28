import { request } from "@/api/request"
export default {
    /**
     * 根据项目名、第{roundNumber}查询该轮次信息
     * @returns 返回一个轮次的信息
     */
    getOneRoundInfo(params = {}) {
        return request({
            url: "/project/getOneRoundInfo",
            method: "get",
            params
        })
    },
    /**
     * 添加轮次
     * @returns
     */
    save(project_id, params = {}) {
        return request({
            url: "project/round/save",
            method: "post",
            data: params,
            params: { project_id }
        })
    },
    /**
     * 更新轮次
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "project/round/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 更新轮次
     * @returns
     */
    delete(project_id, data = {}) {
        return request({
            url: "project/round/delete",
            method: "delete",
            data,
            params: { project_id }
        })
    }
}
