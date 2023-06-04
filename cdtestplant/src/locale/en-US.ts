import localeMessageBox from '@/components/message-box/locale/en-US'
import localeLogin from '@/views/login/locale/en-US'

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US'
import localeUserManage from '@/views/userAbout/userManage/locale/en-US'
import localeSettings from './en-US/settings'

export default {
    'menu.dashboard': 'Dashboard',
    // 开发者添加
    'menu.userAbout': 'userAbout',
    'menu.userAbout.manage': 'userManage',
    'menu.dashboard.monitor': 'theHoleState',
    'menu.server.dashboard': 'Dashboard-Server',
    'menu.server.workplace': 'Workplace-Server',
    'menu.server.monitor': 'Monitor-Server',
    'menu.list': 'List',
    'menu.result': 'Result',
    'menu.exception': 'Exception',
    'menu.form': 'Form',
    'menu.profile': 'Profile',
    'menu.visualization': 'Data Visualization',
    'menu.user': 'User Center',
    // 'menu.arcoWebsite': 'Arco Design',
    // 'menu.faq': 'FAQ',
    'navbar.docs': 'Docs',
    'navbar.action.locale': 'Switch to English',
    ...localeSettings,
    ...localeMessageBox,
    ...localeLogin,
    ...localeWorkplace,
    // ADD
    ...localeUserManage,
}
