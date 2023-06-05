import { DEFAULT_LAYOUT } from "../base"

const DASHBOARD = {
    path: "/dashboard",
    name: "dashboard",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        icon: "icon-dashboard",
        order: 0,
        locale:"图标展示"
    },
    children: [
        {
            path: "workplace",
            name: "Workplace",
            component: () => import("@/views/dashboard/workplace/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale:"工作台"
            }
        },
    ]
}

export default DASHBOARD
