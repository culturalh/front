<template>
  <div class="appliance-management">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <a-button type="primary" @click="showModal('add')">
        <template #icon><PlusOutlined /></template>
        新增家电
      </a-button>
      <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索家电名称"
          enter-button="搜索"
          style="width: 300px; margin-left: 16px"
          @search="handleSearch"
      />
    </div>

    <!--   分页属性     :pagination="{ pageSize: 8 }"-->
    <!-- 家电信息表格 -->
    <a-table
        :columns="columns"
        :data-source="appliances"
        :pagination="false"
        rowKey="id"
        bordered
    >
      <template #picture="{ text }">
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
              @change="checked => toggleStatus(record.id, checked)"
          />
          <a-popconfirm
              title="确定要删除这个家电吗？"
              @confirm="() => handleDelete(record.id)"
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
            name="applianceName"
            :rules="[{ required: true, message: '请输入家电名称' }]"
        >
          <a-input v-model:value="currentAppliance.applianceName" />
        </a-form-item>

        <a-form-item
            label="家电分类"
            name="deviceType"
            :rules="[{ required: true, message: '请选择分类' }]"
        >
          <a-select
              v-model:value="currentAppliance.deviceType"
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
          <span style="margin-left: 8px">元/月</span>
        </a-form-item>

<!--        <a-form-item-->
<!--            label="创建时间"-->
<!--            name="createTime"-->
<!--            :rules="[{ required: true, message: '请输入库存数量' }]"-->
<!--        >-->
<!--          <a-input-number-->
<!--              v-model:value="currentAppliance.createTime"-->
<!--              :min="0"-->
<!--              style="width: 200px"-->
<!--          />-->
<!--        </a-form-item>-->

        <a-form-item
            label="家电图片"
            name="picture"
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
import {ref, reactive, onMounted} from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import axios from "axios";
import { useUserStore } from '@/stores/userStore'


const userStore = useUserStore()
onMounted(()=>{
  getApplianceInfo();
  fetchCategories();
})


// 模拟初始数据
const initData = [
  {
    id: 1,
    applianceName: '智能冰箱',
    deviceType: '1',
    price: 3999.00,
    createTime: 50,
    picture: 'https://example.com/fridge.jpg',
    description: '节能环保，大容量设计',
    status: '1'
  },
  {
    id: 2,
    applianceName: '滚筒洗衣机',
    deviceType: '2',
    price: 2999.00,
    createTime: 30,
    picture: 'https://example.com/washer.jpg',
    description: '静音设计，高效洗净',
    status: '0'
  }
];

// 响应式数据
const appliances = ref([...initData]);
const searchQuery = ref('');
const modalVisible = ref(false);
const modalType = ref('add');
const currentAppliance = reactive({});
const imageFiles = ref([]);

const categoryOptions = ref([]);

// 获取家电分类方法
const fetchCategories = async () => {
  try {
    const response = await axios.get('/merchant/applianceInfo/getClassify');
    categoryOptions.value = response.data.content.map(item => ({
      value: item.categoryId.toString(), // 根据实际接口返回字段调整
      label: item.deviceType  // 根据实际接口返回字段调整
    }));
    console.log('分类数据加载成功:', categoryOptions.value);
  } catch (error) {
    console.error('获取分类失败:', error);
    message.error('分类数据加载失败，请稍后重试');
  }
};

// 表格列配置
const columns = [
  {
    title: '家电名称',
    dataIndex: 'applianceName',
    width: 200
  },
  {
    title: '分类',
    dataIndex: 'deviceType',
    width: 120,
    customRender: ({ text }) => {
      const category = categoryOptions.value.find(opt => opt.label === text);
      return category ? category.label : '未知分类';
    }
  },
  {
    title: '价格(元/月)',
    dataIndex: 'price',
    width: 120,
    customRender: ({ text }) => `¥${text.toFixed(2)}`
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100
  },
  {
    title: '图片',
    dataIndex: 'picture',
    width: 120,
    slots: { customRender: 'picture' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    slots: { customRender: 'status' }
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 100
  },
  {
    title: '操作',
    width: 200,
    slots: { customRender: 'action' }
  }
];


// 查询家电信息（可以模糊查询）
const getApplianceInfo = async () => {
  try {
    await axios.get(  '/merchant/applianceInfo/get',
        {
          params: {
            searchQuery: searchQuery.value,
            //只能对本商家的家电产品进行管理
            merchantId: userStore.userInfo.id
          },
        }
    ).then(response => {
      if (response.data.success) {
        console.log('response.data.content', response.data.content)
        appliances.value = response.data.content;
        console.log('appliances.value', appliances.value)
      } else {
        console.error('Failed to fetch applianceInfo');
      }
    });
  } catch (error) {
    console.error('Error fetching applianceInfo:', error);
  }
};


// 增加家电信息
const addApplianceInfo =  () => {
  try {
    const formData = new FormData();
    const deviceTypeLabel = categoryOptions.value.find(opt => opt.value === currentAppliance.deviceType)?.label;
    formData.append('applianceName', currentAppliance.applianceName);
    formData.append('deviceType',  deviceTypeLabel);
    formData.append('price',  currentAppliance.price);
    formData.append('description', currentAppliance.description)
    formData.append('merchantId',userStore.userInfo.id)
    // 如果有新上传的头像文件
    if (imageFiles.value.length > 0 && imageFiles.value[0].originFileObj) {
      // 添加文件对象到 FormData
      formData.append('picture', imageFiles.value[0].originFileObj);
    } else if (currentAppliance.picture) {
      // 如果未上传新文件但已有头像，传递原有地址（可选）
      formData.append('existingPicture',currentAppliance.picture);
    }

    axios.post('/merchant/applianceInfo/add',
        formData
        ,{
          headers: {
            'Content-Type': 'multipart/form-data'//设置请求头
          }
        }).then(response => {
      console.log("response.data.content:",response.data.success);
      // Object.assign(userInfo, response.data.content);
      Object.assign(appliances, response.data.content);
      //重新刷新数据
      getApplianceInfo();
      message.success("新增成功");
    })

    modalVisible.value = false;
    // message.success('成功');
  } catch (error) {
    message.error('保存失败，请重试');
  }
};


// 修改家电分类
const updateApplianceInfo =  () => {
  try {
    const formData = new FormData();
    const deviceTypeLabel = categoryOptions.value.find(opt => opt.value === currentAppliance.deviceType)?.label;
    formData.append('id', currentAppliance.id);
    formData.append('applianceName', currentAppliance.applianceName);
    formData.append('deviceType',  deviceTypeLabel);
    formData.append('price',  currentAppliance.price);
    formData.append('status',  currentAppliance.status)
    formData.append('description', currentAppliance.description)
    formData.append('merchantId',userStore.userInfo.id)
    // 如果有新上传的头像文件
    if (imageFiles.value.length > 0 && imageFiles.value[0].originFileObj) {
      // 添加文件对象到 FormData
      formData.append('picture', imageFiles.value[0].originFileObj);
    } else if (currentAppliance.picture) {
      // 如果未上传新文件但已有头像，传递原有地址（可选）
      formData.append('existingPicture',currentAppliance.picture);
    }
    axios.post('/merchant/applianceInfo/update',
        formData
        ,{
          headers: {
            'Content-Type': 'multipart/form-data'//设置请求头
          }
        }).then(response => {
      console.log("response.data.content:",response.data.success);
      // Object.assign(userInfo, response.data.content);
      Object.assign(appliances, response.data.content);
      //重新刷新数据
      getApplianceInfo();
      message.success("修改成功");
    })

    modalVisible.value = false;
    // message.success('成功');
  } catch (error) {
    console.log('error', error)
    message.error('保存失败，请重试');
  }
};

// 删除家电分类
const deleteApplianceInfo = async (id) => {
  try {
    await axios.delete(`/merchant/applianceInfo/delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.data.success) {
        message.success('删除成功');
        getApplianceInfo();
      }
    });
  } catch (error) {
    console.error('Error deleting applianceClassify:', error);
  }
};


// 显示模态框
const showModal = (type, record) => {
  modalType.value = type;
  if (type === 'edit') {
    console.log('record', record)
    const category = categoryOptions.value.find(opt => opt.label === record.deviceType);
    Object.assign(currentAppliance, {
      ...record,
      deviceType: category ? category.value : undefined
    });
// 修改后（补充必要字段）
    if (record.picture) {
      imageFiles.value = [{
        uid: '-1',
        name: 'preview-image',
        status: 'done',          // 必须字段
        url: record.picture,     // 原图地址
        thumbUrl: record.picture // 缩略图地址（用于预览）
      }];
    }
  }
  else {
    Object.assign(currentAppliance, {
      id: null,
      applianceName: '',
      deviceType: undefined,
      price: 0,
      createTime: '',
      picture: '',
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

    if (modalType.value === 'add') {
      addApplianceInfo();
    } else {
      updateApplianceInfo();
    }

    modalVisible.value = false;
  } catch (error) {
    message.error('操作失败，请重试');
  }
};

const handleSearch = () => {
    getApplianceInfo();
};

//更新状态
const updateStatus = async (id,status) => {
  try {
    axios.post('/merchant/applianceInfo/updateStatus',
        {
          id: id,
          status: status,
        }
        ,{
          headers: {
            'Content-Type': 'application/json'//设置请求头
          }
        }).then(response => {
      console.log("response.data.success:",response.data.success);
      // Object.assign(userInfo, response.data.content);
      //重新刷新数据
      getApplianceInfo();
      // message.success("修改成功");
    })
    message.success('信息更新成功');
  } catch (error) {
    message.error('保存失败，请重试');
  }
};

// 切换状态
const toggleStatus = (id, checked) => {
  const index = appliances.value.findIndex(d => d.id === id);
  if (index !== -1) {
    appliances.value[index].status = checked ? '1' : '0';
  }
  updateStatus(id,appliances.value[index].status);
};

// 删除项
const handleDelete = (id) => {
  // appliances.value = appliances.value.filter(d => d.id !== id);
  deleteApplianceInfo(id);
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