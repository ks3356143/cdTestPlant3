import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const USER: AppRouteRecordRaw = {
    path: '/user',
    name: 'user',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.userAbout',
        requiresAuth: true,
        icon: 'icon-user',
        order: 1,
    },
    children: [
        {
            path: 'manage',
            name: 'manage',
            component: () => import('@/views/userAbout/userManage/index.vue'),
            meta: {
                locale: 'menu.userAbout.manage',
                requiresAuth: true,
                roles: ['admin', 'user'],
            },
        },
        {
            path: 'test',
            name: 'test',
            component: () => import('@/views/userAbout/test/index.vue'),
            meta: {
                locale: 'menu.userAbout.test',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
}

export default USER
