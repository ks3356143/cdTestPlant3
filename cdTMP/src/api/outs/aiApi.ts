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
        return request({
            url: import.meta.env.DEV ? `/local_doc_qa/testing_item` : `${AI_API_BASE}/api/local_doc_qa/testing_item`,
            timeout: 120000,
            method: "post",
            data
        })
    }
}
