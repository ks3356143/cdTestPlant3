import { request } from "@/api/request"
// 该api集合主要是tree动态加载项
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
     * 根据项目名、树节点等级和key查找设计需求
     * @returns 设计需求树状节点信息
     */
    getDemandInfo(projectId, key, level) {
        return request({
            url: `project/getDesignDemandInfo`,
            method: "get",
            params: {
                projectId: projectId,
                key: key,
                level: level
            }
        })
    },
    /**
     * 根据项目名、树节点等级和key查找测试需求
     * @returns 返回测试需求testDemand
     */
    getTestInfo(projectId, key, level) {
        return request({
            url: `project/getTestdemandInfo`,
            method: "get",
            params: {
                projectId: projectId,
                key: key,
                level: level
            }
        })
    },
    /**
     * 根据项目名、树节点等级和key查找测试用例
     * @returns 返回测试用例
     */
    getCaseInfo(projectId, key, level) {
        return request({
            url: `project/getCaseInfo`,
            method: "get",
            params: {
                projectId: projectId,
                key: key,
                level: level
            }
        })
    },
    /**
     * 根据项目名、树节点等级和key查找问题单
     * @returns 返回问题单problem
     */
    getProblemInfo(projectId, key, level) {
        return request({
            url: `project/getProblemInfo`,
            method: "get",
            params: {
                projectId: projectId,
                key: key,
                level: level
            }
        })
    },
}
