<template>
    <a-layout class="layout">
        <div class="navbar layout-navbar">
            <NavBar :title="$route.query.name" />
        </div>
        <a-layout class="layout">
            <a-layout class="layout layout-demo">
                <a-layout-sider class="layout-sider">
                    <div class="p-2">
                        <a-input-group class="mb-2 w-full flex items-center" size="mini">
                            <a-input style="height: 32px"></a-input>
                            <a-button>搜索</a-button>
                        </a-input-group>
                        <a-tree
                            :data="treeData"
                            size="small"
                            block-node
                            animation
                            @select="pointNode"
                            :load-more="loadMore"
                            showLine
                            ref="treeRef"
                        ></a-tree>
                    </div>
                </a-layout-sider>
            </a-layout>
            <a-layout class="layout-content">
                <a-layout-content class="work-area">
                    <PageLayout />
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { provide, ref, onMounted } from "vue"
import NavBar from "@/layout/components/navbar.vue"
import PageLayout from "@/layout/page-layout.vue"
import projectApi from "@/api/project/project"
import { useRoute } from "vue-router"
// 缩小后的menu菜单
const drawerVisible = ref(false)
provide("toggleDrawerMenu", () => {
    drawerVisible.value = !drawerVisible.value
})
// 树状
/// 初始化round轮次数据
const route = useRoute()
const treeRef = ref()
const treeData = ref([])
const projectId = ref(route.query.id)
onMounted(async () => {
    const roundData = await projectApi.getRoundInfo(projectId)
    treeData.value = roundData
})
/// 点击树状节点-参数传入为key的值
const pointNode = (value, data) => {
    console.log("点击的节点为:", value)
    console.log(data.node)
}
/// 动态加载函数-参数当前节点点击下箭头
const loadMore = (nodeData) => {
    console.log("动态加载的节点为：", nodeData) // 输出点击节点的key,以及添加上去的level属性
    return new Promise(async (resolve) => {
        const res = await projectApi.getDemandInfo(route.query.id, nodeData.key, nodeData.level)
        nodeData.children = res
        resolve()
    })
}
</script>

<style lang="less" scoped>
.tree {
    height: 100%;
}
.layout-demo :deep(.arco-layout-sider) {
    width: 300px !important;
}
.layout {
    width: 100%;
    height: 100%;
}

.layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 60px;
}

.layout-sider {
    position: fixed;
    top: 60px;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
        position: absolute;
        top: 0;
        right: -1px;
        display: block;
        width: 1px;
        height: 100%;
        background-color: var(--color-border);
        content: "";
    }

    > :deep(.arco-layout-sider-children) {
        overflow-y: hidden;
    }
}

.layout-content {
    min-height: 100vh;
    overflow-y: auto;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>
