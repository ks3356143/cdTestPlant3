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
                        <a-alert title="提示" style="margin-bottom: 10px" class="mt-0 py-1"
                            >空搜索需要点击搜索按钮</a-alert
                        >
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
                        >
                            <!-- 在轮次节点可以新增、编辑、删除、复制 -->
                            <template #extra="nodeData">
                                <template v-if="nodeData.level === '0'">
                                    <a-tooltip content="点击新增轮次">
                                        <IconPlus
                                            style="
                                                position: absolute;
                                                right: 8px;
                                                font-size: 12px;
                                                top: 8px;
                                                color: #3370ff;
                                            "
                                            @click="() => handleRoundAddClick(nodeData)"
                                        />
                                    </a-tooltip>
                                    <a-tooltip content="点击删除轮次">
                                        <a-popconfirm
                                            content="确定要删除该轮次吗?"
                                            position="bottom"
                                            @ok="handleRoundDelClick(nodeData)"
                                        >
                                            <IconMinus
                                                style="
                                                    position: absolute;
                                                    right: 25px;
                                                    font-size: 12px;
                                                    top: 8px;
                                                    color: #3370ff;
                                                "
                                            />
                                        </a-popconfirm>
                                    </a-tooltip>
                                    <a-tooltip content="点击编辑当前轮次"
                                        ><IconEdit
                                            style="
                                                position: absolute;
                                                right: 42px;
                                                font-size: 12px;
                                                top: 8px;
                                                color: #3370ff;
                                            "
                                            @click="() => handleRoundEditClick(nodeData)"
                                    /></a-tooltip>
                                </template>
                            </template>
                        </a-tree>
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
    <ma-form-modal
        ref="maFormModalRef"
        :title="title"
        :column="roundColumn"
        :options="roundOption"
        width="800px"
        :submit="handleRoundSubmit"
    ></ma-form-modal>
</template>

<script setup>
import { provide, ref, onMounted } from "vue"
import NavBar from "@/layout/components/navbar.vue"
import PageLayout from "@/layout/page-layout.vue"
import MaFormModal from "@/components/ma-form-modal/index.vue"
import projectApi from "@/api/project/project"
import roundApi from "@/api/project/round"
import { Message } from "@arco-design/web-vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import { useTreeDataStore } from "@/store"
import { storeToRefs } from "pinia"
import dayjs from "dayjs"
//~~~~ 缩小后的menu菜单
const drawerVisible = ref(false)
provide("toggleDrawerMenu", () => {
    drawerVisible.value = !drawerVisible.value
})
//~~~~ 搜索绑定与搜索按钮点击
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
//~~~~ 树状组件
/// 初始化round轮次数据
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const treeRef = ref()
const { treeData, currentNode } = storeToRefs(treeDataStore)
const projectInfo = ref({ ...route.query })
const projectId = ref(route.query.id)
onMounted(async () => {
    treeDataStore.initTreeData(projectId.value)
})
/// 点击树状节点-参数1:节点数组，参数2:树node对象
const pointNode = (value, data) => {
    console.log(data.node)
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

//~~~~ 表单弹窗组件功能
const maFormModalRef = ref()
const title = ref("")
/// 点击新增轮次按钮
const handleRoundAddClick = (nodeData) => {
    // 这里是文档写错了,调用form是里面组件绑定的数据
    maFormModalRef.value.form = {}
    maFormModalRef.value.open({
        beginTime: dayjs().format("YYYY-MM-DD"),
        grade: "1",
        key: `${treeDataStore.treeData.length}`,
        name: `第${treeDataStore.treeData.length + 1}轮测试`,
        ident: `${route.query.ident}-R${treeDataStore.treeData.length + 1}`,
        project: projectId.value
    })
    title.value = "新增轮次"
}
/// 点击编辑轮次按钮
const handleRoundEditClick = async (nodeData) => {
    const data = await roundApi.getOneRoundInfo({
        projectId: projectId.value,
        round: nodeData.key
    })
    maFormModalRef.value.open(data.data)
    title.value = `编辑轮次:${data.data.name}`
}
/// 点击删除轮次按钮
const handleRoundDelClick = async (value) => {
    try {
        await roundApi.delete(projectId.value, value)
        Message.success("删除成功！")
        treeDataStore.resetTreeData(projectId.value)
    } catch {
        Message.error("删除失败！")
    }
}
/// Ma-form-Modal的提交按钮
const handleRoundSubmit = async (value) => {
    console.log(value)
    if (title.value.slice(0, 1) === "编") {
        try {
            await roundApi.update(value.id, value)
            Message.success("编辑成功！")
        } catch {
            Message.error("编辑失败！")
        }
    }
    if (title.value.slice(0, 1) === "新") {
        try {
            await roundApi.save(projectId.value, value)
            Message.success("新增成功！")
            treeDataStore.resetTreeData(projectId.value)
        } catch {
            Message.error("新增失败！")
        }
    }
}
/// 设置轮次弹窗的列信息
const roundColumn = ref([
    {
        title: "基本信息",
        customClass: ["mb-2", "pb-0"],
        formType: "card",
        bodyStyle: { paddingBottom: 0 },
        formList: [
            {
                formType: "grid",
                cols: [
                    {
                        span: 12,
                        formList: [
                            { title: "标识", dataIndex: "ident" },
                            {
                                title: "开始时间",
                                dataIndex: "beginTime",
                                formType: "date",
                                placeholder: "请选择时间",
                                rules: [{ required: true, message: "开始时间必填" }]
                            },
                            {
                                title: "速度等级",
                                dataIndex: "speedGrade",
                                placeholder: "请填入速度等级",
                                rules: [{ required: true, message: "速度等级必填" }]
                            }
                        ]
                    },
                    {
                        span: 12,
                        formList: [
                            { title: "名称", dataIndex: "name" },
                            {
                                title: "结束时间",
                                dataIndex: "endTime",
                                formType: "date",
                                placeholder: "请选择时间",
                                rules: [{ required: true, message: "结束时间必填" }]
                            },
                            {
                                title: "封装",
                                dataIndex: "package",
                                placeholder: "请填入封装",
                                rules: [{ required: true, message: "封装必填" }]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "质量等级",
        dataIndex: "grade",
        formType: "radio",
        dict: {
            data: [
                { label: "军级", value: "1" },
                { label: "商业级", value: "2" },
                { label: "宇航级", value: "3" },
                { label: "工业级", value: "4" }
            ]
        },
        placeholder: "请填入质量等级",
        rules: [{ required: true, message: "质量等级必填" }]
    },
    {
        formType: "card",
        title: "极端工况信息",
        customClass: ["mb-2", "pb-0"],
        bodyStyle: { paddingBottom: 0 },
        formList: [
            {
                formType: "divider",
                title: "最好工况",
                orientation: "left",
                margin: "20px"
            },
            {
                formType: "grid",
                cols: [
                    {
                        span: 12,
                        formList: [{ title: "电压", dataIndex: "best_condition_voltage", placeholder: "请填入电压" }]
                    },
                    {
                        span: 12,
                        formList: [{ title: "温度", dataIndex: "best_condition_tem", placeholder: "请填入温度" }]
                    }
                ]
            },
            {
                formType: "divider",
                title: "典型工况",
                orientation: "left",
                margin: "20px"
            },
            {
                formType: "grid",
                cols: [
                    {
                        span: 12,
                        formList: [{ title: "电压", dataIndex: "typical_condition_voltage", placeholder: "请填入电压" }]
                    },
                    {
                        span: 12,
                        formList: [{ title: "温度", dataIndex: "typical_condition_tem", placeholder: "请填入温度" }]
                    }
                ]
            },
            {
                formType: "divider",
                title: "最差工况",
                orientation: "left",
                margin: "20px"
            },
            {
                formType: "grid",
                cols: [
                    {
                        span: 12,
                        formList: [{ title: "电压", dataIndex: "low_condition_voltage", placeholder: "请填入电压" }]
                    },
                    {
                        span: 12,
                        formList: [{ title: "温度", dataIndex: "low_condition_tem", placeholder: "请填入温度" }]
                    }
                ]
            }
        ]
    }
])
/// 表单的option
const roundOption = ref({
    customClass: [""]
})
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
