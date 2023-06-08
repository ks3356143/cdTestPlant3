<template>
    <router-view v-slot="{ Component, route }" class="mx-2 my-2">
        <transition name="ma-fade" mode="out-in" appear>
            <!-- 这里主要在路由定义是否缓存页面 -->
            <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
            <keep-alive v-else :include="cacheList">
                <component :is="Component" :key="route.fullPath"></component>
            </keep-alive>
        </transition>
    </router-view>
</template>

<script setup>
import { computed } from "vue"
import { useTabBarStore } from "@/store"
// 获取缓存列表
const tabBarStore = useTabBarStore()
const cacheList = computed(() => tabBarStore.getCacheList)
</script>

<style lang="less" scoped></style>
