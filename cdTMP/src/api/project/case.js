import { request } from "@/api/request"
export default {
    /**
     * 根据项目id、round、designDemand、testDemand信息，请求详细case数据
     * @returns 测试用例数据
     */
    getCaseList(params = {}) {
        return request({
            url: `project/getCaseList`,
            method: "get",
            params
        })
    },
    /**
     * 添加测试用例
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/case/save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新测试用例
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "/project/case/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 删除测试用例
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/case/delete",
            method: "delete",
            data
        })
    },
    /**
     * 右键点击需求创建测试用例
     * @returns 成功或失败信息
     */
    createByDemand(params = {}) {
        return request({
            url: "/project/case/create_by_demand",
            method: "post",
            data: params
        })
    },
    /**
     * 拖拽大功能：拖拽测试用例到测试项节点，移动还是复制
     * @returns 返回case的key用于刷新树状图的数据
     */
    copyOrMoveCaseToDemand(params = {}) {
        return request({
            url: "/project/case/copy_or_move_to_demand",
            method: "get",
            params
        })
    },
    /**
     * 拖拽大功能：拖拽测试用例到用例节点（都是用例）,移动还是复制
     * @returns 返回case的key用于刷新树状图的数据
     */
    copyOrMoveCaseByCase(params = {}) {
        return request({
            url: "/project/case/copy_or_move_by_case",
            method: "get",
            params
        })
    }
}
