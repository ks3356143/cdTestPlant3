<template>
    <a-input
        v-model="value"
        :placeholder="props.component.searchPlaceholder ?? `请输入${props.component.title}`"
        allow-clear
    />
</template>

<script setup>
import { ref, inject, watch } from "vue"
import { get, set } from "lodash"
const props = defineProps({
    component: Object
})
const searchForm = inject("searchForm")

const value = ref(get(searchForm.value, props.component.dataIndex, props.component.searchDefaultValue ?? ""))
set(searchForm.value, props.component.dataIndex, value.value)

watch(
    () => get(searchForm.value, props.component.dataIndex),
    (vl) => (value.value = vl)
)
watch(
    () => value.value,
    (v) => set(searchForm.value, props.component.dataIndex, v)
)
</script>
