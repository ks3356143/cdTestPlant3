import { computed } from 'vue'
// a-table列的配置信息
const columns = computed(() => [
    {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
    },
    {
        title: '用户名称',
        dataIndex: 'name',
        align: 'center',
    },
    {
        title: '启用状态',
        dataIndex: 'status',
        align: 'center',
        slotName: 'status',
    },
    {
        title: '更新时间',
        dataIndex: 'updateDate',
        slotName: 'updateDate',
    },
    {
        title: '电话号码',
        dataIndex: 'cellphone',
    },
    {
        title: '系统角色',
        dataIndex: 'role',
        slotName: 'role',
    },
    {
        title: '操作',
        dataIndex: 'operations',
        slotName: 'operations',
        align: 'center',
    },
])

export default columns
