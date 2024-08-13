<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef" @beforeCancel="handleBeforeCancel">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
                <!-- 表格前置扩展槽:添加关联按钮 -->
                <template #tableAfterButtons>
                    <a-button type="outline" status="warning" @click="handleOpenRelationCSX">
                        <template #icon>
                            <icon-tags />
                        </template>
                        关联测试项
                    </a-button>
                </template>
                <!-- 版本字段的插槽 -->
                <template #inputPrepend-ident> XQ_XX_ </template>
            </ma-crud>
        </div>
        <!-- 关联的modal组件 -->
        <a-modal v-model:visible="visible" width="700px" draggable :on-before-ok="handleRelatedOk">
            <template #title>关联测试项</template>
            <div class="pb-3">已存在的关联项:</div>
            <a-typography-paragraph>
                <ol class="ol-reset">
                    <li v-for="item in computedRelatedData">{{ item }}</li>
                </ol>
            </a-typography-paragraph>
            <div class="pb-3">选择关联的测试需求项:</div>
            <a-cascader
                :options="options"
                multiple
                allow-search
                placeholder="暂无关联测试项，请选择..."
                :loading="cascaderLoading"
                v-model:model-value="relatedData"
            />
        </a-modal>
    </div>
</template>

<script setup>
import { ref } from "vue"
import commonApi from "@/api/common"
// hooks
import useCrudRef from "./hooks/useCrudRef"
import useRalateDemand from "./hooks/useRalateDemand"

// 根据传参获取key，分别为轮次、设计需求的key
const { projectId, crudRef, crudOptions, crudColumns, handleBeforeCancel } = useCrudRef()
// 关联弹窗、关联的事件处理
const { visible, relatedData, options, cascaderLoading, computedRelatedData, handleOpenRelationCSX, handleRelatedOk } =
    useRalateDemand(projectId)

// 标识显示字段
const testTypeDict = ref([])
!(function () {
    commonApi.getDict("testType").then((res) => {
        testTypeDict.value = res
    })
})()
const showType = (record) => {
    let len = testTypeDict.value.data.length
    for (let i = 0; i < len; i++) {
        if (testTypeDict.value.data[i].key === record.testType) {
            let item = testTypeDict.value.data[i]
            return "XQ-" + item.show_title + "-" + record.ident
        }
    }
}

// 暴露给route-view的刷新表格函数
const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })
defineOptions({
    name: "designDemand"
})
</script>

<style lang="less" scoped>
.ol-reset {
    list-style: auto;
}
</style>
