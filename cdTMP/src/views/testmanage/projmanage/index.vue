<template>
    <div class="ma-content-block p-3 lg:h-full block lg:border-0 lg:flex justify-between">
        <div class="h-full w-full lg:ml-3 lg:mr-2 pt-2">
            <!-- ma-crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #operationBeforeExtend="{ record }">
                    <a-popover title="文档生成组合按钮" trigger="click">
                        <a-button type="primary" size="mini">
                            <template #icon>
                                <icon-plus />
                            </template>
                            文档生成
                        </a-button>
                        <template #content>
                            <p>
                                <a-link
                                    :disabled="isGenerating"
                                    :loading="isDgLoading"
                                    @click="createDgItem($event, record)"
                                >
                                    大纲二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isSmLoading" @click="createSmItem(record)">
                                    说明二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isJlloading" @click="createJLItem(record)">
                                    记录二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isBgLoading" @click="createBgItem(record)">
                                    报告二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="ishsmLoading" @click="createHsmItem(record)">
                                    回归说明二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="ishjlLoading" @click="createHjlItem(record)">
                                    回归记录二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isWtdLoading" @click="createWtdItem(record)">
                                    问题单二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiDagang(record)">
                                    <icon-eye />
                                    [测试]生成最后大纲
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiShuoming(record)">
                                    <icon-eye />[测试]生成最后说明
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiJilu(record)"
                                    ><icon-eye />[测试]生成最后记录</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiBaogao(record)"
                                    ><icon-eye />[测试]生成测评报告</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiHsm(record)"
                                    ><icon-eye />[测试]回归测试说明</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiHjl(record)"
                                    ><icon-eye />[测试]回归测试记录</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiWtd(record)"
                                    ><icon-eye />[测试]生成问题单</a-link
                                >
                            </p>
                        </template>
                    </a-popover>
                    <a-button @click="enterWorkPlant(record)" size="mini" status="warning" type="outline">
                        工作区
                    </a-button>
                    <a-link @click="previewRef.open(record)"><icon-eye />预览</a-link>
                    <a-link @click="handleFragmentClick(record)"><icon-file />片段</a-link>
                    <a-link @click="handleBoardClick(record)"><icon-dashboard />项目看板</a-link>
                </template>
            </ma-crud>
        </div>
        <preview ref="previewRef" :columns="crudColumns"></preview>
        <Progress
            :visible="visible"
            :isComplete="isComplete"
            :text="ptext"
            @clickConfirm="handleModalConfirmClick"
        ></Progress>
    </div>
</template>

<script lang="jsx" setup>
import { ref } from "vue"
import preview from "./cpns/preview.vue"
import Progress from "./cpns/progress.vue"
import useEnterWorkPlant from "./hooks/useEnterWorkPlant"
import useSeitaiModal from "./hooks/useSeitaiModal"
import useGenerateSecond from "./hooks/useGenerateSecond"
import useCrudInit from "./hooks/useCrudInit"
// crud配置和字段信息定义
const { crudRef, crudOptions, crudColumns } = useCrudInit()
// 点击进入工作区函数 - 每次点击后都清除localStorage中树状目录数据
const { enterWorkPlant } = useEnterWorkPlant()
// 生成最终文档事件，并且弹窗显隐和退出条件判断
const {
    visible,
    isComplete,
    ptext,
    handleModalConfirmClick,
    createSeitaiShuoming,
    createSeitaiDagang,
    createSeitaiJilu,
    createSeitaiBaogao,
    createSeitaiHsm,
    createSeitaiHjl,
    createSeitaiWtd
} = useSeitaiModal()
// 用于生成二段文档按钮事件和禁用按钮ref
const {
    isGenerating,
    isDgLoading,
    isSmLoading,
    isBgLoading,
    isJlloading,
    ishsmLoading,
    ishjlLoading,
    isWtdLoading,
    createJLItem,
    createSmItem,
    createDgItem,
    createBgItem,
    createHsmItem,
    createHjlItem,
    createWtdItem
} = useGenerateSecond()

// 其他功能
// 1.跳转到项目看板页面
const handleBoardClick = (record) => {
    router.push({
        name: "projBoard",
        params: {
            projectId: record.id
        }
    })
}
// 2.跳转到项目所属文档片段
const handleFragmentClick = (record) => {
    router.push({
        name: "projFragment",
        params: {
            projectId: record.id
        }
    })
}
// 3.预览项目信息ref
const previewRef = ref()

defineOptions({
    name: "projmanage"
})
</script>

<style lang="less" scoped>
.msg-menu {
    // border-right: 1px solid var(--color-border-2);
    & li {
        border-radius: 1px;
        cursor: pointer;
        margin-bottom: 5px;
        padding: 10px;
        padding-left: 20px;
    }
    & li:hover,
    & li.active {
        background: var(--color-fill-2);
        color: rgb(var(--primary-5));
    }
}
</style>
