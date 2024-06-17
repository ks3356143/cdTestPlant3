<template>
    <div class="ma-content-block p-3 mt-3 bg-white">
        <a-spin class="chartContainer" :loading="isDataLoading" tip="图标数据加载中...">
            <ma-chart height="300px" :option="loginChartOptions" v-if="!isDataLoading" />
        </a-spin>
    </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { graphic } from "echarts"
import fetchData from "@/hooks/fetchData"
import commonApi from "@/api/common"
// 传给hook的远程请求数据函数
async function fetchDataFunc() {
    return await commonApi.getChartData()
}
const { loadingData, isDataLoading } = fetchData(
    [
        { month: "1", count: 2 },
        { month: "2", count: 10 }
    ],
    fetchDataFunc
)
// 计算属性：将loadingData转为xAxis
const xAxisData = computed(() => {
    return loadingData.value.map((item) => {
        return item.month + "月"
    })
})
const yAxisData = computed(() => {
    return loadingData.value.map((item) => {
        return item.count
    })
})

function graphicFactory(side) {
    return {
        type: "text",
        bottom: "8",
        ...side,
        style: {
            text: "",
            textAlign: "center",
            fill: "#4E5969",
            fontSize: 12
        }
    }
}

const graphicElements = ref([graphicFactory({ left: "3%" }), graphicFactory({ right: 0 })])

const loginChartOptions = computed(() => ({
    title: {
        text: `项目每月统计-${new Date().getFullYear()}年份`
    },
    grid: {
        left: "3%",
        right: "3%",
        top: "50",
        bottom: "30"
    },
    xAxis: {
        type: "category",
        offset: 2,
        data: xAxisData.value,
        boundaryGap: true,
        axisLabel: {
            color: "#4E5969",
            formatter(value, idx) {
                return `${value}`
            }
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            interval: (idx) => {
                if (idx === xAxisData.value.length - 1) return false
                return true
            },
            lineStyle: {
                color: "#E5E8EF"
            }
        },
        axisPointer: {
            show: true,
            lineStyle: {
                color: "#23ADFF",
                width: 2
            }
        }
    },
    yAxis: {
        type: "value",
        axisLine: {
            show: false
        },
        axisLabel: {
            formatter(value, idx) {
                if (idx === 0) return value
                return `${value}`
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: "dashed",
                color: "#E5E8EF"
            }
        }
    },
    tooltip: {
        trigger: "axis",
        formatter(params) {
            return `<div class="login-chart">
        <p class="tooltip-title">${params[0].axisValueLabel}</p>
        <div class="content-panel"><span>项目数量</span><span class="tooltip-value">${Number(
            params[0].value
        ).toLocaleString()}</span></div>
      </div>`
        }
    },
    graphic: {
        elements: graphicElements.value
    },
    series: [
        {
            data: yAxisData.value,
            type: "line",
            smooth: true,
            symbolSize: 14,
            emphasis: {
                focus: "series",
                itemStyle: {
                    borderWidth: 2
                }
            },
            lineStyle: {
                width: 3,
                color: new graphic.LinearGradient(0, 0, 1, 0, [
                    {
                        offset: 0,
                        color: "rgba(30, 231, 255, 1)"
                    },
                    {
                        offset: 0.5,
                        color: "rgba(36, 154, 255, 1)"
                    },
                    {
                        offset: 1,
                        color: "rgba(111, 66, 251, 1)"
                    }
                ])
            },
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    {
                        offset: 0,
                        color: "rgba(17, 126, 255, 0.16)"
                    },
                    {
                        offset: 1,
                        color: "rgba(17, 128, 255, 0)"
                    }
                ])
            }
        }
    ]
}))
</script>

<style lang="less" scoped>
.chartContainer {
    width: 100%;
    height: 300px;
}
</style>
