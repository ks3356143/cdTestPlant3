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

// import "tinymce/plugins/advlist" // 高级列表
// import "tinymce/plugins/anchor" // 锚点
// import "tinymce/plugins/autolink" // 自动链接
import "tinymce/plugins/autosave" // 自动存稿
// import "tinymce/plugins/charmap" // 特殊字符
import "tinymce/plugins/code" // 编辑源码
// import "tinymce/plugins/codesample" // 代码示例
// import "tinymce/plugins/directionality" // 文字方向
import "tinymce/plugins/image" // 插入编辑图片
import "tinymce/plugins/importcss" // 引入css
// import "tinymce/plugins/insertdatetime" // 插入日期时间
import "tinymce/plugins/lists" // 列表插件
import "tinymce/plugins/nonbreaking" // 插入不间断空格
// import "tinymce/plugins/pagebreak" // 插入分页符
// import "tinymce/plugins/preview" // 预览
import "tinymce/plugins/quickbars" // 快速工具栏
import "tinymce/plugins/save" // 保存
import "tinymce/plugins/searchreplace" // 查找替换
import "tinymce/plugins/table" // 表格
// import "tinymce/plugins/visualblocks" //显示元素范围
import "tinymce/plugins/visualchars" // 显示不可见字符
// import "tinymce/plugins/wordcount" // 字数统计

const appStore = useAppStore()

const props = defineProps({
    modelValue: { type: String },
    height: { type: Number, default: 200 },
    id: { type: String, default: () => "tinymce" + new Date().getTime().toString() },
    plugins: {
        type: [String, Array],
        default: "searchreplace visualchars code table nonbreaking lists autosave"
    },
    toolbar: {
        type: [String, Array],
        // 如果要取消粘贴只粘贴文本，需要用户加格式请加上pastetext
        default:
            "code undo redo restoredraft | paste | bold | alignleft alignjustify indent formatpainter | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | subscript superscript removeformat"
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

// 辅助函数：遍历元素和子元素的style样式
function cleanStyles(element) {
    element.removeAttribute("style") // 移除元素自身的style属性
    element.removeAttribute("class") // 移除元素自身的class属性
    // 遍历子元素，递归清理样式
    for (const child of element.children) {
        // 移除子元素的style以及class属性
        cleanStyles(child)
    }
}

// 辅助函数：将元素中span变为text节点
function removeUnwantedSpansAndMore(element) {
    // 所有span变为字符串
    const spans = element.querySelectorAll("span")
    for (const span of spans) {
        const text = span.textContent
        const textNode = document.createTextNode(text)
        const parent = span.parentNode
        parent.removeChild(span)
        parent.appendChild(textNode)
    }
    // 所有a元素变成为字符串
    const as = element.querySelectorAll("a")
    for (const a of as) {
        const text = a.textContent
        const textNode = document.createTextNode(text)
        const parent = a.parentNode
        parent.removeChild(a)
        parent.appendChild(textNode)
    }
}

// 辅助函数：去掉注释节点
function removeCommentNodes(node) {
    const childNodes = node.childNodes
    // 遍历子节点
    for (let i = childNodes.length - 1; i >= 0; i--) {
        // 如果是注释节点
        if (childNodes[i].nodeType === Node.COMMENT_NODE) {
            node.removeChild(childNodes[i]) // 从父节点中移除该注释节点
        } else if (childNodes[i].nodeType === Node.ELEMENT_NODE) {
            removeCommentNodes(childNodes[i]) // 如果是元素节点，递归检查该元素的子节点
        }
    }
}

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
    selector: "#textarea1", // 下面自定义样式选中的区域为编辑区
    content_style: "body {line-height:1.5;font-size:14px;} p {margin:2px 0px;}", // 这里可以设置自定义样式
    // paste_as_text: false, // 粘贴文字只能是纯文本
    // 1.自定义粘贴过滤器函数，args.content就是粘贴内容
    paste_preprocess: function (plugin, args) {
        let content = args.content
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, "text/html")
        // 遍历一级元素
        Array.from(doc.body.children).forEach((element) => {
            cleanStyles(element)
            removeUnwantedSpansAndMore(element)
            removeCommentNodes(element)
        })
        // 将处理后的fragment转换回HTML字符串
        args.content = doc.body.innerHTML
    }
})

const editorKey = ref(new Date().getTime())

// 图片作为img的base64处理
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
<style lang="less"></style>
