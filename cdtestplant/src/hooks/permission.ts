import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store'

export default function usePermission() {
    const userStore = useUserStore()
    return {
        // 返回的函数可自定义路由权限
        accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
            return (
                !route.meta?.requiresAuth ||
                !route.meta?.roles ||
                route.meta?.roles?.includes('*') ||
                route.meta?.roles?.includes(userStore.role)
            )
        },
        findFirstPermissionRoute(_routers: any, role = 'admin') {
            const cloneRouters = [..._routers]
            while (cloneRouters.length) {
                const firstElement = cloneRouters.shift()
                if (
                    firstElement?.meta?.roles?.find((el: string[]) => {
                        return el.includes('*') || el.includes(role)
                    })
                )
                    return { name: firstElement.name }
                if (firstElement?.children) {
                    cloneRouters.push(...firstElement.children)
                }
            }
            return null
        },
        // 你可以添加任何规则
    }
}
