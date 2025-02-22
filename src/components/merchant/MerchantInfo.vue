<template>
  <a-card class="profile-card">
    <!-- 头部标题 -->
    <div class="profile-header">
      <h2>商家信息</h2>
      <a-button type="primary" @click="editProfile">
        <template #icon><EditOutlined /></template>
        编辑信息
      </a-button>
    </div>

    <!-- 基本信息展示 -->
    <a-descriptions bordered :column="2">
      <a-descriptions-item label="用户名">
        {{ userInfo.username }}
      </a-descriptions-item>
      <a-descriptions-item label="名称">
        {{ userInfo.name || '未填写' }}
      </a-descriptions-item>
<!--      <a-descriptions-item label="性别">-->
<!--        {{ genderMap[userInfo.gender] || '未填写' }}-->
<!--      </a-descriptions-item>-->
<!--      <a-descriptions-item label="年龄">-->
<!--        {{ userInfo.age || '未填写' }}-->
<!--      </a-descriptions-item>-->
      <a-descriptions-item label="角色">
        {{ roleMap[userInfo.role] || '未填写' }}
      </a-descriptions-item>
      <a-descriptions-item label="电话">
        {{ userInfo.phone || '未填写' }}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ userInfo.email || '未填写' }}
      </a-descriptions-item>
      <a-descriptions-item label="头像">
        <a-avatar
            :src="userInfo.avatar + '?t=' + Date.now()"
            :size="100"
            v-if="userInfo.avatar"
        />
        <span v-else>未设置</span>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>

  <!-- 编辑模态框 -->
  <a-modal
      v-model:visible="editModalVisible"
      title="编辑个人信息"
      @ok="handleSave"
      width="600px"
  >
    <a-form
        :model="editForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
    >
      <a-form-item label="名称">
        <a-input v-model:value="editForm.name" />
      </a-form-item>
<!--      <a-form-item label="性别">-->
<!--        <a-select v-model:value="editForm.gender">-->
<!--          <a-select-option value="0">女</a-select-option>-->
<!--          <a-select-option value="1">男</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->
<!--      <a-form-item label="年龄">-->
<!--        <a-input-number-->
<!--            v-model:value="editForm.age"-->
<!--            :min="0"-->
<!--            style="width: 100%"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="电话">
        <a-input v-model:value="editForm.phone" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="editForm.email" />
      </a-form-item>
      <a-form-item label="头像">
        <a-upload
            v-model:file-list="avatarFiles"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :max-count="1"
        >
          <div v-if="avatarFiles.length < 1">
            <plus-outlined />
            <div style="margin-top: 8px">上传头像</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import { message } from 'ant-design-vue';
import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
import axios from "axios";

// 模拟用户数据
const userInfo = reactive({
  id: '',
  username: 'user123',
  name: '张三',
  gender: '1',
  age: 28,
  role: '1',
  phone: '13800138000',
  email: 'user123@example.com',
  avatar: 'https://example.com/avatar.jpg'
});

// 编辑表单数据
const editForm = reactive({});
const editModalVisible = ref(false);
const avatarFiles = ref([]);

// 映射关系
// const genderMap = {
//   '0': '女',
//   '1': '男'
// };

const roleMap = {
  '0': '管理员',
  '1': '用户',
  '2': '商家'
};

// 进入编辑模式
const editProfile = () => {
  Object.assign(editForm, userInfo);
  if (userInfo.avatar) {
    avatarFiles.value = [{
      uid: '-1',
      name: 'avatar.jpg',
      status: 'done',
      url: userInfo.avatar
    }];
  }
  editModalVisible.value = true;
};

const getUserInfo = async () => {
  try {
    //id测试，需要登录的时候保存在全局
    axios.get(`/merchant/userInfo/getUserInfo/1891189268559302656`,
        {
          headers: {
            'Content-Type': 'application/json'//设置请求头
          }
        }
    ).then(response => {
      console.log("response.data.content:",response.data.content);
      Object.assign(userInfo, response.data.content);
    })
  }catch (error) {
    console.log('Error fetching user info:', error)
  }
}

onMounted(()=>{
  getUserInfo();
})

// 保存修改
const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append('id', '1891189268559302656');
    formData.append('username', editForm.username);
    formData.append('name', editForm.name);
    formData.append('gender', editForm.gender);
    formData.append('role', editForm.role);
    formData.append('age', editForm.age);
    formData.append('phone', editForm.phone);
    formData.append('email', editForm.email);
    // 如果有新上传的头像文件
    if (avatarFiles.value.length > 0 && avatarFiles.value[0].originFileObj) {
      // 添加文件对象到 FormData
      formData.append('avatar', avatarFiles.value[0].originFileObj);
    } else if (userInfo.avatar) {
      // 如果未上传新文件但已有头像，传递原有地址（可选）
      formData.append('existingAvatar', userInfo.avatar);
    }

    axios.post('/merchant/userInfo/update',
        //     {
        //   id: 1891366491547373568,
        //   username: editForm.username,
        //   name: editForm.name,
        //   gender: editForm.gender,
        //   role: editForm.role,
        //   age: editForm.age,
        //   phone: editForm.phone,
        //   email: editForm.email,
        //   // avatar: editForm.avatar
        //   avatar: avatarFiles.value.length > 0 ? avatarFiles.value[0].url : ''//如果有头像就赋值，没有就赋空
        // }
        formData
        ,{
          headers: {
            'Content-Type': 'multipart/form-data'//设置请求头
          }
        }).then(response => {
      console.log("response.data.content:",response.data.success);
      Object.assign(userInfo, response.data.content);
      //重新刷新数据
      getUserInfo();
      message.success("编辑成功");
    })

    editModalVisible.value = false;
    message.success('信息更新成功');
  } catch (error) {
    message.error('保存失败，请重试');
  }
};

// 文件上传验证
const beforeUpload = file => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件');
  }
  return isImage;
};
</script>

<style scoped>
.profile-card {
  max-width: 1000px;
  margin: 24px auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.ant-descriptions-item-label {
  font-weight: bold;
  width: 120px;
}

.ant-avatar {
  border: 1px solid #f0f0f0;
}
</style>
