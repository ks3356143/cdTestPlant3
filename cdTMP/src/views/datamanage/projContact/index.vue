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
import { Message } from "@arco-design/web-vue"
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
    rowSelection: { showCheckedAll: true }
})
const crudColumns = ref([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: "公司编号", align: "center", dataIndex: "key", search: true, width: 220 },
    {
        title: "名称",
        align: "center",
        dataIndex: "name",
        search: true,
        width: 220,
        commonRules: [{ required: true, message: "名称必填" }]
    },
    {
        title: "法人",
        align: "center",
        dataIndex: "entrust_person",
        search: true,
        width: 220,
        commonRules: [{ required: true, message: "法人必填" }]
    }
])
</script>

<style lang="less" scoped></style>
