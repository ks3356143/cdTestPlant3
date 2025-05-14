<script lang="tsx">
import { computed, defineComponent, ref, Teleport } from "vue"
import { useRoute } from "vue-router"
import { Popover } from "@arco-design/web-vue"
import MaInfo from "@/components/ma-info/index.vue"
// 请求的API
import dutApi from "@/api/project/dut"
import designApi from "@/api/project/designDemand"
import demandApi from "@/api/project/testDemand"
// columns导入
import useDutColumn from "@/views/project/round/hooks/useColumn"
import useDesignColumn from "@/views/project/dut/hooks/useColumns"
import useDemandColumn from "@/views/project/design-demand/hooks/useColumns"
import Empty from "@/components/Empty/index.vue"

export default defineComponent({
    name: "ParentPreview",
    props: {
        parentKey: { type: String, default: "" } // 在ma-form已经判断所以必然有值，索引上级key
    },
    setup(props) {
        const route = useRoute()
        const project_id = route.query.id // 项目id
        const hoverText = ref("")
        const buttonLikeRef = ref<HTMLDivElement | null>(null)
        const onMouseenter = () => {
            // 进入时候注册事件
            hoverText.value = "查看上级"
        }
        const onMouseleave = () => {
            hoverText.value = ""
        }
        // ma-info变量
        const dutOriginColumns = useDutColumn(undefined)
        const dutColumns = computed(() => {
            // 去掉上传源代码字段
            const quUploadColumns = dutOriginColumns.value.filter((it) => it.dataIndex !== "upload")
            // 判断是否为源代码被测件
            return quUploadColumns
        })
        const designColumns = useDesignColumn(undefined)
        const demandColumns = useDemandColumn(undefined)
        // 根据parentKey判断是哪个级别节点
        const keyLength = props.parentKey.split("-").length
        // 储存ma-info的dom
        let maInfoDom = <Empty></Empty>
        // 处理异步请求的函数
        const fetchNodeData = async (resPromise: Promise<any>, nodeType: string) => {
            const res = await resPromise
            switch (nodeType) {
                case "dut":
                    const dutInfo = res.data
                    const dutInfoJudge = computed(() => {
                        if (dutInfo.type === "SO") {
                            // 计算注释率：注释行/总行数
                            dutInfo.comment_percent = (dutInfo.comment_lines / dutInfo.total_lines) * 100 + "%"
                        } else {
                            // 如果是非源代码被测件行数均填写：“不适用”
                            dutInfo.comment_lines = "不适用"
                            dutInfo.comment_percent = "不适用"
                            dutInfo.effective_lines = "不适用"
                            dutInfo.total_lines = "不适用"
                        }
                        return dutInfo
                    })
                    maInfoDom = (
                        <MaInfo columns={dutColumns.value} data={dutInfoJudge.value} tableLayout="auto"></MaInfo>
                    )
                    break
                case "design":
                    maInfoDom = <MaInfo columns={designColumns.value} data={res.data} tableLayout="auto"></MaInfo>
                    break
                case "demand":
                    maInfoDom = <MaInfo columns={demandColumns.value} data={res.data} tableLayout="auto"></MaInfo>
                    break
                default:
                    break
            }
        }
        switch (keyLength) {
            case 2:
                // 请求设计需求节点
                fetchNodeData(dutApi.getDutOne({ project_id, key: props.parentKey }), "dut")
                break
            case 3:
                // 请求测试项节点
                fetchNodeData(designApi.getDesignDemandOne({ project_id, key: props.parentKey }), "design")
                break
            case 4:
                // 请求用例节点
                fetchNodeData(demandApi.getTestDemandOne({ project_id, key: props.parentKey }), "demand")
                break
            default:
                break
        }

        return () => (
            <Teleport to="body">
                <Popover trigger="click" position="left">
                    {{
                        default: () => (
                            <div class="preview-container">
                                <div
                                    class="button-like"
                                    ref={buttonLikeRef}
                                    onMouseenter={onMouseenter}
                                    onMouseleave={onMouseleave}
                                >
                                    <icon-find-replace />
                                    {hoverText.value && <span class="ml-2">{hoverText.value}</span>}
                                </div>
                            </div>
                        ),
                        content: () => (
                            <div
                                style={{
                                    width: "600px"
                                }}
                            >
                                {maInfoDom}
                            </div>
                        )
                    }}
                </Popover>
            </Teleport>
        )
    }
})
</script>

<style scoped lang="less">
.preview-container {
    position: fixed;
    right: 80px;
    top: 45%;
    z-index: 10000;
}
.button-like {
    width: 40px;
    height: 40px;
    font-size: 16px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.8);
    transition: all 0.1s;
    overflow: hidden;
    position: relative;
    span {
        white-space: nowrap;
    }
}
.button-like:hover {
    width: 120px;
    border-radius: 22px;
}
.click-content {
    min-width: 500px;
    min-height: 300px;
    background-color: #fff;
}
</style>
