import NProgress from "nprogress" // progress bar
import { useUserStore } from "@/store"
// userInfo守卫
export default function setupUserLoginInfoGuard(router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start()
        const userStore = useUserStore()
        if (userStore.isLogin()) {
            if (userStore.role) {
                next()
            } else {
                try {
                    await userStore.info()
                    next()
                } catch (error) {
                    await userStore.logout()
                    next({
                        name: "login",
                        query: {
                            redirect: to.name,
                            ...to.query
                        }
                    })
                }
            }
        } else {
            if (to.name === "login") {
                next()
                return
            }
            next({
                name: "login",
                query: {
                    redirect: to.name,
                    ...to.query
                }
            })
        }
    })
}
