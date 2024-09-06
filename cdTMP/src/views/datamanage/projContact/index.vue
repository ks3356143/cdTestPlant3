<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef"></ma-crud>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import contactApi from "@/api/system/contact"

const crudRef = ref()
const crudOptions = ref({
    autoRequest: true,
    api: contactApi.getlist,
    add: { show: true, api: contactApi.save },
    edit: { show: true, api: contactApi.update },
    delete: { show: true, api: contactApi.delete },
    operationWidth: 160,
    operationColumn: true,
    operationColumnAlign: "center",
    showIndex: false,
    searchColNumber: 3,
    tablePagination: false,
    rowSelection: { showCheckedAll: true },
    showTools: false,
    afterDelete() {
        crudRef.value.tableRef.selectAll(false)
    }
})
const crudColumns = ref([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: "公司编号", align: "center", dataIndex: "key", search: true, width: 70, formType: "input-number" },
    {
        title: "名称",
        align: "center",
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "名称必填" }]
    },
    {
        title: "简称",
        align: "center",
        dataIndex: "refer_name",
        width: 200,
        search: true,
        commonRules: [{ required: true, message: "简称必填" }]
    },
    {
        title: "法人",
        align: "center",
        dataIndex: "entrust_person",
        search: true,
        width: 90,
        commonRules: [{ required: true, message: "法人必填" }]
    },
    {
        title: "地址",
        align: "center",
        dataIndex: "addr",
        search: true,
        commonRules: [{ required: true, message: "公司地址必填" }]
    }
])
</script>

<style lang="less" scoped></style>
