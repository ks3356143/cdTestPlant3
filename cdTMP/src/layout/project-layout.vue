<template>
    <a-layout class="layout">
        <div class="navbar layout-navbar">
            <NavBar :title="projectInfo.name" />
        </div>
        <a-layout class="layout">
            <a-layout class="layout layout-demo">
                <a-layout-sider class="layout-sider">
                    <div class="p-2">
                        <a-input-group class="mb-2 w-full flex items-center" size="mini">
                            <a-input style="height: 32px" v-model="searchKey" allow-clear></a-input>
                            <a-button @click="handleSearchTreeDataClick">搜索</a-button>
                        </a-input-group>
                        <a-input-group class="mb-2 w-full flex items-center justify-between" size="mini">
                            <a-button class="w-1/2" type="primary">增加轮次</a-button>
                            <a-button class="w-1/2" type="primary" status="danger">删除轮次</a-button>
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
                            border
                            :default-selected-keys="[currentNode ? currentNode : route.query.key]"
                        ></a-tree>
                    </div>
                </a-layout-sider>
                <a-layout class="layout-content">
                    <a-layout-content class="work-area project-layout">
                        <PageLayout />
                    </a-layout-content>
                </a-layout>
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
import { useRouter } from "vue-router"
import { useTreeDataStore } from "@/store"
import { storeToRefs } from "pinia"
// 缩小后的menu菜单
const drawerVisible = ref(false)
provide("toggleDrawerMenu", () => {
    drawerVisible.value = !drawerVisible.value
})
// 搜索绑定与搜索按钮点击
const searchKey = ref("")
const handleSearchTreeDataClick = () => {
    const loop = (itemdata) => {
        const result = []
        itemdata.forEach((item) => {
            if (item.title.indexOf(searchKey.value) > -1) {
                result.push({ ...item })
            } else if (item.children) {
                const filterdata = loop(item.children)
                if (filterdata.length) {
                    result.push({
                        ...item,
                        children: filterdata
                    })
                }
            }
        })
        return result
    }
    // 返回过滤后的treeData
    // treeDataStore.originTreeData
    if (searchKey.value) {
        treeData.value = loop(treeDataStore.treeData)
    } else {
        treeData.value = treeDataStore.originTreeData
    }
}
// 树状
/// 初始化round轮次数据
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const treeRef = ref()
const { treeData, currentNode } = storeToRefs(treeDataStore)
const projectInfo = ref({ ...route.query })
const projectId = ref(route.query.projectId)
onMounted(async () => {
    treeDataStore.initTreeData(projectId)
})
/// 点击树状节点-参数1:节点数组，参数2:树node对象
const pointNode = (value, data) => {
    console.log(data.node);
    if (data.node.level === "0") {
        router.push({ name: "round", query: { ...projectInfo.value, key: data.node.key } })
    }
    if (data.node.level === "1") {
        router.push({ name: "dut", query: { ...projectInfo.value, key: data.node.key } })
    }
    if (data.node.level === "2") {
        router.push({ name: "designDemand", query: { ...projectInfo.value, key: data.node.key } })
    }
    if (data.node.level === "3") {
        router.push({ name: "testDemand", query: { ...projectInfo.value, key: data.node.key } })
    }
    if (data.node.level === "4") {
        router.push({ name: "case", query: { ...projectInfo.value, key: data.node.key } })
    }
    if (data.node.level === "5") {
        router.push({ name: "problem", query: { ...projectInfo.value, key: data.node.key } })
    }
    treeDataStore.setCurrentNode(data.node.key)
}
/// 动态加载函数-参数1:树node对象
const loadMore = (nodeData) => {
    console.log("动态加载的节点为：", nodeData) // 输出点击节点的key,以及添加上去的level属性
    if (nodeData.level == "0") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getDutInfo(projectInfo.value.id, nodeData.key, nodeData.level)
            nodeData.children = res
            resolve()
        })
    }
    if (nodeData.level == "1") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getDemandInfo(projectInfo.value.id, nodeData.key, nodeData.level)
            nodeData.children = res
            resolve()
        })
    }
    if (nodeData.level == "2") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getTestInfo(projectInfo.value.id, nodeData.key, nodeData.level)
            nodeData.children = res
            resolve()
        })
    }
    if (nodeData.level == "3") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getCaseInfo(projectInfo.value.id, nodeData.key, nodeData.level)
            nodeData.children = res
            resolve()
        })
    }
    if (nodeData.level == "4") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getProblemInfo(projectInfo.value.id, nodeData.key, nodeData.level)
            nodeData.children = res
            resolve()
        })
    }
}
</script>

<style lang="less" scoped>
.tree {
    height: 100%;
}
.layout {
    display: flex;
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
.layout-demo {
    position: relative;
}
.layout-content {
    position: absolute;
    top: 60px;
    left: 300px;
    min-height: 100vh;
    width: 100% - 300px;
    overflow-y: auto;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    position: absolute;
}
</style>
