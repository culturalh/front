<template>
  <div class="appliance-management">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <a-button type="primary" @click="showModal('add')">
        <template #icon><PlusOutlined /></template>
        新增家电
      </a-button>
      <a-input-search
          v-model:value="searchValue"
          placeholder="搜索家电名称"
          enter-button="搜索"
          style="width: 300px; margin-left: 16px"
          @search="handleSearch"
      />
    </div>

    <!-- 家电信息表格 -->
    <a-table
        :columns="columns"
        :data-source="filteredAppliances"
        :pagination="{ pageSize: 8 }"
        rowKey="appliance_id"
        bordered
    >
      <template #image="{ text }">
        <a-image
            :src="text"
            width="100"
            v-if="text"
        />
        <span v-else>无图片</span>
      </template>

      <template #status="{ text }">
        <a-tag :color="text === '1' ? 'green' : 'red'">
          {{ text === '1' ? '已上架' : '已下架' }}
        </a-tag>
      </template>

      <template #action="{ record }">
        <a-space>
          <a-button size="small" @click="showModal('edit', record)">编辑</a-button>
          <a-switch
              :checked="record.status === '1'"
              @change="checked => toggleStatus(record.appliance_id, checked)"
          />
          <a-popconfirm
              title="确定要删除这个家电吗？"
              @confirm="() => handleDelete(record.appliance_id)"
          >
            <a-button size="small" danger>删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 新增/编辑模态框 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="modalType === 'add' ? '新增家电' : '编辑家电信息'"
        @ok="handleSubmit"
        width="800px"
    >
      <a-form
          ref="formRef"
          :model="currentAppliance"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
      >
        <a-form-item
            label="家电名称"
            name="name"
            :rules="[{ required: true, message: '请输入家电名称' }]"
        >
          <a-input v-model:value="currentAppliance.name" />
        </a-form-item>

        <a-form-item
            label="家电分类"
            name="category"
            :rules="[{ required: true, message: '请选择分类' }]"
        >
          <a-select
              v-model:value="currentAppliance.category"
              :options="categoryOptions"
          />
        </a-form-item>

        <a-form-item
            label="价格"
            name="price"
            :rules="[{ required: true, message: '请输入价格' }]"
        >
          <a-input-number
              v-model:value="currentAppliance.price"
              :min="0"
              :precision="2"
              style="width: 200px"
          />
          <span style="margin-left: 8px">元</span>
        </a-form-item>

        <a-form-item
            label="库存数量"
            name="stock"
            :rules="[{ required: true, message: '请输入库存数量' }]"
        >
          <a-input-number
              v-model:value="currentAppliance.stock"
              :min="0"
              style="width: 200px"
          />
        </a-form-item>

        <a-form-item
            label="家电图片"
            name="image"
        >
          <a-upload
              v-model:file-list="imageFiles"
              list-type="picture-card"
              :before-upload="beforeUpload"
              :max-count="1"
          >
            <div v-if="imageFiles.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item
            label="家电描述"
            name="description"
        >
          <a-textarea
              v-model:value="currentAppliance.description"
              :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

// 模拟初始数据
const initData = [
  {
    appliance_id: 1,
    name: '智能冰箱',
    category: '1',
    price: 3999.00,
    stock: 50,
    image: 'https://example.com/fridge.jpg',
    description: '节能环保，大容量设计',
    status: '1'
  },
  {
    appliance_id: 2,
    name: '滚筒洗衣机',
    category: '2',
    price: 2999.00,
    stock: 30,
    image: 'https://example.com/washer.jpg',
    description: '静音设计，高效洗净',
    status: '0'
  }
];

// 响应式数据
const appliances = ref([...initData]);
const searchValue = ref('');
const modalVisible = ref(false);
const modalType = ref('add');
const currentAppliance = reactive({});
const imageFiles = ref([]);

// 分类选项
const categoryOptions = [
  { value: '1', label: '大家电' },
  { value: '2', label: '厨房电器' },
  { value: '3', label: '生活电器' }
];

// 表格列配置
const columns = [
  {
    title: '家电名称',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 120,
    customRender: ({ text }) => {
      return categoryOptions.find(opt => opt.value === text)?.label || '-';
    }
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 120,
    customRender: ({ text }) => `¥${text.toFixed(2)}`
  },
  {
    title: '库存',
    dataIndex: 'stock',
    width: 100
  },
  {
    title: '图片',
    dataIndex: 'image',
    width: 120,
    slots: { customRender: 'image' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slots: { customRender: 'status' }
  },
  {
    title: '操作',
    width: 200,
    slots: { customRender: 'action' }
  }
];

// 搜索功能
const filteredAppliances = computed(() => {
  return appliances.value.filter(item =>
      item.name.includes(searchValue.value)
  );
});

// 显示模态框
const showModal = (type, record) => {
  modalType.value = type;
  if (type === 'edit') {
    Object.assign(currentAppliance, record);
    if (record.image) {
      imageFiles.value = [{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: record.image
      }];
    }
  } else {
    Object.assign(currentAppliance, {
      appliance_id: null,
      name: '',
      category: undefined,
      price: 0,
      stock: 0,
      image: '',
      description: '',
      status: '1'
    });
    imageFiles.value = [];
  }
  modalVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
  try {
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (modalType.value === 'add') {
      const newId = appliances.value.length
          ? Math.max(...appliances.value.map(d => d.appliance_id)) + 1
          : 1;
      appliances.value.push({
        ...currentAppliance,
        appliance_id: newId,
        image: imageFiles.value[0]?.url || ''
      });
    } else {
      const index = appliances.value.findIndex(
          d => d.appliance_id === currentAppliance.appliance_id
      );
      appliances.value.splice(index, 1, {
        ...currentAppliance,
        image: imageFiles.value[0]?.url || ''
      });
    }

    modalVisible.value = false;
    message.success('操作成功');
  } catch (error) {
    message.error('操作失败，请重试');
  }
};

// 切换状态
const toggleStatus = (id, checked) => {
  const index = appliances.value.findIndex(d => d.appliance_id === id);
  if (index !== -1) {
    appliances.value[index].status = checked ? '1' : '0';
  }
};

// 删除项
const handleDelete = (id) => {
  appliances.value = appliances.value.filter(d => d.appliance_id !== id);
  message.success('删除成功');
};

// 文件上传处理
const beforeUpload = file => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件');
  }
  return isImage;
};
</script>

<style scoped>
.appliance-management {
  padding: 24px;
}

.toolbar {
  margin-bottom: 24px;
}

.ant-table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-form-item {
  margin-bottom: 16px;
}
</style>