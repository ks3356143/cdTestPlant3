import { request } from "@/api/request"
export default {
    /**
     * 如果缺少部分文件给与提示
     * @returns 根据output_dir生成最终大纲文档
     */
    createDagangSeiTai(params = {}) {
        return request({
            url: `/create/dgDocument`,
            method: "get",
            params
        })
    }
}
