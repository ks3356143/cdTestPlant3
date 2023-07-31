import { request } from "@/api/request"

export default {
    /**
     * 根据项目id、round信息，请求dut
     * @returns dut数据
     */
    getDutList(params = {}) {
        return request({
            url: `/project/getDutList`,
            method: "get",
            params
        })
    },
    /**
     * 添加被测件
     * @returns
     */
    save(params = {}) {
        return request({
            url: "/project/dut/save",
            method: "post",
            data: params
        })
    },
    /**
     * 更新dut
     * @returns
     */
    update(id, data = {}) {
        return request({
            url: "/project/dut/update/" + id,
            method: "put",
            data
        })
    },
    /**
     * 删除dut
     * @returns
     */
    delete(data) {
        return request({
            url: "/project/dut/delete",
            method: "delete",
            data
        })
    },
}
