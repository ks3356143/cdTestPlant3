<template>
    <div class="ma-content-block lg:flex justify-between p-4" ref="crudRef">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns">
                <!-- 字典标识列 -->
                <template #code="{ record }">
                    <a-tooltip content="点击查看字典数据">
                        <a-link @click="openDictList(record)">
                            {{ record.code }}
                        </a-link>
                    </a-tooltip>
                </template>
                <!-- 状态列 -->
                <template #status="{ record }">
                    <a-switch
                        :checked-value="1"
                        unchecked-value="2"
                        @change="changeStatus($event, record.id)"
                        :default-checked="record.status == 1"
                    >
                    </a-switch>
                </template>
                <template #operationBeforeExtend="{ record }">
                    <a-link @click="openDictList(record)"><icon-list /> 字典数据</a-link>
                </template>
            </ma-crud>
        </div>

        <data-list ref="datalistRef"></data-list>
    </div>
</template>

<script setup lang="jsx">
import { ref } from "vue"
import dictApi from "@/api/system/dict"
import { Message } from "@arco-design/web-vue"
import DataList from "./dataList.vue"

const crudRef = ref()
const datalistRef = ref()

// 打开datalist页面
const openDictList = async (row) => {
    datalistRef.value.open(row)
}

// 点击切换status
const changeStatus = async (status, id) => {
    const response = await dictApi.changeStatus({ id, status })
    if (response.success) {
        Message.success(response.message)
    }
}

const crudOptions = ref({
    api: dictApi.getDictIndex,
    showIndex: false,
    operationColumnAlign: "center",
    rowSelection: { showCheckedAll: true },
    searchColNumber: 4,
    tablePagination: false,
    operationColumn: true,
    showTools: false,
    afterDelete(response) {
        crudRef.value.tableRef.selectAll(false)
    }
})

const crudColumns = ref([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
        title: "字典备注",
        dataIndex: "remark",
        search: true,
        width: 220,
        align: "center",
        commonRules: [{ required: true, message: "字典备注必填" }]
    },
    {
        title: "字典标识",
        dataIndex: "code",
        search: true,
        width: 260,
        align: "center",
        commonRules: [{ required: true, message: "字典标识必填" }]
    },
    {
        title: "状态",
        dataIndex: "status",
        search: true,
        formType: "radio",
        align: "center",
        dict: { name: "data_status", props: { label: "title", value: "key" } },
        addDefaultValue: "1",
        width: 180
    },
    {
        title: "字典名称",
        dataIndex: "name",
        hide: true,
        formType: "textarea",
        align: "center"
    },
    {
        title: "更新时间",
        dataIndex: "update_datetime",
        addDisplay: false,
        editDisplay: false,
        align: "center",
        search: true,
        formType: "range",
        width: 180
    }
])

defineOptions({
    name: "dictmanage"
})
</script>

<style lang="less" scoped></style>
