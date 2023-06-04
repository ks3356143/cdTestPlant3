import Mock from 'mockjs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock'

const userListMock = Mock.mock({
    'data|52': [
        {
            'index|+1': 1,
            'name': '@cname',
            'status': '@integer(0,1)',
            'updateDate': '@datetime(yyyy-MM-dd)',
            'cellphone': '18782947123',
            'role': "@pick(['admin','user'])",
        },
    ],
})

// 取get的查询参数，传入url解析出东西
const getParams = (url: any) => {
    const urlp = url.split('?')[1]
    // 解析参数
    const queryStr = new URLSearchParams(urlp)
    const current: any = queryStr.get('current')
    const pageSize: any = queryStr.get('pageSize')
    return [current, pageSize]
}

setupMock({
    setup() {
        Mock.mock(new RegExp('/api/user/list'), (params: any) => {
            const [current, pageSize] = getParams(params.url)
            const fyUerList = userListMock.data.slice((current - 1) * pageSize, current * pageSize)
            return successResponseWrap({ data: [...fyUerList], total: userListMock.data.length })
        })
        Mock.mock(new RegExp('/api/user/delete'), (payload) => {
            // 在mock中删除
            const id = payload.body
            const index = userListMock.data.findIndex((item: any) => item.index === id)
            userListMock.data.splice(index, 1)
            return successResponseWrap({ data: [], msg: '成功' })
        })
        Mock.mock(new RegExp('/api/user/all'), (payload) => {
            const option = JSON.parse(payload.body)
            // 根据name查询
            let newUserList = userListMock.data.filter((item: any) => item.name.includes(option.name))
            if (option.status) {
                newUserList = newUserList.filter((item: any) => item.status === option.status)
            }
            newUserList = newUserList.filter((item: any) => item.cellphone.includes(option.cellphone))
            newUserList = newUserList.filter((item: any) => {
                const updateDate1 = option.updateDate[0]
                const updateDate2 = option.updateDate[1]
                if (item.updateDate < updateDate1) {
                    return false
                }
                if (item.updateDate > updateDate2) {
                    return false
                }
                return true
            })
            newUserList = newUserList.filter((item: any) => item.role.includes(option.role))
            const fyUerList = newUserList.slice(
                (option.current - 1) * option.pageSize,
                option.current * option.pageSize
            )
            return successResponseWrap({ data: [...fyUerList], total: newUserList.length })
        })
    },
})
