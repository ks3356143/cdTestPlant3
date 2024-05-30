<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import caseApi from "@/api/project/case"
import { useTreeDataStore } from "@/store"
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
const designDemandNumber = route.query.key.split("-")[2]
const testDemandNumber = route.query.key.split("-")[3]
const crudRef = ref()
const projectId = ref(route.query.id)
// 标识显示字段-用例比较特殊让后端返回了“FT”字样，因为FT是在测试项里面标识的
const showType = (record) => {
    let key_string = parseInt(record.key.substring(record.key.lastIndexOf("-") + 1)) + 1
    return "YL-" + record.testType + "-" + record.ident + "-" + key_string.toString().padStart(3, "0")
}
// crud设置
const crudOptions = ref({
    api: caseApi.getCaseList,
    add: { show: true, api: caseApi.save, text: "新增用例" },
    edit: { show: true, api: caseApi.update, text: "修改用例" },
    delete: { show: true, api: caseApi.delete },
    // 处理新增删除后树状图显示
    beforeOpenAdd: function () {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let design_key = key_split[2]
        let test_key = key_split[3]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} >
        ${td[round_key].title} > ${td[round_key].children[dut_key].title} >
        ${td[round_key].children[dut_key].children[design_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].title} > 用例-`
        return true
    },
    beforeOpenEdit: function (record) {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let design_key = key_split[2]
        let test_key = key_split[3]
        let td = treeDataStore.treeData
        console.log(route.query.key)
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} >
        ${td[round_key].title} > ${td[round_key].children[dut_key].title} >
        ${td[round_key].children[dut_key].children[design_key].title} >
        ${td[round_key].children[dut_key].children[design_key].children[test_key].title}
        >用例[${record.name}]-`
        return true
    },
    afterAdd: (res) => {
        let id = projectId.value
        treeDataStore.updateCaseTreeData(res.data, id)
    },
    afterEdit: (res) => {
        let id = projectId.value
        treeDataStore.updateCaseTreeData(res.data, id)
    },
    afterDelete: (res, record) => {
        let id = projectId.value
        if (!record) {
            record = { key: route.query.key + "-X" }
        }
        treeDataStore.updateCaseTreeData(record, id)
    },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber,
        designDemand: designDemandNumber,
        testDemand: testDemandNumber
    },
    showIndex: false,
    showTools: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    formOption: {
        width: 1200,
        layout: [
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "ident" }] },
                    { span: 12, formList: [{ dataIndex: "name" }] }
                ]
            },
            {
                formType: "card",
                customClass: ["ml-10", "mb-3", "py-0", "px-0"],
                title: "人员信息",
                formList: [
                    {
                        formType: "grid",
                        cols: [
                            { span: 8, formList: [{ dataIndex: "designPerson" }] },
                            { span: 8, formList: [{ dataIndex: "testPerson" }] },
                            { span: 8, formList: [{ dataIndex: "monitorPerson" }] }
                        ]
                    }
                ]
            }
        ]
    }
})
const crudColumns = ref([
    {
        title: "ID",
        width: 50,
        align: "center",
        dataIndex: "id",
        fixed: "left"
    },
    {
        title: "用例标识",
        dataIndex: "ident",
        sortable: { sortDirections: ["ascend"] },
        width: 140,
        align: "center",
        addDisabled: true,
        addDefaultValue: route.query.key,
        editDefaultValue: route.query.key,
        editDisabled: true,
        search: true,
        validateTrigger: "blur"
    },
    {
        title: "名称",
        dataIndex: "name",
        width: 120,
        align: "center",
        search: true,
        commonRules: [{ required: true, message: "名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "设计人员",
        width: 80,
        dataIndex: "designPerson",
        align: "center",
        search: true,
        formType: "select",
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "执行人员",
        dataIndex: "testPerson",
        width: 80,
        align: "center",
        search: true,
        formType: "select",
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "审核人员",
        dataIndex: "monitorPerson",
        width: 80,
        align: "center",
        search: true,
        formType: "select",
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "用例综述",
        align: "center",
        dataIndex: "summarize",
        search: true,
        addDefaultValue: ""
    },
    {
        title: "用例初始化",
        dataIndex: "initialization",
        hide: true,
        addDefaultValue: "软件正常启动，正常登录进软件"
    },
    {
        title: "前提和约束",
        dataIndex: "premise",
        hide: true,
        addDefaultValue: "软件正常启动，各界面显示工作正常"
    },
    {
        title: "测试步骤",
        dataIndex: "testStep",
        hide: true,
        addDefaultValue: [
            {
                operation: "",
                expect: "",
                result: "",
                passed: "3",
                status: "3"
            }
        ],
        formType: "children-form",
        type: "group",
        formList: [
            {
                title: "操作",
                dataIndex: "operation",
                formType: "editor",
                height: 180
            },
            {
                title: "预期",
                placeholder: "请输入预期结果",
                dataIndex: "expect"
            },
            {
                title: "结果",
                dataIndex: "result",
                formType: "editor",
                height: 180
            },
            {
                title: "是否通过",
                dataIndex: "passed",
                formType: "radio",
                dict: { name: "passType", props: { label: "title", value: "key" } },
                commonRules: [{ required: true, message: "是否通过必填" }]
            },
            {
                title: "执行状态",
                dataIndex: "status",
                formType: "radio",
                dict: { name: "execType", props: { label: "title", value: "key" } },
                commonRules: [{ required: true, message: "执行状态必填" }]
            }
        ]
    }
])
// 暴露刷新表格方法给外部
const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })
</script>

<style lang="less" scoped></style>
