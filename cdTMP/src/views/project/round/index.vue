<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
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

<script setup lang="jsx">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import dutApi from "@/api/project/dut"
import { useTreeDataStore } from "@/store"
const treeDataStore = useTreeDataStore()
const route = useRoute()
const roundNumber = route.query.key.split("-")[0]
const projectId = ref(route.query.id)
const crudRef = ref()
// crud组件
const crudOptions = ref({
    api: dutApi.getDutList,
    add: { show: true, api: dutApi.save, text: "新增被测件" },
    // 处理添加后函数
    beforeOpenAdd: function () {
        let round_str = parseInt(route.query.key) + 1
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident}>第${round_str}轮>被测件-`
        return true
    },
    beforeOpenEdit: function (record) {
        let round_str = parseInt(route.query.key) + 1
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident}>第${round_str}轮>被测件[${record.name}]-`
        return true
    },
    afterAdd: (res) => {
        let id = projectId.value
        treeDataStore.updateDutTreeData(res.data, id)
    },
    afterEdit: (res) => {
        let id = projectId.value
        treeDataStore.updateDutTreeData(res.data, id)
    },
    afterDelete: (res, record) => {
        let id = projectId.value
        treeDataStore.updateDutTreeData(record, id)
    },
    edit: { show: true, api: dutApi.update, text: "编辑被测件" },
    delete: { show: true, api: dutApi.delete },
    parameters: {
        projectId: route.query.id,
        round: roundNumber
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
        width: 600
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
        sortable: { sortDirections: ["ascend"] },
        align: "center",
        dataIndex: "ident",
        search: true,
        // 这里做的标识预填
        addDefaultValue: route.query.ident + "-R" + (parseInt(route.query.key) + 1) + "-UT",
        addDisabled: true,
        editDisabled: true,
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
        control: (value, data) => {
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
                // 其他数据清除

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
        title: "版本",
        align: "center",
        dataIndex: "version",
        search: true,
        commonRules: [{ required: true, message: "版本必填" }],
        validateTrigger: "blur"
    },
    {
        title: "单位",
        align: "center",
        dataIndex: "release_union",
        search: true,
        commonRules: [{ required: true, message: "单位必选" }],
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        title: "发布时间",
        dataIndex: "release_date",
        hide: true,
        commonRules: [{ required: true, message: "时间必填" }],
        formType: "date"
    },
    {
        title: "空行",
        hide: true,
        align: "center",
        dataIndex: "black_line",
        formType: "input-number"
    },
    {
        title: "纯注释",
        hide: true,
        align: "center",
        dataIndex: "pure_code_line",
        formType: "input-number"
    },
    {
        title: "混合行",
        hide: true,
        align: "center",
        dataIndex: "mix_line",
        formType: "input-number"
    },
    {
        title: "总注释",
        hide: true,
        align: "center",
        dataIndex: "total_comment_line",
        formType: "input-number"
    },
    {
        title: "总代码",
        hide: true,
        align: "center",
        dataIndex: "total_code_line",
        formType: "input-number"
    },
    {
        title: "总行数",
        hide: true,
        align: "center",
        dataIndex: "total_line",
        formType: "input-number"
    },
    {
        title: "注释率 %",
        align: "center",
        dataIndex: "comment_line",
        hide: true,
        addDisabled: true,
        editDisabled: true,
        customRender: ({ record }) => {
            if (record.total_comment_line && record.total_code_line) {
                if (isNaN(parseFloat(record.total_comment_line)) || isNaN(parseFloat(record.total_code_line))) {
                    return "数值错误"
                }
                if (parseFloat(record.total_comment_line) <= 0 || parseFloat(record.total_code_line) <= 0) {
                    return "不能为负数"
                }
                if (parseFloat(record.total_comment_line) >= parseFloat(record.total_code_line)) {
                    return "注释大于总行"
                }
                return (
                    <a-statistic
                        animation-duration={parseInt(1000)}
                        precision={2}
                        animation
                        value-style={{ color: "lightblue" }}
                        value={parseFloat(record.total_comment_line / record.total_code_line)}
                    ></a-statistic>
                )
            }
        },
        // 注意这个是个创新点
        control(value, data) {
            data.comment_line = (data.total_comment_line / data.total_code_line).toFixed(2).toString()
        }
    }
])
</script>

<style lang="less" scoped></style>
