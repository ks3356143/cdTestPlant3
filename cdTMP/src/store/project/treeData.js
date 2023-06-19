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
                this.treeData = roundData
                this.originTreeData = roundData
            }
        },
        setCurrentNode(nodeKey) {
            this.currentNode = nodeKey
        }
    }
})

export default useTreeDataStore
