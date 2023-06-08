import { DEFAULT_LAYOUT } from "../base"

const DASHBOARD = {
    path: "/dashboard",
    name: "dashboard",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        icon: "icon-home",
        order: 0,
        locale: "首页"
    },
    children: [
        {
            path: "workplace",
            name: "Workplace",
            component: () => import("@/views/dashboard/workplace/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "工作台",
                icon: "icon-dashboard"
            }
        },
        {
            path: "usercenter",
            name: "Usercenter",
            component: () => import("@/views/dashboard/usercenter/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "用户中心",
                icon: "icon-user"
            }
        },
        {
            path: "usermanage",
            name: "Usermanage",
            component: () => import("@/views/dashboard/usermanage/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "用户管理",
                icon: "icon-user-group"
            }
        },
    ]
}

export default DASHBOARD
