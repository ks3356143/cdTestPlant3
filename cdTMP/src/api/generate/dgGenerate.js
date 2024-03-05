import { request } from "@/api/request"
export default {
    /**
     *
     * @returns 大纲测试项数据
     */
    createTestDemand(params = {}) {
        return request({
            url: `/generate/create/testdemand`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 大纲依据数据
     */
    createYiju(params = {}) {
        return request({
            url: `/generate/create/yiju`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成联系方式
     */
    createContact(params = {}) {
        return request({
            url: `/generate/create/contact`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成技术依据文件部分
     */
    createTechYiju(params = {}) {
        return request({
            url: `/generate/create/techyiju`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-测评时间和地点
     */
    createTimeaddress(params = {}) {
        return request({
            url: `/generate/create/timeaddress`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-被测软件功能
     */
    createFuncList(params = {}) {
        return request({
            url: `/generate/create/funcList`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-测评对象的软件组成描述
     */
    createSoftComposition(params = {}) {
        return request({
            url: `/generate/create/softComposition`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-被测软件接口
     */
    createInterface(params = {}) {
        return request({
            url: `/generate/create/interface`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-被测软件性能
     */
    createPerformance(params = {}) {
        return request({
            url: `/generate/create/performance`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-被测软件性能
     */
    createBaseInformation(params = {}) {
        return request({
            url: `/generate/create/baseInformation`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成测评大纲-测试总体要求
     */
    createRequirement(params = {}) {
        return request({
            url: `/generate/create/requirement`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-测试内容充分性及测试方法有效性
     */
    createAdequacyEffectiveness(params = {}) {
        return request({
            url: `/generate/create/adequacy_effectiveness`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-测评组织及分工
     */
    createGroup(params = {}) {
        return request({
            url: `/generate/create/group`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-测评条件和保障
     */
    createGuarantee(params = {}) {
        return request({
            url: `/generate/create/guarantee`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-缩略语
     */
    createAbbreviation(params = {}) {
        return request({
            url: `/generate/create/abbreviation`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-研制总要求-测试项对比表
     */
    createYzComparison(params = {}) {
        return request({
            url: `/generate/create/yzComparison`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-需求规格说明追踪表
     */
    createXqComparison(params = {}) {
        return request({
            url: `/generate/create/xqComparison`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-反向测试项-需求规格说明追踪表
     */
    createFanXqComparison(params = {}) {
        return request({
            url: `/generate/create/fanXqComparison`,
            method: "get",
            params
        })
    },
    /**
     *
     * @returns 生成-代码质量度量分析表
     */
    createCodeQuality(params = {}) {
        return request({
            url: `/generate/create/codeQuality`,
            method: "get",
            params
        })
    },
}
