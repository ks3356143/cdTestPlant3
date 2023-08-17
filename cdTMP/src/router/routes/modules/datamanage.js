import { DEFAULT_LAYOUT } from "../base"

const DATAMANAGE = {
    path: "/datamanage",
    name: "Datamanage",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        icon: "icon-storage",
        order: 99,
        locale: "数据管理"
    },
    children: [
        {
            path: "dictmanage",
            name: "Dictmanage",
            component: () => import("@/views/datamanage/dictmanage/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "字典管理",
                icon: "icon-book"
            }
        }
    ]
}

export default DATAMANAGE
