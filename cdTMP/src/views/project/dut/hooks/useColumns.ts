import { ref } from "vue"

export default function (crudOrFormRef?: any) {
    const crudColumns = ref([
        {
            title: "ID",
            align: "center",
            width: 50,
            hide: true,
            dataIndex: "id",
            commonRules: [{ required: true, message: "ID必填" }],
            validateTrigger: "blur-sm",
            display: false
        },
        {
            title: "设需标识",
            align: "center",
            sortable: { sortDirections: ["ascend"] },
            width: 180,
            dataIndex: "ident",
            search: true,
            validateTrigger: "blur-sm",
            placeholder: "请输入文档中设计需求的标识",
            help: '若不知道则填"无"或不填',
            openPrepend: true
        },
        {
            title: "设需名称",
            align: "center",
            width: 200,
            dataIndex: "name",
            search: true,
            commonRules: [{ required: true, message: "设计需求名称是必填" }],
            validateTrigger: "blur-sm"
        },
        {
            title: "章节号",
            align: "center",
            width: 150,
            dataIndex: "chapter",
            search: true,
            help: '若为隐含需求则填"/"'
        },
        {
            title: "需求类型",
            width: 150,
            align: "center",
            dataIndex: "demandType",
            addDefaultValue: "1",
            formType: "radio",
            search: true,
            dict: { name: "demandType", props: { label: "title", value: "key" }, translation: true },
            commonRules: [{ required: true, message: "需求类型是必填" }],
            validateTrigger: "blur-sm",
            // 主要为了添加“接口”的4个字段
            onControl: (value) => {
                if (value === "3") {
                    return {
                        source: { display: true },
                        to: { display: true },
                        type: { display: true },
                        protocal: { display: true }
                    }
                } else {
                    return {
                        source: { display: false },
                        to: { display: false },
                        type: { display: false },
                        protocal: { display: false }
                    }
                }
            }
        },
        {
            formType: "grid-tailwind",
            customClass: [],
            colNumber: 2,
            cols: [
                {
                    formList: [
                        {
                            title: "接口来源",
                            dataIndex: "source",
                            hide: true
                        },
                        {
                            title: "目的地",
                            dataIndex: "to",
                            hide: true
                        }
                    ]
                },
                {
                    formList: [
                        {
                            title: "接口类型",
                            dataIndex: "type",
                            hide: true,
                            placeholder:"请填写接口类型或协议，例如：UART"
                        },
                        {
                            title: "接口数据",
                            dataIndex: "protocal",
                            hide: true,
                            placeholder:"请填写接口的交互数据，例如：XX分级数据"
                        }
                    ]
                }
            ]
        },
        {
            title: "需求描述",
            dataIndex: "description",
            hide: true,
            width: 300,
            formType: "editor",
            height: 300
        }
    ])
    return crudColumns
}
