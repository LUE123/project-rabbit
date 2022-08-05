import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import store from '@/store'
import { h } from 'vue'

// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: () => import('@/views/Layout'),
    children: [
      { path: '/', component: () => import('@/views/home') },
      { path: '/category/:id', component: () => import('@/views/category/index') },
      { path: '/category/sub/:id', component: () => import('@/views/category/sub') },
      { path: '/product/:id', component: () => import('@/views/goods/index') },
      { path: '/cart', component: () => import('@/views/cart/index') },
      
      { path: '/member/checkout',component: () => import('@/views/member/pay/checkout') },
      { path: '/member/pay',component: () => import('@/views/member/pay/index') },
      { path: '/pay/callback', component: () => import('@/views/member/pay/result') },
      
      {
        path: '/member', component: () => import('@/views/member/Layout'),
        children: [
          { path: '/member', component: () => import ('@/views/member/home')},
          // { path: '/member/order', component: () => import ('@/views/member/order')},
          // { path: '/member/order/:id', component: () => import ('@/views/member/order/detail')}
          {
            path: '/member/order',
            // 创建一个RoutrView容器形成嵌套关系
            component: { render: () => h(<RouterView />) },
            children: [
              { path: '', component: () => import ('@/views/member/order')},
              { path: ':id', component: () => import ('@/views/member/order/detail')}
            ]
          }
        ]
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/login/callback',
    component: () => import('@/views/login/callback.vue')
  },
]

// vue2.0  new VueRouter({}) 创建路由实例
// vue3.0  createRouter({})  创建路由实例
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 切换路由时，页面滚动的位置
  scrollBehavior() {
    return{left:0,top:0}
  }
})

// 前置导航守卫   如果没登陆 跳转的地址以member开头 拦截 先登陆
router.beforeEach((to, from, next) => {
  // 需要登陆的路由 ：地址是由 /member 开头
  const { profile } = store.state.user
  // to.path.startsWith('/member') 跳转的地址以member开头
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  } 
  next()
})

export default router
