<template>
  <a-layout-header class="custom-header">
    <div class="header-container">
      <!-- 品牌区 -->
      <div class="brand">
        <img :src="logo" alt="Logo" class="logo" />
        <h1 class="system-name">{{ title }}</h1>
      </div>

      <!-- 导航菜单 -->
      <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          :theme="theme"
          class="nav-menu"
      >

        <a-menu-item
            v-for="item in menuItems"
            :key="item.key"
        >
          <router-link :to="item.to">
              {{ item.label }}
          </router-link>
        </a-menu-item>
      </a-menu>

      <!-- 右侧操作区 -->
      <div class="user-panel">
        <slot name="user-action">
          <a-button
              type="primary"
              @click="handleLogout"
          >
            {{ logoutText }}
          </a-button>
        </slot>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
import { ref,defineProps,defineEmits } from 'vue';

const props = defineProps({
  logo: {
    type: String,
    default: require('@/assets/logo.png')
  },
  title: {
    type: String,
    default: '家电租赁系统'
  },
  menuItems: {
    type: Array,
    default: () => [
      { key: 'home', label: '首页' },
      { key: 'category', label: '发布系统通知' },
      { key: 'about', label: '关于我们' }
    ]
  },
  theme: {
    type: String,
    default: 'dark' // dark/light
  },
  logoutText: {
    type: String,
    default: '退出登录'
  }
});

const emit = defineEmits(['logout', 'menu-change']);

const selectedKeys = ref([props.menuItems[0]?.key]);

const handleLogout = () => {
  emit('logout');
};
</script>

<style scoped>
/* 修改后的样式 */
.custom-header {
  /*background: v-bind('theme === "dark" ? "#2d3a4b" : "#fff"');*/
  /*padding: 0 24px;*/
  /*height: 64px;*/
  /*line-height: 64px;*/

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 保留原有样式 */
  background: v-bind('theme === "dark" ? "#2d3a4b" : "#fff"');
  padding: 0 24px;
  line-height: 64px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 32px;
}

.system-name {
  color: v-bind('theme === "dark" ? "#fff" : "#000"');
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.nav-menu {
  flex: 1;
  margin-left: 40px;
  background: transparent;
  border-bottom: none;

}

.user-panel {
  margin-left: auto;
}
</style>