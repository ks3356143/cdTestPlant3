<template>
    <!-- 组件：该组件显示一个正方体，可粘贴图片内容进去并展示，并生成base64到数据里面 -->
    <div class="image-input-container flex flex-col gap-1">
        <div class="image-input-handle flex items-center justify-center" @paste="handlePaste">
            <!-- 加载状态 -->
            <div v-if="isLoading">
                <a-spin :size="32" />
            </div>
            <!-- 正常显示状态 -->
            <template v-else-if="imgData">
                <img :src="imgData" alt="粘贴的图片" class="preview-image img-container" />
            </template>

            <template v-else>
                <div class="placeholder">此处Ctrl+V粘贴图片</div>
            </template>
        </div>
        <!-- 题注：fontnote -->
        <a-input v-model="fontnote" class="max-w-100" placeholder="请输入题注"></a-input>
    </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import { nextTick, ref } from "vue"

// 储存图片base64
const imgData = defineModel<string>()
// 储存题注
const fontnote = defineModel<string>("fontnote")
// 加载状态
const isLoading = ref(false)

// 处理粘贴事件
const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault()
    // 处理没有粘贴内容
    if (!e.clipboardData) return
    const items = e.clipboardData!.items
    // 遍历粘贴板内容
    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        // 判断是否是粘贴的图片
        if (item.kind === "file" && item.type.startsWith("image/")) {
            const file = item.getAsFile()
            if (!file) {
                Message.error("读取图片失败，请重新粘贴")
                break
            }
            // 判断大小不超过50M
            if (file.size > 50 * 1024 * 1024) {
                Message.error("要求图片不超过50M")
                break
            }
            isLoading.value = true
            const reader = new FileReader()
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                imgData.value = e.target!.result as string
                await nextTick() // 保证图片展示
                isLoading.value = false
            }
            // 加载失败处理
            reader.onerror = () => {
                Message.error("图片加载失败，请重试")
                isLoading.value = false
            }
            reader.readAsDataURL(file) // 可直接转为base64的url给img元素使用
            break
        } else {
            Message.error("请粘贴图片，无法粘贴文字或其他内容")
            break
        }
    }
}
</script>

<style scoped lang="less">
.image-input-handle {
    width: 200px;
    height: 180px;
    border: 1px solid #eee;
    cursor: alias;

    .img-container{
        width: 100%;
        height: 100%;
    }
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}
</style>
