import { request } from "@/api/request"

export default {
    /**
     * 获取公告信息
     * @returns
     */
    getNoticeList(params = {}) {
        return request({
            url: "system/getNoticeList",
            method: "get",
            params
        })
    },
    /**
     * 快捷查询字典
     */
    getDict(code) {
        return request({
            url: "system/dataDict/list?code=" + code,
            method: "get"
        })
    }
}
