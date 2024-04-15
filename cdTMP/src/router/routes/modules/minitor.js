import { DEFAULT_LAYOUT } from "../base"

const TESTMANAGE = {
    path: "/monitor",
    name: "Monitor",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        icon: "icon-desktop",
        order: 1,
        locale: "监控"
    },
    children: [
        {
            path: "operationLog",
            name: "OperationLog",
            component: () => import("@/views/monitor/operationLog/index.vue"),
            meta: {
                requiresAuth: true,
                roles: ["*"],
                locale: "操作日志",
                icon: "icon-robot"
            }
        }
    ]
}

export default TESTMANAGE
