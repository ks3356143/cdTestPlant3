<template>
    <div class="proj-fragment-container">
        <div class="ma-content-block lg:flex justify-between p-4">
            <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0" v-loading="isDataLoading">
                <page-header :data="headerData"></page-header>
                <hr />
                <ma-crud class="mt-3" :options="crudOptions" :columns="crudColumns" ref="crudRef">
                    <!-- 切换is_main -->
                    <template #is_main="{ record }">
                        <a-switch
                            v-model:model-value="record.is_main"
                            :before-change="beforeSwitchChange(record)"
                        ></a-switch>
                    </template>
                </ma-crud>
            </div>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { computed, ComputedRef, ref } from "vue"
import { useRoute } from "vue-router"
import PageHeader from "@/views/testmanage/components/PageHeader/index.vue"
import useFetchData from "@/hooks/fetchData"
// apis
import { FragApi } from "@/api/system/fragment"
import projectApi from "@/api/testmanage/project"
// types
import { ProductFileEnum } from "@/utils/enums/productTypes"
import type { IDictData } from "@/utils/types/CommonType"
import type { IPageHeaderProps } from "../components/PageHeader/types"
import type { IFragSearchCondition } from "@/api/system/types/fragmentTypes"
import { Message } from "@arco-design/web-vue"

const route = useRoute()
const crudRef = ref()
// 产品文档类型写死7种
const productFileType: IDictData<ProductFileEnum>[] = Object.keys(ProductFileEnum).map((it, index) => ({
    label: ProductFileEnum[it],
    value: index + 1
}))
// hook-获取单个项目信息
const fetchData = async () => {
    return projectApi.getProjectById(route.params.projectId)
}
const { loadingData, isDataLoading } = useFetchData({}, fetchData)
// 给头部组件的计算属性
const headerData: ComputedRef<IPageHeaderProps> = computed(() => {
    return {
        title: loadingData.value.ident as string,
        name: loadingData.value.name as string
    }
})
// 在表格切换is_main属性
const beforeSwitchChange = (record: any) => {
    return async function (newVal: boolean) {
        await FragApi.update(record.id, {
            is_main: newVal,
            projectId: route.params.projectId as string
        })
        Message.success("设置成功")
    }
}

// ma-crud配置
const crudOptions = ref<object>({
    api: FragApi.getFragList,
    edit: { show: true, api: FragApi.update },
    delete: { show: true, api: FragApi.delete },
    beforeRequest: (params: IFragSearchCondition) => {
        // 添加项目id参数
        params.projectId = route.params.projectId as string
    },
    afterDelete(response: any) {
        crudRef.value.setSelecteds([])
    },
    showTools: false,
    operationColumn: true,
    operationColumnWidth: 120,
    operationColumnAlign: "center",
    bordered: { wrapper: true, cell: true },
    resizable: false, // 不允许调整列宽
    rowSelection: { showCheckedAll: true, checkStrictly: true },
    isDbClickEdit: false,
    searchColNumber: 2,
    formOption: {
        isFull: true,
        layout: [
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "name" }] },
                    { span: 12, formList: [{ dataIndex: "belong_doc" }] }
                ]
            }
        ]
    }
})
const crudColumns = ref<any[]>([
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
        title: "片段名称",
        align: "center",
        width: 120,
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "片段名称必填" }],
        validateTrigger: "blur"
    },
    {
        title: "所属文档",
        align: "center",
        width: 100,
        dataIndex: "belong_doc",
        formType: "select",
        search: true,
        commonRules: [{ required: true, message: "所属文档必选" }],
        dict: { data: productFileType, translation: true }
    },
    {
        title: "替换片段",
        align: "center",
        dataIndex: "is_main",
        addDisplay: false,
        editDisplay: false
    },
    {
        title: "内容",
        align: "center",
        dataIndex: "content",
        hide: true,
        formType: "editor",
        height: 550
    }
])

defineOptions({
    name: "projFragment"
})
</script>

<style scoped></style>
