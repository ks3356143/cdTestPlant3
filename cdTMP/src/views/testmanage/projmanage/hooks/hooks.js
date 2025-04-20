import { Message } from "@arco-design/web-vue"

export default {
    /**
     * 生成最终产品文档的进度条模块
     */
    async create_entire_doc(visible, isComplete, api, record_id, docName, fragmentList) {
        visible.value = true
        isComplete.value = false
        try {
            const st = await api({ id: record_id, frag: fragmentList })
            // 动态生成文件名
            const fileType = st.type
            const fileExt = fileType.includes("zip") ? "zip" : "docx"
            const fileName = `${docName}.${fileExt}`
            // 下面是创建后Blob并触发下载
            const blob = new Blob([st], {
                type: fileType
            })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = fileName // 设置文件名（动态）
            a.click()
            window.URL.revokeObjectURL(url) // 释放 URL 对象
            // 上面是触发下载
            isComplete.value = true
            Message.success("文档生成并下载成功!")
        } catch (err) {
            isComplete.value = true
            visible.value = false
        }
    }
}
