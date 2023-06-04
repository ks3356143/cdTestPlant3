<template>
    <div class="chen-form">
        <div class="header">
            <slot name="header"></slot>
        </div>
        <a-form :model="modelValue">
            <a-row>
                <template v-for="item in (formItems as any[])" :key="item.label">
                    <a-col v-bind="colLayout">
                        <a-form-item
                            v-if="!item.isHidden"
                            :field="item.field"
                            :rules="item.rules"
                            :validate-trigger="item.trigger"
                            :label="item.label"
                            :placeholder="item.placeholder"
                        >
                            <template v-if="item.type === 'input'">
                                <a-input
                                    allow-clear
                                    :placeholder="item.placeholder"
                                    :model-value="modelValue[`${item.field}`]"
                                    @update:model-value="handleValueChange($event, item.field)"
                                ></a-input>
                            </template>
                            <template v-else-if="item.type === 'password'">
                                <a-input-password
                                    allow-clear
                                    :placeholder="item.placeholder"
                                    :model-value="modelValue[`${item.field}`]"
                                    @update:model-value="handleValueChange($event, item.field)"
                                ></a-input-password>
                            </template>
                            <template v-else-if="item.type === 'select'">
                                <a-select
                                    allow-clear
                                    :placeholder="item.placeholder"
                                    style="width: 100%"
                                    :model-value="modelValue[`${item.field}`]"
                                    @update:model-value="handleValueChange($event, item.field)"
                                >
                                    <a-option
                                        v-for="option in (item as any).options"
                                        :key="option.value"
                                        :value="option.value"
                                        :label="option.label"
                                    ></a-option>
                                </a-select>
                            </template>
                            <template v-else-if="item.type === 'datepicker'">
                                <a-date-picker
                                    style="width: 100%"
                                    :model-value="modelValue[`${item.field}`]"
                                    @update:model-value="handleValueChange($event, item.field)"
                                ></a-date-picker>
                            </template>
                        </a-form-item>
                    </a-col>
                </template>
            </a-row>
        </a-form>
    </div>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits } from 'vue'

    const emit = defineEmits(['update:modelValue'])
    const props = defineProps({
        modelValue: {
            type: Object,
            required: true,
        },
        formItems: {
            type: Array,
            default: () => [],
        },
        colLayout: {
            type: Object,
            default: () => ({
                xs: 24,
                sm: 24,
                md: 24,
                lg: 24,
                xl: 24,
            }),
        },
    })

    const handleValueChange = (value: any, field: string) => {
        emit('update:modelValue', { ...props.modelValue, [field]: value })
    }
</script>

<style scoped></style>
