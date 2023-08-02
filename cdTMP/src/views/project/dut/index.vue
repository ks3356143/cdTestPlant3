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
import designDemandApi from "@/api/project/designDemand"
const route = useRoute()
const router = useRouter()
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
// crud组件
const crudOptions = ref({
    api: designDemandApi.getDesignDemandList,
    add: { show: true ,api: designDemandApi.save},
    edit: { show: true, api: designDemandApi.editDesignDemand },
    delete: { show: true,api: designDemandApi.delete },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber
    },
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    operationColumnAlign: "center",
    formOption: {
        width: 1200
    }
})
const crudColumns = ref([
    {
        title: "ID",
        align: "center",
        width: 50,
        dataIndex: "id",
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "标识",
        align: "center",
        width: 120,
        dataIndex: "ident",
        search: true,
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "需求名称",
        align: "center",
        width: 150,
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "需求名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "需求类型",
        width: 150,
        align: "center",
        dataIndex: "demandType",
        addDefaultValue: "1",
        formType: "radio",
        search: true,
        dict: { name: "demandType", props: { label: "title", value: "key" }, translation: true },
        commonRules: [{ required: true, message: "需求类型是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "需求描述",
        dataIndex: "description",
        hide: true,
        width: 300,
        formType: "editor",
        height: 300
    }
])
</script>

<style lang="less" scoped></style>
