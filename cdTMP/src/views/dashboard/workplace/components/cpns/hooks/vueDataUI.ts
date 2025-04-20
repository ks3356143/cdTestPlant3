import { Ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useAppStore } from "@/store"

// 单个每月项目数量对象格式
interface IData {
    mouth: string
    count: number
}
// 响应.data的数据格式
interface ResData {
    data: IData[]
}

function useVueDataUI(data: Ref<ResData>) {
    const appStore = useAppStore()
    const { theme } = storeToRefs(appStore)
    // 结构pinia储存的主体响应式变量
    const initialData = [
        {
            name: "项目数量",
            series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: "line",
            color: "rgb(95,139,238)",
            scaleSteps: 10,
            suffix: "个",
            smooth: true
        }
    ]
    const chartData = computed<any[]>(() => {
        if (data.value) {
            const countData = data.value.data.map((it) => it.count)
            initialData[0].series = countData
        }
        return initialData
    })
    // 暗黑模式识别(这是存在pinia的)
    const darkMode = document.body.getAttribute("arco-theme")
    const initialConfig = {
        theme: darkMode === "dark" ? "celebrationNight" : "",
        responsive: false,
        customPalette: [],
        downsample: { threshold: 500 },
        chart: {
            fontFamily: "inherit",
            backgroundColor: "#FFFFFFff",
            color: "#1A1A1Aff",
            height: 300,
            width: 1200,
            padding: { top: 36, right: 24, bottom: 48, left: 48 },
            highlighter: { color: "#1A1A1Aff", opacity: 5, useLine: false, lineDasharray: 2, lineWidth: 1 },
            grid: {
                stroke: "#e1e5e8ff",
                showVerticalLines: false,
                showHorizontalLines: false,
                position: "middle",
                frame: {
                    show: false,
                    stroke: "#E1E5E8ff",
                    strokeWidth: 2,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: 0
                },
                labels: {
                    show: true,
                    color: "#1A1A1Aff",
                    fontSize: 12,
                    axis: { yLabel: "", yLabelOffsetX: 0, xLabel: "", xLabelOffsetY: 14, fontSize: 12 },
                    zeroLine: { show: true },
                    xAxis: { showBaseline: true },
                    yAxis: {
                        showBaseline: true,
                        commonScaleSteps: 1,
                        useIndividualScale: false,
                        stacked: false,
                        gap: 12,
                        labelWidth: 40,
                        formatter: null,
                        scaleMin: 0,
                        scaleMax: 20
                    },
                    xAxisLabels: {
                        color: "#1A1A1Aff",
                        show: true,
                        values: [
                            "一月",
                            "二月",
                            "三月",
                            "四月",
                            "五月",
                            "六月",
                            "七月",
                            "八月",
                            "九月",
                            "十月",
                            "十一月",
                            "十二月"
                        ],
                        fontSize: 12,
                        showOnlyFirstAndLast: false,
                        showOnlyAtModulo: false,
                        modulo: 12,
                        yOffset: 8,
                        rotation: 0
                    }
                }
            },
            comments: { show: true, showInTooltip: true, width: 200, offsetX: 0, offsetY: 0 },
            labels: { fontSize: 10, prefix: "", suffix: "" },
            legend: { color: "#1A1A1Aff", show: false, fontSize: 16 },
            title: {
                text: "项目每月统计",
                color: "#1A1A1Aff",
                fontSize: 18,
                bold: true,
                textAlign: "left",
                paddingLeft: 5,
                paddingRight: 0,
                subtitle: { color: "#CCCCCCff", text: "", fontSize: 16, bold: false },
                show: true
            },
            tooltip: {
                show: true,
                color: "#1A1A1Aff",
                backgroundColor: "#FFFFFFff",
                fontSize: 14,
                customFormat: null,
                borderRadius: 4,
                borderColor: "#e1e5e8",
                borderWidth: 1,
                backgroundOpacity: 30,
                position: "center",
                offsetY: 24,
                showValue: true,
                showPercentage: false,
                roundingValue: 0,
                roundingPercentage: 0
            },
            userOptions: {
                show: true,
                position: "right",
                buttons: {
                    tooltip: true,
                    pdf: true,
                    csv: true,
                    img: true,
                    table: false,
                    labels: false,
                    fullscreen: true,
                    sort: false,
                    stack: true,
                    animation: false,
                    annotator: false
                },
                buttonTitles: {
                    open: "打开选项",
                    close: "关闭选项",
                    tooltip: "切换提示开关",
                    pdf: "下载为PDF",
                    csv: "下载为CSV",
                    img: "下载为PNG",
                    table: "表格显示/隐藏",
                    labels: "标签显示/隐藏",
                    fullscreen: "切换全屏",
                    stack: "切换stack模式"
                }
            },
            zoom: { show: false }
        },
        showTable: false
    }
    const chartConfig = computed(() => {
        if (data.value) {
            const countData = data.value.data.map((it) => it.count)
            initialConfig.chart.grid.labels.yAxis.scaleMax = Math.max(...countData) ? Math.max(...countData) : 10
        }
        return {
            ...initialConfig,
            theme: theme.value === "dark" ? "celebrationNight" : ""
        }
    })
    return { chartData, chartConfig }
}

export default useVueDataUI
