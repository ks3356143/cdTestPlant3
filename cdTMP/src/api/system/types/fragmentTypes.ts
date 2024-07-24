/**
 * 所属产品文档名称的enum
 */
export enum FragBelongDoc {
    dg = "大纲",
    sm = "说明",
    jl = "记录",
    hsm = "回归说明",
    hjl = "回归记录",
    bg = "报告",
    wtd = "问题单"
}

/**
 * 接口：文档片段查询条件
 */
export interface IFragSearchCondition {
    belongDocName?: FragBelongDoc
    name?: string
    isMain?: boolean
    projectId?: number
}
