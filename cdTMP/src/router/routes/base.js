import { REDIRECT_ROUTE_NAME } from "@/router/constants"

/**
 * @description: 返回import("@/layout/default-layout.vue")
 * @type: Promise对象
 */
export const DEFAULT_LAYOUT = () => import("@/layout/default-layout.vue")

export const REDIRECT_MAIN = {
    path: "/redirect",
    name: "redirectWrapper",
    component: DEFAULT_LAYOUT, // () => import("@/layout/default-layout.vue")
    meta: {
        requiresAuth: true,
        hideInMenu: true
    },
    children: [
        {
            path: "/redirect/:path",
            name: REDIRECT_ROUTE_NAME, // 'Redirect'
            component: () => import("@/views/redirect/index.vue"),
            meta: {
                requiresAuth: true,
                hideInMenu: true
            }
        }
    ]
}

export const NOT_FOUND_ROUTE = {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("@/views/not-found/index.vue")
}
