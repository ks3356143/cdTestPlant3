<template>
    <div class="w-full lg:w-3/12 ma-content-block rounded-sm ml-0 lg:ml-3 p-3 mt-3">
        <div class="flex">测试管理平台相关</div>
        <div class="block lg:grid lg:grid-cols-2 lg:gap-2 mt-3">
            <a-card type="rounded-sm text-center" class="w-full" :body-style="{ padding: 0 }" :bordered="false">
                <a target="_blank" href="https://github.com/ks3356143/cdTestPlant3">
                    <a-button type="outline" class="w-full">前端仓库</a-button>
                </a>
            </a-card>
            <a-card type="rounded-sm text-center" class="w-full" :body-style="{ padding: 0 }" :bordered="false">
                <a href="https://github.com/ks3356143/cdtestplant_v1" target="_blank">
                    <a-button type="outline" class="w-full">后端仓库</a-button>
                </a>
            </a-card>
            <a-card type="rounded-sm text-center" class="w-full" :body-style="{ padding: 0 }" :bordered="false">
                <a href="https://arco.design/vue/docs/pro/start" target="_blank">
                    <a-button type="outline" class="w-full">感谢ArcoDesign</a-button>
                </a>
            </a-card>
            <a-card type="rounded-sm text-center" class="w-full" :body-style="{ padding: 0 }" :bordered="false">
                <a href="https://doc.mineadmin.com/guide/" target="_blank">
                    <a-button type="outline" class="w-full">感谢:MineAdmin</a-button>
                </a>
            </a-card>
            <div class="mt-2">管理平台版本</div>
            <a-tag class="mt-2" color="#0fc6c2">TestManagePlant V0.0.1</a-tag>
        </div>
    </div>
</template>

<script setup></script>

<style lang="less" scoped></style>
