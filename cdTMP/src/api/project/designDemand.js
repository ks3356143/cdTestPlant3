import { request } from "@/api/request"

export default {
    /**
     * 根据项目id、round信息，请求详细designDemand数据
     * @returns 设计需求数组数据
     */
    getDesignDemandList(params = {}) {
        return request({
            url: `project/getDesignDemandList`,
            method: "get",
            params
        })
    },
    /**
     * 查询单个设计需求-传统
     * @returns 单个设计需求数据
     */
    getDesignDemandOne(params = {}) {
        return request({
            url: `project/getDesignOne`,
            method: "get",
            params
        })
    },
    /**
     * 查询单个设计需求-id
     * @returns 单个设计需求数据
     */
    getDesignOneById(id) {
        return request({
            url: `project/getDesignOneById?id=${id}`,
            method: "get"
        })
    },
    /**
     * 编辑设计需求
     * @returns 成功编辑或失败
     */
    editDesignDemand(id, data = {}) {
        return request({
            url: `project/editDesignDemand/` + id,
            method: "put",
            data
        })
    },
    /**
     * 添加设计需求
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/designDemand/save",
            method: "post",
            data: params
        })
    },
    /**
     * 批量添加设计需求
     * @returns
     */
    multiSave(params = {}) {
        return request({
            url: "/project/designDemand/multi_save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新dut
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: `project/editDesignDemand/` + id,
            method: "put",
            data
        })
    },
    /**
     * 删除设计需求
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/designDemand/delete",
            method: "delete",
            data
        })
    },
    /**
     * 获取级联选择器所需要的（复制功能）级联design列表
     * @returns data_list:三级级联列表
     */
    getRelatedCasDesign(params = {}) {
        return request({
            url: "/project/designDemand/getRelatedDesign",
            method: "get",
            params
        })
    },
    /**
     * 提交选择的行、列，被替换内容，替换内容，请求后端替换
     * @returns
     */
    replace(data) {
        return request({
            url: "/project/designDemand/replace/",
            method: "post",
            data
        })
    }
}
