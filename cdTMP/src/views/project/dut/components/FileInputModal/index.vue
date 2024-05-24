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
        >
            <div class="uploadContainer">
                <span :style="{ marginBottom: '10px', flex: '0 1 160px' }">上传设计需求.docx:</span>
                <a-upload
                    :style="{ marginBottom: '10px' }"
                    :custom-request="handleRquest"
                    :limit="1"
                    accept=".docx"
                ></a-upload>
            </div>
            <a-alert :style="{ margin: '10px 0' }" type="warning"
                >上传录入提示信息：硬性要求，本辅助程序根据GJB438C文档结构进行解析，要求：1.功能需求章节必须包含<span
                    class="important-text"
                    >“CSCI功能需求”</span
                >或<span class="important-text">“CSCI能力需求”</span>文字,且章节级别必须为<span class="important-text"
                    >2级</span
                >; 2.外部接口章节必须包含<span class="important-text">“CSCI外部接口需求”</span
                >文字,且章节级别必须为<span class="important-text">2级</span
                >。暂时只能解析这两个章节，如果错误请修改文档文字后再次上传，后续优化。</a-alert
            >
            <div class="operation-container">
                <span :style="{ marginRight: '10px', fontWeight: 700 }">操作按钮:</span>
                <a-button type="primary" @click="handleCreateAtLatest">新增一条</a-button>
            </div>
            <div class="demand-container">
                <a-collapse show-expand-icon>
                    <a-collapse-item v-for="(item, index) in htmlData" :key="index">
                        <template #header>
                            <a-input-group>
                                <a-input
                                    placeholder="章节号"
                                    v-model="item.capter"
                                    :style="{ width: '110px' }"
                                    @click.stop.prevent
                                ></a-input>
                                <a-input
                                    placeholder="标题"
                                    v-model="item.title"
                                    :style="{ width: '350px' }"
                                    @click.stop.prevent
                                ></a-input>
                                <a-input
                                    placeholder="标识"
                                    v-model="item.ident"
                                    :style="{ width: '160px' }"
                                    @click.stop.prevent
                                ></a-input>
                                <a-select
                                    :style="{ width: '200px' }"
                                    placeholder="请选择设计需求类型"
                                    @click.stop.prevent
                                    v-model="item.demandType"
                                >
                                    <a-option v-for="it in demandType" :value="it.key">{{ it.title }}</a-option>
                                </a-select>
                            </a-input-group>
                        </template>
                        <div class="content">
                            <a-textarea
                                show-word-limit
                                placeholder="设计需求内容"
                                auto-size
                                v-model="item.content"
                                allow-clear
                            />
                        </div>
                        <template #extra>
                            <a-button-group>
                                <a-button
                                    type="primary"
                                    status="success"
                                    size="mini"
                                    @click.stop.prevent="handledownCreate(index)"
                                >
                                    +下方新增
                                </a-button>
                                <a-button
                                    type="primary"
                                    status="danger"
                                    size="mini"
                                    @click.stop.prevent="handleDelete(index)"
                                >
                                    删除该条
                                </a-button>
                            </a-button-group>
                        </template>
                    </a-collapse-item>
                </a-collapse>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref } from "vue"
import mammoth from "mammoth"
import dictApi from "@/api/system/dict"
import { parseHtmlStringByDemandDut } from "@/views/project/dut/tools/parseHtmlString"
// 单个设计需求录入模版
const templateDemandObj = {
    capter: "",
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
const htmlData = ref([
    {
        capter: "4.2.1.1",
        title: "解析并执行注入指令",
        ident: "RQGN01-UART-ZRZL",
        demandType: "1",
        content: `WXT星载触发处理单元主控软件通过UART总线与PDPU之间通讯，完成数据注入和广播注入的接收，其中包括注入指令、星表、主控软件目标文件、FPGA目标文件、算法参数、广播时间码、姿态等数据接收。
通讯过程按照《EP卫星PDPU与WXT星载触发处理单元的通信协议》有关规定执行。`
    },
    {
        capter: "4.2.1.2",
        title: "接受星表注入",
        ident: "RQGN01-UART",
        demandType: "1",
        content: `星表数据存储在触发处理单元NORFLASH基地址为0xBC000000，偏移地址0x100000~1FFFFF空间中，主备份NORFLASH存储同一份星表数据。软件在初始化的时候，将NORFLASH中的星表数据读取到算法调用内存空间。`
    },
    {
        capter: "4.2.1.3",
        title: "接收软件代码重构",
        ident: "RQGN01-1553B-SWRCV",
        demandType: "1",
        content: `主控软件接收软件重构目标文件，支持乱序接收软件重构目标代码，每接收到一个首包（包序号为0），则认为是新一次目标文件接收开始，更新“软件重构状态”为软件重构接收中；若没有收到首包，对于之后接收到的中间包和尾包都丢弃；当尾包包序号以前的所有序号的数据包均接收完毕，则认为主控软件目标文件接收完毕，更新“软件重构状态”为软件重构写入中；在接收过程中，如果接收到中间包的包序号大于尾包包序号，则丢弃该中间包，并置“软件重构状态为”包序号错，之后停止当前目标文件接收直至接收到新的首包，如果前后收到两个包序号相同的数据包，则保留后接收到的数据包（尾包以第一次收到的为准）。`
    }
])
// 上传行为函数
const handleRquest = function (options) {
    const { onProgress, onError, onSuccess, fileItem } = options
    onProgress(0.1)
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
                const finalData = parseHtmlStringByDemandDut(rawHtml)
                // 将finalData赋值给响应式数据ref变量：htmlData
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
// 点击单条右侧按钮：下方新增 - 深拷贝,并插入到下方
const handledownCreate = (index) => {
    const newDemand = JSON.parse(JSON.stringify(templateDemandObj))
    htmlData.value.splice(index + 1, 0, newDemand)
}
// 点击单条右侧按钮：删除
const handleDelete = (index) => {
    htmlData.value.splice(index, 1)
}
// 打开弹窗并初始化form数据
const open = function () {
    // 打开时候传入对象可初始化from
    modalVisible.value = true
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
    height: 100%;
    padding: 5px;
}
.operation-container {
    margin-bottom: 5px;
}
.important-text {
    font-weight: 700;
    color: red;
}
</style>
