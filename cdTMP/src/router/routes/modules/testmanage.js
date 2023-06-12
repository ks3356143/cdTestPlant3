import { DEFAULT_LAYOUT } from "../base"

const TESTMANAGE = {
    path: "/testmanage",
    name: "Testmanage",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        icon: "icon-apps",
        order: 98,
        locale: "测试管理"
    },
    children: [
        {
            path: "projmanage",
            name: "Projmanage",
            component: () => import("@/views/testmanage/projmanage/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "项目管理",
                icon: "icon-folder"
            }
        }
    ]
}

export default TESTMANAGE
