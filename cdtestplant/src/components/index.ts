// 全局注册内容
import { App } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    GraphicComponent,
} from 'echarts/components'
import Chart from './chart/index.vue'
import Breadcrumb from './breadcrumb/index.vue'

// 手动引入ECharts模块以减小包装尺寸

use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    GraphicComponent,
])

export default {
    install(Vue: App) {
        Vue.component('Chart', Chart)
        Vue.component('Breadcrumb', Breadcrumb)
    },
}
