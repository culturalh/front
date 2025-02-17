<template>
  <a-layout style="min-height: 100vh">
    <!-- 顶部导航栏 -->
<!--    <a-layout-header class="header">-->
<!--      <div class="header-content">-->
<!--        <div class="logo">-->
<!--          <img src="@/assets/logo.png" alt="Logo" />-->
<!--          <span class="title">家电租赁系统</span>-->
<!--        </div>-->
<!--        <a-menu-->
<!--            v-model:selectedKeys="topNavKeys"-->
<!--            mode="horizontal"-->
<!--            theme="dark"-->
<!--            class="nav-menu"-->
<!--        >-->
<!--          <a-menu-item key="home">首页</a-menu-item>-->
<!--          <a-menu-item key="category">系统通知</a-menu-item>-->
<!--          <a-menu-item key="about">关于我们</a-menu-item>-->
<!--        </a-menu>-->
<!--        <div class="user-panel">-->
<!--&lt;!&ndash;          <a-input-search placeholder="搜索家电" style="width: 200px" />&ndash;&gt;-->
<!--          <a-button type="primary" class="login-btn">退出登录</a-button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </a-layout-header>-->
    <!-- 顶部导航栏 -->
    <TheHeader
        :menu-items="topMenuItems"
        @logout="handleLogout"
    >
      <template #user-action>
        <a-button
            type="primary"
            danger
            @click="handleLogout"
        >
          <LogoutOutlined />
          安全退出
        </a-button>
      </template>
    </TheHeader>
    <a-layout>
      <!-- 侧边栏 -->
<!--      <a-layout-sider width="220" theme="light" class="sider">-->
<!--        <a-menu-->
<!--            v-model:selectedKeys="sideNavKeys"-->
<!--            mode="inline"-->
<!--            theme="light"-->
<!--            class="side-menu"-->
<!--        >-->
<!--          <a-sub-menu key="sub1" title="热门租赁">-->
<!--            <a-menu-item key="1">空调</a-menu-item>-->
<!--            <a-menu-item key="2">冰箱</a-menu-item>-->
<!--            <a-menu-item key="3">洗衣机</a-menu-item>-->
<!--          </a-sub-menu>-->
<!--          <a-sub-menu key="sub2" title="服务指南">-->
<!--            <a-menu-item key="4">租赁流程</a-menu-item>-->
<!--            <a-menu-item key="5">费用说明</a-menu-item>-->
<!--            <a-menu-item key="6">售后服务</a-menu-item>-->
<!--          </a-sub-menu>-->
<!--        </a-menu>-->
<!--      </a-layout-sider>-->


      <TheSider
          :menu-items="sideMenuItems"
          :collapsible="true"
          @menu-select="handleMenuSelect"
      >
        <template #title>
          <div class="custom-title">
            <AppstoreOutlined />
            <span>家电租赁管理</span>
          </div>
        </template>

        <template #footer>
          <div class="collapse-btn" @click="isCollapsed = !isCollapsed">
            <MenuFoldOutlined v-if="!isCollapsed" />
            <MenuUnfoldOutlined v-else />
          </div>
        </template>
      </TheSider>

<!--      <a-layout-sider width="220" theme="light" class="sider">-->
<!--        <a-menu-->
<!--            v-model:selectedKeys="sideNavKeys"-->
<!--            mode="inline"-->
<!--            theme="light"-->
<!--            class="side-menu"-->
<!--        >-->
<!--          &lt;!&ndash; 原二级目录改为一级目录 &ndash;&gt;-->
<!--          <a-menu-item key="1">-->
<!--            <template #icon><HomeOutlined /></template>-->
<!--            首页概览-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="2">-->
<!--            <template #icon><AppstoreOutlined /></template>-->
<!--            个人信息-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="3">-->
<!--            <template #icon><ShoppingCartOutlined /></template>-->
<!--            订单管理-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="4">-->
<!--            <template #icon><TeamOutlined /></template>-->
<!--            查看家电信息-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="5">-->
<!--            <template #icon><ProfileOutlined /></template>-->
<!--            交易管理-->
<!--          </a-menu-item>-->
<!--          <a-menu-item key="6">-->
<!--            <template #icon><QuestionCircleOutlined /></template>-->
<!--            日志管理-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--      </a-layout-sider>-->

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <!-- 横幅区域 -->
        <div class="banner">
          <h1>轻松租赁 品质生活</h1>
          <p>每日租金低至 ¥9.9 起</p>
          <a-button type="primary" size="large">立即租赁</a-button>
        </div>

        <!-- 推荐家电 -->
        <a-card title="推荐家电" class="recommend-card">
          <a-row :gutter="[16, 16]">
            <a-col :span="6" v-for="item in appliances" :key="item.id">
              <a-card hoverable>
                <template #cover>
                  <img :src="item.image" alt="家电图片" />
                </template>
                <a-card-meta :title="item.name">
                  <template #description>
                    <div class="appliance-info">
                      <span class="price">¥{{ item.price }}/日</span>
                      <a-tag color="blue">{{ item.category }}</a-tag>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from '@/components/TheHeader'
import TheSider from '@/components/TheSider'
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue';

// const topNavKeys = ref(['home']);
// const sideNavKeys = ref(['1']);

const appliances = ref([
  {
    id: 1,
    name: '智能变频空调',
    category: '空调',
    price: 15.9,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 2,
    name: '双开门冰箱',
    category: '冰箱',
    price: 12.5,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 3,
    name: '滚筒洗衣机',
    category: '洗衣机',
    price: 9.9,
    image: 'https://via.placeholder.com/300x200'
  },
  {
    id: 4,
    name: '4K 智能电视',
    category: '电视',
    price: 8.8,
    image: 'https://via.placeholder.com/300x200'
  }
]);
const topMenuItems = ref([
  { key: 'home', label: '首页' },
  { key: 'category', label: '系统通知' },
  { key: 'about', label: '关于我们' }
]);

const handleLogout = () => {
  console.log('执行退出登录逻辑');
  // 实际业务中这里应该调用退出登录接口
  // 并跳转到登录页面
};


// 侧边栏菜单配置
const sideMenuItems = ref([
  {
    key: '1',
    label: '首页概览',
    icon: HomeOutlined
  },
  {
    key: '2',
    label: '个人信息',
    icon: AppstoreOutlined
  },
  {
    key: '3',
    label: '订单管理',
    icon: ShoppingCartOutlined
  },
  {
    key: '4',
    label: '查看家电信息',
    icon: TeamOutlined
  },
  {
    key: '5',
    label: '交易管理',
    icon: ProfileOutlined
  },
  {
    key: '6',
    label: '日志管理',
    icon: QuestionCircleOutlined
  }
]);

const isCollapsed = ref(false);

const handleMenuSelect = (key) => {
  console.log('选中菜单:', key);
  // 根据 key 执行路由跳转或其他操作
};
</script>

<style scoped>
/* 顶部导航栏样式 */
.header {
  background: #2d3a4b;
  padding: 0 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  height: 32px;
}

.title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  background: transparent;
  line-height: 62px;
  border-bottom: none;
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn {
  margin-left: 16px;
}

/* 侧边栏样式 */
/*.sider {*/
/*  background: #fff;*/
/*  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.05);*/
/*}*/

/*.side-menu {*/
/*  border-right: none;*/
/*}*/

/* 新增侧边栏菜单项样式 */
.side-menu {
  padding: 16px 0;
}

.side-menu .ant-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 8px;
}

.side-menu .ant-menu-item:hover {
  background: #f5f5f5;
}

.side-menu .ant-menu-item-selected {
  background: #e6f7ff;
  color: #1890ff;
}

/* 内容区域样式 */
.content {
  /*padding: 24px;*/
  /*background: #f0f2f5;*/
  /*min-height: calc(100vh - 64px);*/
  margin-left: 220px;
  margin-top: 64px; /* 与导航栏高度一致 */
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.banner {
  background: linear-gradient(135deg, #1890ff, #205bcf);
  color: #fff;
  padding: 48px 32px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
}

.banner h1 {
  font-size: 32px;
  margin-bottom: 16px;
}

.banner p {
  font-size: 18px;
  margin-bottom: 24px;
}

.recommend-card {
  border-radius: 8px;
}

.appliance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.price {
  color: #f5222d;
  font-weight: bold;
}

:deep(.ant-card-cover img) {
  height: 200px;
  object-fit: cover;
}
</style>