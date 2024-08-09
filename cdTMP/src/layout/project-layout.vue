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
import { provide, ref } from "vue"
import NavBar from "@/layout/components/navbar.vue"
import PageLayout from "@/layout/page-layout.vue"
import MaFormModal from "@/components/ma-form-modal/index.vue"
// 轮次的右键菜单，单独一个组件 -> 在treeComponents里面
import roundRight from "./treeComponents/roundRight.vue"
// 问题单ma-crud
import ProblemChoose from "@/views/project/case/components/ProblemChoose.vue"
import { useRoute } from "vue-router"
import { useTreeDataStore } from "@/store"
import { storeToRefs } from "pinia"
import Progress from "@/views/testmanage/projmanage/cpns/progress.vue"
// hooks模块化
import useTreeDrag from "@/layout/treeHooks/treeDrag.js"
import { useRightClick } from "./treeHooks/rightClick"
import useNodeCopy from "./treeHooks/nodeCopy"
import useSearchNodes from "./treeHooks/searchNodes"
import useMustSoDut from "./treeHooks/mustSoDut"
import useNodeExpand from "./treeHooks/useNodeExpand"
import useNodeClick from "./treeHooks/useNodeClick"
import useLoadTreeNode from "./treeHooks/useLoadTreeNodes"
import useRoundMaForm from "./treeHooks/useRoundMaForm"
// router-view里面组件的ref -> 多个hook使用
const routeViewRef = ref()
const treeDataStore = useTreeDataStore()
const { treeData, currentNode } = storeToRefs(treeDataStore)
const route = useRoute()
const treeRef = ref()
const projectInfo = ref({ ...route.query })
const projectId = ref(route.query.id)

//~~~~~~大模块：选择同一节点新建复制到下一轮~~~~~~
const { checkedKeys, visible, isComplete, ptext, handleCopyNode, handleModalConfirmClick } = useNodeCopy(projectId)

//~~~~~~provide：menu缩小菜单~~~~~~
const drawerVisible = ref(false)
provide("toggleDrawerMenu", () => {
    drawerVisible.value = !drawerVisible.value
})

//~~~~~~小功能：节点搜索功能~~~~~~
const { searchKey, handleSearchTreeDataClick } = useSearchNodes()

//~~~~~~M功能：强制必须有源代码被测件~~~~~~
const {
    soDutFormRef,
    soDutModalTitle,
    handleSoDutExistsForceModal,
    handleSoDutSubmit,
    handleSoDutCancel,
    soDutColumn
} = useMustSoDut(projectId)

//~~~~~~小功能：展开和收缩~~~~~~
const { expandedKeys, toggleExpanded } = useNodeExpand()

//~~~~~~大功能：单击/双击节点逻辑~~~~~~
const { selectedKeys, pointNode } = useNodeClick(expandedKeys)

//~~~~~~大功能：动态加载a-tree节点函数~~~~~~
const { loadMore } = useLoadTreeNode()

//~~~~~~功能：轮次的Ma-Form~~~~~~
const {
    maFormModalRef,
    title,
    roundColumn,
    roundOption,
    handleRoundAddClick,
    handleRoundEditClick,
    handleRoundDelClick,
    handleRoundSubmit
} = useRoundMaForm(projectId, handleSoDutExistsForceModal)

// 大功能：~~~~~~右键菜单实现~~~~~~
const {
    popupVisible,
    popupContainer,
    roundRightVisible,
    roundRightContainer,
    problemRoundRef,
    options,
    modalVisible,
    relatedCopyData,
    cascaderLoading,
    problemTitle,
    checkboxValue,
    displayRightMenu,
    handleProblemShowClick,
    handleDoptionClickGreateCases,
    handleDoptionClickCopyDemand,
    handleCopyDemand
} = useRightClick(projectId, routeViewRef)

// ~~~~~~~~大功能：拖拽~~~~~~~~
const {
    paoVisible,
    paoContainer,
    pao2Visible,
    pao2Container,
    ondrop,
    allowdrop,
    paoOk,
    paoCancel,
    paoOk2,
    paoCancel2
} = useTreeDrag(projectId, routeViewRef)
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
