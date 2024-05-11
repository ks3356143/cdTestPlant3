<template>
    <a-modal v-model:visible="visible" width="1200px" :footer="false">
        <template #title>关联添加问题单</template>
        <!-- crud组件 -->
        <div class="lg:w-full w-full">
            <ma-crud :options="crudOptions" :columns="columns" ref="crudRef">
                <!-- 自定义字段名为 related 的插槽 -->
                <!-- record 当前数据行的数据、column 当前列信息、rowIndex 当前数据行索引 -->
                <template #related="{ record }">
                    <a-switch
                        v-model="record.related"
                        @change="handleRelatedChange(record)"
                        type="round"
                        checked-color="green"
                        unchecked-color="#F53F3F"
                        :loading="loading"
                    >
                        <template #checked> 已关联 </template>
                        <template #unchecked> 未关联 </template>
                    </a-switch>
                </template>
                <!-- ident插槽 -->
                <template #ident="{ record }">
                    {{ "PT_" + route.query.ident + "_" + record.ident.padStart(3, "0") }}
                </template>
            </ma-crud>
        </div>
    </a-modal>
</template>

<script setup lang="jsx">
import { ref } from "vue"
import problemApi from "@/api/project/problem"
import { Message } from "@arco-design/web-vue"
import { useRoute, useRouter } from "vue-router"
const route = useRoute()
// 定义emits
const emits = defineEmits(["deleted", "relatedOrunrelated"])

// ~~~定义关联的switch-值改变处理~~~ 该函数返回false或返回Promise[reject]则停止切换
/// 定义个switch的加载loading属性
const loading = ref(false)
const handleRelatedChange = async (record) => {
    // 因为switch绑定了record.related所以可以动态改变
    loading.value = true
    const res = await problemApi
        .relateProblem({
            case_key: route.query.key,
            problem_id: record.id,
            val: record.related
        })
        .catch((err) => {
            // 如果出错则保持不变
            record.related = !record.related
            loading.value = false
        })
    if (!res.data.isOK) {
        // 后台说没关联成功则保持不变
        record.related = !record.related
        loading.value = false
    }
    loading.value = false
    emits("relatedOrunrelated")
    Message.success(res.message)
}

// 数据定义
const crudRef = ref()
const visible = ref(false)

// 定义open事件
const open = (row) => {
    crudRef.value.requestData() // 手动请求数据
    visible.value = true
}
// crudOptions设置
const crudOptions = ref({
    autoRequest: false, // 取消自己请求数据，后续自己调用方法请求
    api: problemApi.searchAllProblem, // 请求数据的API
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    operationWidth: 160,
    operationColumnAlign: "center",
    edit: { show: true, api: problemApi.modalupdate },
    delete: { show: true, api: problemApi.delete },
    parameters: {
        projectId: route.query.id,
        key: route.query.key
    },
    showTools: false, // 不显示工具栏
    operationColumn: true,
    operationColumnAlign: "center", // 操作列居中
    isDbClickEdit: false, // 双击不编辑当前列
    bordered: { cell: true },
    formOption: {
        width: 1000,
        layout: [
            {
                formType: "grid",
                customClass: ["mt-0"],
                cols: [
                    { span: 12, formList: [{ dataIndex: "name" }] },
                    { span: 12, formList: [{ dataIndex: "ident" }] }
                ]
            },
            {
                formType: "grid",
                customClass: ["ml-4"],
                cols: [
                    { span: 12, formList: [{ dataIndex: "status" }] },
                    { span: 12, formList: [{ dataIndex: "closeMethod" }] }
                ]
            },
            {
                formType: "grid",
                customClass: ["ml-4"],
                cols: [
                    { span: 12, formList: [{ dataIndex: "grade" }] },
                    { span: 12, formList: [{ dataIndex: "type" }] }
                ]
            },
            {
                formType: "divider",
                title: "问题详情"
            },
            {
                dataIndex: "operation"
            },
            {
                dataIndex: "expect"
            },
            {
                dataIndex: "result"
            },
            {
                dataIndex: "rules"
            },
            {
                dataIndex: "suggest"
            },
            {
                formType: "divider",
                title: "解决问题"
            },
            {
                dataIndex: "solve"
            },
            {
                formType: "divider",
                title: "人员信息"
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "postPerson" }] },
                    { span: 12, formList: [{ dataIndex: "postDate" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "designerPerson" }] },
                    { span: 12, formList: [{ dataIndex: "designDate" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "verifyPerson" }] },
                    { span: 12, formList: [{ dataIndex: "verifyDate" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "revokePerson" }] },
                    { span: 12, formList: [{ dataIndex: "revokeDate" }] }
                ]
            }
        ]
    },
    // 添加删除后置处理方法：让父组件知道我删除了，你必须刷新表格
    afterDelete(response, record) {
        emits("deleted")
    }
})

// columns数据
const columns = ref([
    {
        title: "名称",
        align: "left",
        search: true,
        dataIndex: "name",
        commonRules: [{ required: true, message: "名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "问题标识",
        align: "center",
        sortable: { sortDirections: ["ascend"] },
        width: 140,
        search: true,
        dataIndex: "ident",
        editDisabled: true,
        addDisabled: true,
        addDefaultValue: `${route.query.ident}`,
        validateTrigger: "blur"
    },
    {
        title: "缺陷状态",
        align: "center",
        width: 80,
        search: true,
        dataIndex: "status",
        formType: "radio",
        addDefaultValue: "2",
        commonRules: [{ required: true, message: "缺陷状态是必填" }],
        dict: {
            name: "problemStatu",
            translation: true,
            props: { label: "title", value: "key" },
            tagColors: { 1: "green", 2: "blue", 3: "#FF7D00", 4: "red" }
        }
    },
    {
        title: "缺陷类型",
        align: "center",
        width: 80,
        dataIndex: "type",
        search: true,
        addDefaultValue: "3",
        formType: "radio",
        commonRules: [{ required: true, message: "缺陷类型必选" }],
        dict: {
            name: "problemType",
            translation: true,
            props: { label: "title", value: "key" }
        }
    },
    {
        title: "缺陷等级",
        align: "center",
        width: 80,
        dataIndex: "grade",
        search: true,
        addDefaultValue: "1",
        formType: "radio",
        commonRules: [{ required: true, message: "缺陷等级必填" }],
        dict: {
            name: "problemGrade",
            translation: true,
            props: { label: "title", value: "key" }
        }
    },
    {
        title: "闭环方式",
        align: "center",
        width: 150,
        dataIndex: "closeMethod",
        addDefaultValue: ["2"],
        search: true,
        formType: "checkbox",
        dict: {
            name: "closeMethod",
            translation: true,
            props: { label: "title", value: "key" }
        },
        customRender: ({ record }) => {
            // 判断是否具有1：修改文档
            if (!record.closeMethod.hasOwnProperty("0")) {
                if (!record.closeMethod.hasOwnProperty("1")) {
                    return (
                        <a-tag size="small" bordered color="magenta">
                            还未闭环
                        </a-tag>
                    )
                }
            }
            const tagObj = []
            for (let item in record.closeMethod) {
                if (record.closeMethod[item] === "1") {
                    tagObj.push(
                        <a-tag size="small" bordered color="blue">
                            修改文档
                        </a-tag>
                    )
                } else if (record.closeMethod[item] === "2") {
                    tagObj.push(
                        <a-tag size="small" bordered color="green">
                            修改程序
                        </a-tag>
                    )
                }
            }
            return <a-space size="mini">{tagObj}</a-space>
        }
    },
    {
        title: "问题操作",
        hide: true,
        search: true,
        dataIndex: "operation",
        formType: "editor",
        addDefaultValue: ""
    },
    {
        title: "期望结果",
        hide: true,
        dataIndex: "expect",
        addDefaultValue: ""
    },
    {
        title: "问题结果",
        hide: true,
        dataIndex: "result",
        formType: "editor",
        addDefaultValue: ""
    },
    {
        title: "违反规则",
        hide: true,
        dataIndex: "rules",
        addDefaultValue: ""
    },
    {
        title: "修改建议",
        hide: true,
        dataIndex: "suggest",
        addDefaultValue: ""
    },
    {
        title: "处理方式",
        hide: true,
        dataIndex: "solve",
        addDefaultValue: "",
        formType: "textarea"
    },
    {
        title: "提单人",
        dataIndex: "postPerson",
        search: true,
        hide: true,
        formType: "select",
        commonRules: [{ required: true, message: "提单人必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "悬挂状态",
        dataIndex: "hang",
        search: false,
        addDisplay: false,
        editDisplay: false,
        align: "center",
        customRender: ({ record }) => {
            // 判断是否为悬挂状态record.hang[Boolean]
            let tagObj
            if (record.hang) {
                tagObj = (
                    <a-tag size="small" bordered color="green">
                        有关联用例
                    </a-tag>
                )
            } else {
                tagObj = (
                    <a-tag size="small" bordered color="red">
                        悬挂
                    </a-tag>
                )
            }
            return <a-space size="mini">{tagObj}</a-space>
        }
    },
    {
        title: "是否关联",
        dataIndex: "related",
        align: "center",
        formType: "switch",
        addDisplay: false,
        editDisplay: false
    },
    {
        title: "提单日期",
        hide: true,
        dataIndex: "postDate",
        formType: "date"
    },
    {
        title: "设师上级",
        hide: true,
        dataIndex: "designerPerson",
        commonRules: [{ required: true, message: "提单人必填" }]
    },
    {
        title: "确认日期",
        hide: true,
        dataIndex: "designDate",
        formType: "date"
    },
    {
        title: "验证人",
        hide: true,
        dataIndex: "verifyPerson",
        formType: "select",
        commonRules: [{ required: true, message: "提单人必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "验证日期",
        hide: true,
        dataIndex: "verifyDate",
        formType: "date"
    },
    {
        title: "撤销人",
        hide: true,
        dataIndex: "revokePerson",
        formType: "select",
        commonRules: [{ required: true, message: "提单人必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "撤销日期",
        hide: true,
        dataIndex: "revokeDate",
        formType: "date"
    }
])

// 暴露自己的open方法
defineExpose({ open })
</script>

<style lang="less" scoped></style>
