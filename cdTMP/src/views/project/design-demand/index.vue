<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-full w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #ident="{ record }">
                    {{ showType(record) }}
                </template>
                <!-- 表格前置扩展槽:添加关联按钮 -->
                <template #tableAfterButtons>
                    <a-button type="outline" status="warning" @click="handleOpenRelationCSX">
                        <template #icon>
                            <icon-tags />
                        </template>
                        关联测试项
                    </a-button>
                </template>
                <!-- 版本字段的插槽 -->
                <template #inputPrepend-ident> XQ_XX_ </template>
            </ma-crud>
        </div>
        <!-- 关联的modal组件 -->
        <a-modal v-model:visible="visible" width="700px" draggable :on-before-ok="handleRelatedOk">
            <template #title>关联测试项</template>
            <div class="pb-3">已存在的关联项:</div>
            <a-typography-paragraph>
                <ol class="ol-reset">
                    <li v-for="item in computedRelatedData">{{ item }}</li>
                </ol>
            </a-typography-paragraph>
            <div class="pb-3">选择关联的测试需求项:</div>
            <a-cascader
                :options="options"
                multiple
                allow-search
                placeholder="暂无关联测试项，请选择..."
                :loading="cascaderLoading"
                v-model:model-value="relatedData"
            />
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute } from "vue-router"
import testDemandApi from "@/api/project/testDemand"
import { useTreeDataStore } from "@/store"
import commonApi from "@/api/common"
import PinYinMatch from "pinyin-match"
import { Message } from "@arco-design/web-vue"

const treeDataStore = useTreeDataStore()
const route = useRoute()
const crudRef = ref()
// 根据传参获取key，分别为轮次、设计需求的key
const roundNumber = route.query.key.split("-")[0]
const dutNumber = route.query.key.split("-")[1]
const designDemandNumber = route.query.key.split("-")[2]
const projectId = ref(route.query.id)
// ~~~~~关联相关变量和函数~~~~~
// 定义关联弹窗变量函数
const visible = ref(false)
const relatedData = ref([])
const computedRelatedData = computed(() => {
    const labelResultList = []
    options.value.forEach((item) => {
        if (item.children) {
            item.children.forEach((child) => {
                if (relatedData.value.includes(child.value)) {
                    labelResultList.push(child.label)
                }
            })
        }
    })
    return labelResultList
})
// 定义cascader的加载圈
const cascaderLoading = ref(false)
// 点击关联测试项-button
const handleOpenRelationCSX = async () => {
    // 请求接口获取数据
    cascaderLoading.value = true
    visible.value = true
    // 点击进入时清除关联
    relatedData.value = []
    const res = await testDemandApi.getRelatedTestDemand({ id: projectId.value, round: roundNumber })
    options.value = res.data
    // 找出本设计需求design对应已关联的测试项
    const res_exist = await testDemandApi.getExistRelatedTestDemand({
        project_id: projectId.value,
        roundNumber,
        dutNumber,
        designDemandNumber
    })
    relatedData.value = res_exist.data
    cascaderLoading.value = false
}
// 点击关联确定按钮
const handleRelatedOk = async () => {
    // 获取级联数据
    const relationDestItemIds = relatedData.value
    if (relationDestItemIds.length > 0) {
        const res = await testDemandApi.solveRelatedTestDemand({
            data: relationDestItemIds,
            project_id: projectId.value,
            roundNumber,
            dutNumber,
            designDemandNumber
        })
        if (res.code == 200) {
            Message.success(res.message)
            return true
        }
    } else {
        const res = await testDemandApi.solveRelatedTestDemand({
            data: [],
            project_id: projectId.value,
            roundNumber,
            dutNumber,
            designDemandNumber
        })
        if (res.code == 200) {
            Message.success(res.message)
            return true
        }
    }
    return false
}
// 级联cascade组件options
const options = ref([])
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 标识显示字段
const testTypeDict = ref([])
!(function () {
    commonApi.getDict("testType").then((res) => {
        testTypeDict.value = res
    })
})()
const showType = (record) => {
    let len = testTypeDict.value.data.length
    for (let i = 0; i < len; i++) {
        if (testTypeDict.value.data[i].key === record.testType) {
            let item = testTypeDict.value.data[i]
            return "XQ-" + item.show_title + "-" + record.ident
        }
    }
}
// crud组件
const crudOptions = ref({
    api: testDemandApi.getTestDemandList,
    add: { show: true, api: testDemandApi.save, text: "新增测试项" },
    edit: { show: true, api: testDemandApi.update, text: "修改测试项" },
    delete: { show: true, api: testDemandApi.delete },
    showTools: false,
    beforeOpenAdd: function () {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let design_key = key_split[2]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} > ${td[round_key].children[dut_key].children[design_key].title} > 测试项-`
        return true
    },
    beforeOpenEdit: function (record) {
        let key_split = route.query.key.split("-")
        let round_key = key_split[0]
        let dut_key = key_split[1]
        let design_key = key_split[2]
        let td = treeDataStore.treeData
        crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} > ${td[round_key].children[dut_key].children[design_key].title} >测试项[${record.name}]-`
        return true
    },
    afterAdd: (res) => {
        let id = projectId.value
        treeDataStore.updateTestDemandTreeData(res.data, id)
    },
    afterEdit: (res) => {
        let id = projectId.value
        treeDataStore.updateTestDemandTreeData(res.data, id)
    },
    afterDelete: (res, record) => {
        let id = projectId.value
        if (!record) {
            record = { key: route.query.key + "-X" }
        }
        treeDataStore.updateTestDemandTreeData(record, id)
    },
    parameters: {
        projectId: route.query.id,
        round: roundNumber,
        dut: dutNumber,
        designDemand: designDemandNumber
    },
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    operationColumnAlign:'center',
    formOption: {
        width: 1200
    }
})
const crudColumns = ref([
    {
        title: "ID",
        align: "center",
        hide: true,
        dataIndex: "id"
    },
    {
        title: "测项标识",
        width: 150,
        dataIndex: "ident",
        sortable: { sortDirections: ["ascend"] },
        align: "center",
        search: true,
        validateTrigger: "blur",
        placeholder: "请填写测试项的标识，注意标识不能重复",
        commonRules: [{ required: true, message: "测试项标识必填" }],
        openPrepend: true
    },
    {
        title: "名称",
        dataIndex: "name",
        width: 120,
        align: "center",
        search: true,
        commonRules: [{ required: true, message: "名称是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "优先级",
        dataIndex: "priority",
        search: true,
        formType: "radio",
        align: "center",
        addDefaultValue: "1",
        dict: {
            name: "priority",
            props: { label: "title", value: "key" },
            translation: true,
            tagColors: { 1: "red", 2: "blue", 3: "green" }
        }
    },
    {
        title: "测试类型",
        dataIndex: "testType",
        search: true,
        align: "center",
        formType: "select",
        sortable: { sortDirections: ["ascend", "descend"] },
        addDefaultValue: "4",
        maxLength: 200,
        commonRules: [{ required: true, message: "测试类型必选" }],
        dict: { name: "testType", translation: true, props: { label: "title", value: "key" } },
        extra: "请保证测试类型选择正确",
        // 这是arco的属性，所以在ma-crud和ma-form可以直接使用arco属性和事件（事件+onXXX）
        filterOption: function (inputValue, selectedOption) {
            if (inputValue) {
                let matchRes = PinYinMatch.match(selectedOption.label, inputValue)
                if (matchRes) {
                    return true
                }
            }
        }
    },
    {
        title: "测试手段",
        align: "center",
        dataIndex: "testMethod",
        formType: "select",
        multiple: true,
        dict: { name: "testMethod", props: { label: "title", value: "key" }, translation: true }
    },
    {
        title: "充分性要求",
        hide: true,
        addDefaultValue: "覆盖需求相关功能",
        dataIndex: "adequacy",
        formType: "textarea",
        maxLength: 256,
        commonRules: [{ required: true, message: "充分性描述必填" }],
        addDefaultValue:
            "测试用例覆盖XX子项名称1、XX子项名称2、XX子项名称3子项要求的全部内容。\n所有用例执行完毕，对于未执行的用例说明未执行原因。"
    },
    {
        title: "测试子项",
        hide: true,
        dataIndex: "testContent",
        commonRules: [{ required: true, message: "测试方法是必填的" }],
        formType: "children-form",
        formList: [
            {
                title: "子项名称",
                dataIndex: "subName",
                placeholder: "对应测试项描述标题，和测试方法的标题",
                rules: [{ required: true, message: "测试子项名称必填" }],
                onChange: (ev) => {
                    // 取出子项的对象数组
                    const subItemFormData = crudRef.value.getFormData().testContent
                    // 取出充分性条件字段字符串
                    const mapRes = subItemFormData.map((subItem) => subItem.subName)
                    crudRef.value.getFormData().adequacy = `测试用例覆盖${mapRes.join(
                        "、"
                    )}子项要求的全部内容。\n所有用例执行完毕，对于未执行的用例说明未执行原因。`
                }
            },
            {
                title: "子项描述",
                dataIndex: "subDesc",
                placeholder: "对应大纲测试项表格的测试项描述",
                rules: [{ required: true, message: "测试子项描述必填" }]
            },
            {
                title: "条件",
                dataIndex: "condition",
                placeholder: "在什么环境和前置条件下"
            },
            {
                title: "操作",
                dataIndex: "operation",
                placeholder: "通过xxx操作"
            },
            {
                title: "观察",
                dataIndex: "observe",
                placeholder: "查看xxx内容"
            },
            {
                title: "期望",
                dataIndex: "expect",
                placeholder: "xxx结果正确"
            }
        ]
    }
])
// 暴露给route-view的刷新表格函数
const refreshCrudTable = () => {
    crudRef.value.refresh()
}
defineExpose({ refreshCrudTable })

defineOptions({
    name: "designDemand"
})
</script>

<style lang="less" scoped>
.ol-reset {
    list-style: auto;
}
</style>
