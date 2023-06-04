const modelConfig = {
    formItems: [
        {
            field: 'name',
            type: 'input',
            label: '用户名称',
            placeholder: '请输入用户名称',
            rules: [
                { required: true, message: 'name is required' },
                { minLength: 2, message: 'must be greater than 2 characters' },
            ],
            trigger: ['change', 'input'],
        },
        {
            field: 'password',
            type: 'password',
            label: '用户密码',
            placeholder: '请输入密码',
            isHidden: true,
        },
        {
            field: 'status',
            type: 'select',
            label: '启用状态',
            placeholder: '请输入真实姓名',
            options: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
            ],
            rules: [{ required: true, message: '此为必填项' }],
            trigger: ['blur'],
        },
        {
            field: 'updateDate',
            type: 'datepicker',
            label: '更新日期',
            placeholder: '不填为今日',
        },
        {
            field: 'role',
            type: 'select',
            label: '系统角色',
            placeholder: '请输入系统角色',
            options: [
                { label: '管理员', value: 'admin' },
                { label: '用户', value: 'user' },
            ],
            rules: [{ required: true, message: '此为必填项' }],
            trigger: ['blur'],
        },
    ],
    colLayout: { span: 24 },
}
export default modelConfig
