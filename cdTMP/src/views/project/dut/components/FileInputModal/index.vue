<template>
    <div class="file-input-container">
        <a-modal
            v-model:visible="modalVisible"
            width="80%"
            title="设计需求批量写入"
            :unmount-on-close="true"
            :mask-closable="false"
            ok-text="录入"
            :esc-to-close="false"
            :on-before-ok="handleModalSubmit"
        >
            <div class="uploadContainer">
                <span :style="{ marginBottom: '10px', flex: '0 1 160px' }">上传设计需求.docx:</span>
                <a-upload
                    :style="{ marginBottom: '10px' }"
                    :custom-request="handleRquest"
                    :limit="1"
                    accept=".docx"
                    @change="handleUploadChange"
                ></a-upload>
            </div>
            <a-alert :style="{ margin: '10px 0' }" type="warning">
                请去除需求规格说明文件中不必要的部分再来此处解析，注意：本系统不支持word中emf格式图片，如果使用了visio等图片请<span
                    class="important-text"
                    >在word变为普通图片上传</span
                >
            </a-alert>
            <div class="operation-container">
                <span :style="{ marginRight: '10px', fontWeight: 700 }">操作按钮:</span>
                <a-space>
                    <a-button type="primary" @click="handleCreateAtLatest">新增一条</a-button>
                    <a-button type="outline" status="warning" @click="handleResetData">重置数据</a-button>
                </a-space>
            </div>
            <a-spin :loading="loading" tip="解析word完成，正在渲染界面..." :style="{ width: '100%' }">
                <div class="demand-container">
                    <a-list
                        @page-change="handlePageChange"
                        :data="htmlData"
                        :pagination-props="{ defaultPageSize: 15, total: htmlData.length }"
                    >
                        <template #item="{ item, index }">
                            <a-list-item>
                                <div class="item-container">
                                    <a-input-group>
                                        <a-input
                                            placeholder="章节号"
                                            v-model="item.chapter"
                                            :style="{ width: '100px' }"
                                            @click.stop.prevent
                                        ></a-input>
                                        <a-input
                                            placeholder="标题"
                                            v-model="item.title"
                                            :style="{ width: '300px' }"
                                            @click.stop.prevent
                                        ></a-input>
                                        <a-input
                                            placeholder="标识"
                                            v-model="item.ident"
                                            :style="{ width: '200px' }"
                                            @click.stop.prevent
                                        ></a-input>
                                        <a-select
                                            :style="{ width: '150px' }"
                                            placeholder="请选择设计需求类型"
                                            @click.stop.prevent
                                            v-model="item.demandType"
                                        >
                                            <a-option v-for="it in demandType" :value="it.key">{{ it.title }}</a-option>
                                        </a-select>
                                    </a-input-group>
                                    <a-button-group>
                                        <a-button
                                            type="primary"
                                            status="success"
                                            size="small"
                                            @click.stop.prevent="handledownCreate(index)"
                                        >
                                            <template #icon>
                                                <icon-plus />
                                            </template>
                                            下方新增
                                        </a-button>
                                        <a-button
                                            type="primary"
                                            status="danger"
                                            size="small"
                                            @click.stop.prevent="handleDelete(index)"
                                        >
                                            <template #icon>
                                                <icon-delete />
                                            </template>
                                            删除该条
                                        </a-button>
                                    </a-button-group>
                                </div>
                                <div class="content">
                                    <MaEditor v-model="item.content" />
                                </div>
                            </a-list-item>
                        </template>
                    </a-list>
                </div>
            </a-spin>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"
import mammoth from "mammoth"
import dictApi from "@/api/system/dict"
import demandApi from "@/api/project/designDemand"
import { useRoute, useRouter } from "vue-router"
import { parseHtmlStringByDemandDut } from "@/views/project/dut/tools/parseHtmlString"
import { HtmlParser } from "@/views/project/dut/tools/parser"
import { useTreeDataStore } from "@/store"
// 其他初始化数据
const route = useRoute()
const router = useRouter()
const treeDataStore = useTreeDataStore()
// ~导入editor组件~tinymce
import MaEditor from "@/components/ma-editor/index.vue"
import { Message } from "@arco-design/web-vue"
// 单个设计需求录入模版
const templateDemandObj = {
    chapter: "",
    title: "",
    ident: "",
    demandType: "",
    content: ""
}
// 先请求设计需求的dict，然后给demandType选项
let demandType = []
const getDictDemandType = async function () {
    const res = await dictApi.getDictByCode({ code: "demandType" })
    demandType = res.data
}
getDictDemandType()
// 弹窗显示
const modalVisible = ref(false)
// 全部html数据-循环创建折叠项
const htmlData = ref([])
// 数据变化spin显示
const loading = ref(false)
// 当upload组件发生变化时候
const handleUploadChange = (files) => {
    files.length ? (files.length = 1) : (htmlData.value = [])
}
// 上传行为函数
const handleRquest = function (options) {
    const { onProgress, onError, onSuccess, fileItem } = options
    onProgress(0.1)
    // 让spin组件先转圈
    loading.value = true
    // 让Empty组件不显示
    htmlData.value.push(templateDemandObj)
    // 获取文件
    let reader = new FileReader()
    reader.readAsArrayBuffer(fileItem.file)
    reader.onload = function (loadEvent) {
        let arrayBuffer = loadEvent.target.result
        mammoth
            .convertToHtml({ arrayBuffer: arrayBuffer })
            .then((res) => {
                // 已经上传到浏览器了，需要解析为列表
                onSuccess(1)
                const rawHtml = res.value
                const parser = new HtmlParser(rawHtml)
                const finalData = parser.parseToArray()
                htmlData.value = finalData
                // ~~~~使用nextTick：等待DOM更新完成~~~~
                nextTick(() => {
                    loading.value = false
                })
            })
            .catch(function (error) {
                console.log("处理错误导致失败，请检查前端代码")
                console.log("错误如下：", error)
                onError(error)
            })
    }
}
// 上方按钮：直接在最下新增一条
const handleCreateAtLatest = () => {
    const newDemand = JSON.parse(JSON.stringify(templateDemandObj))
    htmlData.value.push(newDemand)
}
// 上方按钮：重置数据，点击页面不卡段
const handleResetData = () => {
    htmlData.value = []
}
// 点击单条右侧按钮：下方新增 - 深拷贝,并插入到下方
const handledownCreate = (index) => {
    const newDemand = JSON.parse(JSON.stringify(templateDemandObj))
    htmlData.value.splice(index + 1, 0, newDemand)
}
// 因为a-list限制必须知道当前页码和页容量
const currentPage = ref(1)
const handlePageChange = (page) => {
    currentPage.value = page
}
// 点击单条右侧按钮：删除 - 需要根据currentPage动态觉得因为a-list每页都是这样计算的
const handleDelete = (index) => {
    const currentIndex = index + (currentPage.value - 1) * 15
    htmlData.value.splice(currentIndex, 1)
}
// 打开弹窗并初始化form数据
const open = function () {
    // 打开时候传入对象可初始化from
    modalVisible.value = true
}
// 为了性能，监听modal关闭则清空数据
watch(
    () => modalVisible.value,
    (newValue) => {
        if (!newValue) {
            htmlData.value = []
        }
    }
)
// 提交事件
const handleModalSubmit = async () => {
    if (!htmlData.value.length) {
        Message.error("请添加设计需求后再提交...")
        return false
    }
    const res = await demandApi.multiSave({
        projectId: route.query.id,
        key: route.query.key,
        data: htmlData.value
    })
    if (res.code === 200) {
        treeDataStore.updateDesignDemandTreeData(res.data, route.query.id)
        Message.success("批量新增设计需求成功...")
        return true
    }
    return false
}
// 暴露该组件ref的方法
defineExpose({ open })
</script>

<style lang="less" scoped>
.uploadContainer {
    display: flex;
    align-items: center;
    & span {
        font-size: 1em;
        font-weight: 700;
    }
}
.demand-container {
    width: 100%;
    height: 55vh;
    padding: 5px;
    overflow: auto;
}
.operation-container {
    margin-bottom: 5px;
}
.important-text {
    font-weight: 700;
    color: red;
}
.item-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 5px 5px;
    border: 1px solid #ccc;
    border-bottom: none;
}
</style>
