<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #ident="{ record }">
                    {{ "PT_" + route.query.ident + "_" + record.ident.padStart(3,"0") }}
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import problemApi from "@/api/project/problem"
import { useTreeDataStore } from "@/store"
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
const designDemandNumber = route.query.key.split("-")[2]
const testDemandNumber = route.query.key.split("-")[3]
const caseNumber = route.query.key.split("-")[4]
const crudRef = ref()
const projectId = ref(route.query.id)
const crudOptions = ref({
    api: problemApi.getProblemList,
    add: { show: true, api: problemApi.save },
    edit: { show: true, api: problemApi.update },
    delete: { show: true, api: problemApi.delete },
    beforeOpenAdd: function () {
        let round_key = route.query.key.split("-")[0]
        let dut_key = route.query.key.split("-")[1]
        let design_key = route.query.key.split("-")[2]
        let test_key = route.query.key.split("-")[3]
        let case_key = route.query.key.split("-")[4]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} >
        ${td[round_key].title} > ${td[round_key].children[dut_key].title} >
        ${td[round_key].children[dut_key].children[design_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].children[case_key].title} > 用例-`
        return true
    },
    beforeOpenEdit: function (record) {
        let round_key = route.query.key.split("-")[0]
        let dut_key = route.query.key.split("-")[1]
        let design_key = route.query.key.split("-")[2]
        let test_key = route.query.key.split("-")[3]
        let case_key = route.query.key.split("-")[4]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} >
        ${td[round_key].title} > ${td[round_key].children[dut_key].title} >
        ${td[round_key].children[dut_key].children[design_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].children[case_key].title}
        >用例[${record.name}]-`
        return true
    },
    afterAdd: (res) => {
        console.log(res)
        let id = projectId.value
        treeDataStore.updateProblemTreeData(res.data, id)
    },
    afterEdit: (res) => {
        let id = projectId.value
        treeDataStore.updateProblemTreeData(res.data, id)
    },
    afterDelete: (res, record) => {
        let id = projectId.value
        treeDataStore.updateProblemTreeData(record, id)
    },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber,
        designDemand: designDemandNumber,
        testDemand: testDemandNumber,
        case: caseNumber
    },
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    scroll: { x: "100%", y: "100%" },
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
    }
})
const crudColumns = ref([
    {
        title: "名称",
        align: "left",
        search: true,
        dataIndex: "name",
        commonRules: [{ required: true, message: "名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "标识",
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
                if (item === "0") {
                    tagObj.push(
                        <a-tag size="small" bordered color="blue">
                            修改文档
                        </a-tag>
                    )
                } else if (item === "1") {
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
        title: "提单人",
        dataIndex: "postPerson",
        search: true,
        formType: "select",
        commonRules: [{ required: true, message: "提单人必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
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
</script>

<style lang="less" scoped></style>
