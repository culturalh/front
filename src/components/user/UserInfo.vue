<template>
  <div class="merchant-detail">
    <a-card title="商家信息" :bordered="false" class="info-card">
      <div class="header-actions">
        <a-button
            v-if="!editMode"
            type="primary"
            @click="enterEditMode"
        >
          <template #icon><EditOutlined /></template>
          编辑信息
        </a-button>
        <a-space v-else>
          <a-button type="primary" @click="saveChanges">保存修改</a-button>
          <a-button @click="cancelEdit">取消</a-button>
        </a-space>
      </div>

      <a-form :model="formState" :label-col="{ span: 4 }">
        <!-- 基本信息 -->
        <a-card title="基本信息" type="inner" class="section-card">
          <a-form-item label="商家名称" required>
            <a-input
                v-if="editMode"
                v-model:value="formState.merchant_name"
                placeholder="请输入商家名称"
            />
            <span v-else>{{ formState.merchant_name || '-' }}</span>
          </a-form-item>

          <a-form-item label="营业状态">
            <a-select
                v-if="editMode"
                v-model:value="formState.business_status"
                :options="statusOptions"
            />
            <a-tag v-else :color="statusColorMap[formState.business_status]">
              {{ statusLabelMap[formState.business_status] }}
            </a-tag>
          </a-form-item>
        </a-card>

        <!-- 联系信息 -->
        <a-card title="联系信息" type="inner" class="section-card">
          <a-form-item label="联系人" required>
            <a-input
                v-if="editMode"
                v-model:value="formState.contact_person"
                placeholder="请输入联系人姓名"
            />
            <span v-else>{{ formState.contact_person || '-' }}</span>
          </a-form-item>

          <a-form-item label="联系电话" required>
            <a-input
                v-if="editMode"
                v-model:value="formState.contact_phone"
                placeholder="请输入联系电话"
            />
            <span v-else>{{ formState.contact_phone || '-' }}</span>
          </a-form-item>

          <a-form-item label="联系地址">
            <a-input
                v-if="editMode"
                v-model:value="formState.address"
                placeholder="请输入详细地址"
            />
            <span v-else>{{ formState.address || '-' }}</span>
          </a-form-item>
        </a-card>

        <!-- 资质信息 -->
        <a-card title="资质证明" type="inner" class="section-card">
          <a-form-item label="营业执照">
            <div v-if="editMode">
              <a-upload
                  v-model:file-list="licenseFiles"
                  list-type="picture-card"
                  :before-upload="beforeUpload"
              >
                <div v-if="licenseFiles.length < 1">
                  <plus-outlined />
                  <div style="margin-top: 8px">上传执照</div>
                </div>
              </a-upload>
            </div>
            <div v-else>
              <a-image
                  v-if="formState.business_license"
                  :src="formState.business_license"
                  width="200"
              />
              <span v-else>未上传</span>
            </div>
          </a-form-item>
        </a-card>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue';

// 模拟初始数据
const originalData = {
  merchant_name: 'XX家电旗舰店',
  business_status: '1',
  contact_person: '张三',
  contact_phone: '13800138000',
  address: '北京市朝阳区XX街道XX号',
  business_license: 'https://example.com/license.jpg'
};

// 响应式数据
const editMode = ref(false);
const formState = reactive({ ...originalData });
const licenseFiles = ref([]);

// 状态选项配置
const statusOptions = [
  { value: '1', label: '正常营业' },
  { value: '2', label: '暂停营业' },
  { value: '3', label: '已关闭' }
];

const statusLabelMap = {
  '1': '正常营业',
  '2': '暂停营业',
  '3': '已关闭'
};

const statusColorMap = {
  '1': 'green',
  '2': 'orange',
  '3': 'red'
};

// 进入编辑模式
const enterEditMode = () => {
  editMode.value = true;
};

// 取消编辑
const cancelEdit = () => {
  Object.assign(formState, originalData);
  editMode.value = false;
};

// 保存修改
const saveChanges = async () => {
  try {
    // 这里应替换为实际API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    Object.assign(originalData, formState);
    message.success('信息更新成功');
    editMode.value = false;
  } catch (error) {
    message.error('保存失败，请重试');
  }
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
.merchant-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.info-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-actions {
  margin-bottom: 24px;
  text-align: right;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 6px;
}

.section-card:last-child {
  margin-bottom: 0;
}

.ant-form-item {
  margin-bottom: 16px;
}
</style>