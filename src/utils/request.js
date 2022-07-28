// 基于axios封装网络请求
// 每个程序员的想法都不一样，封装的地方和名字都不一样，但是思想相同
import theAxios from 'axios'
import router from '@/router';
import { Notify } from 'vant';
import { getToken } from '@/utils/token.js';
const axios = theAxios.create({
    // baseURL: 'http://toutiao.itheima.net/',
    baseURL: 'http://geek.itheima.net',
    timeout: 20000 // 20秒无响应直接判定超时
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // 没有叫undefined null是值为空
    // ?. 可选链操作符，如果前面对象里没有length，原地返回undefined   如果getToken在原地有值，才能调用length获取长度
    if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
        config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    // 只有401才代表身份过期，才需要跳转登录
    if (error.response.status === 401) {
        // 不能使用this.$router 因为this不是vue组件对象无法调用$router
        // 解决，引入router
        Notify({ type: 'warning', message: '身份已过期' })
        router.replace('/login')
    }
    return Promise.reject(error);
});

export default ({ url, method = 'GET', params = {}, data = {}, headers }) => {
    return axios({
        url,
        method,
        params,
        data,
        headers
    })
}
