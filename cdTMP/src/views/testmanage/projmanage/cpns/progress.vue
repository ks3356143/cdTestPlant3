<template>
    <div class="progress">
        <a-modal
            draggable
            :visible="visible"
            hide-cancel
            :mask-closable="false"
            :on-before-ok="handleClickConfirmButton"
            @cancel="handleClickConfirmButton"
        >
            <template #title>正在生成{{ text }}</template>
            <div><a-progress :percent="percent" size="large" /></div>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue"
import { Notification } from "@arco-design/web-vue"
const emits = defineEmits(["clickConfirm"])
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: "测评大纲"
    }
})
const percent = ref(0)
// 点击确定或关闭按钮判断是否完成，未完成则无法关闭进度条modal
const handleClickConfirmButton = () => {
    if (props.isComplete) {
        emits("clickConfirm")
        return true
    }
    Notification.warning({
        title: "无法关闭",
        content: "生成大纲未完成，请等待生成完成后再关闭"
    })
    return false
}
// 打开modal后自动移动
let timer = null
watch(
    () => props.visible,
    (newVal, oldVal) => {
        if (newVal) {
            timer = setInterval(() => {
                if (percent.value <= 0.95) {
                    let temp = parseFloat(percent.value.toFixed(2))
                    temp += 0.01
                    percent.value = parseFloat(temp.toFixed(2))
                }
            }, 100)
        } else {
            // 进度条清零
            percent.value = 0
            clearInterval(timer)
            timer = null
        }
    }
)
// 监听是否完成大纲生成
watch(
    () => props.isComplete,
    (newVal, oldVal) => {
        if (newVal) {
            percent.value = 1
            clearInterval(timer)
            timer = null
        }
    }
)
onUnmounted(() => {
    clearInterval(timer)
    timer = null
    // 进度条清零
    percent.value = 0
})
</script>

<style lang="less" scoped></style>
