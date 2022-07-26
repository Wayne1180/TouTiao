// 基于axios封装网络请求
// 每个程序员的想法都不一样，封装的地方和名字都不一样，但是思想相同
import theAxios from 'axios'
const axios = theAxios.create({
    baseURL: 'http://toutiao.itheima.net/',
    timeout: 20000 // 20秒无响应直接判定超时
})

export default ({ url, method = 'GET', params = {}, data = {}, headers }) => {
    return axios({
        url,
        method,
        params,
        data,
        headers
    })
}
