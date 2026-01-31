<template>
    <div class="project-modal-container">
        <a-modal v-model:visible="visible" width="70%" draggable :on-before-ok="handleSyncOk">
            <template #title>{{ "软件概述" }}</template>
            <div class="mb-2">
                <a-space>
                    <a-dropdown>
                        <a-button type="primary">新增元素<icon-plus /></a-button>
                        <template #content>
                            <a-doption @click="addTextRow">文字</a-doption>
                            <a-doption @click="addPicRow">图片</a-doption>
                            <a-doption @click="addTableRow">表格</a-doption>
                        </template>
                    </a-dropdown>
                    <a-alert type="warning" style="height: 32px">段落（文）会在word渲染时自动缩进2个字符</a-alert>
                </a-space>
            </div>
            <a-table :columns="columns" :show-header="false" :data="data" @change="handleChange" :draggable="{ type: 'handle', width: 40 }"> </a-table>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import useTable from "./hooks/useTable"

const visible = ref(false)

const { columns, data, handleChange, addTextRow, addPicRow, addTableRow } = useTable()

const handleSyncOk = async () => {
    return false
}

const open = async () => {
    visible.value = true
}

defineExpose({ open })

defineOptions({
    name: "ProjectModal"
})
</script>

<style scoped></style>
