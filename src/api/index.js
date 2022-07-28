//统一封装接口方法
//每个方法负责请求一个url地址
//逻辑页面，导入这个接口方法，就能发请求
//好处：请求url路径，可以在这里统一管理

import request from '@/utils/request.js'
import { getToken } from '@/utils/token'

//登录接口
export const loginAPI = ({ mobile, code }) => request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
        mobile,
        code
    }
})
//获取所有频道
export const getAllChannelsAPI = () => axios({
    url: '/v1_0/channels',
    method: 'GET'
})

//获取用户选择的频道  用户没有登陆，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
    url: '/v1_0/user/channels',
    method: 'GET',
})

//获取文章新闻推荐
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
    url: '/v1_0/articles',
    method: 'GET',
    params: {
        //这里的参数，axios会帮你拼接在URL？后面(查询字符串)
        channel_id,
        timestamp
    }
})

//对文章不感兴趣
export const dislikeArticleAPI = ({ artId }) => request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
        target: artId
    },

})

//反馈垃圾内容
export const reportArticleAPI = ({ artId, type }) => request({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
        target: artId,
        type: type,
        remark: '遗留问题'
    }
})