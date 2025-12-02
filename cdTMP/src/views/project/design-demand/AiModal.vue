<template>
    <div class="ai-modal-container">
        <a-modal v-model:visible="visible" width="80%" unmount-on-close draggable>
            <template #title> AI生成测试项 </template>
            <div class="flex flex-col">
                <a-button type="primary" :disabled="generateLoading" @click="generateClick">{{
                    generateLoading ? "AI正在生成测试项中..." : "点击生成测试项"
                }}</a-button>
                <a-progress
                    :percent="percent"
                    :style="{ width: '100%' }"
                    size="large"
                    :show-text="false"
                    :color="{
                        '0%': 'rgb(var(--primary-6))',
                        '100%': 'rgb(var(--success-6))'
                    }"
                    class="mb-2"
                />
                <a-list :loading="listLoading" :data="dataList">
                    <template #header> 设计需求：{{ designObj?.name ?? "暂无内容" }} </template>
                    <template #item="{ item, index }">
                        <a-list-item>
                            <div class="item-container">
                                <a-input-group>
                                    <div class="index-hao">{{ indexTu[index] }}</div>
                                    测试项：
                                    <a-input placeholder="测试项标识" v-model="item.ident" :style="{ width: '100px' }" @click.stop.prevent></a-input>
                                    <a-input placeholder="测试项名称" v-model="item.title" :style="{ width: '200px' }" @click.stop.prevent></a-input>
                                    <a-select placeholder="选择优先级" v-model="item.priority" :style="{ width: '100px' }">
                                        <a-option value="1">高</a-option>
                                        <a-option value="2">中</a-option>
                                        <a-option value="3">低</a-option>
                                    </a-select>
                                    <a-select placeholder="选择测试类型" v-model="item.testType" :style="{ width: '200px' }">
                                        <a-option v-for="type in testType" :key="type.key" :value="type.key">
                                            {{ type.title }}
                                        </a-option>
                                    </a-select>
                                    <a-select placeholder="选择测试手段" multiple v-model="item.testMethod" :style="{ width: '250px' }">
                                        <a-option v-for="method in testMethod" :key="method.key" :value="method.key">
                                            {{ method.title }}
                                        </a-option>
                                    </a-select>
                                </a-input-group>
                                <div class="m-2 flex justify-start items-center">
                                    <div class="label">测试项描述：</div>
                                    <div class="input flex-1">
                                        <a-input v-model="item.demandDescription"></a-input>
                                    </div>
                                </div>
                                <div class="arco-table arco-table-size-large arco-table-border arco-table-stripe arco-table-hover">
                                    <div class="arco-table-container">
                                        <table class="arco-table-element" cellpadding="0" cellspacing="0">
                                            <thead>
                                                <tr class="arco-table-tr">
                                                    <th class="arco-table-th" :width="100">
                                                        <span class="arco-table-cell arco-table-cell-align-center">
                                                            <span class="arco-table-th-title">子项序号</span>
                                                        </span>
                                                    </th>
                                                    <th class="arco-table-th" :width="400">
                                                        <span class="arco-table-cell arco-table-cell-align-center">
                                                            <span class="arco-table-th-title">测试子项描述</span>
                                                        </span>
                                                    </th>
                                                    <th class="arco-table-th" :width="800">
                                                        <span class="arco-table-cell arco-table-cell-align-center">
                                                            <span class="arco-table-th-title">测试子项步骤</span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <!-- 这里tr要v-for渲染 -->
                                                <tr class="arco-table-tr" v-for="(row, idx) in item.children" :key="idx">
                                                    <td class="arco-table-td">
                                                        <span class="arco-table-cell arco-table-cell-align-center">
                                                            {{ idx + 1 }}
                                                        </span>
                                                    </td>
                                                    <td class="arco-table-td">
                                                        <span class="arco-table-cell">
                                                            <a-textarea auto-size placeholder="请填写测试子项名称" v-model="row.name"></a-textarea>
                                                        </span>
                                                    </td>
                                                    <td class="arco-table-td">
                                                        <span class="arco-table-cell">
                                                            <OpeAndExpect v-model="row.subStep" />
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </a-list-item>
                    </template>
                </a-list>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue"
import { useRoute } from "vue-router"
import designApi from "@/api/project/designDemand"
import dictApi from "@/api/common"
import OpeAndExpect from "./OpeAndExpect.vue" // 操作和预期子表格
import aiApi from "@/api/outs/aiApi"
import { Message } from "@arco-design/web-vue"
import tool from "@/utils/tool"

// 常量
const indexTu = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚"

// 初始化测试类型-一起请求处理错误
const testType = ref<any>([])
const testMethod = ref<any>([])
const fetchTestType = async () => {
    try {
        const [typeResponse, methodResponse] = await Promise.all([dictApi.getDict("testType"), dictApi.getDict("testMethod")])
        testType.value = typeResponse.data
        testMethod.value = methodResponse.data
    } catch (e) {
        Message.error("初始化测试类型或测试手段错误，请检查网络后重试!")
    }
}
fetchTestType()

// 初始化设计需求
const route = useRoute()
const getDesign = async () => {
    try {
        const res = await designApi.getDesignDemandOne({ project_id: route.query.id, key: route.query.key })
        designObj.value = res.data
    } catch (e) {
        Message.error("初始化设计需求信息错误，请检查网络后重试!")
    }
}
getDesign()
const designObj: any = ref()

// 进度条和列表加载loading
const percent = ref(0.0)
const listLoading = ref(false)

// 根据测试项生成按钮
const generateLoading = ref(false)
const generateClick = async () => {
    try {
        generateLoading.value = true
        listLoading.value = true
        percent.value = 0.1 // 开始进度
        startProgressSimulation()
        // 变量：给AI的问题
        const question = tool.htmlToTextWithDOM(designObj.value?.description || "")
        console.log("给AI的问题如下：", question)
        const res = await aiApi.getAiTestItem({ question: question, stream: false })
        percent.value = 1.0 // 完成进度
        console.log("AI接口返回如下", res)
        Message.success("生成测试项成功，请完善信息后录入数据")
    } catch (e) {
        percent.value = 0.0
    } finally {
        stopProgressSimulation()
        generateLoading.value = false
        setTimeout(() => {
            listLoading.value = false
        }, 500)
    }
}

// 生成的AI测试项数据
const dataList = ref([])

// 进度条模拟变量和函数
const progressInterval = ref<NodeJS.Timeout>()
const startProgressSimulation = () => {
    progressInterval.value = setInterval(() => {
        if (percent.value < 0.8) {
            percent.value += (0.8 - percent.value) * 0.1
        }
    }, 200)
}

const stopProgressSimulation = () => {
    if (progressInterval.value) {
        clearInterval(progressInterval.value)
        progressInterval.value = undefined
    }
}

onUnmounted(() => {
    stopProgressSimulation()
})

// defineModel
const visible = defineModel<boolean>("visible", { default: false })
</script>

<style scoped lang="less">
.index-hao {
    font-size: 18px;
    padding: 0 9px;
    color: rgb(var(--primary-5));
}
:deep(.arco-list-item) {
    border: 1px solid #999 !important;
}
:deep(.arco-progress-line-bar) {
    border-radius: 0 !important;
}
:deep(.arco-progress-line) {
    border-radius: 0 !important;
}
</style>
