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

// 用户关注
export const userFollowedAPI = ({ userId }) => request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
        target: userId
    }
})

// 用户取关
export const userUnFollowedAPI = ({ userId }) => request({
    url: `/v1_0/user/followings/${userId}`,
    method: 'DELETE'
})

//获取所有频道
export const getAllChannelsAPI = () => request({
    url: '/v1_0/channels',
    method: 'GET'
})

//获取用户选择的频道  用户没有登陆，默认返回后台设置的默认频道列表
export const getUserChannelsAPI = () => request({
    url: '/v1_0/user/channels',
    method: 'GET',
})

// 更新覆盖频道
export const updateChannelsAPI = ({ channels }) => request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
        channels // 用户已选整个频道数组
    }
})

// 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) => request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
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

// 对文章点赞
export const likeArticleAPI = ({ artId }) => request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
        target: artId
    }
})
export const unLikeArticleAPI = ({ artId }) => request({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
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

// 获取联想建议
export const suggestListAPI = ({ keywords }) => request({
    url: '/v1_0/suggestion',
    method: 'GET',
    params: {
        q: keywords
    }
})

// 搜索结果列表
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => request({
    url: '/v1_0/search',
    method: 'GET',
    params: {
        page,
        per_page,
        q
    }
})

// 获取文章详情
export const detailAPI = ({ artId }) => request({
    url: `/v1_0/articles/${artId}`,
    method: 'GET',
})