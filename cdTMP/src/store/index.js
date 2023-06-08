import { createPinia } from "pinia"
import useUserStore from "./modules/user"
import useAppStore from "./modules/app"
import useTabBarStore from "./modules/tab-bar"
// ma组件新增
import useFormStore from "./modules/form"
import useKeepAliveStore from "./modules/keepAlive"
import useTagStore from "./modules/tag"

const pinia = createPinia()

export { useUserStore, useAppStore, useTabBarStore, useFormStore, useKeepAliveStore, useTagStore }
export default pinia
