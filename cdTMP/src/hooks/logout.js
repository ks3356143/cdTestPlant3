import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

import { useUserStore } from '@/store'

export default function useUser() {
    const router = useRouter()
    const userStore = useUserStore()
    const logout = async (logoutTo) => {
        await userStore.logout()
        const currentRoute = router.currentRoute.value
        Message.success('登出成功')
        document.body.setAttribute("arco-theme", "light")
        router.push({
            name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
            query: {
                ...router.currentRoute.value.query,
                redirect: currentRoute.name,
            },
        })
    }
    return {
        logout,
    }
}
