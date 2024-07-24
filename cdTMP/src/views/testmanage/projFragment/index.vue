<template>
    <div class="proj-fragment-container">
        <div class="ma-content-block lg:flex justify-between p-4">
            <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0" v-loading="isDataLoading">
                <a-page-header @back="handleBackClick" :style="{ background: 'var(--color-bg-2)' }" :title="loadingData.ident">
                    <template #subtitle>
                        <a-space>
                            <span>{{ loadingData.name }}</span>
                        </a-space>
                        <span class="text-base ml-3 text-red-950">所属文档片段</span>
                    </template>
                </a-page-header>
                <hr/>
                <ma-crud class="mt-3" :options="crudOptions" :columns="crudColumns" ref="crudRef"> </ma-crud>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FragApi } from "@/api/system/fragment"
import { ProductFileEnum } from "@/utils/enums/productTypes"
import { IDictData } from "@/utils/types/CommonType"
import useFetchData from "@/hooks/fetchData"
import projectApi from "@/api/testmanage/project"
const route = useRoute()
const router = useRouter()
const crudRef = ref(null)
// 产品文档类型写死7种
const productFileType: IDictData<ProductFileEnum>[] = Object.keys(ProductFileEnum).map((it) => ({
    label: ProductFileEnum[it],
    value: it as ProductFileEnum
}))
// 返回项目管理
const handleBackClick = () => {
    router.go(-1)
}
// hook-获取单个项目信息
const fetchData = async () => {
    return projectApi.getProjectById(route.params.projectId)
}
const { loadingData, isDataLoading } = useFetchData({}, fetchData)

// ma-crud配置
const crudOptions = ref<object>({
    api: FragApi.getFragList,
    showTools: false
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
        dict: { data: productFileType }
    }
])

defineOptions({
    name: "projFragment"
})
</script>

<style scoped></style>
