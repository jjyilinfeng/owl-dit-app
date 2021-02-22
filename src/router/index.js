import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/userAccount',
    name: '登录注册',
    component: () => import('../views/UserAccount.vue')
  },
  {
    path: '/welcomePage',
    name: '欢迎',
    component: () => import('../views/welcomePage.vue')
  },
  {
    path: '/test',
    name: '测试',
    component: () => import('../views/Test.vue')
  },
  {
    path:'/index',
    name:'主页',
    component: ()=> import('../views/Index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  //history:createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
