import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  // {
  //   path: '/',
  //   redirect:"/login"
  // },
  {
    path: '/login',
    name: 'LoginView',
   component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'RegisterView',
   component: () => import('../views/RegisterView.vue')
  },
  {
    path:'/adminMain',
    name: 'AdminMain',
    component: () => import('../views/admin/AdminMain')
  },
  {
    path:'/merchantMain',
    name: 'MerchantMain',
    component: () => import('../views/merchant/MerchantMain')
  },
  {
    path:'/userMain',
    name: 'UserMain',
    component: () => import('../views/user/UserMain')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


// // 路由守卫
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = checkUserLoginStatus(); // 检查用户是否已登录
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     next('/login'); // 未登录时跳转到登录页面
//   } else {
//     next(); // 放行
//   }
// });
//
// // 检查用户登录状态
// function checkUserLoginStatus() {
//   // 从 localStorage 或 Vuex 中获取登录状态
//   return localStorage.getItem('isLoggedIn') === 'true';
// }


export default router
