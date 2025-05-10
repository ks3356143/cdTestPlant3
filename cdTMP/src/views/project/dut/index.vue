<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
                <template #tableAfterButtons>
                    <a-button status="success" type="outline" @click="handleAddFileInputDemand" v-if="isXQ === 'XQ'">
                        <template #icon>
                            <icon-plus />
                        </template>
                        上传需求规格说明快捷录入
                    </a-button>
                </template>
                <!-- 字段的前缀后缀的插槽 -->
                <!-- 版本字段的插槽 -->
                <template #inputPrepend-ident> SJ-XX- </template>
            </ma-crud>
        </div>
        <file-input-modal ref="fileInputRef" @enterFinish="crudRef.refresh()"></file-input-modal>
    </div>
</template>

<script setup>
import { ref } from "vue"
import useCrudOptions from "@/views/project/dut/hooks/useCrudOptions"
import useColumns from "./hooks/useColumns"
import { useRoute } from "vue-router"
import dutApi from "@/api/project/dut"
import commonApi from "@/api/common"
import FileInputModal from "./components/FileInputModal/index.vue"
const route = useRoute()
const crudRef = ref()
const projectId = ref(route.query.id)
// 5月8日修改设计需求标识就按SJ-FT-设计需求标识来
const demandTypeDict = ref([])
;(function () {
    commonApi.getDict("demandType").then((res) => {
        demandTypeDict.value = res
    })
})()

// 5月31日更新，获取当前dut的类型，以判断是否显示“需求录入”的按钮
const isXQ = ref("")
async function isXQdemand() {
    const res = await dutApi.getDutType({ key: route.query.key, project_id: projectId.value })
    isXQ.value = res.data.dut_type
}
isXQdemand()

const showType = (record) => {
    let len = demandTypeDict.value.data.length
    for (let i = 0; i < len; i++) {
        if (demandTypeDict.value.data[i].key === record.demandType) {
            let item = demandTypeDict.value.data[i]
            return "SJ-" + item.show_title + "-" + record.ident
        }
    }
}
// crud组件
const crudOptions = useCrudOptions(crudRef)
const crudColumns = useColumns(crudRef)
// ~~~大功能打开ma-form-modal~~~
const fileInputRef = ref(null)
const handleAddFileInputDemand = () => {
    fileInputRef.value.open()
}

const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })

defineOptions({
    name: "dut"
})
</script>

<style lang="less" scoped></style>
