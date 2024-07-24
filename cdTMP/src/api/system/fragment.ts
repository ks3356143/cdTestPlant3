import { request } from "@/api/request"
import { IFragSearchCondition } from "./types/fragmentTypes"
export class FragApi {
    /**
     * 根据参数获取文档片段
     * @returns 文档片段数组
     */
    static getFragList(params: IFragSearchCondition = {}) {
        return request({
            url: "system/userField/getFragment",
            method: "get",
            params
        })
    }
}
