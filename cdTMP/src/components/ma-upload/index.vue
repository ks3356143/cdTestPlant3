<!--
 - @Author XXX
 - @Link XXX
-->
<template>
    <div>
        <ma-image-upload v-if="props.type === 'image'" v-model="file" />
        <ma-file-upload v-if="props.type === 'file'" v-model="file" />
        <ma-chunk-upload v-if="props.type === 'chunk'" v-model="file" />
    </div>
</template>
<script setup>
import { ref, watch, provide } from "vue"
import { Message } from "@arco-design/web-vue"

import uploadConfig from "@/config/upload"
import MaImageUpload from "./components/image-upload.vue"
import MaFileUpload from "./components/file-upload.vue"
import MaChunkUpload from "./components/chunk-upload.vue"

const emit = defineEmits(["update:modelValue"])
const file = ref()
const props = defineProps({
    modelValue: { type: [String, Number, Array], default: () => {} },
    title: { type: String, default: "buttonText" },
    icon: { type: String, default: "icon-plus" },
    rounded: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
    size: { type: Number, default: 4 * 1024 * 1024 },
    chunk: { type: Boolean, default: false },
    chunkSize: { type: Number, default: 1 * 1024 * 1024 },
    limit: { type: Number, default: 0 },
    tip: { type: String, default: undefined },
    type: { type: String, default: "image" },
    accept: { type: String, default: "*" },
    returnType: { type: String, default: "hash" },
    fileType: { type: String, default: "button" },
    showList: { type: Boolean, default: true },
    requestData: { type: Object, default: {} }
})

if (!["id", "url", "hash"].includes(props.returnType)) {
    Message.error("MaUpload组件props的returnType只能为：id, url, hash 其中一个")
    console.error("MaUpload组件props的returnType只能为：id, url, hash 其中一个")
}

watch(
    () => props.modelValue,
    (val) => {
        file.value = val
    },
    {
        deep: true,
        immediate: true
    }
)

provide("storageMode", uploadConfig.storageMode)
provide("config", props)

watch(
    () => file.value,
    (vl) => emit("update:modelValue", vl)
)
</script>
