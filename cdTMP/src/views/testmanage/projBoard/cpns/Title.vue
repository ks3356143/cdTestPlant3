<template>
    <div class="title-container">
        <div class="ma-content-block rounded-sm flex-col justify-between w-full p-3 bg-color">
            <a-page-header
                @back="handleBackClick"
                :style="{ background: 'var(--color-bg-2)' }"
                :title="props.pInfo.ident"
            >
                <template #subtitle>
                    <a-space>
                        <span>{{ props.pInfo.name }}</span>
                        <a-tag color="red" size="small">{{ props.pInfo.step }}</a-tag>
                    </a-space>
                </template>
            </a-page-header>
            <div class="title">基本信息</div>
            <div class="item-container">
                <a-card
                    class="item"
                    v-for="(val, key) in pInfo.title_info"
                    :style="{ width: '360px' }"
                    :title="key"
                    :key="key"
                    hoverable
                >
                    <ul class="li-container">
                        <li v-for="(v, k) in val" :key="k">
                            <div class="key">{{ k }}:</div>
                            <div class="value">{{ v }}</div>
                        </li>
                    </ul>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
const router = useRouter()

// 1.头部-点击返回
const handleBackClick = () => {
    router.go(-1)
}
// 2.定义props
const props = defineProps({
    pInfo: {
        type: Object,
        required: true
    }
})
</script>

<style lang="less" scoped>
:deep(.arco-page-header-main) {
    align-items: center;
}
.item-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item {
        height: 11rem;
        .li-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            li {
                display: flex;
                line-height: 1.5;
                gap: 5px;
                .value {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    white-space: nowrap;
                    font-weight: 700;
                }
            }
        }
    }
}
.title {
    margin: 10px;
    font-weight: 700;
    font-size: 1rem;
}
</style>
