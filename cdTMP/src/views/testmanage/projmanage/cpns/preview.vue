<template>
    <!-- 描述列表组件 -->
    <a-modal width="1000px" v-model:visible="visible" :footer="false">
        <template #title>{{ previewRecord.name }}</template>
        <ma-info :columns="columns" :data="previewRecord" column="3"></ma-info>
    </a-modal>
</template>

<script setup>
import { ref, reactive } from "vue"
import MaInfo from "@/components/ma-info/index.vue"
// 提供open方法给外界，并获取整行数据
const visible = ref(false)
const previewRecord = ref({})
const columns = ref([])
const open = (record, outColumns) => {
    visible.value = true
    previewRecord.value = record
    columns.value = outColumns
}
defineExpose({ open })
// MA-INFO的columns
</script>

<style lang="less" scoped></style>
