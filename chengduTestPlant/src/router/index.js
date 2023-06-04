import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import { useUserStore } from "@/store"
import NProgress from "nprogress"
import tool from "@/utils/tool"
import "nprogress/nprogress.css"

import routes from "./webRouter.js"

const title = import.meta.env.VITE_APP_TITLE
const defaultRoutePath = "/"
const whiteRoute = ["login", "mineDoc", "interfaceList", "interfaceCode", "signature"]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    let toTitle = to.meta.title ? to.meta.title : to.name
    document.title = `${toTitle} - ${title}`
    const token = tool.local.get(import.meta.env.VITE_APP_TOKEN_PREFIX)

    // 登录状态下
    if (token) {
        // 如果访问的是login直接跳转'/'
        if (to.name === "login") {
            next({ path: defaultRoutePath })
            return
        }
        // 如果没有pinia/userStore.user数据且不是undefined，则获取data然后跳转
        if (!userStore.user && userStore.user == undefined) {
            const data = await userStore.requestUserInfo()
            data && next({ path: to.path, query: to.query })
        } else {
            next()
        }
    } else {
        // 如果没有token，则看访问路径是否在白名单，如果在白名单则跳转访问，如果不在白名单跳转login页面
        if (!whiteRoute.includes(to.name)) {
            next({ name: "login", query: { redirect: to.fullPath } })
        } else {
            next()
        }
    }
})

router.afterEach((to, from) => {
    NProgress.done()
})

router.onError((error) => {
    console.log(error)
    NProgress.done()
})

export default router
