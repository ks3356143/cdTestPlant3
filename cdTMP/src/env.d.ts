declare module "@arco-design/web-vue/dist/arco-vue-icon"
declare module "vue-virtual-scroller"
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}
