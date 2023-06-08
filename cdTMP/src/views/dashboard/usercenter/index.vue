<template>
    <div class="block">
        <div class="user-header rounded-sm text-center">
            <div class="pt-3 mx-auto avatar-box">
                <ma-upload rounded></ma-upload>
            </div>
            <div>
                <a-tag size="large" class="mt-3 rounded-full" color="#de53ff">
                    {{ userStore.role }}
                </a-tag>
            </div>
        </div>
        <a-layout-content class="block lg:flex lg:justify-between">
            <div class="ma-content-block w-full lg:w-6/12 mt-3 p-4">
                <a-tabs type="rounded">
                    <a-tab-pane key="info" title="个人资料">
                        <user-infomation />
                    </a-tab-pane>
                    <a-tab-pane key="safe" title="安全设置">
                        <editpassword />
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div class="ma-content-block w-full lg:w-6/12 mt-3 p-4 ml-0 lg:ml-3">
                <a-tabs type="rounded">
                    <a-tab-pane key="login-log" title="登录日志">
                        <a-timeline class="pl-5 mt-3">
                            <a-timeline-item
                                :label="`地理位置；${item.ip_location}，操作系统：${item.os}`"
                                v-for="(item, idx) in loginLogList"
                                :key="idx"
                            >
                                您于 {{ item.login_time }} 登录系统，{{ item.message }}
                            </a-timeline-item>
                        </a-timeline>
                    </a-tab-pane>
                    <a-tab-pane key="operation-log" title="操作日志">
                        <a-timeline class="pl-5 mt-3">
                            <a-timeline-item
                                :label="`地理位置；${item.ip_location}，方式：${item.method}，路由：${item.router}`"
                                v-for="(item, idx) in operationLogList"
                                :key="idx"
                            >
                                您于 {{ item.created_at }} 执行了 {{ item.service_name }}
                            </a-timeline-item>
                        </a-timeline>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-layout-content>
    </div>
</template>

<script setup>
import { ref } from "vue"
import MaUpload from "@cps/ma-upload/index.vue"
import userInfomation from "./components/userInfo.vue"
import editpassword from "./components/editpassword.vue"
import { useUserStore } from "@/store"
const userStore = useUserStore()
const loginLogList = ref([
    { ip_location: "成都", os: "window10", login_time: "2023-6-6", message: "更新了xxx项目" },
    { ip_location: "成都", os: "window10", login_time: "2023-6-5", message: "更新了xxx项目" }
])
const operationLogList = ref([
    { ip_location: "四川省-成都市", method: "POST", router: "/demo/update", created_at: "2023-06-06 17:05:08",service_name:"问答历史" },
    { ip_location: "四川省-成都市", method: "POST", router: "/demo/update", created_at: "2023-06-06 17:05:08",service_name:"问答历史" },
    { ip_location: "四川省-成都市", method: "POST", router: "/demo/update", created_at: "2023-06-06 17:05:08",service_name:"问答历史" },
])
</script>

<style scoped>
.avatar-box {
    width: 130px;
}
.user-header {
    width: 100%;
    height: 200px;
    background: url("@/assets/userBanner.jpg") no-repeat;
    background-size: cover;
}
</style>
