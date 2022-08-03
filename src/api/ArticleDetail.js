import request from "@/utils/request"
// 获取文章详情
export const detailAPI = ({ artId }) => request({
    url: `/v1_0/articles/${artId}`,
    method: 'GET',
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

// 对评论或评论回复点赞
export const likeCommentAPI = ({ comId }) => request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
        target: comId
    }
})

// 取消对评论或评论回复点赞
export const unLikeCommentAPI = ({ comId }) => request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
})

// 文章 评论列表
export const commentsListAPI = ({ id, offset = null, limit = 10 }) => request({
    url: '/v1_0/comments',
    method: 'GET',
    params: {
        // axios只针对params参数，如果发现键值对，值为null，会忽略此参数名和值，不携带在url？后面
        type: 'a', // 什么时候需要外面传：此值会变化
        source: id,
        offset,
        limit
    }
})

// 文章评论-发布评论
export const commentSendAPI = ({ id, content, art_id = null }) => {
    // axios中，data请求体传参，如果值为null，是不会忽略这个参数的，也会把参数名和值携带给后台(只有params遇到null才会忽略)
    // 形参art_id可选参数，如果逻辑页面是对文章评论，则不需要传递art_id
    // 所以这时，内部art_id值为null就证明此次调用是针对文章评论

    // data请求体对象需要自己处理
    const obj = {
        target: id,
        content
    }
    if (art_id !== null) {
        // 如果本次有第三个参数，证明是对评论进行回复
        obj.art_id = art_id
    }
    return request({
        url: '/v1_0/comments',
        method: 'POST',
        data: obj
    })
}

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