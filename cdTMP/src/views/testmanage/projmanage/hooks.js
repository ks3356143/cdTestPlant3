import { Message } from "@arco-design/web-vue"

export default {
    /**
     * 生成最终产品文档的进度条模块
     */
    async create_entire_doc(visible, isComplete, api, record_id) {
        visible.value = true
        isComplete.value = false
        const st = await api({ id: record_id }).catch((err) => {
            isComplete.value = true
            visible.value = false
        })
        isComplete.value = true
        Message.success(st.message)
    }
}
