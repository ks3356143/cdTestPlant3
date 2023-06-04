<template>
    <div class="modal">
        <a-modal v-model:visible="dialogVisible" @before-ok="handleOkBtn" @cancel="handleCancelBtn">
            <template #title> {{ props.title }} </template>
            <div class="content">
                <chen-form v-model="formData" v-bind="modelConfig"></chen-form>
                <slot></slot>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, defineProps, defineExpose } from 'vue'
    import chenForm from '@/base-ui/from'

    const props = defineProps({
        title: {
            type: String,
            default: '新建或编辑',
        },
        modelConfig: {
            type: Object,
            required: true,
        },
        defaultInfo: {
            type: Object,
            default: () => ({}),
        },
    })
    // 绑定数据在这里
    const formData = ref<any>({})
    const dialogVisible = ref(false)
    const handleOkBtn = (done: any) => {
        console.log(formData.value)
        console.log('点击了ok')
        // 这里发生异步请求时关闭
        setTimeout(() => {
            done()
        }, 1000)
    }
    const handleCancelBtn = () => {
        console.log('点击了取消')
    }
    // 监听父组件编辑，编辑回显
    watch(
        () => props.defaultInfo,
        (newValue) => {
            // eslint-disable-next-line no-restricted-syntax
            for (const item of props.modelConfig.formItems) {
                formData.value[item.field] = newValue[item.field]
            }
        }
    )
    // 暴露自己的显示隐藏变量
    defineExpose({
        dialogVisible,
    })
</script>

<style scoped></style>
