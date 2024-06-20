import { createApp } from "vue"
import ArcoVue from "@arco-design/web-vue"
import ArcoVueIcon from "@arco-design/web-vue/es/icon"
import globalComponents from "@/components"
import App from "./App.vue"
import router from "./router"
import pinia from "@/store"
// import directive from './directive'
// arcodesign的样式全局引入
import "@arco-design/web-vue/dist/arco.css"

// 导入全局样式
import "@/style/skin.less"
import "@/style/index.css"
import "@/style/global.less"

// 读取package.json打印个软件名称和版本
import tool from "@/utils/tool"
import packageJson from "../package.json"
// 启动app之前
const app = createApp(App)
app.use(ArcoVue, {})
app.use(ArcoVueIcon)
app.use(router)
app.use(pinia)
app.use(globalComponents)
import directives from "@/directives"
app.use(directives)

// 注册ma-icon图标
const modules = import.meta.glob("./assets/ma-icons/*.vue", { eager: true })
for (const path in modules) {
    const name = path.match(/([A-Za-z0-9_-]+)/g)[2]
    const componentName = `MaIcon${name}`
    app.component(componentName, modules[path].default)
}

// 全局注册变量和工具
app.config.globalProperties.$tool = tool
app.config.globalProperties.$title = import.meta.env.VITE_APP_TITLE
app.config.globalProperties.$url = import.meta.env.VITE_APP_BASE
app.mount("#app")

// 无用的东西：下面就打印一个东西
tool.capsule("TestManagePlant", `v${packageJson.version} debug`)
