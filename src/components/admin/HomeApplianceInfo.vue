<template>
  <div class="table-container">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <a-input-search
          v-model:value="searchQuery"
          placeholder="请输入分类名称"
          enter-button="搜索"
          @search="onSearch"
          style="width: 300px; margin-right: 16px;"
      />
      <a-button type="primary" @click="showModal('add')">新增分类</a-button>
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
        <tr v-for="(item, index) in dataSource" :key="item.categoryId">
          <td>{{ index + 1 }}</td>
          <td>{{ item.deviceType }}</td>
          <td>
            <a-tag :color="item.isActive === '1' ? 'green' : 'red'">
              {{ item.isActive === '1' ? '已启用' : '已禁用' }}
            </a-tag>
          </td>
          <td>{{ item.createdTime }}</td>
          <td>
            <a-space>
              <a-button size="small" @click="showModal('edit', item)">编辑</a-button>
              <a-button
                  size="small"
                  :type="item.isActive === '1' ? 'danger' : 'primary'"
                  @click="toggleStatus(item)"
              >
                {{ item.isActive === '1' ? '禁用' : '启用' }}
              </a-button>
              <a-popconfirm
                  title="确认删除该分类吗？"
                  @confirm="deleteItem(item.categoryId)"
              >
                <a-button size="small" danger>删除</a-button>
              </a-popconfirm>
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
            label="分类名称"
            name="deviceType"
            :rules="[{ required: true, message: '请输入分类名称' }]"
        >
          <a-input v-model:value="formState.deviceType" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import { message } from 'ant-design-vue';
import axios from "axios";

// 初始模拟数据
const initData = [
  {
    categoryId: 1,
    deviceType: '大家电',
    isActive: '1',
    createdTime: '2023-10-01 10:00:00',
  },
  {
    categoryId: 2,
    deviceType: '厨房电器',
    isActive: '0',
    createdTime: '2023-10-02 14:30:00',
  }
];

// 表格列配置
const columns = [
  {
    title: '分类编号',
    dataIndex: 'categoryId',
    width: 120
  },
  {
    title: '分类名称',
    dataIndex: 'deviceType',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'isActive',
    // slots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    width: 200
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

const modalVisible = ref(false);
const modalType = ref('add');
const formState = reactive({
  categoryId: null,
  deviceType: '',
});

// 显示模态框
const showModal = (type, record) => {
  modalType.value = type;
  if (type === 'edit') {
    Object.assign(formState, record);
  } else {
    formState.deviceType = '';
  }
  modalVisible.value = true;
};

// 提交表单
const handleSubmit = () => {
  if (!formState.deviceType) {
    message.error('请填写分类名称');
    return;
  }

  if (modalType.value === 'add') {
    addApplianceClassify();
  } else {
   updateApplianceClassify();
  }

  modalVisible.value = false;
};

// 切换状态
const toggleStatus = (record) => {
  // 直接修改 formState 的属性
  formState.categoryId = record.categoryId;
  formState.deviceType = record.deviceType;
  formState.isActive = record.isActive === '1' ? '0' : '1'; // 切换状态
  console.log('formState',formState)
  //修改是否禁用
  // formState.isActive = record.isActive;
  console.log('formState.isActive',formState.isActive)
  //更新家电分类
  updateApplianceClassify();
  // 重新获取家电分类
  getApplianceClassify();
};

// 删除项
const deleteItem = (categoryId) => {
  deleteApplianceClassify(categoryId);
};

// 搜索功能
const onSearch = () => {
  getApplianceClassify();
};

onMounted(()=>{
  getApplianceClassify();
})


// 查询家电分类（可以模糊查询）
const getApplianceClassify = async () => {
  try {
    await axios.get(  '/admin/applianceClassify/get',
        {
          params: {
            searchQuery: searchQuery.value,
          },
        }
     ).then(response => {
      if (response.data.success) {
        console.log('response.data.content', response.data.content)
        dataSource.value = response.data.content;
        console.log('dataSource.value', dataSource.value)
      } else {
        console.error('Failed to fetch applianceClassify');
      }
    });
  } catch (error) {
    console.error('Error fetching applianceClassify:', error);
  }
};

// 增加家电分类
const addApplianceClassify = async () => {
  try {
    await axios.post('/admin/applianceClassify/add', {
      deviceType: formState.deviceType,
      //默认为禁用状态

    }).then(response => {
      if (response.data.success) {
        message.success('添加成功');
        getApplianceClassify();
      }
    });
  } catch (error) {
    console.error('Error adding applianceClassify:', error);
  }
};

// 修改家电分类
const updateApplianceClassify = async () => {
  try {
    await axios.post('/admin/applianceClassify/update', {
      categoryId: formState.categoryId,
      deviceType: formState.deviceType,
      isActive: formState.isActive,
      createdTime: formState.createdTime,
    }).then(response => {
      if (response.data.success) {
        message.success('修改成功');
        getApplianceClassify();
      }
    });
  } catch (error) {
    console.error('Error updating applianceClassify:', error);
  }
};

// 删除家电分类
const deleteApplianceClassify = async (categoryId) => {
  try {
    await axios.delete(`/admin/applianceClassify/delete/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.data.success) {
        message.success('删除成功');
        getApplianceClassify();
      }
    });
  } catch (error) {
    console.error('Error deleting applianceClassify:', error);
  }
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