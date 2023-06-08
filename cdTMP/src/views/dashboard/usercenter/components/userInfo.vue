<template>
    <a-form class="w-full md:w-full mt-3" :model="userInfo" @submit="modifyInfo">
        <a-form-item label="账户名" label-col-flex="80px">
            <a-input disabled :default-value="userInfo.username" allow-clear />
        </a-form-item>
        <a-form-item label="名称" label-col-flex="80px">
            <a-input v-model="userInfo.name" allow-clear />
        </a-form-item>
        <a-form-item label="手机" label-col-flex="80px">
            <a-input v-model="userInfo.phone" allow-clear />
        </a-form-item>
        <a-form-item label="邮箱" label-col-flex="80px">
            <a-input v-model="userInfo.email" allow-clear />
        </a-form-item>
        <a-form-item label="个人签名" label-col-flex="80px">
            <a-textarea v-model="userInfo.introduction" :max-length="255" class="h-28" show-word-limit allow-clear />
        </a-form-item>
        <a-form-item label-col-flex="80px">
            <a-button html-type="submit" type="primary">保存</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup>
import { reactive } from "vue"
import { useUserStore } from "@/store"
import { Message } from "@arco-design/web-vue"
// import user from "@/api/system/user"

const userStore = useUserStore()
const userInfo = reactive({
    ...userStore.$state
})

const modifyInfo = async (data) => {
    // 注意要用values
    console.log(data.values);
    Message.success("模拟请求成功，后续写接口")
}
</script>
