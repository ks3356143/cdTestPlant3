<template>
    <!-- 注意该组件强制绑定caseTable页面，不要使用在其他地方了 -->
    <div class="replace-person-container">
        <a-modal
            v-model:visible="visible"
            width="40%"
            unmount-on-close
            ok-text="替换执行时间"
            cancel-text="关闭"
            draggable
            :on-before-ok="submitReplace"
        >
            <template #title>替换执行时间</template>
            <div class="content-container">
                <a-form ref="exeTime" :model="formData" scroll-to-first-error>
                    <a-form-item field="designPerson" label="执行时间">
                        <a-date-picker v-model="exetime" style="width: 200px" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Message } from "@arco-design/web-vue"
import caseApi from "@/api/project/case"

const visible = ref(false)
const formData = ref({})
const exetime = ref("")
// props
const { selectRows } = defineProps<{ selectRows: any }>()

// 2.异步执行替换操作，返回boolean-true则关闭弹窗
const submitReplace = async () => {
    // 不再非受控验证，手动验证
    if (exetime.value === "") {
        Message.error("请选择时间后，进行替换操作")
        return false
    }
    if (selectRows.length && selectRows.length > 0) {
        // 判断是否选择了行
        // 请求后台执行
        await caseApi.exetimeReplace({
            selectRows: selectRows,
            exetime: exetime.value
        })
        Message.success("批量替换成功...")
        return true
    }
    Message.error("请在表格中选择行...")
    return false
}

// 其他：打开modal
const open = () => {
    exetime.value = ""
    visible.value = true
}
defineExpose({ open })
</script>

<style lang="less" scoped></style>
