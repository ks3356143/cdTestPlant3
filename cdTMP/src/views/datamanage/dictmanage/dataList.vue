<template>
    <a-modal v-model:visible="visible" fullscreen :footer="false">
        <template #title>维护数据字典 →【{{ currentRow.name }}】</template>
        <!-- crud组件 -->
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <ma-crud :options="crudOptions" :columns="columns" ref="crudRef">
                <!-- 排序列 -->
                <template #sort="{ record }">
                    <a-input-number
                        :default-value="record.sort"
                        mode="button"
                        @change="changeSort($event, record.id)"
                        :min="0"
                        :max="1000"
                    />
                </template>
                <!-- 状态列 -->
                <template #status="{ record }">
                    <a-switch
                        :checked-value="1"
                        unchecked-value="2"
                        @change="changeStatus($event, record.id)"
                        :default-checked="record.status == 1"
                    />
                </template>
            </ma-crud>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, nextTick } from "vue"
import dictApi from "@/api/system/dict"
import { Message } from "@arco-design/web-vue"

const crudRef = ref()
const visible = ref(false)
const currentRow = ref({ id: undefined, name: undefined })

// 改变dictItem的sort字段
const changeSort = async (value, id) => {
    const response = await dictApi.numberOperation({ id, numberName: "sort", numberValue: value })
    if (response.success) {
        Message.success(response.message)
    }
}
// 改变dictItem状态
const changeStatus = async (status, id) => {
    const response = await dictApi.changeItemStatus({ id, status })
    if (response.success) {
        Message.success(response.message)
    }
}

// 打开a-modal事件
const open = (row) => {
    currentRow.value = row
    // 调用固定方法请求数据
    crudRef.value.requestParams = { id: currentRow.value.id }
    crudRef.value.requestData()
    visible.value = true
}
// crudOptions
const crudOptions = ref({
    autoRequest: false,
    api: dictApi.getDictItemAll,
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    operationColumn: true,
    operationWidth: 160,
    operationColumnAlign:'center',
    beforeAdd: (form) => {
        form.id = currentRow.value?.id
    },
    add: { show: true, api: dictApi.saveDictItem },
    edit: { show: true, api: dictApi.updateDictItemData },
    delete: { show: true, api: dictApi.realDeleteItem },
})
// crudColumns
const columns = ref([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: true },
    {
        title: "字典标签",
        align: "center",
        dataIndex: "title",
        search: true,
        width: 220,
        commonRules: [{ required: true, message: "字典标签必填" }]
    },
    {
        title:"字段缩写",
        dataIndex:"show_title",
        width: 220,
        align: "center",
        search: true,
    },
    {
        title: "字典键值",
        align: "center",
        dataIndex: "key",
        addDisplay: false,
        editDisplay: false,
        search: true,
        width: 220,
        commonRules: [{ required: true, message: "字典键值必填" }]
    },
    {
        title: "排序",
        align: "center",
        dataIndex: "sort",
        formType: "input-number",
        addDefaultValue: 1,
        width: 180,
        min: 0,
        max: 1000
    },
    {
        title: "状态",
        align: "center",
        dataIndex: "status",
        search: true,
        addDefaultValue: "1",
        formType: "radio",
        dict: { name: "data_status", props: { label: "title", value: "key" } },
        addDefaultValue: "1",
        width: 180
    },
    {
        title: "备注",
        align: "center",
        dataIndex: "remark",
        hide: true,
        formType: "textarea"
    },
    {
        title: "更新时间",
        align: "center",
        dataIndex: "update_datetime",
        addDisplay: false,
        editDisplay: false,
        search: true,
        formType: "range",
        width: 180
    }
])

// 暴露自己的open方法
defineExpose({ open })
</script>

<style lang="less" scoped></style>