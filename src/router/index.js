import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '',
    redirect:"/login"
  },
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
    //管理员路由
  {
    path:'/adminMain',
    name: 'AdminMain',
    redirect: '/adminHome',
    component: () => import('../views/admin/AdminMain'),
    children:[
      {
        path:'/adminHome',
        name: 'AdminHome',
        component: () => import('../components/admin/AdminHome')
      }
    ]
  },
    //商家路由
  {
    path:'/merchantMain',
    name: 'MerchantMain',
    redirect: '/merchantHome',
    component: () => import('../views/merchant/MerchantMain'),
    children:[
      {
        path:'/merchantHome',
        name: 'MerchantHome',
        component: () => import('../components/merchant/MerchantHome')
      }
    ]
  },

    //用户路由
  {
    path:'/userMain',
    name: 'UserMain',
    redirect: '/userHome',
    component: () => import('../views/user/UserMain'),
    children:[
      {
        path:'/userHome',
        name: 'UserHome',
        component: () => import('../components/user/UserHome')
      }
    ]
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
