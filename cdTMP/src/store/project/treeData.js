import { defineStore } from "pinia"
import projectApi from "@/api/project/project"

const useTreeDataStore = defineStore("treeDataStore", {
    state: () => {
        return {
            treeData: [],
            originTreeData: [],
            currentNode: undefined
        }
    },
    actions: {
        // 不能使用箭头函数，无法绑定this
        async initTreeData(projectId) {
            if (this.treeData.length === 0) {
                const roundData = await projectApi.getRoundInfo(projectId)
                this.treeData = roundData.data
                this.originTreeData = roundData.data
            }
        },
        // 用于新增轮次后显示
        async resetTreeData(projectId) {
            const roundData = await projectApi.getRoundInfo(projectId)
            this.treeData = roundData.data
            this.originTreeData = roundData.data
        },
        setCurrentNode(nodeKey) {
            this.currentNode = nodeKey
        },
        // 获取轮次信息中差中间的是哪几个轮次
        getRoundMiddleInfo() {
            let roundLength = this.treeData.length
            // 取出最后一个key的值
            let lastKey = parseInt(this.treeData[this.treeData.length - 1].key) + 1
            // 遍历数组，找出key最大值
            let key_list = []
            this.treeData.forEach((item) => {
                key_list.push(parseInt(item.key))
            })
            if (roundLength !== lastKey) {
                let cha = lastKey - roundLength
                return lastKey - cha - 1
            } else {
                return roundLength
            }
        }
    }
})

export default useTreeDataStore
