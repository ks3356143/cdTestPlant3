import { ref, computed } from "vue"
import projectApi from "@/api/project/project"
export function useDocTimeShow(projectId: number) {
    const visible = ref<boolean>(false)
    const handleModalVisible = (): void => {
        visible.value = true
    }
    // 获取时间模块
    const timeTemp = ref<any[]>([])
    const getTimeByBackend = async () => {
        const res = await projectApi.getDocumentTimeShow(projectId)
        timeTemp.value = res.data
    }
    getTimeByBackend()
    const timeList = computed(() => {
        timeTemp.value.forEach((item) => {
            // 遍历所有属性，对值格式进行处理
            Object.keys(item).forEach((key) => {
                if (Array.isArray(item[key])) {
                    item[key] = item[key].join("~")
                } else {
                    if (item[key].includes("年")) {
                        item[key] = item[key].replace('年','').replace('月','').replace('日','')
                    }
                }
            })
        })
        return timeTemp.value
    })
    return {
        visible,
        handleModalVisible,
        timeList
    }
}
