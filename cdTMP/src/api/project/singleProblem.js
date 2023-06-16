import { request } from "@/api/request"
export default {
    getSingleProblem(params = {}) {
        return request({
            url: "/project/getSingleProblem",
            method: "get",
            params
        })
    }
}
