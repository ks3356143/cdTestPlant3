<template>
    <div class="userManage">
        <Breadcrumb :items="['menu.userAbout', 'menu.userAbout.manage']"></Breadcrumb>
        <a-card :title="$t('menu.userAbout.manage')">
            <a-row>
                <a-col :flex="1">
                    <a-form
                        :model="formModel"
                        :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }"
                        label-align="left"
                    >
                        <a-row :gutter="16">
                            <a-col :span="8">
                                <a-form-item field="name" :label="$t('searchTable.form.name')">
                                    <a-input
                                        v-model="formModel.name"
                                        allow-clear
                                        :placeholder="$t('searchTable.form.name.placeholder')"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="status" :label="$t('searchTable.form.status')">
                                    <a-select
                                        v-model="formModel.status"
                                        allow-clear
                                        :options="statusOptions"
                                        :placeholder="$t('searchTable.form.status.placeholder')"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="updateDate" :label="$t('searchTable.form.date')">
                                    <a-range-picker v-model="formModel.updateDate" style="width: 100%" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="name" :label="$t('searchTable.form.cellphone')">
                                    <a-input
                                        v-model="formModel.cellphone"
                                        allow-clear
                                        :placeholder="$t('searchTable.form.cellphone.placeholder')"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="role" :label="$t('searchTable.form.role')">
                                    <a-select
                                        v-model="formModel.role"
                                        allow-clear
                                        :placeholder="$t('searchTable.form.role.placeholder')"
                                        ><a-option label="管理员" value="admin"></a-option>
                                        <a-option label="用户" value="user"></a-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
                <a-divider style="height: 84px" direction="vertical" />
                <a-col :flex="'86px'" style="text-align: right">
                    <a-space direction="vertical" :size="18">
                        <a-button type="primary" @click="handleSearBtn">
                            <template #icon>
                                <icon-search />
                            </template>
                            {{ $t('searchTable.form.search') }}
                        </a-button>
                        <a-button @click="handleResetBtn">
                            <template #icon>
                                <icon-refresh />
                            </template>
                            {{ $t('searchTable.form.reset') }}
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-row style="margin-bottom: 8px">
                <a-col :span="24" class="buttonRight">
                    <a-space>
                        <a-button type="primary" @click="handleCreateBtn">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('searchTable.operation.create') }}
                        </a-button>
                        <a-button type="dashed">
                            <template #icon>
                                <icon-minus />
                            </template>
                            {{ $t('searchTable.operation.delete') }}
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-table
                ellipsis
                row-key="id"
                :loading="loading"
                :pagination="false"
                :columns="(columns as any)"
                :data="renderData"
                :bordered="true"
                size="medium"
            >
                <template #status="row">
                    <a-button v-if="row.record.status" size="mini" type="outline" status="success">已启用</a-button>
                    <a-button v-else size="mini" type="outline" status="danger">未启用</a-button>
                </template>
                <template #operations="row">
                    <a-space>
                        <a-button
                            v-permission="['admin', 'user']"
                            type="primary"
                            size="mini"
                            @click="handleEditRowBtn(row.record)"
                        >
                            编辑
                        </a-button>
                        <a-button
                            v-permission="['admin']"
                            type="outline"
                            status="danger"
                            size="mini"
                            @click="handleDeleteRowBtn(row.record)"
                        >
                            删除
                        </a-button>
                    </a-space>
                </template>
            </a-table>
            <a-row style="margin-top: 8px" class="buttonRight"
                ><a-pagination
                    v-model:current="current"
                    v-model:page-size="pageSize"
                    :total="total"
                    style="float: right"
                    show-page-size
                    show-total
                    show-jumper
                    @change="handleChangePage"
                    @page-size-change="handleChangeSize"
                ></a-pagination
            ></a-row>
        </a-card>
        <!-- 弹窗组件 -->
        <page-modal
            ref="pageModelRef"
            title="新建用户"
            :model-config="modelConfig"
            :default-info="defaultInfo"
        ></page-modal>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import useLoading from '@/hooks/loading'
    import { getUserList, deleteUserList, getUserListAll } from '@/api/userAbout'
    import { Message } from '@arco-design/web-vue'
    import pageModal from '@/components/page-modal/page-modal.vue'
    import modelConfig from './config/modelConfig'
    // 导入a-table列数据
    import columns from './config/columns'
    // 定义page-modal的ref调用
    const pageModelRef = ref<InstanceType<typeof pageModal>>()
    // 定义a-form的v-model数据
    const generateFormModel = () => {
        return {
            name: '',
            status: '',
            password: '',
            updateDate: [],
            cellphone: '',
            role: '',
        }
    }
    const statusOptions: any[] = [
        { label: '已启用', value: 1 },
        { label: '未启用', value: 0 },
    ]
    const formModel = ref(generateFormModel())
    // 定义a-table数据
    /// 请求的表格数据
    const renderData: any = ref([])
    // 请求pagination数据查询数据
    const total = ref<number>(0)
    const pageSize = ref<number>(10)
    const current = ref<number>(1)

    // 请求用户列表数据函数
    const { loading, setLoading } = useLoading(true)
    const fetchUserListData = async (params: any = {}) => {
        setLoading(true)
        try {
            const data = await getUserList(params)
            renderData.value = data.data.data
            total.value = data.data.total
            Message.success('请求数据成功')
        } catch (err) {
            Message.error('请求失败，请检测网络')
        } finally {
            setLoading(false)
        }
    }
    fetchUserListData({ current: current.value, pageSize: pageSize.value })

    // a-pagination分页页面变换处理、a-pagination单页显示大小函数
    const handleChangePage = (currentPage: number) => {
        fetchUserListData({ current: currentPage, pageSize: pageSize.value })
    }
    const handleChangeSize = (size: number) => {
        fetchUserListData({ current: current.value, pageSize: size })
    }
    // 处理搜索按钮函数
    const fetchUserListAll = async (params: any) => {
        setLoading(true)
        try {
            const data = await getUserListAll(params)
            renderData.value = data.data.data
            total.value = data.data.total
            Message.success('数据请求成功')
        } catch (err) {
            Message.error('请求失败')
        } finally {
            setLoading(false)
        }
    }
    const handleSearBtn = () => {
        // 组装queryInfo
        const queryInfo = { ...formModel.value, current: current.value, pageSize: pageSize.value }
        fetchUserListAll(queryInfo)
    }
    // 处理重置按钮函数
    const handleResetBtn = () => {
        formModel.value = generateFormModel()
    }
    // 点击新建按钮
    const defaultInfo = ref({})
    const handleCreateBtn = () => {
        if (pageModelRef.value) {
            pageModelRef.value.dialogVisible = true
        }
        defaultInfo.value = {}
    }
    // 用户编辑行按钮
    const handleEditRowBtn = (item: any) => {
        if (pageModelRef.value) {
            pageModelRef.value.dialogVisible = true
        }
        defaultInfo.value = { ...item }
    }
    // 用户删除行按钮
    const fetchDeleteUserList = async (params: any) => {
        setLoading(true)
        try {
            await deleteUserList(params)
            // 再去请求一次
            fetchUserListData({ current: current.value, pageSize: pageSize.value })
            Message.success('删除成功')
        } catch (err) {
            Message.error('删除失败')
        } finally {
            setLoading(false)
        }
    }
    const handleDeleteRowBtn = (item: any) => {
        fetchDeleteUserList(item.index)
    }
</script>

<style scoped>
    .userManage {
        padding: 0 15px 15px 15px;
    }
    .buttonRight {
        display: flex;
        justify-content: end;
    }
</style>
