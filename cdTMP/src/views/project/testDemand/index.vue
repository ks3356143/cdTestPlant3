<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns">
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
const projectId = ref(route.query.id)
// 标识显示字段
const showType = (record) => {
    let key_string = parseInt(record.key.substring(record.key.lastIndexOf("-") + 1)) + 1
    return record.ident + "-" + "YL" + key_string.toString().padStart(3,"0")
}
// crud设置
const crudOptions = ref({
    api: caseApi.getCaseList,
    add: { show: true, api: caseApi.save },
    edit: { show: true, api: caseApi.update },
    delete: { show: true, api: caseApi.delete },
    // 处理新增删除后树状图显示
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
        title: "标识",
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
        commonRules: [{ required: true, message: "设计人员必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "执行人员",
        dataIndex: "testPerson",
        width: 80,
        align: "center",
        search: true,
        formType: "select",
        commonRules: [{ required: true, message: "执行人员必填" }],
        dict: { url: "system/user/list", translation: true, props: { label: "name", value: "name" } }
    },
    {
        title: "审核人员",
        dataIndex: "monitorPerson",
        width: 80,
        align: "center",
        search: true,
        formType: "select",
        commonRules: [{ required: true, message: "审核人员必填" }],
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
                formType: "editor"
            },
            {
                title: "预期",
                placeholder: "请输入预期结果",
                dataIndex: "expect"
            },
            {
                title: "结果",
                dataIndex: "result",

                formType: "editor"
            },
            {
                title: "是否通过",
                dataIndex: "passed",
                formType: "radio",
                dict: { name: "passType", props: { label: "title", value: "key" } }
            },
            {
                title: "执行状态",
                dataIndex: "status",
                formType: "radio",
                dict: { name: "execType", props: { label: "title", value: "key" } }
            }
        ]
    }
])
</script>

<style lang="less" scoped></style>
