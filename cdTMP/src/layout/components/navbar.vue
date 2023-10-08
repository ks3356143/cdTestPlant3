<template>
    <div class="navbar">
        <div class="left-side">
            <a-space>
                <img src="@/assets/img/wxwx-logo.svg" class="logo" alt="logo" @click="handleClickLogo" />
                <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5">
                    成都测试管理平台
                </a-typography-title>
                <icon-menu-fold
                    v-if="!topMenu && appStore.device === 'mobile'"
                    style="font-size: 22px; cursor: pointer"
                    @click="toggleDrawerMenu"
                />
            </a-space>
        </div>
        <div class="center-side flex items-center justify-center">
            <template v-if="title"> 项目名称：{{ title }} </template>
            <Menu v-if="topMenu"></Menu>
        </div>
        <ul class="right-side">
            <li>
                <a-tooltip content="搜索-暂无">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="testCreate">
                        <template #icon>
                            <icon-search />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip content="语言-暂无">
                    <a-button class="nav-btn" type="outline" :shape="'circle'">
                        <template #icon>
                            <icon-language />
                        </template>
                    </a-button>
                </a-tooltip>
                <!-- 这里有个下拉列表 -->
            </li>
            <li>
                <a-tooltip content="切换主题-暂无">
                    <a-button class="nav-btn" type="outline" :shape="'circle'">
                        <template #icon>
                            <icon-moon-fill />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip :content="isFullscreen ? '退出全屏' : '进入全屏'">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
                        <template #icon>
                            <icon-fullscreen-exit v-if="isFullscreen" />
                            <icon-fullscreen v-else />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip content="设置">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
                        <template #icon>
                            <icon-settings />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-dropdown trigger="click">
                    <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
                        <img alt="avatar" src="@/assets/img/avatar.jpg" />
                    </a-avatar>
                    <template #content>
                        <a-doption>
                            <a-space @click="switchRoles">
                                <icon-tag />
                                <span> 切换角色 </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="$router.push({ name: 'Usercenter' })">
                                <icon-user />
                                <span> 用户中心 </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="$router.push({ name: 'Usercenter' })">
                                <icon-settings />
                                <span> 用户设置 </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="handleLogout">
                                <icon-export />
                                <span> 退出登录 </span>
                            </a-space>
                        </a-doption>
                    </template>
                </a-dropdown>
            </li>
        </ul>
    </div>
</template>

<script setup>
// 测试接口导入
import dgGenerateApi from "@/api/generate/dgGenerate"
// ~~~~~~~~~
import { computed, inject } from "vue"
import { useAppStore } from "@/store"
import { useFullscreen } from "@vueuse/core"
// 这个hook就是退出登录跳转的
import useUser from "@/hooks/logout"
import { Message } from "@arco-design/web-vue"
import Menu from "@/layout/components/menu.vue"
import { useRouter } from "vue-router"
const router = useRouter()
const appStore = useAppStore()
// title管理-默认在后台
const props = defineProps({
    title: {
        type: String,
        default: ""
    }
})
// 是否menu在顶部-暂时不用
const topMenu = computed(() => appStore.topMenu && appStore.menu)
// 全屏设置,使用了@vueuse/core
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen()
// appStore里面设置
const setVisible = () => {
    console.log("在appStore里面设置全局{ globalSettings: true }，暂无做")
    appStore.updateSettings({ globalSettings: true })
}
// 右上角下拉
const setDropDownVisible = () => {
    const event = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true
    })
    triggerBtn.value.dispatchEvent(event)
}
/// 切换角色
const switchRoles = async () => {
    Message.success("模拟切换角色")
}
/// 退出登录
const { logout } = useUser()
const handleLogout = () => {
    logout()
}
// 注入事件
const toggleDrawerMenu = inject("toggleDrawerMenu")
// 点击图标返回首页
const handleClickLogo = () => {
    console.log("回到workplace")
    router.push({ name: "Workplace" })
}

// 测试生成文档-测试项和方法
const testCreate = async ()=>{
    const st = await dgGenerateApi.createTestDemand()
    Message.success(st.message)
}

</script>

<style scoped lang="less">
.logo {
    width: 35px;
    height: 35px;
    cursor: pointer;
}

.navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}

.left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.center-side {
    flex: 1;
}

.right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
        border-radius: 20px;
    }
    li {
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    a {
        color: var(--color-text-1);
        text-decoration: none;
    }
    .nav-btn {
        border-color: rgb(var(--gray-2));
        color: rgb(var(--gray-8));
        font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
        position: absolute;
        bottom: 14px;
    }
    .trigger-btn {
        margin-left: 14px;
    }
}
</style>

<style lang="less">
.message-popover {
    .arco-popover-content {
        margin-top: 0;
    }
}
</style>
