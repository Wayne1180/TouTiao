// 基于axios封装网络请求
// 每个程序员的想法都不一样，封装的地方和名字都不一样，但是思想相同
import theAxios from 'axios'
import router from '@/router';
import Notify from '@/ui/Notify';
import { getToken, removeToken, setToken } from '@/utils/token.js';
import { getNewTokenAPI } from '@/api';
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
}, async function (error) {
    // 对响应错误做点什么
    // 只有401才代表身份过期，才需要跳转登录
    if (error.response.status === 401) {
        // 不能使用this.$router 因为this不是vue组件对象无法调用$router
        // 解决，引入router
        Notify({ type: 'warning', message: '身份已过期' })

        // 方式1：清除token，强制跳转到登录，用户有感知
        removeToken() // 先清除token，才能让路由守卫判断失效，放行去登录页
        // router.currentRoute 相当于在vue文件内this.$route 当前路由对象信息
        // fullpath 路由对象里完整路由路径#后面的一切
        router.replace(`/login?path=${router.currentRoute.fullPath}`)

        // 方式2：使用refresh_token 换回新的token再继续使用，js代码实现，用户无感知
        // const res = await getNewTokenAPI()

        // 新的token回来之后，我们要做什么
        //1.更新token在本地
        // setToken(res.data.data.token)
        // // 更新新的token在请求头里
        // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
        // // 2.未完成这次请求，再次发起
        // // error.config就是上一次请求的配置对象
        // // 结果我们要return回原本逻辑页面调用地方，还是return回去一个Promise对象
        // return axios(error.config)
    } else if (error.response.status === 500 && error.config.url === '/v_1/authorizations' && error.config.method === 'put') {
        // 刷新的refreshtoken也过期了
        // removeToken()
        localStorage.clear() // 清除本地所有值
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
