<template>
    <div class="project-info-other-container">
        <a-dropdown>
            <a-button class="nav-btn">
                <template #icon>
                    <icon-settings />
                </template>
                <a-space>
                    <span>项目设置</span>
                    <!-- 这里表示总体状态: not done -->
                    warning
                </a-space>
            </a-button>
            <template #content>
                <a-doption @click="ClickSoftSummary">软件概述</a-doption>
                <a-doption>软件接口信息</a-doption>
            </template>
        </a-dropdown>
        <project-modal ref="projectModalRef" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import ProjectModal from "./projectModal/index.vue"

// ref
const projectModalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

// events
const ClickSoftSummary = async ()=>{
    projectModalRef.value?.open()
}

defineOptions({
    name: "ProjectInfoOther"
})
</script>

<style scoped lang="less"></style>
