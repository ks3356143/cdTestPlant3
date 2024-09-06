<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef"></ma-crud>
        </div>
    </div>
</template>

<script lang="jsx" setup>
import { ref } from "vue"
import { Message } from "@arco-design/web-vue"
import abbreviationApi from "@/api/system/abbreviation"

const crudRef = ref()
const crudOptions = ref({
    autoRequest: true,
    api: abbreviationApi.getlist,
    add: { show: true, api: abbreviationApi.save },
    edit: { show: true, api: abbreviationApi.update },
    delete: { show: true, api: abbreviationApi.delete },
    operationWidth: 160,
    operationColumn: true,
    operationColumnAlign: "center",
    showIndex: false,
    searchColNumber: 3,
    tablePagination: false,
    rowSelection: { showCheckedAll: true },
    afterDelete(response) {
        crudRef.value.tableRef.selectAll(false)
    }
})
const crudColumns = ref([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
        title: "缩略语",
        align: "center",
        width: 200,
        dataIndex: "title",
        search: true,
        commonRules: [{ required: true, message: "缩略语必填" }]
    },
    {
        title: "全称",
        align: "center",
        dataIndex: "des",
        search: true,
        ellipsis: true,
        commonRules: [{ required: true, message: "全称和描述必填" }]
    }
])

defineOptions({
    name: "abbreviation"
})
</script>

<style lang="less" scoped></style>
