<template>
    <ma-form-item
        v-if="typeof props.component.display == 'undefined' || props.component.display === true"
        :component="props.component"
        :custom-field="props.customField"
    >
        <slot :name="`form-${props.component.dataIndex}`" v-bind="props.component">
            <ma-editor
                v-model="value"
                style="width: 100%"
                :height="props.component.height"
                :id="props.component.id"
                @change="maEvent.handleChangeEvent(props.component, $event)"
            >
            </ma-editor>
        </slot>
    </ma-form-item>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue"
import { get, set } from "lodash"
import MaEditor from "@/components/ma-editor/index.vue"
import MaFormItem from "./form-item.vue"
import { maEvent } from "../js/formItemMixin.js"
const props = defineProps({
    component: Object,
    customField: { type: String, default: undefined }
})

const formModel = inject("formModel")
const index = props.customField ?? props.component.dataIndex
const value = ref(get(formModel.value, index))

watch(
    () => get(formModel.value, index),
    (vl) => (value.value = vl)
)
watch(
    () => value.value,
    (v) => {
        set(formModel.value, index, v)
        index.indexOf(".") > -1 && delete formModel.value[index]
    }
)

maEvent.handleCommonEvent(props.component, "onCreated")
onMounted(() => {
    maEvent.handleCommonEvent(props.component, "onMounted")
})
</script>
