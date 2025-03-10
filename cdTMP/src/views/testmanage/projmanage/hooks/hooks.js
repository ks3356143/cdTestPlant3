import { Message } from "@arco-design/web-vue"

export default {
    /**
     * 生成最终产品文档的进度条模块
     */
    async create_entire_doc(visible, isComplete, api, record_id, docName) {
        visible.value = true
        isComplete.value = false
        const st = await api({ id: record_id }).catch((err) => {
            isComplete.value = true
            visible.value = false
        })
        // 下面是创建后Blob并触发下载
        const blob = new Blob([st], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${docName}.docx` // 设置下载文件名
        a.click()
        window.URL.revokeObjectURL(url) // 释放 URL 对象
        // 上面是触发下载
        isComplete.value = true
        Message.success("文档生成并下载成功!")
    }
}
