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
import { computed, ComputedRef } from "vue"
import PageHeader from "@/views/testmanage/components/PageHeader/index.vue"
// apis - import
import { FragApi } from "@/api/system/fragment"
import projectApi from "@/api/testmanage/project"
// types - import
import type { IPageHeaderProps } from "../components/PageHeader/types"
import { Message } from "@arco-design/web-vue"
// hooks-import
import useFetchData from "@/hooks/fetchData"
import useCrudOption from "./hooks/crudOption"
// 1.hook-crudOptions
const { crudRef, crudOptions, crudColumns, route } = useCrudOption()
// 2.hook-获取单个项目信息
const fetchData = async () => {
    return projectApi.getProjectById(route.params.projectId)
}
const { loadingData, isDataLoading } = useFetchData({}, fetchData)
// 3.给头部组件的计算属性
const headerData: ComputedRef<IPageHeaderProps> = computed(() => {
    return {
        title: loadingData.value.ident as string,
        name: loadingData.value.name as string
    }
})
// 4.noQuery - 请求头部数据
const beforeSwitchChange = (record: any) => {
    return async function (newVal: boolean) {
        await FragApi.update(record.id, {
            is_main: newVal,
            projectId: route.params.projectId as string
        })
        Message.success("设置成功")
    }
}

defineOptions({
    name: "projFragment"
})
</script>

<style scoped></style>
