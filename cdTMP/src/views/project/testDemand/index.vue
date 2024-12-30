<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef" @beforeCancel="handleBeforeCancel">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
            </ma-crud>
        </div>
        <problem-form ref="problemFormRef" :title="title"></problem-form>
    </div>
</template>

<script setup lang="jsx">
import { ref } from "vue"
import ProblemForm from "@/views/project/case/components/ProblemForm.vue"
import useCrudOpMore from "./hooks/useCrudOpMore"
import useColumn from "./hooks/useColumn"
const problemFormRef = ref(null)
const title = ref("问题单表单")
const crudRef = ref()
// 标识重新定义
const showType = (record) => {
    let key_string = parseInt(record.key.substring(record.key.lastIndexOf("-") + 1)) + 1
    return "YL-" + record.testType + "-" + record.ident + "-" + key_string.toString().padStart(3, "0")
}

const { handleBeforeCancel, crudOptions } = useCrudOpMore(crudRef)
const crudColumns = useColumn(crudRef, problemFormRef)

// 暴露刷新表格方法给外部
const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })

defineOptions({
    name: "testDemand"
})
</script>

<style lang="less" scoped></style>
