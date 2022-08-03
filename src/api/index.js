//统一封装接口方法
//每个方法负责请求一个url地址
//逻辑页面，导入这个接口方法，就能发请求
//好处：请求url路径，可以在这里统一管理

import request from '@/utils/request.js'
import { getToken } from '@/utils/token'
import { getStorage } from '@/utils/storage.js'

// 既引入也同时向外按需导出，所有引入过来的方法
export * from './ArticleDetail.js'

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

// 用户-获取个人资料(编辑页面使用)
export const userProfileAPI = () => request({
    url: '/v1_0/user/profile',
    method: 'GET'
})

// 用户-获取基本信息(我的页面显示数据)
export const getUserInfoAPI = () => request({
    url: '/v1_0/user',
    method: 'GET'
})

// 用户-更新头像
export const updateUserPhotoAPI = (fd) => request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fd // fd是外面传进来的new FormData() 表单对象
})

// 用户-更新基本资料
export const updateUserProfileAPI = (obj) => {
    return request({
        // 判断，有什么值再带什么参数给后台
        // 写法1：解构赋值，4个判断，往空对象上添加，有值的加上去
        // 写法2：外面想传几个对象key+value，就直接传给后台
        url: '/v1_0/user/profile',
        method: 'PATCH',  // PATCH局部更新  PUT全部更新
        data: obj
        // data不会忽略值为null的那对key+value，params遇到null值会忽略不携带此对参数和值给后台
        // name, // 昵称
        // gender, // 性别 0男1女
        // birthday, // 生日 格式字符串
        // intro, // 个人介绍
    })
}

// 用户-刷新token
export const getNewTokenAPI = () => request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
        Authorization: 'Bearer' + getStorage('refresh_token')
    }
})