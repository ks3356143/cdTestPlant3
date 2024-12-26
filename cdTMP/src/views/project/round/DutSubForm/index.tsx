import { defineComponent, inject, ref } from "vue"
import { TreeNodeData } from "@arco-design/web-vue"
import { useRoute } from "vue-router"
import { Message } from "@arco-design/web-vue"
import { useTreeDataStore } from "@/store"
import dutAPI from "@/api/project/dut"
import useOptions from "./useOptions"
import MaForm from "@/components/ma-form/index.vue"

const DutSubForm = defineComponent({
    name: "DutSubForm",
    setup(props, { expose }) {
        // globals
        const route = useRoute()
        const project_id = route.query.id
        const treeDataStore = useTreeDataStore()
        const rightViewRef = inject("rightViewRef")
        // refs
        const visible = ref(false)
        const formRef = ref<InstanceType<typeof MaForm> | null>(null)
        const formData = ref<any>({})
        // hooks
        const { options, columnOptions } = useOptions(formRef)
        // 标题
        const title = ref("被测件详情")
        // 双击打开回调
        const open = async (nodeData: TreeNodeData) => {
            // 请求数据
            try {
                const key = nodeData.key
                // 设置表单名称
                title.value = nodeData.title!
                const res = await dutAPI.getDutOne({ project_id, key })
                // 更新表单
                formData.value = res.data
                formData.value.round = key
                visible.value = true
            } catch (e) {
                visible.value = false
            }
        }
        // 异步确认按钮点击
        const handleBeforeOk = async () => {
            const isValidated = await formRef.value!.validateForm()
            if (isValidated) {
                // 失败
                return false
            } else {
                // 成功
                const res = await dutAPI.update(formData.value.id, { project_id, ...formData.value })
                treeDataStore.updateDutTreeData(res.data, project_id) // 刷新树节点信息
                !(rightViewRef as any).value.refresh()
                Message.success("修改成功")
            }
        }
        // out use
        expose({ open })

        // Dom
        return () => (
            <a-modal
                v-model:visible={visible.value}
                width={"40%"}
                draggable
                unmount-on-close
                ok-text="保存"
                cancel-text="关闭"
                on-before-ok={handleBeforeOk}
            >
                {{
                    title: () => <span>[被测件]-{title.value}</span>,
                    default: () => (
                        <ma-form
                            ref={formRef}
                            v-model={formData.value}
                            options={options.value}
                            columns={columnOptions.value}
                        >
                            {{
                                "inputPrepend-version": () => <span>V</span>
                            }}
                        </ma-form>
                    )
                }}
            </a-modal>
        )
    }
})

export default DutSubForm
// 组件类型导出
type DutSubFormOrigin = InstanceType<typeof DutSubForm>
export interface DutSubFormInstance extends DutSubFormOrigin {
    open(nodeData: TreeNodeData): void
}
