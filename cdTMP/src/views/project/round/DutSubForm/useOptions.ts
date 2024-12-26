import { ref, computed } from "vue"
import useCrudRef from "@/views/project/round/hooks/useCrudRef"
import tool from "@/utils/tool"

export default function useOptions(formRef: any) {
    const options = ref({
        showButtons: false,
        labelAlign: "center"
    })
    const { crudColumns } = useCrudRef(undefined, formRef)
    const columnOptions = computed(() => {
        return tool.renameKeyInArray(crudColumns.value, "commonRules", "rules")
    })
    return { options, columnOptions }
}
