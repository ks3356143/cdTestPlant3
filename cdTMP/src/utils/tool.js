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

export default tool
