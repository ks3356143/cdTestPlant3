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
                            <p>
                                <a-link
                                    :disabled="isGenerating"
                                    :loading="isDgLoading"
                                    @click="createDgItem($event, record)"
                                >
                                    大纲二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isSmLoading" @click="createSmItem(record)">
                                    说明二段文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isJlloading" @click="createJLItem(record)">
                                    记录二级文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isBgLoading" @click="createBgItem(record)">
                                    报告二级文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="ishsmLoading" @click="createHsmItem(record)">
                                    回归说明二级文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="ishjlLoading" @click="createHjlItem(record)">
                                    回归记录二级文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" :loading="isWtdLoading" @click="createWtdItem(record)">
                                    问题单二级文档
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiDagang(record)">
                                    <icon-eye />
                                    [测试]生成最后大纲
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiShuoming(record)">
                                    <icon-eye />[测试]生成最后说明
                                </a-link>
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiJilu(record)"
                                    ><icon-eye />[测试]生成最后记录</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiBaogao(record)"
                                    ><icon-eye />[测试]生成测评报告</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiHsm(record)"
                                    ><icon-eye />[测试]回归测试说明</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiHjl(record)"
                                    ><icon-eye />[测试]回归测试记录</a-link
                                >
                            </p>
                            <p>
                                <a-link :disabled="isGenerating" @click="createSeitaiWtd(record)"
                                    ><icon-eye />[测试]生成问题单</a-link
                                >
                            </p>
                        </template>
                    </a-popover>
                    <a-button @click="enterWorkPlant(record)" size="mini" status="warning" type="outline">
                        工作区
                    </a-button>
                    <a-link @click="previewRef.open(record)"><icon-eye />预览</a-link>
                    <a-link @click="handleFragmentClick(record)"><icon-file />片段</a-link>
                    <a-link @click="handleBoardClick(record)"><icon-dashboard />项目看板</a-link>
                </template>
            </ma-crud>
        </div>
        <preview ref="previewRef" :columns="crudColumns"></preview>
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
import hsmGenerateApi from "@/api/generate/hsmGenerate"
import hjlGenerateApi from "@/api/generate/hjlGenerate"
import wtdGenerateApi from "@/api/generate/wtdGenerate"
import { Message } from "@arco-design/web-vue"
import Progress from "./cpns/progress.vue"
import hoosk from "@/views/testmanage/projmanage/hooks.js"
import { validateBlank } from "@/utils/extensions/arcoValidator"
// addDefault、editDefault信息导入
import textInfo from "@/config/textInfo"
const router = useRouter()
// 定义预览组件的Ref
const previewRef = ref()
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
// 该变量用于显示所以生成文档的按钮是否->禁用
const isGenerating = ref(false)
// 用于显示是否正在加载（全部按钮各一个）
const isDgLoading = ref(false)
const isSmLoading = ref(false)
const isBgLoading = ref(false)
const isJlloading = ref(false)
const ishsmLoading = ref(false)
const ishjlLoading = ref(false)
const isWtdLoading = ref(false)
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
// ~~~~~~~~回归测试说明~~~~~~~~
const createSeitaiHsm = async (record) => {
    ptext.value = "回归测试说明"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createHsmDocument, record.id)
}
// ~~~~~~~~回归测试记录~~~~~~~~
const createSeitaiHjl = async (record) => {
    ptext.value = "回归测试记录"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createHjlDocument, record.id)
}
// ~~~~~~~~问题单~~~~~~~~
const createSeitaiWtd = async (record) => {
    ptext.value = "问题单"
    hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createWtdDocument, record.id)
}

// 记录生成二级文档
const createJLItem = async (record) => {
    isGenerating.value = true
    isJlloading.value = true
    await jlGenerateApi.createJLcaserecord({ id: record.id }).finally(() => {
        isGenerating.value = false
        isJlloading.value = false
    })
    Message.success("记录-片段库生成成功，请查看output/jl文件夹")
}
// 说明生成二级文档
const createSmItem = async (record) => {
    isGenerating.value = true
    isSmLoading.value = true
    const id = record.id
    await Promise.all([
        dgGenerateApi.createSoftComposition({ id }), // 生成测评对象 - 和大纲一样
        dgGenerateApi.createFuncList({ id }), // 生成被测软件功能 - 和大纲重复
        dgGenerateApi.createInterface({ id }), // 生成被测软件接口 - 和大纲重复 - 可能会删除
        dgGenerateApi.createPerformance({ id }), // 生成被测软件性能 - 和大纲重复 - 可能会删除
        dgGenerateApi.createBaseInformation({ id }), // 生成被测软件基本信息 - 和大纲重复 - 可能会删除
        dgGenerateApi.createYiju({ id }), // 生成标准类引用文档 - 和大纲重复 - 可能会删除
        smGenerateApi.createSMTechyiju({ id }), // 生成技术类引用文档列表 -> 在大纲基础上添加《测评大纲》
        dgGenerateApi.createEnvironment({ id }), // 生成软硬件环境（注意标题级别不一样，这个在最后处理）
        smGenerateApi.createSMCaseList({ id }), // 生成用例全
        smGenerateApi.createSMCaseBreifList({ id }), // 生成用例列表-那个表格
        smGenerateApi.createSMTrack({ id }) // 生成说明追踪
    ]).finally(() => {
        isGenerating.value = false
        isSmLoading.value = false
    })
    Message.success("说明-片段库生成成功，请查看output/sm文件夹")
}
// 大纲生成二级文档
const createDgItem = async (e, record) => {
    isGenerating.value = true
    isDgLoading.value = true
    const id = record.id
    await Promise.all([
        dgGenerateApi.createTestDemand({ id }), // 生成第一轮测试项
        dgGenerateApi.createYiju({ id }), // 生成依据文件
        dgGenerateApi.createTechYiju({ id }), // 技术依据文件
        dgGenerateApi.createContact({ id }), // 生成联系人和方式
        dgGenerateApi.createTimeaddress({ id }), // 生成测评时间和地点
        dgGenerateApi.createFuncList({ id }), // 生成被测软件功能列表
        dgGenerateApi.createSoftComposition({ id }), // 生成测评对象-软件组成
        dgGenerateApi.createAdequacyEffectiveness({ id }), // 生成测试充分性（adequancy）和有效性（effectiveness）说明
        dgGenerateApi.createGroup({ id }), // 生成测评组织及分工
        dgGenerateApi.createGuarantee({ id }), // 生成测评保障
        dgGenerateApi.createAbbreviation({ id }), // 生成缩略语
        dgGenerateApi.createInterface({ id }), // 生成-被测软件接口
        dgGenerateApi.createPerformance({ id }), // 生成-被测软件性能
        dgGenerateApi.createBaseInformation({ id }), // 生成-被测软件基本信息
        dgGenerateApi.createRequirement({ id }), // 生成-测试总体要求
        dgGenerateApi.createYzComparison({ id }), // 生成-研总-测试项对照表
        dgGenerateApi.createXqComparison({ id }), // 生成-需求规格说明-测试项对照表
        dgGenerateApi.createFanXqComparison({ id }), // 生成-反向测试项-需求规格说明对照表
        dgGenerateApi.createCodeQuality({ id }), // 生成-代码质量度量分析表
        dgGenerateApi.createEnvironment({ id }), // 生成-软硬件环境
        dgGenerateApi.createMainTech({ id }) // 生成-主要战技指标
    ]).finally(() => {
        isGenerating.value = false
        isDgLoading.value = false
    })
    Message.success("大纲-片段库文档生成成功，请查看output/dg文件夹")
}
// 报告生成二级文档
const createBgItem = async (record) => {
    isGenerating.value = true
    isBgLoading.value = true
    const id = record.id
    await Promise.all([
        bgGenerateApi.deleteBGFiles({ id }), // 删除output/bg文件夹下文件
        bgGenerateApi.createBgTechYiju({ id }),
        bgGenerateApi.createBgTimeaddress({ id }),
        bgGenerateApi.createBgBaseInformation({ id }),
        bgGenerateApi.createBgCompletionstatus({ id }),
        bgGenerateApi.createBgSummary({ id }),
        bgGenerateApi.createBgContentandresults1({ id }),
        bgGenerateApi.createBgContentandresults2({ id }),
        bgGenerateApi.createBgEffectAndAdquacy({ id }),
        bgGenerateApi.createBgDemandEffective({ id }),
        bgGenerateApi.createBgQualityEvaluate({ id }),
        bgGenerateApi.createBgEntire({ id }),
        bgGenerateApi.createBgYzxqTrack({ id }),
        bgGenerateApi.createBgProblemsSummary({ id })
    ]).finally(() => {
        isGenerating.value = false
        isBgLoading.value = false
    })
    Message.success("报告-片段库文档生成成功，请查看output/bg文件夹")
}
// 回归测试说明二级文档
const createHsmItem = async (record) => {
    const id = record.id
    isGenerating.value = true
    ishsmLoading.value = true
    await Promise.all([
        hsmGenerateApi.deleteHSMFiles({ id }), // 先删除以前文件
        hsmGenerateApi.createBasicInfo({ id }),
        hsmGenerateApi.createDocSummary({ id }),
        hsmGenerateApi.createJstech({ id }),
        hsmGenerateApi.createChangePart({ id }),
        hsmGenerateApi.createHdemand({ id }),
        hsmGenerateApi.createCaseListDesc({ id }),
        hsmGenerateApi.createCaseList({ id }),
        hsmGenerateApi.createTrack({ id })
    ]).finally(() => {
        isGenerating.value = false
        ishsmLoading.value = false
    })
    Message.success("回归说明-片段库文档生成成功，请查看output/hsm文件夹")
}
// 回归测试记录二级文档
const createHjlItem = async (record) => {
    const id = record.id
    isGenerating.value = true
    ishjlLoading.value = true
    await Promise.all([
        hjlGenerateApi.deleteHJLFiles({ id }), // 先调用删除文件夹里面文件
        hjlGenerateApi.createBasicInfo({ id }),
        hjlGenerateApi.createCaseinfo({ id })
    ]).finally(() => {
        isGenerating.value = false
        ishjlLoading.value = false
    })
    Message.success("回归记录-片段库文档生成成功，请查看output/hjl文件夹")
}
// 问题单二级文档
const createWtdItem = async (record) => {
    isGenerating.value = true
    isWtdLoading.value = true
    await wtdGenerateApi.createWtdTable({ id: record.id }).finally(() => {
        isGenerating.value = false
        isWtdLoading.value = false
    })
    Message.success("问题单-片段库文档生成成功，请查看output/wtd文件夹")
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 1.跳转到项目看板页面
const handleBoardClick = (record) => {
    router.push({
        name: "projBoard",
        params: {
            projectId: record.id
        }
    })
}
// 2.跳转到项目所属文档片段
const handleFragmentClick = (record) => {
    router.push({
        name: "projFragment",
        params: {
            projectId: record.id
        }
    })
}

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
    showTools: false,
    operationColumnWidth: 280, // 操作列宽度
    operationColumnAlign: "center", // 操作列对齐方式
    afterDelete(response) {
        crudRef.value.tableRef.selectAll(false)
    },
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
                    { span: 6, formList: [{ dataIndex: "abbreviation" }] },
                    { span: 6, formList: [{ dataIndex: "quality_person" }] },
                    { span: 6, formList: [{ dataIndex: "vise_person" }] },
                    { span: 6, formList: [{ dataIndex: "config_person" }] }
                ]
            },
            {
                formType: "grid",
                cols: [
                    { span: 6, formList: [{ dataIndex: "security_level" }] },
                    { span: 6, formList: [{ dataIndex: "language" }] },
                    { span: 12, formList: [{ dataIndex: "plant_type" }] }
                ]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "test_level" }] }]
            },
            {
                formType: "grid",
                cols: [{ span: 24, formList: [{ dataIndex: "report_type" }] }]
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
        title: "项目标识",
        align: "center",
        width: 90,
        sortable: { sortDirections: ["ascend"] },
        dataIndex: "ident",
        search: true,
        commonRules: [
            { required: true, message: "标识是必填" },
            { validator: validateBlank, message: "标识格式不正确" }
        ],
        validateTrigger: "blur"
    },
    {
        title: "项目名称",
        width: 110,
        align: "center",
        dataIndex: "name",
        search: true,
        commonRules: [{ required: true, message: "名称是必填" }]
    },
    { title: "工程型号", dataIndex: "engin_model", hide: true },
    { title: "分系统", dataIndex: "section_system", hide: true },
    { title: "子系统", dataIndex: "sub_system", hide: true },
    { title: "设备名称", dataIndex: "device", hide: true },
    {
        title: "开始日期",
        dataIndex: "beginTime",
        align: "center",
        commonRules: [{ required: true, message: "开始时间必填" }],
        formType: "date"
    },
    {
        title: "结束时间",
        align: "center",
        dataIndex: "endTime",
        formType: "date",
        extra: "注意：结束时间需要晚于最后一轮结束时间",
        commonRules: [
            {
                required: true,
                message: "结束时间必填"
            },
            {
                validator: (value, validationCallbackFunction) => {
                    let beginTime = crudRef.value.getFormData().beginTime
                    value < beginTime ? validationCallbackFunction("开始时间必须小于等于结束时间") : null
                }
            }
        ]
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
        align: "center",
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
                { label: "改造", value: 2 },
                { label: "沿用", value: 3 }
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
        addDefaultValue: ["4"],
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
        align: "center",
        addDefaultValue: "9",
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
        formType: "select",
        multiple: true,
        dict: { name: "language", props: { label: "title", value: "key" } }
    },
    {
        title: "依据标准",
        dataIndex: "standard",
        addDefaultValue: ["1", "2", "3", "4", "9"],
        commonRules: [{ required: true, message: "请至少选择一个" }],
        hide: true,
        multiple: true,
        formType: "select",
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
        commonRules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        maxLength: 11,
        dataIndex: "entrust_contact_phone",
        hide: true,
        commonRules: [
            { required: true, message: "联系电话必填" },
            {
                match: /^1[3456789]\d{9}$/,
                message: "电话号码格式错误"
            }
        ]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "entrust_email",
        hide: true
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
        commonRules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        maxLength: 11,
        dataIndex: "dev_contact_phone",
        hide: true,
        commonRules: [
            { required: true, message: "联系电话必填" },
            {
                match: /^1[3456789]\d{9}$/,
                message: "电话号码格式错误"
            }
        ]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "dev_email",
        hide: true
    },
    {
        title: "单位",
        dataIndex: "test_unit",
        hide: true,
        addDefaultValue: textInfo.testUnitAddDefaultText,
        commonRules: [{ required: true, message: "单位必选" }],
        formType: "select",
        dict: { url: "system/contact/index", props: { label: "name", value: "name" }, translation: true }
    },
    {
        formType: "input",
        title: "联系人",
        dataIndex: "test_contact",
        addDefaultValue: textInfo.testUnitContactPersonName,
        hide: true,
        commonRules: [{ required: true, message: "联系人必填" }]
    },
    {
        formType: "input",
        title: "联系电话",
        dataIndex: "test_contact_phone",
        addDefaultValue: textInfo.testUnintContactPhoneNumber,
        hide: true,
        maxLength: 11,
        commonRules: [
            { required: true, message: "联系电话必填" },
            {
                match: /^1[3456789]\d{9}$/,
                message: "电话号码格式错误"
            }
        ]
    },
    {
        formType: "input",
        title: "电子邮箱",
        dataIndex: "test_email",
        hide: true
    },
    {
        title: "状态",
        align: "center",
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

defineOptions({
    name: "projmanage"
})
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
