<template>
    <div class="flex flex-col w-full h-full">
        <a-input-group class="mb-2 w-full flex items-center" size="mini">
            <a-input
                :placeholder="props?.searchPlaceholder"
                allow-clear
                @input="changeKeyword"
                @clear="resetData"
                style="height: 100%"
            />
            <a-button
                @click="
                    () => {
                        isExpand ? maTree.expandAll(false) : maTree.expandAll(true)
                        isExpand = !isExpand
                    }
                "
                >{{ isExpand ? "折叠" : "展开" }}</a-button
            >
        </a-input-group>
        <a-tree
            blockNode
            :data="treeData"
            class="h-full w-full"
            @select="handlerSelect"
            :field-names="props.fieldNames"
            v-model:selected-keys="selectedKeys"
            ref="maTree"
            v-bind="$attrs"
        >
            <template #icon v-if="props.icon"><component :is="props.icon" /></template>
        </a-tree>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const treeData = ref([])
const selectedKeys = ref([])
const maTree = ref()
const isExpand = ref(false)

const emit = defineEmits(["click"])

const props = defineProps({
    modelValue: { type: Array },
    searchPlaceholder: { type: String },
    selectedKeys: { type: Array },
    fieldNames: {
        type: Object,
        default: () => {
            return { title: "label", value: "code" }
        }
    },
    icon: { type: String, default: undefined }
})

onMounted(() => (selectedKeys.value = props.selectedKeys))

watch(
    () => props.modelValue,
    (val) => {
        treeData.value = val
    }
)

const handlerSelect = (item, data) => {
    selectedKeys.value = [item]
    emit("click", ...[item, data])
}

const resetData = () => (treeData.value = props.modelValue)

const changeKeyword = (keyword) => {
    if (!keyword || keyword === "") {
        treeData.value = Object.assign(props.modelValue, [])
        return false
    }
    treeData.value = searchNode(keyword)
}

const searchNode = (keyword) => {
    const loop = (data) => {
        let tree = []
        data.map((item) => {
            if (item.children && item.children.length > 0) {
                const temp = loop(item.children)
                tree.push(...temp)
            } else if (item[props.fieldNames["title"]].indexOf(keyword) !== -1) {
                tree.push(item)
            }
            return tree
        })

        return tree
    }
    return loop(props.modelValue)
}

defineExpose({ maTree })
</script>

<style scoped lang="less">
:deep(.arco-tree-node:hover) {
    background-color: var(--color-fill-2);
    border-radius: 2px;
}
:deep(.arco-tree-node-switcher) {
    margin-left: 2px;
}
</style>