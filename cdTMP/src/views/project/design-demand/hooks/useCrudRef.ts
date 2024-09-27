import { ref, getCurrentInstance } from "vue"
import PinYinMatch from "pinyin-match"
import { useTreeDataStore } from "@/store"
import { useRoute } from "vue-router"
import testDemandApi from "@/api/project/testDemand"
import { isEqual, cloneDeep } from "lodash-es"
interface ITestContent {
    subName: string
    subDesc: string
}

/**
 * 1.配置crud以及全组件使用变量
 * 2.另外包含一个测试项是否保留数据的功能，含一个ref以及一个事件处理函数
 */
export default function useCrudRef() {
    // global
    const treeDataStore = useTreeDataStore()
    const route = useRoute()
    //  variable
    const roundNumber = (route.query.key as string)!.split("-")[0]
    const dutNumber = (route.query.key as string)!.split("-")[1]
    const designDemandNumber = (route.query.key as string)!.split("-")[2]
    // refs
    const projectId = ref(route.query.id)
    const crudRef = ref()
    // 处理弹窗关闭事件:处理用户数据是否保留

    const app = getCurrentInstance()!.appContext.config.globalProperties
    let beforeFormContent: ITestContent[] | undefined = undefined
    const handleBeforeCancel = () => {
        if (!beforeFormContent) {
            return
        }
        const iuEqualValue = isEqual(crudRef.value.getFormData().testContent, beforeFormContent)
        !iuEqualValue &&
            app.$modal.confirm({
                title: "测试项步骤内容你已改动，是否保留您编写的测试项/测试用例步骤数据？",
                content: "",
                okText: "保留",
                cancelText: "恢复原数据",
                simple: true,
                onOk: () => null,
                onCancel: () => {
                    crudRef.value.refresh()
                }
            })
    }
    // 配置
    // crud组件
    const crudOptions = ref({
        api: testDemandApi.getTestDemandList,
        add: { show: true, api: testDemandApi.save, text: "新增测试项" },
        edit: { show: true, api: testDemandApi.update, text: "修改测试项" },
        delete: { show: true, api: testDemandApi.delete },
        showTools: false,
        beforeOpenAdd: function () {
            // 1.新增则将form的content数据变为undifined以便判断
            beforeFormContent = undefined
            // 2.设置标识
            let key_split = (route.query.key as string)!.split("-")
            let round_key = key_split[0]
            let dut_key = key_split[1]
            let design_key = key_split[2]
            let td = treeDataStore.treeData
            crudRef.value.crudFormRef.actionTitle = `${route.query.ident} > ${td[round_key].title} > ${td[round_key].children[dut_key].title} > ${td[round_key].children[dut_key].children[design_key].title} > 测试项-`
            return true
        },
        beforeOpenEdit: function (record) {
            // 1.储存打开前form的content数据到ref中，以便后续比较
            beforeFormContent = cloneDeep(record.testContent)
            // 2.处理标识
            let key_split = (route.query.key as string)!.split("-")
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
            // 清空选择
            crudRef.value.tableRef.selectAll(false)
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
        operationColumnWidth: 200,
        operationColumn: true,
        operationColumnAlign: "center",
        formOption: {
            width: 1200,
            layout: [
                {
                    formType: "grid",
                    cols: [
                        { span: 12, formList: [{ dataIndex: "ident" }] },
                        { span: 12, formList: [{ dataIndex: "name" }] }
                    ]
                },
                {
                    formType: "grid",
                    cols: [{ span: 24, formList: [{ dataIndex: "priority" }] }]
                },
                {
                    formType: "grid",
                    cols: [
                        { span: 12, formList: [{ dataIndex: "testType" }] },
                        { span: 12, formList: [{ dataIndex: "testMethod" }] }
                    ]
                }
            ]
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
            extra: "支持拼音搜索，例如：gn可以搜索出功能测试",
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
                    formType: "textarea",
                    placeholder: "对应大纲测试项表格的测试项描述",
                    rules: [{ required: true, message: "测试子项描述必填" }]
                },
                {
                    title: "条件",
                    dataIndex: "condition",
                    formType: "textarea",
                    placeholder: "在什么环境和前置条件下"
                },
                {
                    title: "操作",
                    dataIndex: "operation",
                    formType: "textarea",
                    placeholder: "通过xxx操作"
                },
                {
                    title: "观察",
                    dataIndex: "observe",
                    formType: "textarea",
                    placeholder: "查看xxx内容"
                },
                {
                    title: "期望",
                    dataIndex: "expect",
                    formType: "textarea",
                    placeholder: "xxx结果正确"
                }
            ]
        }
    ])
    return {
        projectId,
        crudRef,
        crudOptions,
        crudColumns,
        handleBeforeCancel
    }
}
