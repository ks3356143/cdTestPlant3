/**
 * 表单验证器：验证输入trim空格后是否为空，例如项目标识必须不能为空格
 */
export function validateBlank(value: string | undefined, callback: (error?: string) => void): void {
    const val = value?.trim()
    if (val === "") {
        callback("注意标识不能为空格")
    }
}
