<template>
    <a-form-item
        :label="props.component.title"
        :field="props.customField ?? props.component.dataIndex"
        :tooltip="props.component.tooltip"
        :show-colon="props.component.showColon"
        :label-col-flex="props.component.labelColFlex ?? 'auto'"
        :label-col-style="{
            width: props.component.labelWidth ? props.component.labelWidth : options.labelWidth || '100px'
        }"
        :rules="props.component.rules"
        :disabled="props.component.disabled"
        :help="props.component.help"
        :extra="props.component.extra"
        :required="props.component.required"
        :hide-label="props.component.hideLabel"
        :content-class="props.component.contentClass"
        :feedback="props.component.feedback"
        :validate-trigger="props.component.validateTrigger ?? 'blur-sm'"
        :validate-status="props.component.validateStatus"
        :class="[props.component.customClass]"
    >
        <slot></slot>
    </a-form-item>
</template>
<script setup>
import { inject } from "vue"
const options = inject("options")
const props = defineProps({
    component: Object,
    customField: { type: String, default: null }
})
</script>
