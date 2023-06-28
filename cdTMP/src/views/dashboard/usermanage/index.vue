<template>
    <div class="ma-content-block lg:flex justify-between p-4">
        <div class="lg:w-2/12 w-full h-full p-2 shadow">
            <ma-tree-slider
                v-model="depts"
                searchPlaceholder="用户类型"
                :field-names="{ title: 'label', value: 'value' }"
                @click="switchDept"
            ></ma-tree-slider>
        </div>
        <div class="lg:w-10/12 w-full lg:ml-4 mt-5 lg:mt-0">
            <!-- CRUD组件 -->
            <ma-crud :options="crudOptions" :columns="crudColumns" ref="crudRef">
                <template #status="{ record }">
                    <a-switch
                        :checked-value="1"
                        unchecked-value="2"
                        @change="changeStatus($event, record.id)"
                        :default-checked="record.status == 1"
                    ></a-switch>
                </template>
            </ma-crud>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import MaTreeSlider from "@/components/ma-treeSlider/index.vue"
import userApi from "@/api/system/user"
import user from "@/api/system/user"
import { Message } from "@arco-design/web-vue"
// 切换状态按钮
const changeStatus = (e, id) => {
    console.log("当前值：", e)
    console.log("当前ID：", id)
}
// 树状组件-注意在onMounted中加载数据，不然不显示
const depts = ref([])
onMounted(() => {
    depts.value = [
        {
            id: 15,
            parent_id: 0,
            value: 15,
            label: "成都分部",
            children: [
                {
                    id: 16,
                    parent_id: 15,
                    value: 16,
                    label: "FPGA组"
                },
                {
                    id: 17,
                    parent_id: 15,
                    value: 17,
                    label: "CPU组"
                }
            ]
        },
        {
            id: 1,
            parent_id: 0,
            value: 1,
            label: "上海本部",
            children: [
                {
                    id: 3,
                    parent_id: 1,
                    value: 3,
                    label: "FPGA组",
                    children: [
                        {
                            id: 6,
                            parent_id: 3,
                            value: 6,
                            label: "研发部门"
                        },
                        {
                            id: 7,
                            parent_id: 3,
                            value: 7,
                            label: "市场部门"
                        },
                        {
                            id: 8,
                            parent_id: 3,
                            value: 8,
                            label: "测试部门"
                        },
                        {
                            id: 9,
                            parent_id: 3,
                            value: 9,
                            label: "财务部门"
                        },
                        {
                            id: 10,
                            parent_id: 3,
                            value: 10,
                            label: "运维部门"
                        }
                    ]
                },
                {
                    id: 2,
                    parent_id: 1,
                    value: 2,
                    label: "CPU组",
                    children: [
                        {
                            id: 11,
                            parent_id: 2,
                            value: 11,
                            label: "市场部门",
                            children: [
                                {
                                    id: 13,
                                    parent_id: 11,
                                    value: 13,
                                    label: "外勤"
                                },
                                {
                                    id: 14,
                                    parent_id: 11,
                                    value: 14,
                                    label: "行政"
                                }
                            ]
                        },
                        {
                            id: 12,
                            parent_id: 2,
                            value: 12,
                            label: "财务部门"
                        }
                    ]
                }
            ]
        }
    ]
})
const switchDept = (key) => {
    console.log("选择", key)
}
// crud组件
const crudRef = ref()
const crudOptions = reactive({
    // 顶部每行显示列数
    searchColNumber: 3,
    // 开启分页
    tablePagination: true,
    // 是否显示索引列
    showIndex: false,
    // 行选择器
    rowSelection: {
        showCheckedAll: true
    },
    // 是否显示操作列
    operationColumn: true,
    operationWidth: 200,
    // 设置列表数据API
    api: userApi.getPageList,
    // 设置新增接口-show为true则显示按钮、
    add: {
        show: true,
        api: userApi.save
    },
    edit: {
        show: true,
        api: userApi.update
    },
    delete: {
        show: true,
        api: userApi.delete,
        realApi: user.realDeletes
    },
    recovery: { show: true, api: user.recoverys },
    // 是否开启双击编辑行
    isDbClickEdit: true,
    // 表单布局
    formOption: {
        viewType: "modal"
        // isFull: true
    },
    // 用户点击编辑/删除前的hook
    beforeOpenEdit: (record) => {
        if (record.id === 1) {
            Message.error("创始人不可编辑,请关闭窗口！")
            return false
        }
        return true
    },
    beforeDelete: (ids) => {
        if (ids.includes(1)) {
            Message.error("创始人不可删除")
            return false
        }
        return true
    }
})
const crudColumns = reactive([
    { title: "ID", dataIndex: "id", addDisplay: false, editDisplay: false, width: 50, hide: false },
    {
        title: "名称",
        align: "center",
        dataIndex: "name",
        search: true,
        width: 80,
        commonRules: [{ required: true, message: "名称必填" }]
    },
    { title: "用户名", dataIndex: "username", search: true },
    {
        title: "电话",
        align: "center",
        dataIndex: "phone",
        search: true,
        commonRules: [{ match: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码" }]
    },
    {
        title: "邮箱",
        align: "center",
        dataIndex: "email",
        search: true,
        width: 100,
        commonRules: [{ type: "email", message: "请输入正确的邮箱" }]
    },
    {
        title: "密码",
        dataIndex: "password",
        hide: true,
        autocomplete: "off",
        addDisabled: false,
        editDisabled: true,
        type: "password",
        addRules: [{ required: true, message: "密码必填" }],
        addDefaultValue: "123456",
        editDefaultValue: ""
    },
    {
        title: "状态",
        dataIndex: "status",
        align: "center",
        width: 100,
        search: true,
        formType: "radio",
        dict: { name: "data_status", props: { label: "title", value: "key" } },
        addDefaultValue: "1",
        labelWidth: "86px"
    },
    {
        title: "注册时间",
        dataIndex: "create_datetime",
        align: "center",
        width: 180,
        addDisplay: false,
        editDisplay: false,
        search: true,
        formType: "range"
    }
])
</script>

<style lang="less" scoped></style>
