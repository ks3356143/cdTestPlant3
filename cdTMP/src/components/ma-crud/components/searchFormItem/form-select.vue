<template>
    <a-select
        v-model="value"
        :virtual-list-props="props.component.virtualListProps"
        :placeholder="props.component.searchPlaceholder ?? `请选择${props.component.title}`"
        allow-clear
        allow-search
        :scrollbar="props.component.scrollbar"
        :format-label="props.component.formatLabel"
        :max-tag-count="1"
        :options="dicts[props.component.dataIndex]"
        :multiple="props.component.multiple || ['transfer', 'checkbox'].includes(props.component.formType)"
        @change="handlerChangeeEvent"
    />
</template>

<script setup>
import { ref, inject, watch } from "vue"
import { handlerCascader } from "@cps/ma-form/js/networkRequest"
import { get, set } from "lodash-es"
const props = defineProps({
    component: Object
})
const searchForm = inject("searchForm")
const columns = inject("columns")
const dicts = inject("dicts")

let defaultValue

if (props.component.multiple === true) {
    defaultValue = props.component.searchDefaultValue ?? []
} else {
    defaultValue = props.component.searchDefaultValue ?? ""
}

const value = ref(get(searchForm.value, props.component.dataIndex, defaultValue))
set(searchForm.value, props.component.dataIndex, value.value)

watch(
    () => get(searchForm.value, props.component.dataIndex),
    (vl) => (value.value = vl)
)
watch(
    () => value.value,
    (v) => set(searchForm.value, props.component.dataIndex, v)
)

const handlerChangeeEvent = (value) => {
    handlerCascader(value, props.component, columns, dicts, searchForm.value)
}
</script>
