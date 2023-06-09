<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns"></ma-crud>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import testDemandApi from "@/api/project/testDemand"
const route = useRoute()
const router = useRouter()
// 根据传参获取key，分别为轮次、设计需求的key
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[0]
const designDemandNumber = route.query.key.split("-")[2]
// crud组件
const crudOptions = ref({
    api: testDemandApi.getTestDemandList,
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber,
        designDemand: designDemandNumber
    },
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    add: { show: true },
    edit: { show: true, api: testDemandApi.editTestDemand },
    delete: { show: true },
    searchColNumber: 3,
    tablePagination: true,
    operationColumn: true,
    formOption: {
        width: 1200
    }
})
const crudColumns = ref([
    {
        title: "ID",
        align: "center",
        width: 50,
        dataIndex: "id"
    },
    {
        title: "标识",
        dataIndex: "ident",
        align: "center",
        search: true,
        commonRules: [{ required: true, message: "标识是必填" }],
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
        title: "优先级",
        dataIndex: "priority",
        search: true,
        formType: "radio",
        align: "center",
        addDefaultValue: "1",
        dict: {
            name: "priority",
            props: { label: "title", value: "key" },
            translation: true,
            tagColors: { 1: "red", 2: "blue", 3: "green" }
        }
    },
    {
        title: "测试类型",
        dataIndex: "testType",
        search: true,
        align: "center",
        formType: "select",
        sortable: { sortDirections: ["ascend", "descend"] },
        addDefaultValue: "3",
        maxLength: 200,
        commonRules: [{ required: true, message: "测试类型必选" }],
        dict: { name: "testType", translation: true, props: { label: "title", value: "key" } },
        extra: "请保证测试类型选择正确"
    },
    {
        title: "充分条件",
        hide: true,
        addDefaultValue: "覆盖需求相关功能",
        dataIndex: "adequacy",
        commonRules: [{ required: true, message: "充分性描述必填" }]
    },
    {
        title: "终止条件",
        hide: true,
        dataIndex: "termination",
        formType: "textarea",
        showWordLimit: true,
        maxLength: 200,
        addDefaultValue:
            "1.测试正常终止：测试项分解的所有用例执行完毕，达到充分性要求，相关记录完整;\n2.测试异常终止：由于某些特殊原因导致该测试项分解的测试用例不能完全执行，无法执行的原因已记录",
        commonRules: [{ required: true, message: "前提条件必填" }]
    },
    {
        title: "前提条件",
        hide: true,
        addDefaultValue: "软件正常运行，外部接口通信正常",
        dataIndex: "premise",
        commonRules: [{ required: true, message: "前提条件必填" }]
    },
    {
        title: "测试方法",
        align: "center",
        dataIndex: "testMethod",
        commonRules: [{ required: true, message: "测试方法必填" }]
    },
    {
        title: "测试内容",
        hide: true,
        dataIndex: "testContent",
        commonRules: [{ required: true, message: "测试内容必填" }],
        formType: "children-form",
        type: "table",
        formList: [
            {
                title: "测试分解",
                dataIndex: "testXuQiu"
            },
            {
                title: "预期",
                dataIndex: "testYuQi"
            }
        ]
    }
])
</script>

<style lang="less" scoped></style>
