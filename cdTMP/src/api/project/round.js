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
    }
}
