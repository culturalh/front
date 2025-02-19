<template>
  <div class="table-container">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <a-input-search
          v-model="searchQuery"
          placeholder="请输入商家名称"
          enter-button="搜索"
          @search="matchSearch"
          style="width: 300px; margin-right: 16px;"
      />
<!--      <a-button type="primary" @click="showModal('add')">新增分类</a-button>-->
    </div>

    <!-- 数据表格 -->
    <div class="table">
      <table>
        <thead>
        <tr>
          <th v-for="column in columns" :key="column.dataIndex">{{ column.title }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index ) in dataSource" :key="item.id">
          <td>{{ index + 1 }}  </td>
          <td>{{ item.username }}</td>
<!--          <td>-->
<!--            <a-tag :color="item.is_active === '1' ? 'green' : 'red'">-->
<!--              {{ item.is_active === '1' ? '已启用' : '已禁用' }}-->
<!--            </a-tag>-->
<!--          </td>-->
          <td> {{ item.name }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <a-space>
              <a-button size="small" @click="showModal('edit', item)">详情</a-button>
              <a-button
                  size="small"
                  :type="item.is_active === '1' ? 'danger' : 'primary'"
                  @click="toggleStatus(item)"
              >
                {{ item.is_active === '1' ? '禁用' : '启用' }}
              </a-button>
<!--              <a-popconfirm-->
<!--                  title="确认删除该分类吗？"-->
<!--                  @confirm="deleteItem(item.category_id)"-->
<!--              >-->
<!--                <a-button size="small" danger>删除</a-button>-->
<!--              </a-popconfirm>-->
            </a-space>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增/编辑模态框 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="modalType === 'add' ? '新增分类' : '编辑分类'"
        @ok="handleSubmit"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item
            label="分类编号"
            name="category_id"
            :rules="[{ required: true, message: '请输入分类编号' }]"
        >
          <a-input v-model:value="formState.category_id" />
        </a-form-item>
        <a-form-item
            label="分类名称"
            name="device_type"
            :rules="[{ required: true, message: '请输入分类名称' }]"
        >
          <a-input v-model:value="formState.device_type" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';

// 初始模拟数据
const initData = [
  {
    id: 1,
    username: 'zhangsan',
    name: '张三',
    phone: '123456789',
    // is_delete: '0'
  },
  {
    id: 1,
    username: 'wangwu',
    name: '王五',
    phone: '123456789',
    // is_delete: '0'
  }
];

// 表格列配置
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    width: 120
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: 120
  },
  {
    title: '操作',
    width: 220,
    slots: { customRender: 'action' }
  }
];

// 响应式数据
const dataSource = ref([...initData]);
const searchQuery = ref('');

// 过滤后的数据源
// const filteredDataSource = computed(() => {
//   return dataSource.value.filter(item =>
//       item.device_type.includes(searchQuery.value)
//   );
// });

const modalVisible = ref(false);
const modalType = ref('add');
const formState = reactive({
  category_id: null,
  device_type: '',
});

// 显示模态框
const showModal = (type, record) => {
  modalType.value = type;
  if (type === 'edit') {
    Object.assign(formState, record);
  } else {
    formState.device_type = '';
  }
  modalVisible.value = true;
};

// //查询
// const matchSearch = () => {
//   console.log('查询内容:', searchQuery.value);
//   // 在这里调用查询逻辑
// };

// 提交表单
const handleSubmit = () => {
  if (!formState.device_type) {
    message.error('请填写分类名称');
    return;
  }

  if (modalType.value === 'add') {
    const newId = dataSource.value.length
        ? Math.max(...dataSource.value.map(d => d.category_id)) + 1
        : 1;

    dataSource.value.push({
      ...formState,
      category_id: newId,
      is_active: '1',
      is_delete: '0',
      created_time: new Date().toLocaleString()
    });
  } else {
    const index = dataSource.value.findIndex(
        d => d.category_id === formState.category_id
    );
    dataSource.value.splice(index, 1, formState);
  }

  modalVisible.value = false;
  message.success('操作成功');
};

// 切换状态
const toggleStatus = (record) => {
  record.is_active = record.is_active === '1' ? '0' : '1';
};

// 删除项
// const deleteItem = (id) => {
//   dataSource.value = dataSource.value.filter(d => d.category_id !== id);
//   message.success('删除成功');
// };

// 搜索功能
const matchSearch = () => {
  // 搜索功能已经通过 computed 实现，无需额外操作
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}

.table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: bold;
}

tr:hover {
  background-color: #f0f2f5;
}
</style>