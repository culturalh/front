import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/userStore';

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
      }, {
        path:'/adminNotice',
        name: 'AdminNotice',
        component: () => import('../components/admin/AdminNotice')
      }, {
        path:'/adminAboutUs',
        name: 'AdminAboutUs',
        component: () => import('../components/admin/AdminAboutUs')
      }
      ,{
        path:'/adminLog',
        name: 'AdminLog',
        component: () => import('../components/admin/AdminLog')
      },{
        path:'/homeApplianceInfo',
        name: 'HomeApplianceInfo',
        component: () => import('../components/admin/HomeApplianceInfo')
      },{
        path:'/merchantInfoManagement',
        name: 'MerchantInfoManagement',
        component: () => import('../components/admin/MerchantInfoManagement')
      },{
        path:'/userInfoManagement',
        name: 'UserInfoManagement',
        component: () => import('../components/admin/UserInfoManagement')
      },{
        path:'/rentalOrder',
        name: 'RentalOrder',
        component: () => import('../components/admin/RentalOrder')
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
      }, {
        path:'/merchantNotice',
        name: 'MerchantNotice',
        component: () => import('../components/merchant/MerchantNotice')
      }, {
        path:'/merchantAboutUs',
        name: 'MerchantAboutUs',
        component: () => import('../components/merchant/MerchantAboutUs')
      }, {
        path:'/merchantInfo',
        name: 'MerchantInfo',
        component: () => import('../components/merchant/MerchantInfo')
      },{
        path:'/merchantApplianceInfo',
        name: 'MerchantApplianceInfo',
        component: () => import('../components/merchant/MerchantApplianceInfo')
      },{
        path:'/merchantLog',
        name: 'MerchantLog',
        component: () => import('../components/merchant/MerchantLog')
      }, {
        path:'/merchantOrder',
        name: 'MerchantOrder',
        component: () => import('../components/merchant/MerchantOrder')
      },{
        path:'/merchantTransaction',
        name: 'MerchantTransaction',
        component: () => import('../components/merchant/MerchantTransaction')
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
      }, {
        path:'/userNotice',
        name: 'UserNotice',
        component: () => import('../components/user/UserNotice')
      }, {
        path:'/userAboutUs',
        name: 'UserAboutUs',
        component: () => import('../components/user/UserAboutUs')
      }, {
        path:'/userApplianceInfo',
        name: 'UserApplianceInfo',
        component: () => import('../components/user/UserApplianceInfo')
      },{
        path:'/userInfo',
        name: 'UserInfo',
        component: () => import('../components/user/UserInfo')
      },{
        path:'/userLog',
        name: 'UserLog',
        component: () => import('../components/user/UserLog')
      },{
        path:'/userOrder',
        name: 'UserOrder',
        component: () => import('../components/user/UserOrder')
      },{
        path:'/userTransaction',
        name: 'UserTransaction',
        component: () => import('../components/user/UserTransaction')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to,from,next) => {
  const store = useUserStore()
  const publicPages = ['/login', '/register']
  // 如果访问的是公共页面，直接放行
  if (publicPages.includes(to.path)) {
    next();
    return;
  }

  // 如果用户已登录
  if (store.userInfo.token) {
    // 如果一切正常，放行
    next();
  } else {
    // 如果未登录，重定向到登录页面
    next('/login');
  }
})




export default router
