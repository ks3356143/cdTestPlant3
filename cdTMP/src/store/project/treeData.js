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
            // 获取localStorage的treeData数据
            if(localStorage.getItem("tree_local_data")){
                this.treeData = JSON.parse(localStorage.getItem("tree_local_data"))
            }
            if (this.treeData.length === 0) {
                const roundData = await projectApi.getRoundInfo(projectId)
                this.treeData = roundData.data
                this.originTreeData = roundData.data
            }
            // 将用户关闭页面数据储存于localStorage中 -> 注意用户打开其他项目 -> 务必清除localStorage的tree_local_data数据
            // 暂定在点击进入工作台时清除!!!
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem("tree_local_data",JSON.stringify(this.treeData))
            })
        },
        // 用于新增轮次后显示
        async resetTreeData(projectId) {
            const roundData = await projectApi.getRoundInfo(projectId)
            this.treeData = roundData.data
            this.originTreeData = roundData.data
        },
        // 新增删除dut后更新树状显示
        async updateDutTreeData(data, projrctId) {
            let temp = data.key.split("-")
            temp.pop(-1)
            let roundKey = temp[0]
            const nodeKey = temp.join("-")
            const res = await projectApi.getDutInfo(projrctId, nodeKey, "0")
            this.treeData[roundKey].children = res.data
        },
        // 新增删除designDemand后tree显示
        async updateDesignDemandTreeData(data, projrctId) {
            let temp = data.key.split("-")
            temp.pop(-1)
            let roundKey = temp[0]
            let dutKey = temp[1]
            const nodeKey = temp.join("-")
            const res = await projectApi.getDemandInfo(projrctId, nodeKey, "1")
            this.treeData[roundKey].children[dutKey].children = res.data
        },
        // 新增删除testDemand后tree显示
        async updateTestDemandTreeData(data, projrctId) {
            let temp = data.key.split("-")
            temp.pop(-1)
            let roundKey = temp[0]
            let dutKey = temp[1]
            let designKey = temp[2]
            const nodeKey = temp.join("-")
            const res = await projectApi.getTestInfo(projrctId, nodeKey, "2")
            this.treeData[roundKey].children[dutKey].children[designKey].children = res.data
        },
        // 新增删除case后tree显示
        async updateCaseTreeData(data, projrctId) {
            let temp = data.key.split("-")
            temp.pop(-1)
            let roundKey = temp[0]
            let dutKey = temp[1]
            let designKey = temp[2]
            let testKey = temp[3]
            const nodeKey = temp.join("-")
            const res = await projectApi.getCaseInfo(projrctId, nodeKey, "3")
            this.treeData[roundKey].children[dutKey].children[designKey].children[testKey].children = res.data
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
        },
        // 输出当前树状结构可展开的节点
        outExpandNode() {
            // 定义递归函数
            const res = []
            function digui(data) {
                if (Object.prototype.toString.call(data) === "[object Array]") {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].children) {
                            res.push(data[i].key)
                            digui(data[i].children)
                        }
                    }
                }
            }
            this.treeData.forEach((item) => {
                if (item.children) {
                    res.push(item.key)
                    digui(item.children)
                }
            })
            return res
        }
    }
})

export default useTreeDataStore
