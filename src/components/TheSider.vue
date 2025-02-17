<template>
  <a-layout-sider
      :width="width"
      :theme="theme"
      :collapsible="collapsible"
      v-model:collapsed="isCollapsed"
      class="side-navigation"
  >
    <!-- 顶部标题 -->
<!--    <div v-if="showTitle" class="sider-title">-->
<!--      <slot name="title">-->
<!--        <h2>{{ title }}</h2>-->
<!--      </slot>-->
<!--    </div>-->

    <!-- 导航菜单 -->
    <a-menu
        v-model:selectedKeys="selectedKeys"
        :mode="menuMode"
        :theme="theme"
        :inline-collapsed="isCollapsed"
        @select="handleSelect"
    >
      <template v-for="item in menuItems" :key="item.key">
        <!-- 带图标的菜单项 -->
        <a-menu-item v-if="!item.children" :key="item.key">
          <template #icon v-if="item.icon">
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>

        <!-- 子菜单 -->
        <a-sub-menu v-else :key="item.key">
          <template #title>
            <component v-if="item.icon" :is="item.icon" />
            <span>{{ item.label }}</span>
          </template>
          <a-menu-item
              v-for="child in item.children"
              :key="child.key"
          >
            {{ child.label }}
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>

    <!-- 底部插槽 -->
    <div v-if="$slots.footer" class="sider-footer">
      <slot name="footer"></slot>
    </div>
  </a-layout-sider>
</template>

<script setup>
import { ref, defineProps,defineEmits ,computed } from 'vue';

const props = defineProps({
  // 菜单配置
  menuItems: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 'key' in item && 'label' in item)
    }
  },

  // 布局配置
  width: {
    type: Number,
    default: 220
  },
  theme: {
    type: String,
    default: 'light', // light/dark
    validator: (v) => ['light', 'dark'].includes(v)
  },
  menuMode: {
    type: String,
    default: 'inline', // inline/vertical
  },

  // 折叠功能
  collapsible: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  },

  // 标题配置
  showTitle: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: '导航菜单'
  }
});

const emit = defineEmits(['update:collapsed', 'menu-select']);

// 处理折叠状态
const isCollapsed = computed({
  get: () => props.collapsed,
  set: (val) => emit('update:collapsed', val)
});

// 当前选中菜单
const selectedKeys = ref([]);

// 菜单选择处理
const handleSelect = ({ key }) => {
  emit('menu-select', key);
};
</script>

<style scoped>
.side-navigation {
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.05);

  position: fixed;
  left: 0;
  top: 64px; /* 根据顶部导航栏高度调整 */
  bottom: 0;
  z-index: 100;
  overflow: auto;
}



.sider-title {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* 菜单项样式 */
:deep(.ant-menu-item) {
  margin: 4px 0;
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.ant-menu-item:hover) {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

/* 折叠状态样式 */
:deep(.ant-layout-sider-collapsed) {
.sider-title h2 {
  display: none;
}

.ant-menu-item span {
  display: none;
}
}

.sider-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
</style>