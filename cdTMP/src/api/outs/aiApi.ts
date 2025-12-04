import { request } from "@/api/request"

const AI_API_BASE = import.meta.env.VUE_APP_AI_API_BASE || "http://192.168.0.63:8777"

interface DataRowType {
    question: string
    stream: boolean
}

export default {
    /**
     * 请求AI生成测试项
     * @returns 可流式或一次性
     */
    getAiTestItem(data: DataRowType) {
        if (import.meta.env.DEV) {
            return request({
                url: `/local_doc_qa/testing_item`,
                timeout: 20000,
                method: "post",
                data
            })
        }
        return request({
            url: `${AI_API_BASE}/api/local_doc_qa/testing_item`,
            timeout: 20000,
            method: "post",
            data
        })
    }
}
