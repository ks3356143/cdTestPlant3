import localeMessageBox from '@/components/message-box/locale/zh-CN'
import localeLogin from '@/views/login/locale/zh-CN'

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN'
import localeUserManage from '@/views/userAbout/userManage/locale/zh-CN'

import localeSettings from './zh-CN/settings'

export default {
    'menu.dashboard': '仪表盘',
    // 框架外添加
    'menu.userAbout': '用户相关',
    'menu.userAbout.manage': '用户管理',
    'menu.userAbout.test': '测试页面',
    // ~~~~~
    'menu.dashboard.monitor': '整体概况',
    'menu.server.dashboard': '仪表盘-服务端',
    'menu.server.workplace': '工作台-服务端',
    'menu.server.monitor': '实时监控-服务端',
    'menu.list': '列表页',
    'menu.result': '结果页',
    'menu.exception': '异常页',
    'menu.form': '表单页',
    'menu.profile': '详情页',
    'menu.visualization': '数据可视化',
    'menu.user': '个人中心',
    // 'menu.arcoWebsite': 'Arco Design',
    // 'menu.faq': '常见问题',
    'navbar.docs': '文档中心',
    'navbar.action.locale': '切换为中文',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localeWorkplace,
    // add
    ...localeUserManage,
}
