import { useRoute } from "vue-router"
import { ref } from "vue"
import { FragApi } from "@/api/system/fragment"
import { ProductFileEnum } from "@/utils/enums/productTypes"
import type { IDictData } from "@/utils/types/CommonType"
import { IFragSearchCondition } from "@/api/system/types/fragmentTypes"

const useCrudOption = () => {
    // global
    const route = useRoute()
    const crudRef = ref()
    // 产品文档类型写死7种
    const productFileType: IDictData<ProductFileEnum>[] = Object.keys(ProductFileEnum).map((it, index) => ({
        label: ProductFileEnum[it],
        value: index + 1
    }))
    // crud-option
    const crudOptions = ref<object>({
        api: FragApi.getFragList,
        add: { show: true, api: FragApi.add },
        edit: { show: true, api: FragApi.update },
        delete: { show: true, api: FragApi.delete },
        // 新增需要项目id
        parameters: {
            projectId: route.params.projectId as string
        },
        beforeRequest: (params: IFragSearchCondition) => {
            // 添加项目id参数
            params.projectId = route.params.projectId as string
        },
        afterDelete(response: any) {
            crudRef.value.tableRef.selectAll(false)
        },
        showTools: false,
        operationColumn: true,
        operationColumnWidth: 180,
        operationColumnAlign: "center",
        bordered: { wrapper: true, cell: true },
        resizable: false, // 不允许调整列宽
        rowSelection: { showCheckedAll: true, checkStrictly: true },
        isDbClickEdit: false,
        searchColNumber: 2,
        formOption: {
            isFull: true,
            layout: [
                {
                    formType: "grid",
                    cols: [
                        { span: 12, formList: [{ dataIndex: "name" }] },
                        { span: 12, formList: [{ dataIndex: "belong_doc" }] }
                    ]
                }
            ]
        }
    })
    const crudColumns = ref<any[]>([
        {
            title: "ID",
            align: "center",
            width: 50,
            hide: true,
            dataIndex: "id",
            commonRules: [{ required: true, message: "ID必填" }],
            validateTrigger: "blur"
        },
        {
            title: "片段名称",
            align: "center",
            width: 180,
            dataIndex: "name",
            search: true,
            commonRules: [{ required: true, message: "片段名称必填" }],
            validateTrigger: "blur"
        },
        {
            title: "所属文档",
            align: "center",
            width: 100,
            dataIndex: "belong_doc",
            formType: "select",
            search: true,
            commonRules: [{ required: true, message: "所属文档必选" }],
            dict: { data: productFileType, translation: true }
        },
        {
            title: "替换片段",
            width: 100,
            align: "center",
            dataIndex: "is_main",
            addDisplay: false,
            editDisplay: false
        },
        {
            title: "内容",
            align: "center",
            dataIndex: "content",
            hide: true,
            formType: "editor",
            height: 550
        }
    ])

    return {
        crudRef,
        crudOptions,
        crudColumns,
        route
    }
}

export default useCrudOption
