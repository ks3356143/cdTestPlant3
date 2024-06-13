<template>
    <div class="time-line-container">
        <div class="ma-content-block rounded-sm flex-column justify-between w-full p-3 bg-color">
            <div class="title">填写的项目时间轴</div>
            <a-timeline direction="horizontal" class="timeline" mode="alternate">
                <a-timeline-item :label="pInfo.time_line.start_time">
                    <a-row :style="{ display: 'inline-flex', alignItems: 'center' }">
                        <div>开始时间</div>
                    </a-row>
                </a-timeline-item>
                <a-timeline-item
                    v-for="(item, index) in pInfo.time_line.round_time"
                    :key="index"
                    :label="`结束时间 : ${item.end}`"
                >
                    <a-col>
                        <div>{{ item.name }}</div>
                        <div class="a-col-title">开始时间 : {{ item.start }}</div>
                    </a-col>
                </a-timeline-item>
                <a-timeline-item :label="pInfo.time_line.end_time">
                    <a-row :style="{ display: 'inline-flex', alignItems: 'center' }">
                        <div>结束时间</div>
                    </a-row>
                </a-timeline-item>
                <div class="info">
                    <a-alert>测试人员填写的项目开始时间、结束时间、轮次时间均会影响生成文档的时间!</a-alert>
                </div>
            </a-timeline>
        </div>
    </div>
</template>

<script setup>
// 1.定义props
const props = defineProps({
    pInfo: {
        type: Object,
        required: true
    }
})
</script>

<style lang="less" scoped>
.title {
    margin: 10px;
    font-weight: 700;
    font-size: 1rem;
}
.timeline {
    position: relative;
    padding: 50px;
    width: 100%;
    .info {
        width: 180px;
        position: absolute;
        right: 30px;
        top: 1rem;
    }
}
.a-col-title {
    font-size: 12px;
    margin-bottom: -5px;
    margin-top: 5px;
    color: var(--color-text-3);
}
</style>
