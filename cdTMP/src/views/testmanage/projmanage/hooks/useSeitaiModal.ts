import { ref } from "vue"
import hoosk from "./hooks"
import seitaiGenerateApi from "@/api/generate/seitaiGenerate"

const useSeitaiModal = function () {
    // refs
    const visible = ref(false)
    const isComplete = ref(false)
    const ptext = ref("测评大纲")
    // events
    const handleModalConfirmClick = () => {
        visible.value = false
    }
    // 生成文档
    // ~~~~~~~~测试说明生成文档~~~~~~~~
    const createSeitaiShuoming = async (record: any) => {
        ptext.value = "测试说明"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createShuomingSeiTai, record.id, ptext.value)
    }

    // ~~~~~~~~测试大纲生成文档~~~~~~~~
    const createSeitaiDagang = async (record: any) => {
        // 根据一系列文档生成大纲 - 这里有进度条组件、a-modal组件
        // 1.打开进度条组件
        ptext.value = "测评大纲"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createDagangSeiTai, record.id, ptext.value)
    }
    // ~~~~~~~~记录生成文档~~~~~~~~
    const createSeitaiJilu = async (record: any) => {
        ptext.value = "测试记录"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createJiluSeiTai, record.id, ptext.value)
    }

    // ~~~~~~~~报告生成文档~~~~~~~~
    const createSeitaiBaogao = async (record: any) => {
        ptext.value = "测评报告"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createBgDocument, record.id, ptext.value)
    }
    // ~~~~~~~~回归测试说明~~~~~~~~
    const createSeitaiHsm = async (record: any) => {
        ptext.value = "回归测试说明"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createHsmDocument, record.id, ptext.value)
    }
    // ~~~~~~~~回归测试记录~~~~~~~~
    const createSeitaiHjl = async (record: any) => {
        ptext.value = "回归测试记录"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createHjlDocument, record.id, ptext.value)
    }
    // ~~~~~~~~问题单~~~~~~~~
    const createSeitaiWtd = async (record: any) => {
        ptext.value = "问题单"
        hoosk.create_entire_doc(visible, isComplete, seitaiGenerateApi.createWtdDocument, record.id, ptext.value)
    }

    return {
        visible,
        isComplete,
        ptext,
        handleModalConfirmClick,
        createSeitaiShuoming,
        createSeitaiDagang,
        createSeitaiJilu,
        createSeitaiBaogao,
        createSeitaiHsm,
        createSeitaiHjl,
        createSeitaiWtd
    }
}

export default useSeitaiModal
