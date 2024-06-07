<template>
    <div class="empty-container">
        <icon-empty :size="60" />
        <p>{{ text }}</p>
    </div>
</template>

<script setup>
import { ref } from "vue"
const text = ref("暂无数据")
</script>

<style lang="less" scoped>
.empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #aaa;
    p {
        margin-top: 6px;
        user-select: none;
    }
}
</style>
