<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import designDemandApi from "@/api/project/designDemand"
import commonApi from "@/api/common"
import { useTreeDataStore } from "@/store"
const treeDataStore = useTreeDataStore()
const route = useRoute()
const router = useRouter()
const crudRef = ref()
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
const projectId = ref(route.query.id)
// 显示标识是FT-{标识}-001，大体思路是：根据类型生成FT，拼接标识和key的最后一位
const demandTypeDict = ref([])
!(function () {
    commonApi.getDict("demandType").then((res) => {
        demandTypeDict.value = res
    })
})()

const showType = (record) => {
    let len = demandTypeDict.value.data.length
    for (let i = 0; i < len; i++) {
        if (demandTypeDict.value.data[i].key === record.demandType) {
            let key_string = parseInt(record.key.substring(record.key.lastIndexOf("-") + 1)) + 1
            let item = demandTypeDict.value.data[i]
            return "SJ-" + record.ident + "-" + item.show_title + "-" + key_string.toString().padStart(3, "0")
        }
    }
}
// crud组件
const crudOptions = ref({
    api: designDemandApi.getDesignDemandList,
    add: { show: true, api: designDemandApi.save },
    edit: { show: true, api: designDemandApi.editDesignDemand },
    delete: { show: true, api: designDemandApi.delete },
    // 处理添加后函数
    beforeOpenAdd: function () {
        let key_split =  route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} > 设计需求-`
        return true
    },
    beforeOpenEdit: function (record) {
        let key_split =  route.query.key.split("-")
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
    }
})
const crudColumns = ref([
    {
        title: "ID",
        align: "center",
        width: 50,
        dataIndex: "id",
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "标识",
        align: "center",
        sortable: { sortDirections: ["ascend"] },
        width: 120,
        dataIndex: "ident",
        search: true,
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "需求名称",
        align: "center",
        width: 150,
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "需求名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "章节号",
        align: "center",
        width: 150,
        dataIndex: "chapter",
        search: true
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
        validateTrigger: "blur"
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
</script>

<style lang="less" scoped></style>
