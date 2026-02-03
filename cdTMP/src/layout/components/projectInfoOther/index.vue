<template>
    <div class="project-info-other-container">
        <a-dropdown>
            <a-button class="nav-btn">
                <template #icon>
                    <icon-settings />
                </template>
                <a-space>
                    <span>项目设置</span>
                    <a-tooltip :content="allStatus ? '您已全部填写' : '还有未填写项目'">
                        <span class="text-green-500" v-if="allStatus">
                            <icon-check-circle-fill />
                        </span>
                        <span class="text-red-500" v-else><icon-exclamation-circle-fill /></span>
                    </a-tooltip>
                </a-space>
            </a-button>
            <template #content>
                <template v-for="item in inputOptions" :key="item.name">
                    <template v-if="!item.status">
                        <a-tooltip :content="`还未录入${item.title}`">
                            <a-doption @click="item.handler">
                                <span class="mr-1">{{ item.title }}</span>
                                <span class="text-red-500"><icon-exclamation-circle-fill /></span>
                            </a-doption>
                        </a-tooltip>
                    </template>
                    <template v-else>
                        <a-doption @click="item.handler">
                            <span class="mr-1">{{ item.title }}</span>
                            <span class="text-green-500"><icon-check-circle-fill /></span>
                        </a-doption>
                    </template>
                </template>
            </template>
        </a-dropdown>
        <project-modal ref="projectModalRef" :reset="fetchAllStatus" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import ProjectModal from "./projectModal/index.vue"
import projectApi from "@/api/project/project"
import { useRoute } from "vue-router"
import { Message } from "@arco-design/web-vue"

const route = useRoute()

// ref
const projectModalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

// events
const clickSoftSummary = async () => {
    projectModalRef.value?.open()
}

// 进入页面时候请求知道各项目样式情况-ref
const fetchAllStatus = async () => {
    try {
        const { data }: { data: Object } = await projectApi.getAllStatus(route.query.id)
        inputOptions.value = inputOptions.value.map((it) => {
            if (data.hasOwnProperty(it.name)) {
                it.status = data[it.name]
            }
            return { ...it }
        })
    } catch (e) {
        Message.error("查询项目级信息是否填写失败，请检查网络")
    }
}

onMounted(async () => {
    await fetchAllStatus()
})

const inputOptions = ref([
    {
        name: "soft_summary",
        title: "软件概述",
        status: false,
        handler: clickSoftSummary
    },
    {
        name: "static_soft_item",
        title: "接口图",
        status: true,
        handler: () => {
            console.log("暂未实现")
        }
    }
])
const allStatus = computed(() => inputOptions.value.every((item) => item.status))

defineOptions({
    name: "ProjectInfoOther"
})
</script>

<style scoped lang="less"></style>
