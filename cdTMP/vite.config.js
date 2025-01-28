import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import vueJsx from "@vitejs/plugin-vue-jsx"
import { visualizer } from "rollup-plugin-visualizer"

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd())
    console.log("当前环境为：", mode)
    const proxyPrefix = env.VITE_APP_PROXY_PREFIX
    return defineConfig({
        base: env.VITE_APP_BASE,
        plugins: [
            vue(),
            vueJsx(),
            visualizer({
                open: true,
                filename: "visualizer.html" // 分析图生成的文件名
            })
        ],
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
                "@cps": resolve(__dirname, "src/components"),
                "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
                vue: "vue/dist/vue.esm-bundler.js"
            }
        },
        define: {
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
        },
        build: {
            chunkSizeWarningLimit: 3000,
            // assetsPublicPath: "./"
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.includes("tinymce")) return "tinymce"
                        return null
                    }
                }
            }
        },
        server: {
            host: "0.0.0.0",
            port: env.VITE_APP_PORT || process.env.port,
            proxy: {
                [proxyPrefix]: {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    ws: true,
                    toProxy: true,
                    rewrite: (path) => path.replace(new RegExp(`^${proxyPrefix}`), "")
                }
            }
        }
    })
}
