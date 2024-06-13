import { ref } from "vue"

/**
 * 该hook传入一个远程数据储存默认值，以及请求远程数据的函数
 */
const useFetchData = (defaultValue = {}, fetDataFunc) => {
    const loadingData = ref(defaultValue) // 远程请求的数据
    const isDataLoading = ref(false)
    // 该hook需要组件里面提供 -> fetchData的函数，返回远程请求数据的东西
    /// 相当于created
    async function fetchOrigin() {
        isDataLoading.value = true
        const res = await fetDataFunc()
        loadingData.value = res.data
        isDataLoading.value = false
    }
    fetchOrigin()
    return {
        loadingData,
        isDataLoading
    }
}
export default useFetchData
