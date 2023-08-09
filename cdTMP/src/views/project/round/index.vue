<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns">
                <template #total_code_line="{ record }">
                    <template v-if="record.total_code_line">
                        <a-statistic
                            :animation-duration="1000"
                            :value="parseInt(record.total_code_line)"
                            animation
                            :value-style="{ color: '#0fbf60' }"
                        ></a-statistic>
                    </template>
                </template>
                <template #total_line="{ record }">
                    <template v-if="record.total_line">
                        <a-statistic
                            :animation-duration="1000"
                            :value="parseInt(record.total_line)"
                            animation
                            :value-style="{ color: 'orange' }"
                        ></a-statistic>
                    </template>
                </template>
                <template #comment_line="{ record }">
                    <template v-if="record.comment_line">
                        <a-statistic
                            :animation-duration="1000"
                            :precision="2"
                            :value="parseFloat(record.comment_line)"
                            animation
                            :value-style="{ color: 'lightblue' }"
                        >
                            <template #suffix> % </template>
                        </a-statistic>
                    </template>
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import dutApi from "@/api/project/dut"
const route = useRoute()
const router = useRouter()
const roundNumber = route.query.key.split("-")[0]

// crud组件
const crudOptions = ref({
    api: dutApi.getDutList,
    add: { show: true, api: dutApi.save,text:"新增被测件" },
    edit: { show: true, api: dutApi.update,text:"编辑被测件" },
    delete: { show: true, api: dutApi.delete },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
    },
    operationWidth: 500,
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    operationColumnAlign: "center",
    formOption: {
        viewType: "drawer",
        width: 600,
    }
})
const beiceType = [
    { label: "源代码", value: "SO" },
    { label: "设计说明", value: "SJ" },
    { label: "需求文档", value: "XQ" },
    { label: "通信协议", value: "XY" }
]

const crudColumns = ref([
    {
        title: "ID",
        width: 50,
        align: "center",
        dataIndex: "id",
        commonRules: [{ required: true, message: "ID是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "标识",
        width: 150,
        align: "center",
        dataIndex: "ident",
        search: true,
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "被测类型",
        align: "center",
        dataIndex: "type",
        search: true,
        formType: "radio",
        addDefaultValue: "SO",
        dict: {
            data: beiceType,
            translation: true,
            tagColors: { XQ: "blue", SO: "green", SJ: "orangered", XY: "pinkpurple" }
        },
        control: (value) => {
            if (value === "SO") {
                return {
                    black_line: { display: true },
                    pure_code_line: { display: true },
                    mix_line: { display: true },
                    total_comment_line: { display: true },
                    total_code_line: { display: true },
                    total_line: { display: true },
                    comment_line: { display: true }
                }
            } else {
                return {
                    black_line: { display: false },
                    pure_code_line: { display: false },
                    mix_line: { display: false },
                    total_comment_line: { display: false },
                    total_code_line: { display: false },
                    total_line: { display: false },
                    comment_line: { display: false }
                }
            }
        }
    },
    {
        title: "被测件名",
        width: 120,
        align: "center",
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "需求名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "空行",
        hide: true,
        align: "center",
        dataIndex: "black_line"
    },
    {
        title: "纯注释",
        hide: true,
        align: "center",
        dataIndex: "pure_code_line"
    },
    {
        title: "混合行",
        hide: true,
        align: "center",
        dataIndex: "mix_line"
    },
    {
        title: "总注释",
        hide: true,
        align: "center",
        dataIndex: "total_comment_line"
    },
    {
        title: "总代码",
        align: "center",
        dataIndex: "total_code_line"
    },
    {
        title: "总行数",
        align: "center",
        dataIndex: "total_line"
    },
    {
        title: "注释率",
        align: "center",
        dataIndex: "comment_line",
        commonRules: [{ required: true, message: "注释率必填" }]
    }
])
</script>

<style lang="less" scoped></style>
