import { ref } from "vue"
import dutApi from "@/api/project/dut"
import { useRoute } from "vue-router"
import { useTreeDataStore } from "@/store"
import beiceType from "@/views/project/round/beiceType"
/**
 * 传入组件Ref返回其options和columnOptions
 * @param crudRef crud组件的Ref，注意不存在传递undefined
 * @param formRef ma-form组件Ref
 * @returns
 */
export default function useCrudRef(crudRef?, formRef?) {
    // globals
    const route = useRoute()
    const projectId = ref(route.query.id)
    const treeDataStore = useTreeDataStore()
    const roundNumber = (route.query.key as any).split("-")[0]
    // 计算注释率计算crud/form的数据，判断
    const calcPercent = () => {
        if (crudRef) {
            const formData = crudRef.value.getFormData()
            const total_line = +formData.black_line + +formData.code_line + +formData.comment_line + +formData.mix_line
            const comment_total = +formData.comment_line + +formData.mix_line
            formData.comment_percent = `${(comment_total / total_line).toFixed(2).toString()}%`
        } else if (formRef) {
            const formData = formRef.value.getFormData()
            const { code_line, comment_line, mix_line, black_line } = formData
            const total_line = +black_line + +code_line + +comment_line + +mix_line
            const comment_total = +comment_line + +mix_line
            formData.comment_percent = `${(comment_total / total_line).toFixed(2).toString()}%`
        }
    }
    // refs
    const crudOptions = ref({
        api: dutApi.getDutList,
        add: { show: true, api: dutApi.save, text: "新增被测件" },
        edit: { show: true, api: dutApi.update, text: "编辑被测件" },
        delete: { show: true, api: dutApi.delete },
        // 处理添加后函数
        beforeOpenAdd: function () {
            let round_str = parseInt(route.query.key as any) + 1
            crudRef.value.crudFormRef.actionTitle = `${route.query.ident}>第${round_str}轮>被测件-`
            return true
        },
        beforeOpenEdit: function (record) {
            let round_str = parseInt(route.query.key as any) + 1
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
            if (!record) {
                record = { key: route.query.key + "-X" }
            }
            treeDataStore.updateDutTreeData(record, id)
            // 清空行选择器
            crudRef.value.tableRef.selectAll(false)
        },

        // 新增、编辑、删除均携带下面
        parameters: {
            projectId: route.query.id,
            round: roundNumber
        },
        operationWidth: 500,
        showIndex: false,
        showTools: false,
        rowSelection: { showCheckedAll: true },
        searchColNumber: 3,
        tablePagination: false,
        operationColumnWidth: 200, // 操作列宽度
        operationColumn: true,
        operationColumnAlign: "center",
        formOption: {
            viewType: "drawer",
            width: 600,
            mask: false
        }
    })

    const crudColumns = ref([
        {
            title: "ID",
            width: 50,
            align: "center",
            hide: true,
            dataIndex: "id",
            commonRules: [{ required: true, message: "ID是必填" }],
            validateTrigger: "blur",
            display: false
        },
        {
            title: "测件标识",
            width: 150,
            sortable: { sortDirections: ["ascend"] },
            align: "center",
            dataIndex: "ident",
            search: true,
            // 这里做的标识预填
            addDefaultValue: route.query.ident + "-R" + (parseInt(route.query.key as any) + 1) + "-UT",
            addDisabled: true,
            editDisabled: true,
            validateTrigger: "blur",
            disabled: true,
            placeholder: "被测件标识未空，请检查"
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
                tagColors: { XQ: "blue", SO: "green", SJ: "orangered", XY: "pinkpurple", YZ: "red" }
            },
            onControl: (value) => {
                if (value === "SO") {
                    return {
                        black_line: { display: true },
                        code_line: { display: true },
                        mix_line: { display: true },
                        comment_line: { display: true },
                        total_code_line: { display: true },
                        total_line: { display: true },
                        comment_percent: { display: true },
                        release_date: { display: false }
                    }
                } else {
                    // 其他数据清除
                    return {
                        black_line: { display: false },
                        code_line: { display: false },
                        mix_line: { display: false },
                        comment_line: { display: false },
                        total_code_line: { display: false },
                        total_line: { display: false },
                        comment_percent: { display: false },
                        release_date: { display: true }
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
            commonRules: [{ required: true, message: "被测件名称必填" }],
            validateTrigger: "blur"
        },
        {
            title: "版本",
            align: "center",
            dataIndex: "version",
            search: true,
            commonRules: [{ required: true, message: "版本必填" }],
            validateTrigger: "blur",
            help: "填写不带V字符",
            openPrepend: true
        },
        {
            title: "用户标识",
            align: "center",
            dataIndex: "ref",
            search: true,
            commonRules: [{ required: true, message: "用户标识必填" }],
            validateTrigger: "blur",
            help: "客户使用的标识"
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
            formType: "input-number",
            commonRules: [{ required: true, message: "空行数必填" }],
            min: 0,
            onControl: () => {
                calcPercent()
            }
        },
        {
            title: "纯代码行",
            hide: true,
            align: "center",
            dataIndex: "code_line",
            formType: "input-number",
            commonRules: [{ required: true, message: "纯代码行数必填" }],
            min: 0,
            onControl: () => {
                calcPercent()
            }
        },
        {
            title: "纯注释行",
            hide: true,
            align: "center",
            dataIndex: "comment_line",
            formType: "input-number",
            commonRules: [{ required: true, message: "纯注释行数必填" }],
            min: 0,
            onControl: () => {
                calcPercent()
            }
        },
        {
            title: "混合行",
            hide: true,
            align: "center",
            dataIndex: "mix_line",
            formType: "input-number",
            help: "混合行是指：代码中一行即包含代码也包含注释",
            commonRules: [{ required: true, message: "混合行数必填" }],
            min: 0,
            onControl: () => {
                calcPercent()
            }
        },
        {
            title: "注释率 %",
            align: "center",
            dataIndex: "comment_percent",
            placeholder: "计算注释率",
            hide: true,
            addDisabled: true,
            editDisabled: true
        }
    ])
    return {
        crudOptions,
        crudColumns
    }
}
