<template>
    <div class="ma-content-block p-3 lg:h-full block lg:border-0 lg:flex justify-between">
        <div class="h-full w-full lg:ml-3 lg:mr-2 pt-2">
            <!-- ma-crud组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #operationBeforeExtend="{ record }">
                    <a-popover title="文档生成组合按钮" trigger="click">
                        <a-button type="primary" size="mini">
                            <template #icon>
                                <icon-plus />
                            </template>
                            文档生成
                        </a-button>
                        <template #content>
                            <p><a-link @click="createDgItem(record)">大纲二段文档</a-link></p>
                            <p><a-link @click="createSmItem(record)">说明二段文档</a-link></p>
                            <p><a-link @click="createJLItem(record)">记录二级文档</a-link></p>
                            <p><a-link @click="createBgItem(record)">报告二级文档</a-link></p>
                            <p>
                                <a-link @click="createSeitaiDagang(record)"><icon-eye />[测试]生成最后大纲</a-link>
                            </p>
                            <p>
                                <a-link @click="createSeitaiShuoming(record)"><icon-eye />[测试]生成最后说明</a-link>
                            </p>
                            <p>
                                <a-link @click="createSeitaiJilu(record)"><icon-eye />[测试]生成最后记录</a-link>
                            </p>
                            <p>
                                <a-link @click="createSeitaiBaogao(record)"><icon-eye />[测试]生成测评报告</a-link>
                            </p>
                        </template>
                    </a-popover>
                    <a-link @click="enterWorkPlant(record)">进入工作区</a-link>
                    <a-link @click="previewRef.open(record, crudColumns)"><icon-eye />预览</a-link>
                </template>
            </ma-crud>
        </div>
        <preview ref="previewRef"></preview>
        <Progress
            :visible="visible"
            :isComplete="isComplete"
            :text="ptext"
            @clickConfirm="handleModalConfirmClick"
        ></Progress>
    </div>
</template>
<script lang="jsx" setup>
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import projectApi from "@/api/testmanage/project"
import preview from "./cpns/preview.vue"
import dgGenerateApi from "@/api/generate/dgGenerate"
import seitaiGenerateApi from "@/api/generate/seitaiGenerate"
import smGenerateApi from "@/api/generate/smGenerate"
import jlGenerateApi from "@/api/generate/jlGenerate"
import bgGenerateApi from "@/api/generate/bgGenerate"
import { Message } from "@arco-design/web-vue"
import Progress from "./cpns/progress.vue"
import hoosk from "@/views/testmanage/projmanage/hooks.js"
const router = useRouter()
// 定义预览组件的Ref
const previewRef = ref(null)
// 点击进入工作区函数 - 每次点击后都清除localStorage中树状目录数据
const enterWorkPlant = function (record) {
    if (localStorage.getItem("tree_local_data")) {
        localStorage.removeItem("tree_local_data")
    }
    router.push({ name: "project", query: record })
}
// 这里放弹出进度条组件变量
const visible = ref(false)
const isComplete = ref(false)
const ptext = ref("测评大纲")
const handleModalConfirmClick = () => {
    visible.value = false
}
// ~~~~~~~~测试说明生成文档~~~~~~~~
const createSeitaiShuoming = async (record) => {
    ptext.value = "测试说明"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createShuomingSeiTai, record.id)
}

// ~~~~~~~~测试大纲生成文档~~~~~~~~
const createSeitaiDagang = async (record) => {
    // 根据一系列文档生成大纲 - 这里有进度条组件、a-modal组件
    // 1.打开进度条组件
    ptext.value = "测评大纲"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createDagangSeiTai, record.id)
}
// ~~~~~~~~记录生成文档~~~~~~~~
const createSeitaiJilu = async (record) => {
    ptext.value = "测试记录"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createJiluSeiTai, record.id)
}

// ~~~~~~~~报告生成文档~~~~~~~~
const createSeitaiBaogao = async (record) => {
    ptext.value = "测评报告"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createBgDocument, record.id)
}

// 记录生成二级文档
const createJLItem = async (record) => {
    const st = await jlGenerateApi.createJLcaserecord({ id: record.id })

    Message.success(st.message)
}
// 说明生成二级文档
const createSmItem = async (record) => {
    // 生成测评对象 - 和大纲一样 - 可能会删除
    const st = await dgGenerateApi.createSoftComposition({ id: record.id })
    // 生成被测软件功能 - 和大纲重复 - 可能会删除
    const st1 = await dgGenerateApi.createFuncList({ id: record.id })
    // 生成被测软件接口 - 和大纲重复 - 可能会删除
    const st2 = await dgGenerateApi.createInterface({ id: record.id })
    // 生成被测软件性能 - 和大纲重复 - 可能会删除
    const st3 = await dgGenerateApi.createPerformance({ id: record.id })
    // 生成被测软件基本信息 - 和大纲重复 - 可能会删除
    const st4 = await dgGenerateApi.createBaseInformation({ id: record.id })
    // 生成标准类引用文档 - 和大纲重复 - 可能会删除
    const st5 = await dgGenerateApi.createYiju({ id: record.id })
    // 生成技术类引用文档列表 -> 在大纲基础上添加《测评大纲》
    const st6 = await smGenerateApi.createSMTechyiju({ id: record.id })
    // 生成软硬件环境（注意标题级别不一样，这个在最后处理）
    const st7 = await dgGenerateApi.createEnvironment({ id: record.id })
    // 生成用例全
    const st8 = await smGenerateApi.createSMCaseList({ id: record.id })
    // 生成用例列表-那个表格
    const st9 = await smGenerateApi.createSMCaseBreifList({ id: record.id })
    // 生成说明追踪
    const st10 = await smGenerateApi.createSMTrack({ id: record.id })
    Message.success(st10.message)
}
// 大纲生成二级文档
const createDgItem = async (record) => {
    // 生成测试项文档
    const st = await dgGenerateApi.createTestDemand({ id: record.id })
    // 标准依据文件
    const st1 = await dgGenerateApi.createYiju({ id: record.id })
    // 技术依据文件
    const st2 = await dgGenerateApi.createTechYiju({ id: record.id })
    // 生成时间和地点
    const st3 = await dgGenerateApi.createTimeaddress({ id: record.id })
    // 生成被测软件功能列表
    const st4 = await dgGenerateApi.createFuncList({ id: record.id })
    // 生成测评对象-软件组成
    const st5 = await dgGenerateApi.createSoftComposition({ id: record.id })
    // 生成联系人和方式
    const st6 = await dgGenerateApi.createContact({ id: record.id })
    // 生成测试充分性（adequancy）和有效性（effectiveness）说明
    const st7 = await dgGenerateApi.createAdequacyEffectiveness({ id: record.id })
    // 生成测评组织及分工
    const st8 = await dgGenerateApi.createGroup({ id: record.id })
    // 生成测评保障
    const st9 = await dgGenerateApi.createGuarantee({ id: record.id })
    // 生成缩略语
    const st10 = await dgGenerateApi.createAbbreviation({ id: record.id })
    // 生成-被测软件接口
    const st11 = await dgGenerateApi.createInterface({ id: record.id })
    // 生成-被测软件性能
    const st12 = await dgGenerateApi.createPerformance({ id: record.id })
    // 生成-被测软件基本信息
    const st13 = await dgGenerateApi.createBaseInformation({ id: record.id })
    // 生成-测试总体要求
    const st14 = await dgGenerateApi.createRequirement({ id: record.id })
    // 生成-研总-测试项对照表
    const st15 = await dgGenerateApi.createYzComparison({ id: record.id })
    // 生成-需求规格说明-测试项对照表
    const st16 = await dgGenerateApi.createXqComparison({ id: record.id })
    // 生成-反向测试项-需求规格说明对照表
    const st17 = await dgGenerateApi.createFanXqComparison({ id: record.id })
    // 生成-代码质量度量分析表
    const st18 = await dgGenerateApi.createCodeQuality({ id: record.id })
    // 生成-软硬件环境
    const st19 = await dgGenerateApi.createEnvironment({ id: record.id })
    // 生成-主要战技指标
    const st20 = await dgGenerateApi.createMainTech({ id: record.id })
    Message.success(st20.message)
}
// 报告生成二级文档
const createBgItem = async (record) => {
    const st1 = await bgGenerateApi.createBgTechYiju({ id: record.id })
    const st2 = await bgGenerateApi.createBgTimeaddress({ id: record.id })
    const st3 = await bgGenerateApi.createBgBaseInformation({ id: record.id })
    const st4 = await bgGenerateApi.createBgCompletionstatus({ id: record.id })
    const st5 = await bgGenerateApi.createBgSummary({ id: record.id })
    const st6 = await bgGenerateApi.createBgContentandresults1({ id: record.id })
    const st7 = await bgGenerateApi.createBgContentandresults2({ id: record.id })
    const st8 = await bgGenerateApi.createBgEffectAndAdquacy({ id: record.id })
    const st9 = await bgGenerateApi.createBgDemandEffective({ id: record.id })
    const st10 = await bgGenerateApi.createBgQualityEvaluate({ id: record.id })
    const st11 = await bgGenerateApi.createBgEntire({ id: record.id })
    const st12 = await bgGenerateApi.createBgYzxqTrack({ id: record.id })
    const st13 = await bgGenerateApi.createBgProblemsSummary({ id: record.id })
    Message.success(st13.message)
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// CRUD-OPTIONS
const crudRef = ref()
const crudOptions = ref({
    rowSelection: { showCheckedAll: true },
    api: projectApi.getPageList,
    add: { show: true, api: projectApi.save, text: "新增项目" },
    edit: { show: true, api: projectApi.update, text: "编辑项目" },
    delete: { show: true, api: projectApi.delete },
    searchColNumber: 3,
    tablePagination: false,
    operationColumn: true,
    operationWidth: 500,
    showIndex: false,
    // 处理弹窗的title
    beforeOpenAdd: function () {
        crudRef.value.crudFormRef.actionTitle = "项目"
        return true
    },
    beforeOpenEdit: function (record) {
        crudRef.value.crudFormRef.actionTitle = record.ident + "：" + record.name
        return true
    },
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
                    { span: 6, formList: [{ dataIndex: "beginTime" }] },
                    { span: 6, formList: [{ dataIndex: "endTime" }] },
                    { span: 6, formList: [{ dataIndex: "duty_person" }] },
                    { span: 6, formList: [{ dataIndex: "runtime" }] },
                    { span: 12, formList: [{ dataIndex: "member" }] },
                    { span: 6, formList: [{ dataIndex: "soft_type" }] },
                    { span: 6, formList: [{ dataIndex: "devplant" }] },
                    { span: 24, formList: [{ dataIndex: "abbreviation" }] },
                    { span: 8, formList: [{ dataIndex: "quality_person" }] },
                    { span: 8, formList: [{ dataIndex: "vise_person" }] },
                    { span: 8, formList: [{ dataIndex: "config_person" }] }
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
        title: "运行环境",
        dataIndex: "runtime",
        hide: true,
        search: false,
        formType: "select",
        dict: { name: "runtime", props: { label: "title", value: "key" } }
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
        // 后台默认值1，可不填
        title: "软件类型",
        dataIndex: "soft_type",
        hide: true,
        search: true,
        formType: "select",
        dict: {
            data: [
                { label: "新研", value: 1 },
                { label: "改造", value: 2 }
            ],
            translation: true
        },
        commonRules: [{ required: true, message: "软件类型必填" }]
    },
    {
        title: "开发环境",
        dataIndex: "devplant",
        hide: true,
        search: false,
        formType: "select",
        dict: { name: "devplant", props: { label: "title", value: "key" } }
    },
    {
        title: "缩略语",
        dataIndex: "abbreviation",
        hide: true,
        search: false,
        formType: "select",
        multiple: true,
        dict: { url: "system/abbreviation/index", props: { label: "title", value: "title" }, translation: true }
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
@/api/generate/seitaiGenerate
