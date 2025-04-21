import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView')
  },
  // {
  //   path: '/home', // Ruta de la vista
  //   name: 'home',
  //   redirect: '/goods',
  //   component: () => import('../views/home/HomeView.vue'),// Vista
  //   children:[
  //     {
  //       path:'/goods',
  //       name:'goods',
  //       component: () => import('../views/home/GoodsList.vue')
  //     },
  //     {
  //       path: '/category',
  //       name: 'category',
  //       component: () => import('../views/home/GoodsCategory.vue')
  //     },
  //     {
  //       path: '/order',
  //       name: 'order',
  //       component: () => import('../views/home/GoodsOrder.vue')
  //     },
  //     {
  //       path:'/user',
  //       name:'user',
  //       component: () => import('../views/home/UserManager.vue')
  //     },
  //     {
  //       path:'/goods/add',
  //       name:'goodsAdd',
  //       component: () => import('../views/home/AddGoods.vue')
  //     },
  //     {
  //       path:'/personalCenter',
  //       name:'personalCenter',
  //       component: () => import('../views/home/PersonalCenter.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/goods/edit',
  //   name: 'goodsEdit',
  //   component: () => import('../views/home/GoodsEditView.vue')
  // }
]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (checkCache(to.path)) {
//     next()
//   } else {
//     next('/login')
//   }
// })

// function checkCache(path) {
//   localStorage.getItem('admin')
//   if (path === '/login' || localStorage.getItem('admin')) {
//     return true
//   } else {
//     return false
//   }
// }


export default router