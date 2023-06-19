import { request } from "@/api/request"

export default {
    /**
     * 根据项目id、round信息，请求dut
     * @returns dut数据
     */
    getDutList(params = {}) {
        return request({
            url: `project/getDutList`,
            method: "get",
            params
        })
    }
}
