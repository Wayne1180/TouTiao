import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User'
// import Search from '@/views/Search'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'

import { getToken } from '@/utils/token'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/login',
    // component: Login
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
  },
  {
    path: '/layout',
    // component: Layout,
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'home',
        // component: Home
        component: () => import('@/views/Home')
      },
      {
        path: 'user',
        // component: User
        component: () => import('@/views/User')
      }
    ]
  },
  {
    path: '/search',
    // component: Search
    component: () => import('@/views/Search')
  },
  {
    // 搜索结果页
    path: '/search_result/:kw',
    // component: SearchResult
    component: () => import('@/views/Search/SearchResult')
  },
  {
    // 文章详情页
    path: '/detail',
    // component: ArticleDetail
    component: () => import('@/views/ArticleDetail')
  },
  {
    // 用户编辑页面
    path: '/user_edit',
    // component: UserEdit
    component: () => import('@/views/User/UserEdit')
  },
  {
    // 聊天页面
    path: '/chat',
    // component: Chat
    component: () => import('@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 路由-全局前置守卫(在路由发生真正的跳转之前，执行此函数)
// 此函数可以决定路由是否跳转/取消/强制中断切换到别的路由
router.beforeEach((to, from, next) => {
  // 需求：如果你已经登陆了，不要切换到登录页面
  if (getToken()?.length > 0 && to.path === '/login') {
    // next(false) 
    next('/layout/home')
  } else {
    next()
  }
})
export default router
