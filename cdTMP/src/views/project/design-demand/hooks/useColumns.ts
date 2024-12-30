import { ref } from "vue"
import PinYinMatch from "pinyin-match"

export default function (crudOrFormRef: any) {
    const crudColumns = ref([
        {
            title: "ID",
            align: "center",
            hide: true,
            dataIndex: "id",
            display: false
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
                        const subItemFormData = crudOrFormRef.value.getFormData().testContent
                        // 取出充分性条件字段字符串
                        const mapRes = subItemFormData.map((subItem) => subItem.subName)
                        crudOrFormRef.value.getFormData().adequacy = `测试用例覆盖${mapRes.join(
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
    return crudColumns
}
