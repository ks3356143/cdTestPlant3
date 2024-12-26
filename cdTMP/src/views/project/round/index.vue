<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <!-- 版本字段的插槽 -->
                <template #inputPrepend-version> V </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref } from "vue"
import useCrudRef from "@/views/project/round/hooks/useCrudRef"
const crudRef = ref()
// crud组件
const { crudOptions, crudColumns } = useCrudRef(crudRef)

const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })

defineOptions({
    name: "round"
})
</script>

<style lang="less" scoped></style>
