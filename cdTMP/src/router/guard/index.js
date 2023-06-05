import { setRouteEmitter } from "@/utils/route-listener"
import setupUserLoginInfoGuard from "./userLoginInfo"
import setupPermissionGuard from "@/router/guard/permisstion"

function setupPageGuard(router) {
    router.beforeEach(async (to) => {
        // 发出路由改变的事件
        setRouteEmitter(to)
    })
}

export default function createRouteGuard(router) {
    setupPageGuard(router)
    setupUserLoginInfoGuard(router)
    setupPermissionGuard(router)
}
