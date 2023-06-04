import { createRouter, createWebHistory } from "vue-router"
// appRoutes为modules下面的所有路由
import { appRoutes } from "./routes"
// 引入基本重定向路由和notFound路由
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from "./routes/base"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "login"
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/login.vue"),
            meta: {
                requiresAuth: false
            }
        },
        ...appRoutes,
        REDIRECT_MAIN,
        NOT_FOUND_ROUTE
    ],
    scrollBehavior() {
        // 页面跳转后滚动到顶部
        return { top: 0 }
    }
})
export default router
