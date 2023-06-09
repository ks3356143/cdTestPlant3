<template>
    <a-space direction="vertical" size="large" fill>
        <a-descriptions
            :data="descriptions"
            :column="props.column"
            :title="props.title"
            :layout="props.layout"
            :bordered="props.bordered"
            table-layout="fixed"
            :size="props.size"
            :label-style="props.labelStyle"
            :value-style="props.valueStyle"
        >
            <a-descriptions-item v-for="item in descriptions" :label="item.label">
                <template v-if="item.formType === 'upload'">
                    <a-image-preview-group infinite v-if="isArray(item.value)">
                        <a-space>
                            <a-image v-for="src in item.value" :src="tool.viewImage(src)" width="50" />
                        </a-space>
                    </a-image-preview-group>
                    <a-image v-else :src="tool.viewImage(item.value)" width="50"></a-image>
                </template>
                <template v-else-if="item.infoSlot">
                    <slot :name="item.dataIndex" :row="item" :data="data"></slot>
                </template>
                <template v-else-if="item.formType === 'radio' || item.formType === 'select'">
                    <a-tag color="blue">{{ item.dict.data.find((row) => row.value == item.value)?.label }}</a-tag>
                </template>
                <div v-else>{{ item.value }} {{ item?.textAppend }}</div>
            </a-descriptions-item>
        </a-descriptions>
    </a-space>
</template>

<script setup>
import { getCurrentInstance, inject, provide, ref, watch } from "vue"
import tool from "@/utils/tool"
import { get, isArray, isBoolean, isEmpty, isFunction } from "lodash"
import { loadDict } from "@cps/ma-form/js/networkRequest.js"
import globalColumn from "@/config/column.js"

const dictList = {}
const app = getCurrentInstance().appContext.app
const columns = ref([])
const data = ref({})
const descriptions = ref([])
const dictData = ref([])
const props = defineProps({
    columns: { type: Array, default: [] },
    data: {},
    column: { default: 3 },
    title: {
        default: ""
    },
    bordered: {
        default: true
    },
    layout: {
        default: "vertical"
    },
    labelStyle: {
        default: {}
    },
    valueStyle: {
        default: {}
    },
    size: {
        default: "large"
    }
})

watch(
    () => props.columns,
    (vl) => {
        columns.value = vl
    },
    { deep: true, immediate: true }
)

const reset = (vl) => {
    data.value = vl // 外传columns
    descriptions.value = [] // 初始化表达数据
    if (!columns.value) { // 如果不存在columns值则不处理
        return
    }
    columns.value.forEach(async (item) => {
        let value = null
        // 如果item为空、dataIndex为"__operation"、infoShow属性为false则不处理
        if (isEmpty(item) || item.dataIndex === "__operation" || item.infoShow === false) {
            return
        }
        // 处理公共列
        if (isBoolean(item.common) && item.common && globalColumn[item.dataIndex]) {
            item = globalColumn[item.dataIndex]
        }
        // 处理字典字段
        if (item.dict) {
            await loadDict(dictList, item)
            item.dict.data = dictList[item.dataIndex] ?? []
        }
        if (isFunction(item.customRender)) {
            value = item.customRender({ record: data.value })
        }
        descriptions.value.push({
            ...item,
            label: item.title,
            value: value ?? get(data.value, item.dataIndex)
        })
    })
}

watch(
    () => props.data,
    (vl) => {
        reset(vl)
    },
    { deep: true, immediate: true }
)

defineExpose({ reset })
</script>

<style scoped></style>
