<template>
    <!-- 修改源码：添加mask-closable属性 -->
    <!-- 修改源码：添加on-before-cancel属性 -->
    <!-- 修改源码：如果为componentName为a-modal则标题吸顶 -->
    <component
        :is="componentName"
        v-model:visible="dataVisible"
        :on-before-ok="submit"
        :on-before-cancel="beforeCancel"
        @cancel="close"
        ok-text="保存"
        cancel-text="关闭"
        draggable
        :mask-closable="options.formOption.mask"
        :width="options.formOption.width"
        :fullscreen="options.formOption.isFull || false"
        unmount-on-close
    >
        <template #title>
            {{ actionTitle }}
        </template>
        <a-spin :loading="dataLoading" tip="加载中..." class="w-full">
            <!-- 修改源码parentKey -->
            <ma-form
                v-model="form"
                :columns="formColumns"
                :parent-key="props.parentKey"
                :options="formOptions"
                ref="maFormRef"
            >
                <template v-for="slot in Object.keys($slots)" #[slot]="component">
                    <slot :name="slot" v-bind="component" />
                </template>
            </ma-form>
        </a-spin>
    </component>
</template>

<script setup>
import { ref, toRaw, inject, provide, nextTick } from "vue" // 这里多了nextTick
import { Message } from "@arco-design/web-vue"
import { containerItems } from "@cps/ma-form/js/utils"
import { isArray, isFunction, get, cloneDeep, isUndefined } from "lodash-es"
import { useRouter } from "vue-router"
import tool from "@/utils/tool"
import { useFormStore } from "@/store/index"

// 2025年5月14日新增
const props = defineProps({
    parentKey: { type: String, default: "" }
})

const formStore = useFormStore()
const router = useRouter()
const formOptions = ref({ showButtons: false })
const maFormRef = ref()
const componentName = ref("a-modal")
const layoutColumns = ref(new Map())
const formColumns = ref([])
const currentAction = ref("")
const dataVisible = ref(false)
const form = ref({})
const actionTitle = ref("")
const dataLoading = ref(true)

const columns = inject("columns")
const options = inject("options")
// 修改源码：新增事件beforeCancel和处理函数beforeCancel
const emit = defineEmits(["success", "error", "beforeCancel"])
const beforeCancel = () => {
    emit("beforeCancel")
    return true
}

provide("form", toRaw(form))
if (window.screen.width < 768) {
    options.formOption.width = window.screen.width
    options.formOption.isFull = true
}

const submit = async () => {
    const formData = maFormRef.value.getFormData()
    if (await maFormRef.value.validateForm()) {
        return false
    }
    let response
    if (currentAction.value === "add") {
        if (isFunction(options.beforeAdd) && !(await options.beforeAdd(formData))) {
            return false
        }
        // 修改源码添加parameters参数
        if (!options.parameters) {
            response = await options.add.api(formData)
        } else {
            response = await options.add.api({ ...formData, ...options.parameters })
        }
        isFunction(options.afterAdd) && (await options.afterAdd(response, formData))
    } else {
        if (isFunction(options.beforeEdit) && !(await options.beforeEdit(formData))) {
            return false
        }
        if (!options.parameters) {
            response = await options.edit.api(formData[options.pk], formData)
        } else {
            response = await options.edit.api(formData[options.pk], { ...formData, ...options.parameters })
        }
        isFunction(options.afterEdit) && (await options.afterEdit(response, formData))
    }
    if (response.success) {
        Message.success(response.message || `${actionTitle.value}成功！`)
        emit("success", response)
        return true
    } else if (response.success === false && (typeof response.code === "undefined" || response.code !== 200)) {
        Message.clear()
        Message.error(response.message || `${actionTitle.value}失败！`)
        return false
    }
}
const open = () => {
    formColumns.value = []
    layoutColumns.value = new Map()
    init()
    if (options.formOption.viewType === "tag" && currentAction.value !== "see") {
        if (!options.formOption.tagId) {
            Message.info("未配置 tagId")
            return
        }
        if (!options.formOption.tagName) {
            Message.info("未配置 tagName")
            return
        }
        const config = {
            options,
            sourceColumns: columns.value,
            formColumns: formColumns.value
        }

        formStore.crudList[options.id] = false

        const queryParams = {
            tagId: options.formOption.tagId,
            op: currentAction.value
        }

        queryParams.key = form.value[options.formOption?.titleDataIndex ?? ""] ?? form.value[options.pk]

        if (formStore.formList[options.formOption.tagId] === undefined) {
            formStore.formList[options.formOption.tagId] = {
                config,
                addData: {},
                editData: {}
            }
        }

        if (currentAction.value === "add") {
            formStore.formList[options.formOption.tagId].addData = cloneDeep(form.value)
        } else {
            formStore.formList[options.formOption.tagId].editData[queryParams.key] = cloneDeep(form.value)
        }
        form.value = {}
        router.push(`/openForm/${options.formOption.tagId}` + tool.httpBuild(queryParams, true))
    } else {
        componentName.value = options.formOption.viewType === "drawer" ? "a-drawer" : "a-modal"
        dataVisible.value = true
    }
}
const close = () => {
    dataVisible.value = false
    formColumns.value = []
    form.value = {}
}
const add = async () => {
    // 修改源码：开始
    const strArr = ["新增编辑", "编辑新增", "新增新增", "编辑编辑", "编辑", "新增"]
    if (!actionTitle.value) {
        actionTitle.value = "新增"
    } else if (strArr.includes(actionTitle.value)) {
        actionTitle.value = "新增"
    } else {
        actionTitle.value += "新增"
    }
    // 修改源码：结束
    currentAction.value = "add"
    formOptions.value["disabled"] = false
    form.value = {}
    open()
    await nextTick(() => maFormRef.value && maFormRef.value.updateOptions())
}
const edit = async (data) => {
    // 修改源码：开始
    const strArr = ["新增编辑", "编辑新增", "新增新增", "编辑编辑", "编辑", "新增"]
    if (!actionTitle.value) {
        actionTitle.value = "编辑"
    } else if (strArr.includes(actionTitle.value)) {
        actionTitle.value = "编辑"
    } else {
        actionTitle.value += "编辑"
    }
    // 修改源码：结束
    currentAction.value = "edit"
    formOptions.value["disabled"] = false
    form.value = {}
    if (options.edit.dataSource && options.edit.dataSource === "api") {
        const response = await options.edit.dataSourceApi(data[options.pk])
        if (response.success) {
            form.value = response.data
            open(response.data)
        }
    } else {
        for (let i in data) form.value[i] = data[i]
        open(data)
    }
    await nextTick(() => maFormRef.value && maFormRef.value.updateOptions())
}
const see = async (data) => {
    actionTitle.value = options.see.title ?? "查看"
    currentAction.value = "see"
    formOptions.value["disabled"] = true
    form.value = {}
    if (options.see.dataSource && options.see.dataSource === "api") {
        const response = await options.see.dataSourceApi(data[options.pk])
        if (response.success) {
            form.value = response.data
            open(response.data)
        }
    } else {
        for (let i in data) form.value[i] = data[i]
        open(data)
    }
    await nextTick(() => maFormRef.value && maFormRef.value.updateOptions())
}

const init = async () => {
    dataLoading.value = true
    const layout = JSON.parse(JSON.stringify(options?.formOption?.layout ?? []))

    await Promise.all(
        columns.value.map(async (item) => {
            if (item.children && item.children.length > 0) {
                await item.children.map(async (childItem) => {
                    await columnItemHandle(childItem)
                })
            } else {
                await columnItemHandle(item)
            }
        })
    )
    // 设置表单布局
    settingFormLayout(layout)
    if (isArray(layout) && layout.length > 0) {
        formColumns.value = layout
        const excludeColumns = ["__index", "__operation"]
        columns.value.map((item) => {
            if (options.formExcludePk) excludeColumns.push(options.pk)
            if (excludeColumns.includes(item.dataIndex)) return
            !item.__formLayoutSetting && formColumns.value.push(item)
        })
    }
    dataLoading.value = false
}

const columnItemHandle = async (item) => {
    const excludeColumns = ["__index", "__operation"]
    if (options.formExcludePk) excludeColumns.push(options.pk)
    if (excludeColumns.includes(item.dataIndex)) {
        layoutColumns.value.set(item.dataIndex, { dataIndex: item.dataIndex, layoutFormRemove: true })
        return
    }
    layoutColumns.value.set(item.dataIndex, item)
    formColumns.value.push(item)

    if (options.formOption.viewType !== "tag") {
        // 针对带点的数据处理
        if (item.dataIndex && item.dataIndex.indexOf(".") > -1) {
            form.value[item.dataIndex] = get(form.value, item.dataIndex)
        }

        // add 默认值处理
        if (currentAction.value === "add") {
            if (item.addDefaultValue && isFunction(item.addDefaultValue)) {
                form.value[item.dataIndex] = await item.addDefaultValue(form.value)
            } else if (typeof item.addDefaultValue != "undefined") {
                form.value[item.dataIndex] = item.addDefaultValue
            }
        }
        // edit 和 see 默认值处理
        if (currentAction.value === "edit" || currentAction.value === "see") {
            if (item.editDefaultValue && isFunction(item.editDefaultValue)) {
                form.value[item.dataIndex] = await item.editDefaultValue(form.value)
            } else if (typeof item.editDefaultValue != "undefined") {
                form.value[item.dataIndex] = item.editDefaultValue
            }
        }
    }

    item.disabled = undefined
    item.readonly = undefined
    await nextTick()
    // 其他处理
    item.display = formItemShow(item)
    item.disabled = formItemDisabled(item)
    item.readonly = formItemReadonly(item)
    item.labelWidth = formItemLabelWidth(item)
    item.rules = getRules(item)
}

const settingFormLayout = (layout) => {
    if (!isArray(layout)) {
        return
    }
    layout.map(async (item, index) => {
        if (containerItems.includes(item.formType)) {
            switch (item.formType) {
                case "tabs":
                    if (item.tabs) {
                        item.tabs.map((tab) => {
                            tab.formList && (tab.formList = settingFormLayout(tab.formList))
                        })
                    }
                    break
                case "card":
                    item.formList && (item.formList = settingFormLayout(item.formList))
                    break
                case "grid-tailwind":
                case "grid":
                    if (item.cols) {
                        item.cols.map((col) => {
                            col.formList && (col.formList = settingFormLayout(col.formList))
                        })
                    }
                    break
                case "table":
                    if (item.rows) {
                        item.rows.map((row) => {
                            if (row.cols) {
                                row.cols.map((col) => {
                                    col.formList && (col.formList = settingFormLayout(col.formList))
                                })
                            }
                        })
                    }
                    break
            }
        } else {
            let column = layoutColumns.value.get(item.dataIndex)
            // 公共column存在以dataIndex作为判断获取配置项
            if (column) {
                // 判断是否layout配置移除
                if (column.layoutFormRemove) {
                    layout[index] = undefined
                    return
                }
                column["__formLayoutSetting"] = true
                item = column
                layout[index] = item
            } else {
                // 当公共column不存在，则执行column配置项处理
                await columnItemHandle(item)
                let column = layoutColumns.value.get(item.dataIndex)
                if (column.layoutFormRemove) {
                    layout[index] = undefined
                    return
                }
                item["__formLayoutSetting"] = true
                layout[index] = item
            }
        }
    })
    // 移除
    return layout.filter((item) => {
        return !isUndefined(item)
    })
}

const formItemShow = (item) => {
    if (currentAction.value === "add") {
        return isFunction(item.addDisplay) ? item.addDisplay() !== false : item.addDisplay !== false
    }
    if (currentAction.value === "edit" || currentAction.value === "see") {
        return isFunction(item.editDisplay) ? item.editDisplay(form.value) !== false : item.editDisplay !== false
    }
    return item.display !== false
}
const formItemDisabled = (item) => {
    if (currentAction.value === "add" && !isUndefined(item.addDisabled)) {
        return isFunction(item.addDisabled) ? item.addDisabled() : item.addDisabled
    }
    if (currentAction.value === "edit" && !isUndefined(item.editDisabled)) {
        return isFunction(item.editDisabled) ? item.editDisabled(form.value) : item.editDisabled
    }
    if (currentAction.value === "see") {
        return true
    }
    if (!isUndefined(item.disabled)) {
        return item.disabled
    }
    return false
}
const formItemReadonly = (item) => {
    if (currentAction.value === "add" && !isUndefined(item.addReadonly)) {
        return isFunction(item.addReadonly) ? item.addReadonly() : item.addReadonly
    }
    if (currentAction.value === "edit" && !isUndefined(item.editReadonly)) {
        return isFunction(item.editReadonly) ? item.editReadonly(form.value) : item.editReadonly
    }
    if (currentAction.value === "see") {
        return true
    }
    if (!isUndefined(item.readonly)) {
        return item.readonly
    }
    return false
}
const formItemLabelWidth = (item) => {
    return item.labelWidth ?? options.labelWidth ?? undefined
}

const toRules = (rules) => {
    if (!rules) {
        return []
    }

    if (isArray(rules)) {
        return rules.map((v) => ({ ...v }))
    }

    if (!rules.validator && isFunction(rules.validatorFormData)) {
        rules.validator = (value, cb) => {
            rules.validatorFormData(value, cb, form.value)
        }
    }
    return { ...rules }
}

const getRules = (item) => {
    if (currentAction.value === "add") {
        return toRules(item.addRules ?? item.commonRules ?? [])
    }
    if (currentAction.value === "edit") {
        return toRules(item.editRules ?? item.commonRules ?? [])
    }
}

const getFormColumns = async (type = "add") => {
    await init()
    return formColumns.value
}
// 修改源码，暴露actionTitle
defineExpose({ add, edit, see, currentAction, form, getFormColumns, maFormRef, actionTitle })
</script>
