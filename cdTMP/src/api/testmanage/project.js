import { request } from "@/api/request"
export default {
    /**
     * 获取项目列表信息
     * @returns {Array}
     */
    getPageList(params = {}) {
        return request({
            url: "testmanage/project/index",
            method: "get",
            params
        })
    }
}
