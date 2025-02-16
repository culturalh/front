<template>
  <div class="register-container">
    <div class="register-background"></div>
    <a-card class="register-card" :bordered="false">
      <h2 class="register-title">用户注册</h2>
      <a-form
          :model="formState"
          :rules="rules"
          ref="registerForm"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <!-- 头像上传 -->
        <a-form-item name="avatar">
          <a-upload
              v-model:file-list="fileList"
              list-type="picture-card"
              :before-upload="beforeUpload"
              @change="handleChange"
              :show-upload-list="false"
          >
            <img
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"
                class="avatar-image"
            />
            <div v-else>
              <plus-outlined />
              <div class="upload-text">上传头像</div>
            </div>
          </a-upload>
        </a-form-item>

        <!-- 用户名 -->
        <a-form-item name="username">
          <a-input
              v-model:value="formState.username"
              placeholder="请输入用户名"
              size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 密码 -->
        <a-form-item name="password">
          <a-input-password
              v-model:value="formState.password"
              placeholder="请输入密码"
              size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 姓名 -->
        <a-form-item name="name">
          <a-input
              v-model:value="formState.name"
              placeholder="请输入姓名"
              size="large"
          >
            <template #prefix>
              <user-add-outlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 性别 -->
        <a-form-item name="gender">
          <a-select
              v-model:value="formState.gender"
              placeholder="请选择性别"
              size="large"
          >
            <a-select-option value="0">男</a-select-option>
            <a-select-option value="1">女</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 年龄 -->
        <a-form-item name="age">
          <a-input
              v-model:value="formState.age"
              placeholder="请输入年龄"
              size="large"
          >
            <template #prefix>
              <user-add-outlined />
            </template>
          </a-input>
        </a-form-item>


        <!-- 用户角色 -->
        <a-form-item name="role">
          <a-select
              v-model:value="formState.role"
              placeholder="请选择用户类型"
              size="large"
          >
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 电话号码 -->
        <a-form-item name="phone">
          <a-input
              v-model:value="formState.phone"
              placeholder="请输入电话号码"
              size="large"
          >
            <template #prefix>
              <whats-app-outlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 邮箱 -->
        <a-form-item name="email">
          <a-input
              v-model:value="formState.email"
              placeholder="请输入邮箱"
              size="large"
          >
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 注册按钮 -->
        <a-form-item>
          <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
          >
            注册
          </a-button>
        </a-form-item>

        <!-- 跳转到登录页面 -->
        <div class="login-link">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterView',
  setup() {
    const registerForm = ref(null);
    const loading = ref(false);
    const router = useRouter();
    const fileList = ref([]);
    const imageUrl = ref('');

    const formState = reactive({
      username: '',//用户名
      password: '',//密码
      name:'',//姓名
      gender:undefined,//性别
      age:'',//年龄
      phone: '',
      email: '',
      role: undefined, // 用户角色
      avatar: '',
    });

    // 验证密码是否一致
    // const validatePassword = (rule, value) => {
    //   if (value !== formState.password) {
    //     return Promise.reject('两次输入的密码不一致');
    //   }
    //   return Promise.resolve();
    // };

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
      phone: [
        { required: true, message: '请输入电话号码', trigger: 'blur' },
        // { validator: validatePassword, trigger: 'blur' }, // 使用 validatePassword 函数
      ],
      email: [
        // { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
      ],
      role: [
        { required: true, message: '请选择用户类型', trigger: 'change' },
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' },
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
      ],
    };

    // 处理头像上传
    const handleChange = (info) => {
      if (info.file.status === 'done') {
        const reader = new FileReader();
        reader.readAsDataURL(info.file.originFileObj);
        reader.onload = () => {
          imageUrl.value = reader.result;
          formState.avatar = reader.result;
        };
      }
    };

    // 限制上传文件类型和大小
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
      }
      return isImage && isLt2M;
    };

    // 提交注册表单
    const onFinish = (values) => {
      loading.value = true;
      // 模拟注册请求
      setTimeout(() => {
        loading.value = false;
        message.success('注册成功！');
        console.log('注册数据:', values);
        router.push('/login');
      }, 1500);
    };

    const onFinishFailed = (errors) => {
      console.log('验证失败:', errors);
    };

    return {
      formState,
      rules,
      registerForm,
      loading,
      fileList,
      imageUrl,
      handleChange,
      beforeUpload,
      onFinish,
      onFinishFailed,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../images/register-bg.jpg');
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
  z-index: -1;
}

.register-card {
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.register-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  color: #1890ff;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-text {
  margin-top: 8px;
  color: #666;
}

.login-link {
  text-align: center;
  margin-top: 16px;
}

.login-link span {
  margin-right: 8px;
}

.login-link a {
  color: #1890ff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>