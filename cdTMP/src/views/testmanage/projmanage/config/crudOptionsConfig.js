import projectApi from "@/api/testmanage/project"
export const crudOptions = {
    showIndex: false,
    rowSelection: { showCheckedAll: true },
    api: projectApi.getPageList,
    add: { show: true },
    edit: { show: true },
    delete: { show: true },
    searchColNumber: 3,
    tablePagination: true,
    operationColumn: true,
    operationWidth: 200,
    showIndex: false,
    formOption: {
        isFull: true,
        layout: [
            {
                formType: "grid",
                cols: [
                    { span: 8, formList: [{ dataIndex: "ident" }] },
                    { span: 8, formList: [{ dataIndex: "name" }] },
                    { span: 8, formList: [{ dataIndex: "engin_model" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 8, formList: [{ dataIndex: "section_system" }] },
                    { span: 8, formList: [{ dataIndex: "sub_system" }] },
                    { span: 8, formList: [{ dataIndex: "device" }] }
                ]
            },
            {
                formType: "divider"
            },
            {
                formType: "grid",
                cols: [
                    { span: 8, formList: [{ dataIndex: "beginTime" }] },
                    { span: 8, formList: [{ dataIndex: "endTime" }] },
                    { span: 8, formList: [{ dataIndex: "duty_person" }] },
                    { span: 8, formList: [{ dataIndex: "member" }] }
                ]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "security_level" }] }]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "test_level" }] },
                    { span: 12, formList: [{ dataIndex: "plant_type" }] }
                ]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "report_type" }] }]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "language" }] }]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "standard" }] }]
            },
            {
                formType: "grid-tailwind",
                customClass: ["mt-0"],
                colNumber: 3,
                cols: [
                    {
                        formList: [
                            {
                                formType: "card",
                                title: "委托方信息",
                                customClass: ["mt-3", "mb-5", "mx-1"],
                                formList: [
                                    { dataIndex: "entrust_ident" },
                                    { dataIndex: "entrust_legal" },
                                    { dataIndex: "entrust_contact" },
                                    { dataIndex: "entrust_contact_phone" },
                                    { dataIndex: "entrust_email" }
                                ]
                            }
                        ]
                    },
                    {
                        formList: [
                            {
                                formType: "card",
                                title: "研制方信息",
                                customClass: ["mt-3", "mb-5", "mx-1"],
                                formList: [
                                    { dataIndex: "dev_ident" },
                                    { dataIndex: "dev_legal" },
                                    { dataIndex: "dev_contact" },
                                    { dataIndex: "dev_contact_phone" },
                                    { dataIndex: "dev_email" }
                                ]
                            }
                        ]
                    },
                    {
                        formList: [
                            {
                                formType: "card",
                                title: "测评中心信息",
                                customClass: ["mt-3", "mb-5", "mx-1"],
                                formList: [
                                    { dataIndex: "test_ident" },
                                    { dataIndex: "test_legal" },
                                    { dataIndex: "test_contact" },
                                    { dataIndex: "test_contact_phone" },
                                    { dataIndex: "test_email" }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
