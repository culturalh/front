<template>
  <a-layout class="notification-management">
    <a-layout-content class="notification-content">
      <div class="notification-header">
        <h1>系统通知管理</h1>
      </div>
      <div class="notification-actions">
        <a-button type="primary" @click="openCreateModal">发布通知</a-button>
      </div>
      <div class="notification-table">
        <a-table
            :columns="columns"
            :data-source="notifications"
            :pagination="false"
            rowKey="notification_id"
        >
          <template #status="{ record }">
            <a-tag :color="record.status === 'published' ? 'green' : 'gray'">
              {{ record.status === 'published' ? '已发布' : '草稿' }}
            </a-tag>
          </template>
          <template #actions="{ record }">
            <a-space>
              <a-button size="small" @click="editNotification(record)">编辑</a-button>
              <a-popconfirm
                  title="确定删除该通知吗？"
                  @confirm="deleteNotification(record.notification_id)"
              >
                <a-button size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
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
                placeholder="请输入通知内容"
                rows={6}
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-model:value="formState.status" :options="statusOptions" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

// 模拟初始数据
const notifications = ref([
  {
    notification_id: 1,
    title: '系统维护通知',
    content: '系统将于2024年10月15日进行维护，届时部分功能将不可用。',
    status: 'published',
    created_at: '2024-10-01 10:00:00',
  },
  {
    notification_id: 2,
    title: '新功能上线',
    content: '我们很高兴地宣布，新版本的家电租赁管理系统已正式上线！',
    status: 'draft',
    created_at: '2024-10-02 15:30:00',
  },
]);

// 表格列配置
const columns = [
  {
    title: '通知ID',
    dataIndex: 'notification_id',
    width: 100,
  },
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '内容',
    dataIndex: 'content',
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: 180,
  },
  {
    title: '操作',
    width: 120,
    slots: { customRender: 'actions' },
  },
];

// 状态选项
const statusOptions = [
  { value: 'published', label: '已发布' },
  { value: 'draft', label: '草稿' },
];

// 响应式数据
const createModalVisible = ref(false);
const formState = reactive({
  notification_id: null,
  title: '',
  content: '',
  status: 'draft',
});

// 打开发布通知模态框
const openCreateModal = () => {
  createModalVisible.value = true;
};

// 保存通知
const saveNotification = () => {
  if (!formState.title || !formState.content) {
    message.error('请填写完整的通知信息');
    return;
  }

  if (formState.notification_id) {
    // 更新现有通知
    const index = notifications.value.findIndex(
        (n) => n.notification_id === formState.notification_id
    );
    notifications.value.splice(index, 1, formState);
  } else {
    // 添加新通知
    const newId = notifications.value.length > 0
        ? Math.max(...notifications.value.map(n => n.notification_id)) + 1
        : 1;
    notifications.value.push({
      ...formState,
      notification_id: newId,
      created_at: new Date().toLocaleString(),
    });
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
  notifications.value = notifications.value.filter(n => n.notification_id !== id);
  message.success('通知已删除');
};
</script>

<style scoped>
.notification-management {
  min-height: 100vh;
  background: #f5f5f5;
}

.notification-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.notification-header {
  margin-bottom: 24px;
}

.notification-actions {
  margin-bottom: 24px;
}

.notification-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>