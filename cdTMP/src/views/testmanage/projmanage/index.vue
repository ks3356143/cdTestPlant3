<template>
    <div class="ma-content-block p-3 lg:h-full block lg:border-0 lg:flex justify-between">
        <ul class="w-full lg:w-2/12 msg-menu p-2 shadow" ref="msgMenuRef">
            <li v-for="(item, index) in msgType" :key="item" @click="getProjectType(item.key, index)">
                <Component :is="typeIcon[item.key] ? typeIcon[item.key] : 'icon-common'" />
                <span class="pl-3">{{ item.title }}</span>
            </li>
        </ul>
        <div class="h-full w-full lg:ml-3 lg:mr-2 pt-2">
            <!-- ma-crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #operationBeforeExtend="{ record }">
                    <!-- <a-link @click="previewRef.open(record, crudColumns)"><icon-eye />预览</a-link> -->
                    <a-link @click="infoModalRef.open()"><icon-eye />预览</a-link>
                </template>
            </ma-crud>
        </div>
        <!-- <preview ref="previewRef"></preview> -->
        <ma-info-modal ref="infoModalRef"></ma-info-modal>
    </div>
</template>

<script lang="jsx" setup>
import { ref } from "vue"
import projectApi from "@/api/testmanage/project"
import preview from "./cpns/preview.vue"
import MaInfoModal from "@/components/ma-info-modal/index.vue"
// 定义预览组件的Ref
const infoModalRef = ref(null)
const previewRef = ref(null)
// 定义左侧标签切换-假数据
const typeIcon = ref({
    er_fpga: "icon-send",
    san_fpga: "icon-email",
    er_cpu: "icon-copy",
    san_cpu: "icon-calendar",
    system_test: "icon-mobile",
    examination_test: "icon-notification"
})
const msgMenuRef = ref()
const getProjectType = (key, index) => {
    const children = msgMenuRef.value.children
    // 如果有li元素的className找到active，则清空，再把点击的加上active样式
    if (children && children[index].className.indexOf("active") === -1) {
        for (let i = 0; i < children.length; i++) children[i].className = ""
        children[index].className = "active"
    }
}
const msgType = ref([
    { key: "er_fpga", title: "二方FPGA测试" },
    { key: "san_fpga", title: "三方FPGA测试" },
    { key: "examination_test", title: "考试项目测试" },
    { key: "er_cpu", title: "二方CPU测试" },
    { key: "san_cpu", title: "三方CPU测试" },
    { key: "system_test", title: "系统级测试" }
])
// CRUD-OPTIONS
const crudRef = ref()
const crudOptions = ref({
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
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "beginTime" }] },
                    { span: 12, formList: [{ dataIndex: "endTime" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 12, formList: [{ dataIndex: "duty_person" }] },
                    { span: 12, formList: [{ dataIndex: "member" }] }
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
            }
        ]
    }
})

// CRUD-CLOMNS
const crudColumns = ref([
    {
        title: "标识",
        width: 70,
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
        formType: "range"
    },
    {
        title: "责任人",
        width: 70,
        dataIndex: "duty_person",
        search: true,
        commonRules: [{ required: true, message: "责任人必选" }],
        formType: "select",
        dict: { url: "system/user/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        title: "成员",
        dataIndex: "member",
        hide: true,
        search: true,
        formType: "select",
        multiple: true,
        dict: { url: "system/user/index", props: { label: "name", value: "name" }, translation: true },
        commonRules: [{ required: true, message: "成员至少选择一个" }]
    },
    {
        title: "关键等级",
        dataIndex: "security_level",
        addDefaultValue: "3",
        hide: true,
        commonRules: [{ required: true, message: "关键等级必填" }],
        search: true,
        formType: "radio",
        dict: { name: "security_level", props: { label: "value", value: "key" } }
    },
    {
        title: "测试级别",
        dataIndex: "test_level",
        commonRules: [{ required: true, message: "请至少选择一个" }],
        addDefaultValue: ["6"],
        hide: true,
        formType: "checkbox",
        dict: { name: "test_level", props: { label: "title", value: "key" } }
    },
    {
        title: "平台类型",
        dataIndex: "plant_type",
        addDefaultValue: "4",
        hide: true,
        formType: "radio",
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
        hide: true,
        formType: "grid-tailwind",
        customClass: ["mt-0 mb-3"],
        colNumber: 3,
        cols: [
            {
                formList: [
                    {
                        title: "委托方信息",
                        customClass: ["mt-0"],
                        formType: "card",
                        formList: [
                            {
                                formType: "grid-tailwind",
                                colNumber: 1,
                                cols: [
                                    {
                                        formList: [
                                            {
                                                title: "标识",
                                                dataIndex: "entrust_ident",
                                                rules: [{ required: true, message: "标识必填" }]
                                            },
                                            {
                                                title: "法人",
                                                dataIndex: "entrust_legal",
                                                rules: [{ required: true, message: "法人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系人",
                                                dataIndex: "entrust_contact",
                                                rules: [{ required: true, message: "联系人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系电话",
                                                dataIndex: "entrust_contact_phone",
                                                rules: [{ required: true, message: "联系电话必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "电子邮箱",
                                                dataIndex: "entrust_email",
                                                rules: [{ required: true, message: "电子邮箱必填" }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                formList: [
                    {
                        title: "研制单位信息",
                        customClass: ["mt-0"],
                        formType: "card",
                        formList: [
                            {
                                formType: "grid-tailwind",
                                colNumber: 1,
                                cols: [
                                    {
                                        formList: [
                                            {
                                                title: "标识",
                                                dataIndex: "dev_ident",
                                                rules: [{ required: true, message: "标识必填" }]
                                            },
                                            {
                                                title: "法人",
                                                dataIndex: "dev_legal",
                                                rules: [{ required: true, message: "法人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系人",
                                                dataIndex: "dev_contact",
                                                rules: [{ required: true, message: "联系人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系电话",
                                                dataIndex: "dev_contact_phone",
                                                rules: [{ required: true, message: "联系电话必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "电子邮箱",
                                                dataIndex: "dev_email",
                                                rules: [{ required: true, message: "电子邮箱必填" }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                formList: [
                    {
                        title: "测评单位信息",
                        customClass: ["mt-0"],
                        formType: "card",
                        formList: [
                            {
                                formType: "grid-tailwind",
                                colNumber: 1,
                                cols: [
                                    {
                                        formList: [
                                            {
                                                title: "标识",
                                                dataIndex: "test_ident",
                                                rules: [{ required: true, message: "标识必填" }]
                                            },
                                            {
                                                title: "法人",
                                                dataIndex: "test_legal",
                                                rules: [{ required: true, message: "法人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系人",
                                                dataIndex: "test_contact",
                                                rules: [{ required: true, message: "联系人必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "联系电话",
                                                dataIndex: "test_contact_phone",
                                                rules: [{ required: true, message: "联系电话必填" }]
                                            },
                                            {
                                                formType: "input",
                                                title: "电子邮箱",
                                                dataIndex: "test_email",
                                                rules: [{ required: true, message: "电子邮箱必填" }]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
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
