<template>
    <a-layout class="layout">
        <div class="navbar layout-navbar">
            <NavBar :title="projectInfo.name" />
        </div>
        <a-layout class="layout">
            <a-layout class="layout layout-demo">
                <a-layout-sider class="layout-sider">
                    <div class="p-2 overflow-auto myhcalc">
                        <a-input-group class="mb-2 w-full flex items-center h-1/12" size="mini">
                            <a-input style="height: 32px" v-model="searchKey" allow-clear></a-input>
                            <a-button @click="handleSearchTreeDataClick">搜索</a-button>
                        </a-input-group>
                        <a-button type="primary" @click="toggleExpanded" class="mb-1">
                            {{ expandedKeys?.length ? "全部收缩" : "全部展开" }}
                        </a-button>
                        <a-popconfirm type="warning" @ok="handleCopyNode" content="是否确定根据选中节点进行创建？">
                            <a-button type="outline" status="warning" class="ml-1">
                                <template #icon> <icon-plus /></template>点击复制创建轮次
                            </a-button>
                        </a-popconfirm>
                        <a-tree
                            class="h-10/12 select-none my-arco-wrap-class"
                            :data="treeData"
                            size="mini"
                            showLine
                            checkable
                            block-node
                            draggable
                            animation
                            auto-expand-parent
                            @select="pointNode"
                            @drop="ondrop"
                            :allow-drop="allowdrop"
                            :load-more="loadMore"
                            v-model:expanded-keys="expandedKeys"
                            v-model:selected-keys="selectedKeys"
                            v-model:checked-keys="checkedKeys"
                            ref="treeRef"
                            border
                            @contextmenu="displayRightMenu"
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
                            <!-- 设计节点的图标 -->
                            <template #switcher-icon="node, { isLeaf }">
                                <IconDown v-if="!isLeaf" />
                                <IconFile v-if="isLeaf" />
                            </template>
                            <!-- 节点图标插槽 -->
                            <template #icon="props">
                                <template v-if="props.node.level === '1'"> [被测件] </template>
                                <template v-if="props.node.level === '2'"> [设] </template>
                                <template v-if="props.node.level === '3'"> [项] </template>
                                <template v-if="props.node.level === '4'">
                                    <template v-if="props.node.isRelatedProblem">
                                        <a-tooltip content="有问题单关联">
                                            <button>[@]</button>
                                        </a-tooltip>
                                    </template>
                                    <template v-else>
                                        <template v-if="props.node.isNotPassed">
                                            <a-tooltip content="该用例未通过，但是未关联问题单，请关联">
                                                <button :style="{ color: 'red' }">[×]</button>
                                            </a-tooltip>
                                        </template>
                                        <template v-else>
                                            <a-tooltip content="该用例未执行或已通过，未关联问题单">
                                                <button>[>]</button>
                                            </a-tooltip>
                                        </template>
                                    </template>
                                </template>
                            </template>
                        </a-tree>
                    </div>
                </a-layout-sider>
                <a-layout class="layout-content myhcalc my-custom">
                    <a-layout-content class="work-area project-layout">
                        <PageLayout ref="routeViewRef" />
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
    >
    </ma-form-modal>
    <!-- 如果没有第一轮的SO_dut则弹窗 -->
    <ma-form-modal
        ref="soDutFormRef"
        :title="soDutModalTitle"
        :column="soDutColumn"
        width="800px"
        :submit="handleSoDutSubmit"
        :custom-cancel="handleSoDutCancel"
        cancelText="返回项目页面"
        :cancel-button-props="{ status: 'warning' }"
        :closable="false"
        :mask-closable="false"
    >
    </ma-form-modal>
    <Progress
        :visible="visible"
        :isComplete="isComplete"
        :text="ptext"
        @clickConfirm="handleModalConfirmClick"
    ></Progress>
    <!-- 右键菜单 -->
    <a-dropdown
        v-model:popup-visible="popupVisible"
        :popup-container="popupContainer"
        position="bottom"
        alignPoint
        :style="{ display: 'block' }"
    >
        <template #content>
            <a-dgroup title="执行操作">
                <a-doption @click="handleDoptionClickGreateCases">
                    <template #icon>
                        <icon-plus-circle />
                    </template>
                    根据测试子项生成所属用例
                </a-doption>
            </a-dgroup>
            <a-dgroup title="复制">
                <a-doption @click="handleDoptionClickCopyDemand">
                    <template #icon>
                        <icon-copy />
                    </template>
                    复制到设计需求下...
                </a-doption>
            </a-dgroup>
        </template>
    </a-dropdown>
    <!-- 复制modal组件 -->
    <!-- 关联的modal组件 -->
    <a-modal v-model:visible="modalVisible" width="700px" draggable :on-before-ok="handleCopyDemand">
        <template #title>复制到设计需求</template>
        <div class="pb-3">选择复制到的节点:</div>
        <a-cascader
            :options="options"
            allow-search
            allow-clear
            size="large"
            placeholder="复制到选择的设计需求节点下"
            :loading="cascaderLoading"
            v-model:model-value="relatedCopyData"
        />
        <div class="mt-3"><a-checkbox v-model="checkboxValue">是否复制用例？</a-checkbox></div>
    </a-modal>
    <!-- 拖拽用例气泡提示 -->
    <a-popconfirm
        v-model:popup-visible="paoVisible"
        ok-text="移动"
        cancel-text="复制"
        @ok="paoOk"
        @cancel="paoCancel"
        :popup-container="paoContainer"
        content="选择移动/复制"
    >
    </a-popconfirm>
    <a-popconfirm
        v-model:popup-visible="pao2Visible"
        ok-text="移动"
        cancel-text="复制"
        @ok="paoOk2"
        @cancel="paoCancel2"
        :popup-container="pao2Container"
        content="选择移动/复制"
    >
    </a-popconfirm>
    <!-- w1:外部下拉选项组件 -->
    <roundRight
        :fvisible="roundRightVisible"
        @update:visible="roundRightVisible = false"
        :container="roundRightContainer"
        @click-problem-show="handleProblemShowClick"
    ></roundRight>
    <!-- w2:轮次的问题单ma-crud，这里要传参2个，首先是请求另外一个接口，然后取消是否关联字段 -->
    <problem-choose ref="problemRoundRef" hasRelated="roundProblem" :title="problemTitle"></problem-choose>
</template>

<script setup>
import { provide, ref, onMounted, h } from "vue"
import NavBar from "@/layout/components/navbar.vue"
import PageLayout from "@/layout/page-layout.vue"
import MaFormModal from "@/components/ma-form-modal/index.vue"
import projectApi from "@/api/project/project"
import roundApi from "@/api/project/round"
import dutApi from "@/api/project/dut"
import copyApi from "@/api/treeOperation/copy"
import caseApi from "@/api/project/case"
import designApi from "@/api/project/designDemand"
import demandApi from "@/api/project/testDemand"
// 轮次的右键菜单，单独一个组件 -> 在treeComponents里面
import roundRight from "./treeComponents/roundRight.vue"
// 问题单ma-crud
import ProblemChoose from "@/views/project/case/components/ProblemChoose.vue"
import { Message, Notification, Tr } from "@arco-design/web-vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import { useTreeDataStore } from "@/store"
import { storeToRefs } from "pinia"
import dayjs from "dayjs"
import Progress from "@/views/testmanage/projmanage/cpns/progress.vue"
import { getContextNodeInfo } from "@/layout/hooks/tools"
// router-view里面组件的ref
const routeViewRef = ref()
/// 初始化round轮次数据
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const treeRef = ref()
const { treeData, currentNode } = storeToRefs(treeDataStore)
const projectInfo = ref({ ...route.query })
const projectId = ref(route.query.id)
//~~~~ 复制粘贴流程
const checkedKeys = ref([])
/// 点击复制按钮
const handleCopyNode = async () => {
    // 0.先判断是否是同一个轮次的节点
    let firstNodeRoundKey = ""
    let isFirst = true
    checkedKeys.value.forEach((item) => {
        if (isFirst) {
            firstNodeRoundKey = item.split("-")[0]
            isFirst = false
        } else {
            if (item.split("-")[0] !== firstNodeRoundKey) {
                Message.error("请选择同一轮次的节点进行复制")
                return
            }
        }
    })
    // 1.先判断是否选中了节点
    if (checkedKeys.value.length < 1) {
        Message.error("您未选择节点，请选择后再试...")
        return
    }
    // 打印下checked节点key
    visible.value = true
    isComplete.value = false
    const st = await copyApi
        .copyCheckedNode({ checkedNodes: checkedKeys.value, project_id: projectId.value })
        .catch((err) => {
            isComplete.value = true
            visible.value = false
        })
    isComplete.value = true
    Message.success(st.message)
    Notification.warning("请注意自动生成的设计需求、测试项、用例信息重复，需要修改")
    // 清空checkedKeys
    checkedKeys.value = []
    // 处理完后需要更新树结构
    treeDataStore.resetTreeData(projectId.value)
    // 清除右侧路由的组件显示，不然会因为数据而出错，当然直接复制query可能是错误信息
    router.replace({ name: "project", query: route.query })
}
/// 进度条变量
const visible = ref(false)
const isComplete = ref(false)
const ptext = ref("轮次数据")
const handleModalConfirmClick = () => {
    visible.value = false
}

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
            if (item.title.indexOf(searchKey.value.replace(" ", "")) > -1) {
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
// ~~~~定义弹出a-form-modal的submit方法~~~
const handleSoDutSubmit = async (data) => {
    // 只有一个参数就是被提交的数据，然后返回false阻止弹窗消失
    const input_data = { ...data, project_id: projectId.value }
    const res = await dutApi.createR1SoDut(input_data)
    if (res.code == 200) {
        treeDataStore.updateDutTreeData(res.data, projectId.value)
        Message.success("添加源代码被测件成功，并自动创建第一轮的文档审查、静态分析、代码审查测试项和用例")
        setTimeout(() => {
            location.reload()
        }, 500)
        return
    }
    return false
}
// ~~~~定义弹出a-form-modal的cancel方法-返回false则无法关闭弹窗~~~~
const handleSoDutCancel = () => {
    Notification.error("必须按要求添加源代码信息，返回项目列表页面!")
    router.replace({ name: "projmanage" })
}
// 初始化树状数据
// so_dut弹窗ref对象
const soDutFormRef = ref()
/// 强制弹窗的标题
const soDutModalTitle = ref("强制添加第一轮源代码信息")
// 辅助函数，传入res.data来判断是否强制弹窗
const handleSoDutExistsForceModal = async () => {
    /// 主动后端请求
    const res = await dutApi.getSoExists({ id: projectId.value })
    res.data.round_list.forEach((item) => {
        if (!item.isExists) {
            Message.warning(`识别到您未添加第${parseInt(item.key) + 1}轮源代码的信息，请填写信息自动创建`)
            soDutModalTitle.value = `强制添加第${parseInt(item.key) + 1}轮源代码的信息`
            soDutFormRef.value.open({ round_key: item.key })
            return
        }
    })
}
onMounted(async () => {
    await treeDataStore.initTreeData(projectId.value)
    // 依次找轮次里面是否有源代码被测件，如果没有则强制弹窗让用户创建
    handleSoDutExistsForceModal()
})
// v-model绑定选中节点
const selectedKeys = ref([])
const previousKey = ref(null)
// 1.定义展开的tree-key 2.定义全部展开的数据 3.定义展开收缩函数 -> 注意在treeStore里面使用递归处理
const expandedKeys = ref([])
const allExpandedKeys = ref([])
const toggleExpanded = () => {
    allExpandedKeys.value = treeDataStore.outExpandNode()
    expandedKeys.value = expandedKeys?.value.length ? [] : allExpandedKeys.value
}
/// 点击树状节点-参数1:节点数组，参数2:树node对象 - 添加双击处理方式
let timerId = null
let count = 0
const pointNode = (value, data) => {
    // 获取处理单击不选中，双击选中的变量
    let catch_selected_key = selectedKeys.value
    selectedKeys.value = previousKey.value
    count++
    if (timerId) {
        return
    }
    timerId = setTimeout(async () => {
        if (count > 1) {
            // 双击触发 value是点击的节点，data是节点数据
            if (data.node.level == "0") {
                projectApi.getDutInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                    treeData.value[value].children = res.data
                    // 添加需要展开数据，注意不要一直push，判断在已展开节点是否包含点击的节点
                    if (!expandedKeys.value.includes(value[0])) {
                        expandedKeys.value.push(value[0])
                    }
                })
            }
            if (data.node.level == "1") {
                projectApi.getDemandInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                    data.node.children = res.data
                    if (!expandedKeys.value.includes(value[0])) {
                        expandedKeys.value.push(value[0])
                    }
                })
            }
            if (data.node.level == "2") {
                projectApi.getTestInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                    data.node.children = res.data
                    if (!expandedKeys.value.includes(value[0])) {
                        expandedKeys.value.push(value[0])
                    }
                })
            }
            if (data.node.level == "3") {
                projectApi.getCaseInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                    data.node.children = res.data
                    if (!expandedKeys.value.includes(value[0])) {
                        expandedKeys.value.push(value[0])
                    }
                })
            }
            count = 0
            clearTimeout(timerId)
            timerId = null
        } else {
            // 单击触发
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
            // if (data.node.level === "5") {
            //     router.push({ name: "problem", query: { ...projectInfo.value, key: data.node.key } })
            // }
            treeDataStore.setCurrentNode(data.node.key)
            // 单击设置选择的key
            selectedKeys.value = catch_selected_key
            // 单击后设置previous选中的key是什么
            previousKey.value = catch_selected_key
            count = 0
            clearTimeout(timerId)
            timerId = null
        }
    }, 250)
}
/// 动态加载函数-参数1:树node对象
const loadMore = (nodeData) => {
    if (nodeData.level == "0") {
        return new Promise(async (resolve) => {
            const res = await projectApi.getDutInfo(projectInfo.value.id, nodeData.key, nodeData.level).catch((err) => {
                resolve() // 捕获错误，让动态加载不再一直转圈
            })
            nodeData.children = res.data
            resolve()
        })
    }
    if (nodeData.level == "1") {
        return new Promise(async (resolve) => {
            const res = await projectApi
                .getDemandInfo(projectInfo.value.id, nodeData.key, nodeData.level)
                .catch((err) => {
                    resolve()
                })
            nodeData.children = res.data
            resolve()
        })
    }
    if (nodeData.level == "2") {
        return new Promise(async (resolve) => {
            const res = await projectApi
                .getTestInfo(projectInfo.value.id, nodeData.key, nodeData.level)
                .catch((err) => {
                    resolve()
                })
            nodeData.children = res.data
            resolve()
        })
    }
    if (nodeData.level == "3") {
        return new Promise(async (resolve) => {
            const res = await projectApi
                .getCaseInfo(projectInfo.value.id, nodeData.key, nodeData.level)
                .catch((err) => {
                    resolve()
                })
            nodeData.children = res.data
            resolve()
        })
    }
}
//~~~~ 表单弹窗组件功能
const maFormModalRef = ref()
const title = ref("")
/// 点击新增轮次按钮
const handleRoundAddClick = (nodeData) => {
    let create_number = treeDataStore.getRoundMiddleInfo()
    // 这里是文档写错了,调用form是里面组件绑定的数据
    maFormModalRef.value.form = {}
    // 这里如果删除中间轮次，那么新增信息应该从中间开始
    maFormModalRef.value.open({
        beginTime: dayjs().format("YYYY-MM-DD"),
        grade: "1",
        key: `${create_number}`,
        name: `第${create_number + 1}轮测试`,
        ident: `${route.query.ident}-R${create_number + 1}`,
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
        router.replace({ name: "project", query: route.query })
    } catch {}
}
/// Ma-form-Modal的提交按钮 - 轮次新增/编辑逻辑
const handleRoundSubmit = async (value) => {
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
            // 调用判断函数，判断是否轮次有源代码dut
            handleSoDutExistsForceModal()
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
                            { title: "轮次标识", dataIndex: "ident", disabled: true },
                            {
                                title: "开始时间",
                                dataIndex: "beginTime",
                                formType: "date",
                                placeholder: "请选择时间",
                                extra: "尽量大于项目开始时间13天，生成文档才符合要求",
                                rules: [
                                    { required: true, message: "开始时间必填" },
                                    {
                                        validator: (value, callback) => {
                                            const projectBegin = route.query.beginTime
                                            value <= projectBegin
                                                ? callback(
                                                      "不能早于项目开始时间，由于还有前期测试设计阶段，建议大于项目开始时间13天"
                                                  )
                                                : null
                                        }
                                    }
                                ]
                            },
                            {
                                title: "速度等级",
                                dataIndex: "speedGrade",
                                placeholder: "请填入速度等级"
                            },
                            {
                                title: "动态地点",
                                dataIndex: "location",
                                placeholder: "请填入测试地点",
                                extra: "该字段影响时间相关表格的地点",
                                rules: [{ required: true, message: "测试地点是必填的" }]
                            }
                        ]
                    },
                    {
                        span: 12,
                        formList: [
                            { title: "名称", dataIndex: "name", rules: [{ required: true, message: "名称必填" }] },
                            {
                                title: "结束时间",
                                dataIndex: "endTime",
                                formType: "date",
                                placeholder: "请选择时间",
                                extra: "该字段决定《测试记录》封面时间",
                                rules: [
                                    { required: true, message: "结束时间必填" },
                                    {
                                        validator(value, errorCallback) {
                                            let start = maFormModalRef.value.form.beginTime
                                            value < start ? errorCallback("结束时间不能小于开始时间") : null
                                        }
                                    }
                                ]
                            },
                            {
                                title: "封装",
                                dataIndex: "package",
                                placeholder: "请填入封装"
                            },
                            {
                                title: "质量等级",
                                dataIndex: "grade",
                                formType: "select",
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
                            }
                        ]
                    }
                ]
            }
        ]
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
// 源代码so_dut的弹窗
const soDutColumn = ref([
    {
        title: "轮次key",
        dataIndex: "round_key",
        placeholder: "非用户填写",
        disabled: true,
        rules: [{ required: true, message: "非用户填写，但必填" }]
    },
    {
        title: "代码版本",
        dataIndex: "version",
        placeholder: "请输入代码版本，注意不要带V",
        rules: [{ required: true, message: "代码版本必填" }],
        openPrepend: true
    },
    {
        title: "用户标识",
        dataIndex: "userRef",
        placeholder: "请输入用户标识",
        help: "客户使用的标识",
        rules: [{ required: true, message: "用户标识为客户的标识，必填，可随意填写后面再修改" }]
    },
    {
        title: "单位",
        dataIndex: "unit",
        placeholder: "请选择单位名称",
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true },
        rules: [{ required: true, message: "单位必选" }]
    },
    {
        title: "空行",
        dataIndex: "black_line",
        formType: "input-number",
        rules: [{ required: true, message: "空行数必填" }]
    },
    {
        title: "纯注释",
        dataIndex: "comment_line",
        formType: "input-number",
        rules: [{ required: true, message: "纯注释数必填" }]
    },
    {
        title: "混合行",
        dataIndex: "mix_line",
        formType: "input-number",
        rules: [{ required: true, message: "混合行必填" }]
    },
    {
        title: "纯代码",
        dataIndex: "code_line",
        formType: "input-number",
        rules: [{ required: true, message: "纯代码行必填" }]
    }
])

// 大功能：右键菜单实现
/// ~~~右键菜单弹出~~~
const popupVisible = ref(false)
/// 右键菜单的挂载容器
const popupContainer = ref()
/// 组件全局
const rightClickNode = { level: 3, isLeaf: false, nodekey: "", title: "" }
/// 轮次右键dropdown显示变量
const roundRightVisible = ref(false)
/// 轮次右键dropdown的容器
const roundRightContainer = ref(null)
/// 轮次问题单标题表里
const problemTitle = ref("第1轮问题单")
/// 紧点击测试项节点显示右键菜单
const displayRightMenu = (e) => {
    const { nodekey, level, title, isLeaf } = getContextNodeInfo(e.target)
    // 如果是测试项则弹出【1.根据测试项步骤生成当前测试项用例 2.复制测试项到设计需求】
    if (+level === 3) {
        e.preventDefault()
        // 首先将被右键点击的node储存到组件全局
        rightClickNode.level = level
        rightClickNode.isLeaf = isLeaf
        rightClickNode.nodekey = nodekey
        rightClickNode.title = title
        // 将popup组件绑定到被右键点击的元素
        popupContainer.value = e.target
        popupVisible.value = true
    }
    if (+level === 0) {
        // 测试显示下拉框
        e.preventDefault()
        rightClickNode.level = level
        rightClickNode.isLeaf = isLeaf
        rightClickNode.nodekey = nodekey
        rightClickNode.title = title
        problemTitle.value = `第${+rightClickNode.nodekey + 1}轮问题单`
        roundRightContainer.value = e.target.parentElement
        roundRightVisible.value = true
    }
}
/// 点击轮次-用户选择了打开问题单
const handleProblemShowClick = () => {
    // 这里要显示轮次的问题单
    problemRoundRef.value.open(rightClickNode.nodekey)
}
/// 点击popup自动生成对应测试项的用例按钮处理函数
const handleDoptionClickGreateCases = async () => {
    // 将project_id加入参数
    rightClickNode.project_id = projectId.value
    await caseApi.createByDemand(rightClickNode)
    routeViewRef.value.refresh()
}
/// 复制modal级联选择器的选项
const options = ref([])
const modalVisible = ref(false)
const relatedCopyData = ref(0)
const cascaderLoading = ref(false)
/// 点击popup复制测试项
const handleDoptionClickCopyDemand = async () => {
    // 首先是要获取选项数据
    cascaderLoading.value = true
    modalVisible.value = true
    // 请求后端给级联选择器数据
    const res = await designApi.getRelatedCasDesign({ id: projectId.value }).catch((err) => {
        Message.error("请求后端数据发生错误，请重试")
        cascaderLoading.value = false
    })
    options.value = res.data
    // 先获取当前右击的需求的key -> 然后找到所属design的nodekey
    const currentDemandKey = rightClickNode.nodekey
    const belongDesignKey = currentDemandKey.substring(0, currentDemandKey.lastIndexOf("-"))
    // 默认赋值给demand的当前design，直接点击确定可以复制到当前
    options.value.forEach((item) => {
        item.children.forEach((tem) => {
            tem.children.forEach((design_obj) => {
                if (belongDesignKey === design_obj.key) {
                    relatedCopyData.value = design_obj.value
                }
            })
        })
    })
    cascaderLoading.value = false
    // 将checkbox-depth参数设置为非勾选
    checkboxValue.value = false
}
/// 点击复制modal弹窗确定按钮
const checkboxValue = ref(false)
const handleCopyDemand = async () => {
    // 获取选择的design的id
    const design_id = relatedCopyData.value
    // 没有选取则直接返回false
    if (!design_id) {
        return false
    }
    // 这里进行复制的数据处理
    const res = await demandApi.copyToDesign({
        project_id: projectId.value,
        design_id: design_id,
        demand_key: rightClickNode.nodekey,
        depth: checkboxValue.value
    })
    if ((res.code = 200)) {
        // 注意必须传projectId，否则返回空
        treeDataStore.updateTestDemandTreeData(res.data, projectId.value)
        Notification.success("复制成功,为避免重复,设置了(复制)字样,请手动修改...")
        return true
    } else {
        Message.error("复制失败，服务器错误")
    }
}

// ~~~~~~~~大功能：拖拽~~~~~~~~
const paoVisible = ref(false)
const paoContainer = ref(null)
const pao2Visible = ref(false)
const pao2Container = ref(null)
/// 储存被拖拽到的节点以及拖拽的节点
let dragNodeGlobal = null
let dropNodeGlobal = null
let dragDropPosition = 0

/// 节点在可释放目标释放的操作 - drapNode是被拖拽的节点，dropNone是释放在哪个节点下，dropPosition是释放的位置-1,0...
const ondrop = ({ e, dragNode, dropNode, dropPosition }) => {
    const data = treeData.value // 1.这是整体的树数据
    // 提示用户只能拖拽用例节点
    if (dragNode.level === "3") {
        Message.warning("只能拖拽用例节点")
        return
    }
    // 拖拽逻辑：
    // 1.首先只能拖拽用例节点才能实现功能
    if (dragNode.level === "4") {
        // 2.1.如果是拖拽到测试项节点下
        if (dropNode.level === "3") {
            // 2.1.1.如果位置为0，则放在了测试项里面,为1，-1在测试上下都不处理
            if (dropPosition === 0) {
                // 判断用例是否已经测试项节点里面了
                if (!dropNode.children || !dropNode.children.includes(dragNode)) {
                    // 不在测试项里面，则弹出提示是复制还是移动
                    dragNodeGlobal = dragNode
                    dropNodeGlobal = dropNode
                    paoContainer.value = e.target.parentElement
                    paoVisible.value = true
                } else if (dropNode.children.includes(dragNode)) {
                    // 这里就用例拖拽到当前的测试项节点，则可弹出复制弹窗
                    dragNodeGlobal = dragNode
                    dropNodeGlobal = dropNode
                    paoContainer.value = e.target.parentElement
                    paoVisible.value = true
                }
            }
        } else if (dropNode.level === "4") {
            // 2.2.如果拖拽到测试用例节点，注意拖动到自己上下方不触发
            // 2.2.1先要判断用例是否是同一个demand，则是改变顺序
            dragNodeGlobal = dragNode
            dropNodeGlobal = dropNode
            pao2Container.value = e.target.parentElement
            pao2Visible.value = true
            dragDropPosition = dropPosition
        }
    }
}
/// 只运行拖拽用例节点和测试项2种节点
const allowdrop = (options) => {
    if (options.dropNode.level === "4" || options.dropNode.level === "3") {
        return true
    }
}
/// 拖拽后弹出气泡-移动
const paoOk = async () => {
    const res = await caseApi.copyOrMoveCaseToDemand({
        project_id: projectId.value,
        case_key: dragNodeGlobal.key,
        demand_key: dropNodeGlobal.key,
        move: true
    })
    await treeDataStore.updateCaseTreeData(res.data.oldCaseKey, projectId.value)
    await treeDataStore.updateCaseTreeData(res.data.newCaseKey, projectId.value)
    routeViewRef.value.refresh()
    Notification.success("移动用例成功")
}
/// 拖拽后弹出气泡-复制
const paoCancel = async () => {
    const res = await caseApi.copyOrMoveCaseToDemand({
        project_id: projectId.value,
        case_key: dragNodeGlobal.key,
        demand_key: dropNodeGlobal.key,
        move: false
    })
    await treeDataStore.updateCaseTreeData(res.data.oldCaseKey, projectId.value)
    await treeDataStore.updateCaseTreeData(res.data.newCaseKey, projectId.value)
    routeViewRef.value.refresh()
    Notification.success("复制用例成功")
}
/// 同级分2个气泡ok是移动，cancel是复制
const paoOk2 = async () => {
    const res = await caseApi.copyOrMoveCaseByCase({
        project_id: projectId.value,
        drag_key: dragNodeGlobal.key,
        drop_key: dropNodeGlobal.key,
        position: dragDropPosition,
        move: true
    })
    await treeDataStore.updateCaseTreeData(res.data.old, projectId.value)
    await treeDataStore.updateCaseTreeData(res.data.new, projectId.value)
    routeViewRef.value.refresh()
    Notification.success("移动用例成功")
}
const paoCancel2 = async () => {
    const res = await caseApi.copyOrMoveCaseByCase({
        project_id: projectId.value,
        drag_key: dragNodeGlobal.key,
        drop_key: dropNodeGlobal.key,
        position: dragDropPosition,
        move: false
    })
    await treeDataStore.updateCaseTreeData(res.data.old, projectId.value)
    await treeDataStore.updateCaseTreeData(res.data.new, projectId.value)
    routeViewRef.value.refresh()
    Notification.success("复制用例成功")
}
// ~~~~大功能：轮次问题单~~~~
const problemRoundRef = ref(null)
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
.myhcalc {
    height: calc(100% - 60px);
}
// 这里容易出错注意
.my-custom {
    width: calc(100% - 300px);
}
.my-arco-wrap-class :deep(.arco-tree-node-title-text) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.chen-node-title {
    cursor: help;
}
</style>
