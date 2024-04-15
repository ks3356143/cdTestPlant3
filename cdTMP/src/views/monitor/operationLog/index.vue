<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #create_datetime="{ record }">
                    {{ record.create_datetime.replace("T", " ") }}
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import operationApi from "@/api/monitor/operationLog"

const crudRef = ref()
const crudOptions = reactive({
    api: operationApi.getOperationsLogs,
    showIndex: false,
    pageLayout: "fixed",
    rowSelection: { showCheckedAll: true },
    showTools: false,
    tablePagination: false
})
const crudColumns = reactive([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    { title: "用户", dataIndex: "user", search: true, align: "center" },
    { title: "操作对象", dataIndex: "operate_obj", align: "center" },
    { title: "操作内容", dataIndex: "operate_des", align: "center" },
    { title: "时间", dataIndex: "create_datetime", align: "center", search: true, formType: "range" }
])
</script>

<style lang="less" scoped></style>
