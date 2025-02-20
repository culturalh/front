<template>
  <a-layout class="notification-management">
    <a-layout-content class="notification-content">
      <div class="notification-actions">
        <a-button type="primary" @click="openCreateModal">发布通知</a-button>
      </div>
      <div class="notification-list">
        <div v-for="(notification,index) in notifications" :key="notification.id" class="notification-card">
          <a-card :hoverable="true" :bordered="true">
            <div class="content-container">
              <span class="notification-id">编号：{{ index + 1 }}</span>
              <span class="notification-status">
<!--                <a-tag :color="notification.status === 'published' ? 'green' : 'gray'">-->
<!--                  {{ notification.status === 'published' ? '已发布' : '草稿' }}-->
<!--                </a-tag>-->
              </span>
            </div>
            <div class="notification-content">
              <h3 class="bold-title">{{ notification.title }}</h3>
              <div class="scrollable-content">
                <p class="content-text">{{ notification.content }}</p>
              </div>
              <div class="notification-meta">
                <span>发布时间：{{ notification.createTime }}</span>
              </div>
            </div>
            <div class="notification-actions">
              <a-space>
                <a-button size="small" @click="editNotification(notification)">编辑</a-button>
                <a-popconfirm
                    title="确定删除该通知吗？"
                    @confirm="deleteNotification(notification.id)"
                >
                  <a-button size="small" danger>删除</a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </a-card>
        </div>
      </div>

      <!-- 发布通知模态框 -->
      <a-modal
          v-model:visible="createModalVisible"
          title="发布通知"
          @ok="saveNotification"
          width="600px"
      >
        <a-form :model="formState" layout="vertical">
          <a-form-item label="通知标题" required>
            <a-input v-model:value="formState.title" placeholder="请输入通知标题" />
          </a-form-item>
          <a-form-item label="通知内容" required>
            <a-textarea
                v-model:value="formState.content"
                placeholder="请输入通知内容（最多200字符）"
                :rows="6"
                :maxlength="200"
                @input="handleContentInput"
            />
            <div class="char-counter">
              {{ formState.content.length }}/200
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import axios from "axios";

// 模拟初始数据
const notifications = ref([
  {
    id: 1,
    title: '系统维护通知',
    content: '系统将于2024年10月15日进行维护，届时部分功能将不可用。',
    createTime: '2024-10-01 10:00:00',
    status: 'published',
  },
  {
    id: 2,
    title: '新功能上线',
    content: '我们很高兴地宣布，新版本的家电租赁管理系统已正式上线！',
    createTime: '2024-10-02 15:30:00',
    status: 'draft',
  },
]);

// 表格列配置
// const columns = [
//   {
//     title: '编号',
//     dataIndex: 'id',
//     width: 100,
//   },
//   {
//     title: '标题',
//     dataIndex: 'title',
//     ellipsis: true,
//   },
//   {
//     title: '内容',
//     dataIndex: 'content',
//     ellipsis: true,
//   },
//   {
//     title: '发布时间',
//     dataIndex: 'createTime',
//     width: 180,
//   },
//   {
//     title: '操作',
//     width: 120,
//     slots: { customRender: 'actions' },
//   },
// ];

// 输入内容不能超过200字符
const handleContentInput = (e) => {
  const cleanValue = e.target.value.replace(/\n/g, '');
  if (cleanValue.length > 200) {
    formState.content = cleanValue.slice(0, 200);
    message.warning('已达到最大字符限制（不含换行符）');
    return;
  }
  formState.content = cleanValue;
};

// 响应式数据
const createModalVisible = ref(false);
const formState = reactive({
  id: null,
  title: '',
  content: '',
});

// 打开发布通知模态框
const openCreateModal = () => {
  formState.id = null;
  formState.title = '';
  formState.content = '';
  createModalVisible.value = true;
};

// 查询通知
const getNotification = async () => {
  try {
    const response = await axios.get('/admin/notification/get', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success) {
      notifications.value = response.data.content;
    } else {
      console.error('Failed to fetch notifications');
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

// 增加通知
const addNotification = async () => {
  try {
    console.log("formState:", formState);
    await axios.post('/admin/notification/add', {
      id: formState.id,
      title: formState.title,
      content: formState.content,
    }).then(response => {
      if (response.data.success) {
        getNotification();
      }
    });
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

// 修改通知
const updateNotification = async () => {
  try {
    await axios.post('/admin/notification/update', {
      id: formState.id,
      title: formState.title,
      content: formState.content,
    }).then(response => {
      if (response.data.success) {
        getNotification();
      }
    });
  } catch (error) {
    console.error('Error updating notification:', error);
  }
};

// 删除通知
const deleteNotice = async (id) => {
  try {
    await axios.delete(`/admin/notification/delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.data.success) {
        getNotification();
      }
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

// 保存通知
const saveNotification = () => {
  if (!formState.title || !formState.content) {
    message.error('请填写完整的通知信息');
    return;
  }

  if (formState.id) {
    updateNotification();
  } else {
    addNotification();
  }

  createModalVisible.value = false;
  message.success('通知已保存');
};

// 编辑通知
const editNotification = (record) => {
  Object.assign(formState, record);
  createModalVisible.value = true;
};

// 删除通知
const deleteNotification = (id) => {
  deleteNotice(id);
  message.success('通知已删除');
};

onMounted(() => {
  getNotification();
});
</script>

<style scoped>
/* 修改列表容器为垂直布局 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px; /* 控制最大宽度 */
  margin: 0 auto;
}

/* 卡片样式 */
.notification-card {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;
}

/* 内容容器 */
.content-container {
  position: relative;
  max-height: 200px; /* 初始最大高度 */
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 悬停时展开内容 */
.notification-card:hover .content-container {
  max-height: none;
  overflow: visible;
}

/* 标题截断 */
.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 12px;
}

/* 可滚动内容区域 */
.scrollable-content {
  max-height: 150px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 内容文本样式 */
.content-text {
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 默认显示4行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
}

/* 悬停时显示全部内容 */
.notification-card:hover .content-text {
  -webkit-line-clamp: unset;
  overflow: visible;
}

/* 滚动条样式 */
.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.notification-id strong {
  font-weight: 600;  /* 600比bold更现代的粗细 */
  color: #333;       /* 加深颜色提升可读性 */
}
.bold-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #1890ff;    /* 品牌色突出标题 */

  /* 保持原有截断效果 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /*max-width: 90%;    !* 防止操作按钮区域重叠 *!*/
}
</style>