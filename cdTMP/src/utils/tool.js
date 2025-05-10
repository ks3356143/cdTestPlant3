const typeColor = (type = "default") => {
    let color = ""
    switch (type) {
        case "default":
            color = "#35495E"
            break
        case "primary":
            color = "#3488ff"
            break
        case "success":
            color = "#43B883"
            break
        case "warning":
            color = "#e6a23c"
            break
        case "danger":
            color = "#f56c6c"
            break
        default:
            break
    }
    return color
}

const tool = {}

// 仅仅是在浏览器调试栏打印版本信息
tool.capsule = (title, info, type = "primary") => {
    console.log(
        `%c ${title} %c ${info} %c`,
        "background:#F6455E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
        `background:${typeColor(type)}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
        "background:transparent"
    )
}

// local函数处理localStorage
/**
 * LocalStorage
 */
tool.local = {
    set(table, settings) {
        let _set = JSON.stringify(settings)
        return localStorage.setItem(table, _set)
    },
    get(table) {
        let data = localStorage.getItem(table)
        try {
            data = JSON.parse(data)
        } catch (err) {
            return null
        }
        return data
    },
    remove(table) {
        return localStorage.removeItem(table)
    },
    clear() {
        return localStorage.clear()
    }
}

/**
 * 辅助函数，删除旧属性，生成新属性 crudColumn -> formColumn
 */
const renameKeyInArray = (arr, oldKey, newKey) => {
    return arr.map((obj) => {
        let { [oldKey]: value, ...rest } = obj
        return { ...rest, [newKey]: value }
    })
}

tool.renameKeyInArray = renameKeyInArray

tool.chnRoundNameArray = [
    "首轮",
    "第二轮",
    "第三轮",
    "第四轮",
    "第五轮",
    "第六轮",
    "第七轮",
    "第八轮",
    "第九轮",
    "第十轮",
    "第十一轮",
    "第十二轮",
    "第十三轮",
    "第十四轮",
    "第十五轮",
    "第十六轮"
]

export default tool
