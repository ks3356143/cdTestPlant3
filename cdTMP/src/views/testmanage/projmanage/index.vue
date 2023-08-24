<template>
    <div class="ma-content-block p-3 lg:h-full block lg:border-0 lg:flex justify-between">
        <div class="h-full w-full lg:ml-3 lg:mr-2 pt-2">
            <!-- ma-crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #operationBeforeExtend="{ record }">
                    <a-link @click="$router.push({ name: 'project', query: record })">进入工作区</a-link>
                    <a-link @click="previewRef.open(record, crudColumns)"><icon-eye />预览</a-link>
                </template>
            </ma-crud>
        </div>
        <preview ref="previewRef"></preview>
    </div>
</template>
<script lang="jsx" setup>
import { ref } from "vue"
import projectApi from "@/api/testmanage/project"
import preview from "./cpns/preview.vue"
// 定义预览组件的Ref
const previewRef = ref(null)
// CRUD-OPTIONS
const crudRef = ref()
const crudOptions = ref({
    rowSelection: { showCheckedAll: true },
    api: projectApi.getPageList,
    add: { show: true, api: projectApi.save },
    edit: { show: true, api: projectApi.update },
    delete: { show: true, api: projectApi.delete },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    operationWidth: 500,
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
                    { span: 24, formList: [{ dataIndex: "member" }] },
                    { span: 8, formList: [{ dataIndex: "quality_person" }] },
                    { span: 8, formList: [{ dataIndex: "vise_person" }] },
                    { span: 8, formList: [{ dataIndex: "config_person" }] },
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
                                    { dataIndex: "entrust_unit" },
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
                                    { dataIndex: "dev_unit" },
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
                                    { dataIndex: "test_unit" },
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
})

// CRUD-CLOMNS
const crudColumns = ref([
    {
        title: "标识",
        width: 70,
        sortable: { sortDirections: ["ascend"] },
        dataIndex: "ident",
        search: true,
        commonRules: [{ required: true, message: "标识是必填" }],
        validateTrigger: "blur"
    },
    {
        title: "项目名称",
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "名称是必填" }]
    },
    { title: "工程型号", dataIndex: "engin_model", hide: true },
    { title: "分系统", dataIndex: "section_system", hide: true },
    { title: "子系统", dataIndex: "sub_system", hide: true },
    { title: "设备", dataIndex: "device", hide: true },
    {
        title: "开始日期",
        dataIndex: "beginTime",
        commonRules: [{ required: true, message: "开始时间必填" }],
        formType: "date"
    },
    {
        title: "结束时间",
        dataIndex: "endTime",
        formType: "date"
    },
    // 这是只为了搜索的字段
    {
        title: "时间范围",
        hide: true,
        dataIndex: "searchOnlyTimeRange",
        search: true,
        addDisplay: false,
        editDisplay: false,
        infoShow: false,
        formType: "range"
    },
    {
        title: "责任人",
        width: 70,
        dataIndex: "duty_person",
        search: true,
        commonRules: [{ required: true, message: "责任人必选" }],
        formType: "select",
        dict: { url: "system/user/list", props: { label: "name", value: "name" }, translation: true }
    },
    {
        title: "成员",
        dataIndex: "member",
        hide: true,
        search: true,
        formType: "select",
        multiple: true,
        dict: { url: "system/user/list", props: { label: "name", value: "name" }, translation: true },
        commonRules: [{ required: true, message: "成员至少选择一个" }]
    },
    {
        title: "质量保证",
        dataIndex: "quality_person",
        hide: true,
        formType: "select",
        dict: { url: "system/user/list", props: { label: "name", value: "name" }, translation: true },
        commonRules: [{ required: true, message: "至少选择一个质量保证员" }]
    },
    {
        title: "质量监督",
        dataIndex: "vise_person",
        hide: true,
        formType: "select",
        dict: { url: "system/user/list", props: { label: "name", value: "name" }, translation: true },
        commonRules: [{ required: true, message: "至少选择一个质量监督员" }]
    },
    {
        title: "配置管理",
        dataIndex: "config_person",
        hide: true,
        formType: "select",
        dict: { url: "system/user/list", props: { label: "name", value: "name" }, translation: true },
        commonRules: [{ required: true, message: "至少选择一个配置管理员" }]
    },
    {
        title: "关键等级",
        dataIndex: "security_level",
        addDefaultValue: "3",
        hide: true,
        commonRules: [{ required: true, message: "关键等级必填" }],
        search: true,
        formType: "radio",
        dict: { name: "security_level", props: { label: "title", value: "key" } }
    },
    {
        title: "测试级别",
        dataIndex: "test_level",
        commonRules: [{ required: true, message: "请至少选择一个测试级别" }],
        addDefaultValue: ["6"],
        hide: true,
        formType: "checkbox",
        dict: { name: "test_level", props: { label: "title", value: "key" } }
    },
    {
        title: "平台类型",
        dataIndex: "plant_type",
        commonRules: [{ required: true, message: "请至少选择一个平台类型" }],
        addDefaultValue: ["3"],
        hide: true,
        formType: "checkbox",
        dict: { name: "plant_type", props: { label: "title", value: "key" } }
    },
    {
        title: "报告类型",
        dataIndex: "report_type",
        addDefaultValue: "1",
        search: true,
        commonRules: [{ required: true, message: "报告类型必填" }],
        // 字典-report_type
        formType: "radio",
        dict: { name: "report_type", translation: true, props: { label: "title", value: "key" } }
    },
    {
        title: "编程语言",
        dataIndex: "language",
        addDefaultValue: ["1"],
        commonRules: [{ required: true, message: "请至少选择一个" }],
        hide: true,
        formType: "checkbox",
        dict: { name: "language", props: { label: "title", value: "key" } }
    },
    {
        title: "依据标准",
        dataIndex: "standard",
        addDefaultValue: ["1"],
        commonRules: [{ required: true, message: "请至少选择一个" }],
        hide: true,
        formType: "checkbox",
        dict: { name: "standard", props: { label: "title", value: "key" } }
    },
    {
        title: "单位",
        dataIndex: "entrust_unit",
        hide: true,
        commonRules: [{ required: true, message: "单位必选" }],
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        formType: "input",
        title: "联系人",
        dataIndex: "entrust_contact",
        hide: true,
        rules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        dataIndex: "entrust_contact_phone",
        hide: true,
        rules: [{ required: true, message: "联系电话必填" }]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "entrust_email",
        hide: true,
        rules: [{ required: true, message: "电子邮箱必填" }]
    },
    {
        title: "单位",
        dataIndex: "dev_unit",
        hide: true,
        commonRules: [{ required: true, message: "单位必选" }],
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        formType: "input",
        title: "联系人",
        dataIndex: "dev_contact",
        hide: true,
        rules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        dataIndex: "dev_contact_phone",
        hide: true,
        rules: [{ required: true, message: "联系电话必填" }]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "dev_email",
        hide: true,
        rules: [{ required: true, message: "电子邮箱必填" }]
    },
    {
        title: "单位",
        dataIndex: "test_unit",
        hide: true,
        commonRules: [{ required: true, message: "单位必选" }],
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        formType: "input",
        title: "联系人",
        dataIndex: "test_contact",
        hide: true,
        rules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        dataIndex: "test_contact_phone",
        hide: true,
        rules: [{ required: true, message: "联系电话必填" }]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "test_email",
        hide: true,
        rules: [{ required: true, message: "电子邮箱必填" }]
    },
    {
        title: "状态",
        dataIndex: "step",
        search: true,
        formType: "radio",
        addDefaultValue: "1",
        addDisabled: true,
        dict: {
            name: "step",
            translation: true,
            props: { label: "title", value: "key" },
            tagColors: { 1: "green", 2: "blue", 3: "red", 4: "yellow" }
        }
    }
])
</script>

<style lang="less" scoped>
.msg-menu {
    // border-right: 1px solid var(--color-border-2);
    & li {
        border-radius: 1px;
        cursor: pointer;
        margin-bottom: 5px;
        padding: 10px;
        padding-left: 20px;
    }
    & li:hover,
    & li.active {
        background: var(--color-fill-2);
        color: rgb(var(--primary-5));
    }
}
</style>
