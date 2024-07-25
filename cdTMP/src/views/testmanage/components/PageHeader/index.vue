<template>
    <a-page-header
        @back="handleBackClick"
        :style="{ background: 'var(--color-bg-2)' }"
        :title="props.data.title"
        v-if="isBlankObj(props.data)"
    >
        <template #subtitle>
            <a-space>
                <span>{{ props.data.name }}</span>
                <span class="text-base ml-3 text-red-950" v-if="!props.data.step">所属文档片段</span>
                <a-tag color="red" size="small" v-else>{{ props.data.step }}</a-tag>
            </a-space>
        </template>
    </a-page-header>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { useRouter } from "vue-router"
import type { IPageHeaderProps } from "./types"
// 组件属性
const props = defineProps({
    data: {
        type: Object as PropType<IPageHeaderProps>,
        required: true
    }
})
const isBlankObj = (data: IPageHeaderProps) => {
    return Object.keys(data).length > 0
}
const router = useRouter()
// 返回上个页面
const handleBackClick = () => {
    router.go(-1)
}
</script>

<style scoped lang="less">
:deep(.arco-page-header-main) {
    align-items: center;
}
</style>
