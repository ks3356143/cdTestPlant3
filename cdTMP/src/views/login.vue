<template>
    <div id="background" class="fixed"></div>
    <div class="bg-backdrop-layout"></div>
    <div class="login-container">
        <div class="login-width md:w-10/12 mx-auto flex justify-between h-full items-center">
            <div class="w-6/12 mx-auto left-panel rounded-l pl-5 pr-5 hidden md:block">
                <div class="logo">
                    <img src="@/assets/img/wxwx-logo.svg" width="45" /><span>{{ $title }}</span>
                </div>
                <div class="slogan flex justify-end">
                    <span>---- 为测评服务，打造测评高地</span>
                </div>
            </div>

            <div class="md:w-6/12 w-11/12 md:rounded-r mx-auto pl-5 pr-5 pb-10">
                <h2 class="mt-10 text-3xl pb-0 mb-10">登录</h2>
                <a-form :model="form" @submit="handleSubmit">
                    <a-form-item
                        field="username"
                        :hide-label="true"
                        :rules="[{ required: true, message: '用户名不能为空' }]"
                    >
                        <a-input v-model="form.username" class="w-full" size="large" placeholder="用户名" allow-clear>
                            <template #prefix><icon-user /></template>
                        </a-input>
                    </a-form-item>

                    <a-form-item
                        field="password"
                        :hide-label="true"
                        :rules="[{ required: true, message: '密码不能为空' }]"
                    >
                        <a-input-password v-model="form.password" placeholder="请输入密码" size="large" allow-clear>
                            <template #prefix><icon-lock /></template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item
                        field="code"
                        :hide-label="true"
                        :rules="[
                            {
                                required: true,
                                match: /^[a-zA-Z0-9]{4}$/,
                                message: '验证码不符合要求'
                            }
                        ]"
                    >
                        <a-input v-model="form.code" placeholder="请输入验证码" size="large" allow-clear>
                            <template #prefix><icon-safe /></template>
                            <template #append>
                                <verify-code ref="Verify" />
                            </template>
                        </a-input>
                    </a-form-item>

                    <a-form-item :hide-label="true" class="mt-5">
                        <a-button html-type="submit" type="primary" long size="large" :loading="loading">
                            登录
                        </a-button>
                    </a-form-item>

                    <a-divider orientation="center">未来登录方式</a-divider>
                    <div class="flex w-3/4 pt-2 mx-auto items-stretch justify-around">
                        <a-avatar class="other-login wechat"><icon-wechat /></a-avatar>
                        <a-avatar class="other-login alipay"><icon-alipay-circle /></a-avatar>
                        <a-avatar class="other-login qq"><icon-qq /></a-avatar>
                        <a-avatar class="other-login weibo"><icon-weibo /></a-avatar>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import verifyCode from "@cps/ma-verifyCode/index.vue"
import { useUserStore } from "@/store"
import { useRouter, useRoute } from "vue-router"
import userApi from "@/api/system/user"
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
// 绑定登录form的数据
// const form = reactive({ username: "superAdmin", password: "admin123", code: "" })
const form = reactive({ username: "", password: "", code: "" })
// 获取验证码dom && arco表单loading
const Verify = ref(null)
const loading = ref(null)
// 点击登录按钮
const errorMessage = ref("")
const handleSubmit = async ({ values, errors }) => {
    if (loading.value) {
        return
    }
    loading.value = true
    if (Verify.value.checkResult(form.code) && !errors) {
        // 登录逻辑需要用到userStore
        try {
            const login_res = await userStore.login(form)
            if (login_res) {
                const { redirect, ...otherQuery } = router.currentRoute.value.query
                router.push({
                    name: redirect || "Workplace",
                    query: {
                        ...otherQuery // 将退出时的查询参数放入，这样就不会错误
                    }
                })
                // 暂时加载LDAP数据
                await userApi.loadLDAPUsers()
            } else {
                return
            }
        } catch (err) {
            errorMessage.value = err.message
        } finally {
            loading.value = false
        }
    }
    loading.value = false
}
</script>

<style lang="less" scoped>
#background {
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: url("@/assets/BingWallpaper.jpg");
}
.bg-backdrop-layout {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 2;
    backdrop-filter: blur(0.01px); // 给背景图模糊
}
.login-container {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: cover;
    z-index: 3;
    .login-width {
        max-width: 950px;
        background: #fff;
        padding: 10px;
        height: 500px;
        position: relative;
        top: 50%;
        margin-top: -255px;
        border-radius: 2px;
    }

    .left-panel {
        height: 491px;
        background-image: url(@/assets/login_picture.svg);
        background-repeat: no-repeat;
        background-position: center 60px;
        background-size: contain;
    }

    .logo {
        display: flex;
        margin-top: 20px;
        color: #333;
        span {
            font-size: 28px;
            margin-left: 15px;
            color: rgb(var(--primary-6));
        }
    }
    .slogan {
        font-size: 16px;
        line-height: 50px;
    }

    :deep(.arco-input-append) {
        padding: 0 !important;
    }

    .other-login {
        cursor: pointer;
    }

    .qq:hover,
    .alipay:hover {
        background: #165dff;
    }
    .wechat:hover {
        background: #0f9c02;
    }

    .weibo:hover {
        background: #f3ce2b;
    }
}
</style>
