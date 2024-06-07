<template>
    <div class="case-modal-container">
        <a-modal v-model:visible="visible" draggable unmount-on-close hide-cancel ok-text="关闭" width="900px">
            <template #title> 问题单关联用例列表 </template>
            <div>
                <a-list>
                    <a-list-item v-for="(item, index) in transformData" :key="index">
                        <a-descriptions :data="item.showData" :title="'用例名称：' + item.case" bordered :column="1" />
                    </a-list-item>
                </a-list>
            </div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"

const visible = ref(false)
// 数据储存在这里
const data = ref([])
// 转换为描述数据
const transformData = computed(() => {
    return data.value.map((item) => {
        // 数组的每一项都要转为{ case:'xxx',showData:[{label:'xxx',value:'xxx2'}] }
        const showData = []
        for (let key in item) {
            let showKey = key
            if (key === "case") continue
            if (key === "dut") {
                showKey = "被测件"
            }
            if (key === "round") {
                showKey = "轮次"
            }
            if (key === "design") {
                showKey = "设计需求"
            }
            if (key === "demand") {
                showKey = "测试项"
            }
            if (key === "demand_ident") {
                showKey = "测试项标识"
            }
            showData.push({
                label: showKey,
                value: item[key]
            })
        }
        return {
            case: item.case,
            showData
        }
    })
})
function open(caseList) {
    visible.value = true
    data.value = caseList
}
defineExpose({
    open
})
</script>

<style lang="less" scoped></style>
