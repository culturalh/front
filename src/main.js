import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
import axios from 'axios';
import { createPinia } from 'pinia'
import {useUserStore} from "@/stores/userStore";

const app = createApp(App);
const pinia = createPinia()
app.use(Antd).use(pinia).use(router).mount('#app')
//全局注册图标
const icons = Icons
for (const i in icons) {
  app.component(i, icons[i])
}

// 初始化用户状态
const store = useUserStore()
store.initFromStorage()
/**
 * axios拦截器
 */
// 请求拦截器
axios.interceptors.request.use(
    (config) => {
      // 获取 token
      const token = localStorage.getItem('token');

      // 如果有 token，并且请求的 URL 不是登录或注册接口，则添加 token 到请求头
      if (token && !config.url?.match(/\/login|\/register/)) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error('请求错误:', error);
      return Promise.reject(error);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const userStore = useUserStore();
      if (error.response.status === 401) {
        // 如果返回 401 未授权，清除用户信息并跳转到登录页面
        userStore.logout();
        router.push('/login');
      }
      return Promise.reject(error);
    }
);

//设置请求基地址
axios.defaults.baseURL = process.env.VUE_APP_SERVER;
console.log("环境",process.env.NODE_ENV);
console.log("服务端地址",process.env.VUE_APP_SERVER);
