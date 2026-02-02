<template>
    <!-- 完成自定义表格 -->
    <div class="fontnote">
        <a-space class="w-full">
            <span>题注：</span>
            <a-input v-model="fontnote" :style="{ width: '500px' }"></a-input>
        </a-space>
    </div>
    <div class="arco-table arco-table-size-large arco-table-border arco-table-stripe arco-table-hover">
        <div class="arco-table-container">
            <table class="arco-table-element" cellpadding="0" cellspacing="0">
                <thead>
                    <tr class="arco-table-tr">
                        <th class="arco-table-th" v-for="(_, colIndex) in datas![0]" :key="colIndex">
                            <span class="arco-table-cell items-center justify-center">
                                <a-tooltip content="此列后新增列">
                                    <a-button type="text" size="mini" @click="addColumn(colIndex)" class="delete-col-btn">
                                        <template #icon>
                                            <icon-plus />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip content="删除该列">
                                    <a-button
                                        type="text"
                                        size="mini"
                                        status="danger"
                                        @click="deleteColumn(colIndex)"
                                        :disabled="datas![0].length <= 1"
                                        class="delete-col-btn"
                                    >
                                        <template #icon>
                                            <icon-close />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </span>
                        </th>
                        <th class="arco-table-th" :style="{ textAlign: 'center' }">
                            <span>操作</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="arco-table-tr" v-for="(row, rowIndex) in datas" :key="rowIndex">
                        <td class="arco-table-td" v-for="(col, colIndex) in row" :key="colIndex">
                            <span class="arco-table-cell">
                                <a-textarea auto-size v-model="datas![rowIndex][colIndex]" />
                            </span>
                        </td>
                        <td class="arco-table-td">
                            <span class="arco-table-cell items-center justify-center">
                                <a-tooltip content="此行后新增行">
                                    <a-button type="text" size="mini" @click="addRow(rowIndex)" class="delete-col-btn">
                                        <template #icon>
                                            <icon-plus />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip content="删除该行">
                                    <a-button size="mini" type="text" status="danger" @click="deleteRow(rowIndex)" :disabled="datas!.length <= 1">
                                        <template #icon>
                                            <icon-delete />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
// 该组件储存数据
const fontnote = defineModel<string>("fontnote")

const datas = defineModel<string[][]>()

// 行列操作
const deleteRow = (rowIndex: number) => {
    datas.value!.splice(rowIndex, 1)
}
const deleteColumn = (colIndex: number) => {
    datas.value!.forEach((row) => {
        row.splice(colIndex, 1)
    })
}
const addRow = (rowIndex: number) => {
    const newRow = new Array(datas.value![0].length).fill("")
    datas.value!.splice(rowIndex + 1, 0, newRow)
}
const addColumn = (colIndex: number) => {
    // 处理空表格的特殊情况
    if (datas.value!.length === 0) {
        datas.value!.push([""])
        return
    }
    // 新增后续列
    datas.value!.forEach((row) => {
        const insertPosition = colIndex === -1 ? row.length : colIndex + 1
        row.splice(insertPosition, 0, "")
    })
}
</script>

<style scoped lang="less">
.fontnote {
    margin: 10px 0;
    width: 100%;
}

.arco-textarea {
    min-width: 120px;
}

.arco-table-cell {
    padding: 5px;
}
</style>
