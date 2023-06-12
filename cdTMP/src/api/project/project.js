import { request } from "@/api/request"

export default {
    /**
     * 根据项目名确定round初始节点
     * @returns round初始节点
     */
    getRoundInfo(projectId) {
        return request({
            url: `project/getRoundInfo/${projectId}`,
            method: "get"
        })
    },

    /**
     * 根据项目名、轮次round查询轮次下面的设计需求
     * @returns 设计需求树状节点信息
     */
    getDemandInfo(projectId, key, level) {
        return request({
            url: `project/getdemandInfo`,
            method: "get",
            params: {
                projectId: projectId,
                key: key,
                level: level
            }
        })
    }
}
