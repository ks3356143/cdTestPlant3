import { Ref, ref } from "vue"
import projectApi from "@/api/project/project"
import { useRoute } from "vue-router"
import { useTreeDataStore } from "@/store"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
export default function useNodeClick(expandedKeys: Ref<string[]>) {
    // global
    const route = useRoute()
    const projectInfo = ref({ ...route.query })
    const treeDataStore = useTreeDataStore()
    const { treeData } = storeToRefs(treeDataStore)
    const router = useRouter()
    // variable
    let timerId: number | null = null
    let count = 0
    // refs
    const selectedKeys = ref<any>([]) // 中间变量用于判断
    const previousKey = ref<any>() // 上一次点击
    // 点击事件
    const pointNode = (value, data) => {
        // 获取处理单击不选中，双击选中的变量
        let catch_selected_key = selectedKeys.value
        selectedKeys.value = previousKey.value
        count++
        if (timerId) {
            return
        }
        timerId = setTimeout(async () => {
            if (count > 1) {
                // 双击触发 value是点击的节点，data是节点数据
                if (data.node.level == "0") {
                    projectApi.getDutInfo(projectInfo.value.id, data.node.key, data.node.level).then((res: any) => {
                        ;(treeData.value[value] as any).children = res.data
                        // 添加需要展开数据，注意不要一直push，判断在已展开节点是否包含点击的节点
                        if (!expandedKeys.value.includes(value[0])) {
                            expandedKeys.value.push(value[0])
                        }
                    })
                }
                if (data.node.level == "1") {
                    projectApi.getDemandInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                        data.node.children = res.data
                        if (!expandedKeys.value.includes(value[0])) {
                            expandedKeys.value.push(value[0])
                        }
                    })
                }
                if (data.node.level == "2") {
                    projectApi.getTestInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                        data.node.children = res.data
                        if (!expandedKeys.value.includes(value[0])) {
                            expandedKeys.value.push(value[0])
                        }
                    })
                }
                if (data.node.level == "3") {
                    projectApi.getCaseInfo(projectInfo.value.id, data.node.key, data.node.level).then((res) => {
                        data.node.children = res.data
                        if (!expandedKeys.value.includes(value[0])) {
                            expandedKeys.value.push(value[0])
                        }
                    })
                }
                count = 0
                if (timerId) clearTimeout(timerId)
                timerId = null
            } else {
                // 单击触发
                if (data.node.level === "0") {
                    router.push({ name: "round", query: { ...projectInfo.value, key: data.node.key } })
                }
                if (data.node.level === "1") {
                    router.push({ name: "dut", query: { ...projectInfo.value, key: data.node.key } })
                }
                if (data.node.level === "2") {
                    router.push({ name: "designDemand", query: { ...projectInfo.value, key: data.node.key } })
                }
                if (data.node.level === "3") {
                    router.push({ name: "testDemand", query: { ...projectInfo.value, key: data.node.key } })
                }
                if (data.node.level === "4") {
                    router.push({ name: "case", query: { ...projectInfo.value, key: data.node.key } })
                }
                // if (data.node.level === "5") {
                //     router.push({ name: "problem", query: { ...projectInfo.value, key: data.node.key } })
                // }
                treeDataStore.setCurrentNode(data.node.key)
                // 单击设置选择的key
                selectedKeys.value = catch_selected_key
                // 单击后设置previous选中的key是什么
                previousKey.value = catch_selected_key
                count = 0
                timerId && clearTimeout(timerId)
                timerId = null
            }
        }, 250)
    }
    return {
        selectedKeys,
        pointNode
    }
}
