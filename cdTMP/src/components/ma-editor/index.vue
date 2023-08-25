<template>
    <div>
        <editor :key="editorKey" v-model="content" :init="initConfig" :id="props.id"></editor>
    </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue"
import { useAppStore } from "@/store"

import Editor from "@tinymce/tinymce-vue"
import tinymce from "tinymce/tinymce"

import "tinymce/icons/default"
import "tinymce/models/dom"
import "tinymce/themes/silver"

import "tinymce/plugins/advlist" //高级列表
import "tinymce/plugins/anchor" //锚点
import "tinymce/plugins/autolink" //自动链接
import "tinymce/plugins/autosave" //自动存稿
import "tinymce/plugins/charmap" //特殊字符
import "tinymce/plugins/code" //编辑源码
import "tinymce/plugins/codesample" //代码示例
import "tinymce/plugins/directionality" //文字方向
import "tinymce/plugins/image" //插入编辑图片
import "tinymce/plugins/importcss" //引入css
import "tinymce/plugins/insertdatetime" //插入日期时间
import "tinymce/plugins/lists" //列表插件
import "tinymce/plugins/nonbreaking" //插入不间断空格
import "tinymce/plugins/pagebreak" //插入分页符
import "tinymce/plugins/preview" //预览
import "tinymce/plugins/quickbars" //快速工具栏
import "tinymce/plugins/save" //保存
import "tinymce/plugins/searchreplace" //查找替换
import "tinymce/plugins/table" //表格
import "tinymce/plugins/visualblocks" //显示元素范围
import "tinymce/plugins/visualchars" //显示不可见字符
import "tinymce/plugins/wordcount" //字数统计

const appStore = useAppStore()

const props = defineProps({
    modelValue: { type: String },
    height: { type: Number, default: 250 },
    id: { type: String, default: () => "tinymce" + new Date().getTime().toString() },
    plugins: {
        type: [String, Array],
        default:
            "preview searchreplace autolink directionality visualblocks visualchars code codesample table charmap nonbreaking insertdatetime advlist lists wordcount autosave"
    },
    toolbar: {
        type: [String, Array],
        default:
            "code undo redo restoredraft | paste pastetext |bold italic underline strikethrough codesample | preview | alignleft alignjustify indent formatpainter | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | charmap pagebreak insertdatetime"
    }
})

const emit = defineEmits(["update:modelValue", "change"])

let content = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit("update:modelValue", value)
    }
})

const list = ref([])

const initConfig = reactive({
    menubar: false, // 菜单栏显隐
    language_url: "/tinymce/i18n/zh_CN.js",
    language: "zh_CN",
    skin_url: "/tinymce/skins/ui/tinymce-5",
    height: props.height,
    toolbar_mode: "wrap",
    plugins: props.plugins,
    toolbar: props.toolbar,
    skeletonScreen: true,
    branding: false,
    content_css: "/tinymce/skins/content/default/content.css",
    setup: (editor) => {
        editor.on("init", () => {
            editor.getBody().style.fontSize = "14px"
        })
    }
})

const editorKey = ref(new Date().getTime())

watch(
    () => list.value,
    (imgs) => {
        let tmp = ""
        imgs.map((img) => {
            if (
                img.indexOf(".jpg") > -1 ||
                img.indexOf(".png") > -1 ||
                img.indexOf(".bmp") > -1 ||
                img.indexOf(".jpeg") > -1 ||
                img.indexOf(".svg") > -1 ||
                img.indexOf(".gif") > -1
            ) {
                tmp += `<img src=${img} width="100%" />`
            }
        })
        content.value = content.value ? content.value + tmp : tmp
    }
)
watch(
    () => content.value,
    (vl) => emit("change", vl)
)
</script>
