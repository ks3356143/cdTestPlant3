<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef" @beforeCancel="handleBeforeCancel">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
            </ma-crud>
        </div>
        <problem-form ref="problemFormRef" :title="title"></problem-form>
    </div>
</template>

<script setup lang="jsx">
import { ref, getCurrentInstance } from "vue"
import { useRoute } from "vue-router"
import caseApi from "@/api/project/case"
import { useTreeDataStore } from "@/store"
import ProblemForm from "@/views/project/case/components/ProblemForm.vue"
import { isEqual, cloneDeep } from "lodash-es"
const problemFormRef = ref(null)
const title = ref("问题单表单")
const treeDataStore = useTreeDataStore()
const route = useRoute()
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

// crud设置以及是否保留step数据事件函数
const app = getCurrentInstance().appContext.config.globalProperties
let beforeFormStep = undefined
// 注意只保留测试步骤!!!
const handleBeforeCancel = () => {
    if (!beforeFormStep) {
        return
    }
    crudRef.value.getFormData().testStep
    const iuEqualValue = isEqual(crudRef.value.getFormData().testStep, beforeFormStep)
    !iuEqualValue &&
        app.$modal.confirm({
            title: "测试项步骤内容你已改动，是否保留您编写的测试项/测试用例步骤数据？",
            content: "",
            okText: "保留",
            cancelText: "恢复原数据",
            simple: true,
            onOk: () => null,
            onCancel: () => {
                crudRef.value.refresh()
            }
        })
}
const crudOptions = ref({
    api: caseApi.getCaseList,
    add: { show: true, api: caseApi.save, text: "新增用例" },
    edit: { show: true, api: caseApi.update, text: "修改用例" },
    delete: { show: true, api: caseApi.delete },
    operationColumnAlign: "center",
    isDbClickEdit: false, // 关闭双击编辑
    // 处理新增删除后树状图显示
    beforeOpenAdd: function () {
        // 1.新增则将form的content数据变为undifined以便判断
        beforeFormStep = undefined
        // 2.标识处理
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
        // 1.储存打开前form的content数据到ref中，以便后续比较
        beforeFormStep = cloneDeep(record.testStep)
        // 2.标识处理
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let design_key = key_split[2]
        let test_key = key_split[3]
        let td = treeDataStore.treeData
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
        // 被删除还是在选择里面
        crudRef.value.tableRef.selectAll(false)
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
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "summarize" }] }]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "initialization" }] }]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "premise" }] },
                    { span: 12, formList: [{ dataIndex: "exe_time" }] }
                ]
            }
        ]
    }
})
const crudColumns = ref([
    {
        title: "ID",
        width: 60,
        align: "center",
        hide: true,
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
        addDefaultValue: "用例标识自动生成，结构为YL_IO_XXXX_001",
        editDefaultValue: "用例标识自动生成，结构为YL_IO_XXXX_001",
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
        title: "是否通过",
        align: "center",
        display: false,
        addDisplay: false,
        editDisplay: false,
        customRender: ({ record }) => {
            let passCount = 0
            let failCount = 0
            let stepCount = record.testStep.length
            record.testStep.forEach((item) => {
                if (item.passed === "1") {
                    passCount++
                } else if (item.passed === "2") {
                    failCount++
                }
            })
            if (failCount > 0) {
                return (
                    <a-tag bordered color="red">
                        未通过
                    </a-tag>
                )
            } else {
                if (passCount === stepCount) {
                    return (
                        <a-tag bordered color="green">
                            已通过
                        </a-tag>
                    )
                } else {
                    return (
                        <a-tag bordered color="orange">
                            包含未执行
                        </a-tag>
                    )
                }
            }
        }
    },
    {
        title: "设计人员",
        width: 80,
        dataIndex: "designPerson",
        align: "center",
        hide: true,
        search: true,
        formType: "select",
        dict: {
            url: "system/user/list",
            params: { project_id: route.query.id },
            translation: true,
            props: { label: "name", value: "name" }
        }
    },
    {
        title: "执行人员",
        dataIndex: "testPerson",
        width: 80,
        align: "center",
        search: true,
        formType: "select",
        dict: {
            url: "system/user/list",
            params: { project_id: route.query.id },
            translation: true,
            props: { label: "name", value: "name" }
        }
    },
    {
        title: "审核人员",
        dataIndex: "monitorPerson",
        width: 80,
        align: "center",
        hide: true,
        formType: "select",
        dict: {
            url: "system/user/list",
            params: { project_id: route.query.id },
            translation: true,
            props: { label: "name", value: "name" }
        }
    },
    {
        title: "用例综述",
        align: "center",
        dataIndex: "summarize",
        hide: true,
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
        title: "执行时间",
        dataIndex: "exe_time",
        hide: true,
        formType: "date"
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
                passed: "3"
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
            }
        ]
    },
    {
        title: "关联问题",
        dataIndex: "problem",
        width: 120,
        addDisplay: false,
        editDisplay: false,
        align: "center",
        customRender: ({ record }) => {
            if (record.problem) {
                return (
                    <a-link
                        onClick={() => {
                            title.value = `PT_${route.query.ident}_${record.problem.ident.padStart(3, 0)}`
                            problemFormRef.value.open(record.problem)
                        }}
                    >{`PT_${route.query.ident}_${record.problem.ident.padStart(3, 0)}`}</a-link>
                )
            } else {
                return "无问题单"
            }
        }
    }
])
// 暴露刷新表格方法给外部
const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })

defineOptions({
    name: "testDemand"
})
</script>

<style lang="less" scoped></style>
