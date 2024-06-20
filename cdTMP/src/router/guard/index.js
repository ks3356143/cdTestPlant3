import { setRouteEmitter } from "@/utils/route-listener"
import setupUserLoginInfoGuard from "./userLoginInfo"
import setupPermissionGuard from "@/router/guard/permisstion"
// 导入设置title的工具
import { setRouteTitle } from "@/utils/title"

function setupPageGuard(router) {
    router.beforeEach(async (to) => {
        // 发出路由改变的事件
        setRouteEmitter(to)
    })
    // 设置站点document.title
    router.afterEach((to, from) => {
        setRouteTitle(to.meta.title)
    })
}

export default function createRouteGuard(router) {
    setupPageGuard(router)
    setupUserLoginInfoGuard(router)
    setupPermissionGuard(router)
}
