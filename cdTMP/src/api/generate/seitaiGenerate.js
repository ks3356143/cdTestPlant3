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
    },
    /**
     * 如果缺少部分文件给与提示
     * @returns 根据output_dir以及output_dir/sm中文档生成测试说明
     */
    createShuomingSeiTai(params = {}) {
        return request({
            url: `/create/smDocument`,
            method: "get",
            params
        })
    },
    /**
     * TODO:如果缺少部分文件给与提示
     * @returns 根据output_dir以及output_dir/JL中文档生成测试记录
     */
    createJiluSeiTai(params = {}) {
        return request({
            url: `/create/jlDocument`,
            method: "get",
            params
        })
    },
    /**
     * TODO:如果缺少部分文件给与提示
     * @returns 根据output_dir以及output_dir/bg中文档生成测评报告
     */
    createBgDocument(params = {}) {
        return request({
            url: `/create/bgDocument`,
            method: "get",
            params
        })
    },
    /**
     * TODO:如果缺少部分文件给与提示
     * @returns 根据output_dir以及output_dir/hsm中文档生成回归测试说明（特殊多个文件）
     */
    createHsmDocument(params = {}) {
        return request({
            url: `/create/hsmDocument`,
            method: "get",
            params
        })
    },
    /**
     * TODO:如果缺少部分文件给与提示
     * @returns 根据output_dir以及output_dir/hjl中文档生成回归测试记录（特殊多个文件）
     */
    createHjlDocument(params = {}) {
        return request({
            url: `/create/hjlDocument`,
            method: "get",
            params
        })
    },
    /**
     * TODO:生成最终问题单
     * @returns 返回是否正确生成问题单
     */
    createWtdDocument(params = {}) {
        return request({
            url: `/create/wtdDocument`,
            method: "get",
            params
        })
    }
}
