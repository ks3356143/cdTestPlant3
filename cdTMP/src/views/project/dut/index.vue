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
        <file-input-modal ref="fileInputRef"></file-input-modal>
    </div>
</template>

<script setup lang="jsx">
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import designDemandApi from "@/api/project/designDemand"
import dutApi from "@/api/project/dut"
import commonApi from "@/api/common"
import { useTreeDataStore } from "@/store"
import FileInputModal from "./components/FileInputModal/index.vue"
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const crudRef = ref()
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
const projectId = ref(route.query.id)
// 5月8日修改设计需求标识就按SJ-FT-设计需求标识来
const demandTypeDict = ref([])
!(function () {
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
const crudOptions = ref({
    api: designDemandApi.getDesignDemandList,
    add: { show: true, api: designDemandApi.save, text: "新增设计需求" },
    edit: { show: true, api: designDemandApi.editDesignDemand, text: "编辑设计需求" },
    delete: { show: true, api: designDemandApi.delete },
    afterDelete(response) {
        crudRef.value.setSelecteds([])
    },
    // 处理添加后函数
    beforeOpenAdd: function () {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} > 设计需求-`
        return true
    },
    beforeOpenEdit: function (record) {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} >设计需求[${record.name}]-`
        return true
    },
    afterAdd: (res) => {
        let id = projectId.value
        treeDataStore.updateDesignDemandTreeData(res.data, id)
    },
    afterEdit: (res) => {
        let id = projectId.value
        treeDataStore.updateDesignDemandTreeData(res.data, id)
    },
    afterDelete: (res, record) => {
        let id = projectId.value
        if (!record) {
            record = { key: route.query.key + "-X" }
        }
        treeDataStore.updateDesignDemandTreeData(record, id)
    },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber
    },
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 4,
    tablePagination: false,
    operationColumn: true,
    operationColumnAlign: "center",
    formOption: {
        width: 1200
    },
    showTools: false
})
const crudColumns = ref([
    {
        title: "ID",
        align: "center",
        width: 50,
        hide: true,
        dataIndex: "id",
        commonRules: [{ required: true, message: "ID必填" }],
        validateTrigger: "blur"
    },
    {
        title: "设需标识",
        align: "center",
        sortable: { sortDirections: ["ascend"] },
        width: 120,
        dataIndex: "ident",
        search: true,
        validateTrigger: "blur",
        placeholder: "请输入文档中设计需求的标识",
        help: '若不知道则填"无"或不填',
        openPrepend: true
    },
    {
        title: "设需名称",
        align: "center",
        width: 150,
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "设计需求名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "章节号",
        align: "center",
        width: 150,
        dataIndex: "chapter",
        search: true,
        help: '若为隐含需求则填"/"'
    },
    {
        title: "需求类型",
        width: 150,
        align: "center",
        dataIndex: "demandType",
        addDefaultValue: "1",
        formType: "radio",
        search: true,
        dict: { name: "demandType", props: { label: "title", value: "key" }, translation: true },
        commonRules: [{ required: true, message: "需求类型是必填" }],
        validateTrigger: "blur",
        // 主要为了添加“接口”的4个字段
        control: (value) => {
            if (value === "3") {
                return {
                    source: { display: true },
                    to: { display: true },
                    type: { display: true },
                    protocal: { display: true }
                }
            } else {
                return {
                    source: { display: false },
                    to: { display: false },
                    type: { display: false },
                    protocal: { display: false }
                }
            }
        }
    },
    {
        formType: "grid-tailwind",
        customClass: [],
        colNumber: 2,
        cols: [
            {
                formList: [
                    {
                        title: "接口来源",
                        dataIndex: "source",
                        hide: true
                    },
                    {
                        title: "目的地",
                        dataIndex: "to",
                        hide: true
                    }
                ]
            },
            {
                formList: [
                    {
                        title: "接口类型",
                        dataIndex: "type",
                        hide: true
                    },
                    {
                        title: "接口内容",
                        dataIndex: "protocal",
                        hide: true
                    }
                ]
            }
        ]
    },
    {
        title: "需求描述",
        dataIndex: "description",
        hide: true,
        width: 300,
        formType: "editor",
        height: 300
    }
])
// ~~~大功能打开ma-form-modal~~~
const fileInputRef = ref(null)
const handleAddFileInputDemand = () => {
    fileInputRef.value.open()
}

defineOptions({
    name: "dut"
})
</script>

<style lang="less" scoped></style>
