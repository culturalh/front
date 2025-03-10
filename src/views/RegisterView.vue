<template>
  <div class="register-container">
    <div class="register-background"></div>
    <a-card class="register-card" :bordered="false">
      <h2 class="register-title">用户注册</h2>
      <a-form
          :model="registerForm"
          :rules="rules"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <!-- 头像上传 -->
        <a-form-item>
          <a-upload
              v-model:file-list="fileList"
              list-type="picture-card"
              :before-upload="beforeUpload"
              @change="handleChange"
              :max-count="1"
          >
            <div v-if="fileList.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传头像</div>
            </div>
          </a-upload>
        </a-form-item>
        <!-- 用户名 -->
        <a-form-item name="username">
          <a-input
              v-model:value="registerForm.username"
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
              v-model:value="registerForm.password"
              placeholder="请输入密码"
              size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 名称 -->
        <a-form-item name="name">
          <a-input
              v-model:value="registerForm.name"
              placeholder="请输入名称"
              size="large"
          >
            <template #prefix>
              <user-add-outlined />
            </template>
          </a-input>
        </a-form-item>

        <!-- 用户角色 -->
        <!-- 添加change事件 -->
        <a-form-item name="role">
          <a-select
              v-model:value="registerForm.role"
              placeholder="请选择用户类型"
              size="large"
              @change="handleRoleChange"
          >
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 性别 -->
        <!-- 添加条件判断 -->
        <a-form-item name="gender" v-if="registerForm.role === 'user'" >
          <a-select
              v-model:value="registerForm.gender"
              placeholder="请选择性别"
              size="large"
          >
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="0">女</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 年龄 -->
        <a-form-item name="age" v-if="registerForm.role === 'user'">
          <a-input
              v-model:value="registerForm.age"
              placeholder="请输入年龄"
              size="large"
          >
            <template #prefix>
              <user-add-outlined />
            </template>
          </a-input>
        </a-form-item>


        <!-- 电话号码 -->
        <a-form-item name="phone">
          <a-input
              v-model:value="registerForm.phone"
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
              v-model:value="registerForm.email"
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
import axios from "axios";

export default {
  name: 'RegisterView',
  setup() {
    // const registerForm = ref(null);
    const loading = ref(false);
    const router = useRouter();
    const fileList = ref([]);
    const imageUrl = ref('');

    const registerForm = reactive({
      username: '',//用户名
      password: '',//密码
      name:'',//姓名
      gender:undefined,//性别
      age: '',//年龄
      phone: '',
      email: '',
      role: undefined, // 用户角色
      avatar: '',
    });

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
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
      ],
      role: [
        { required: true, message: '请选择用户类型', trigger: 'change' },
      ],
      // gender: [
      //   { required: true, message: '请选择性别', trigger: 'change' },
      // ],
      gender: [
        {
          required: registerForm.role === 'user', // 动态设置必填
          message: '请选择性别',
          trigger: 'change'
        },
      ],
      age: [
        {
          required: registerForm.role === 'user', // 动态设置必填
          message: '请输入年龄',
          trigger: 'blur'
        },
        {
          pattern: /^\d+$/,
          message: '年龄必须为数字',
          trigger: 'blur'
        }
      ],
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
      ]
    };

    // 处理头像上传
    const handleChange = ({ file, fileList: newFileList }) => {
      fileList.value = newFileList;

      if (file.status === 'done') {
        // 生成预览URL
        imageUrl.value = URL.createObjectURL(file.originFileObj);
        // 保存文件到表单数据
        registerForm.avatarFile = file.originFileObj;
      } else if (file.status === 'removed') {
        // 清除预览
        imageUrl.value = '';
        registerForm.avatarFile = null;
      }
    };


    // 限制上传文件类型和大小
    const beforeUpload = (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   message.error('图片大小不能超过 2MB！');
      // }
      // return isImage && isLt2M;
      return isImage;
    };

// 在setup函数中添加处理函数
    const handleRoleChange = (value) => {
      // 当切换角色时清空已填写的字段
      if (value !== 'user') {
        registerForm.gender = undefined;
        registerForm.age = '';
      }
    };
    // 提交注册表单
    const onFinish = () => {
      loading.value = true;
      const formData = new FormData();
      formData.append('username', registerForm.username);
      formData.append('password', registerForm.password);
      formData.append('name', registerForm.name);
      formData.append('gender', registerForm.gender);
      formData.append('role', registerForm.role);
      formData.append('age', registerForm.age);
      formData.append('phone', registerForm.phone);
      formData.append('email', registerForm.email);
      formData.append('avatar', fileList.value[0].originFileObj);
      // 发送axios请求，进行注册验证
      axios.post('/register',
        // username: registerForm.username,//用户名
        // password: registerForm.password,//密码
        // name:registerForm.name,//姓名
        // gender:registerForm.gender,//性别
        // age:registerForm.age,//年龄
        // phone: registerForm.phone,
        // email: registerForm.email,
        // role: registerForm.role, // 用户角色
        // avatar: registerForm.avatar,
        formData
      ,
      {
        headers: {
          'Content-Type': 'multipart/form-data'//设置请求头
        }
          }).then(
          response => {
            loading.value = false;
            let isSuccess = response.data;
            if(isSuccess){
              message.success('注册成功！')
              router.push('/login')
            }else{
              //注册失败提示
              message.warn(response.data.msg)
              console.log("返回的数据:",response)
            }
          }
      )

      // // 模拟注册请求
      // setTimeout(() => {
      //   loading.value = false;
      //   message.success('注册成功！');
      //   console.log('注册数据:', values);
      //   router.push('/login');
      // }, 1500);
    };

    const onFinishFailed = (errors) => {
      console.log('验证失败:', errors);
    };

    return {
      rules,
      registerForm,
      loading,
      fileList,
      imageUrl,
      handleChange,
      beforeUpload,
      onFinish,
      onFinishFailed,
      handleRoleChange
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
/* 修复遮罩定位问题 */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-info::before) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5) !important;
  border-radius: 8px;
}

/* 调整操作按钮容器 */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions) {
  position: relative;
  z-index: 2;
  transform: none;
  top: auto;
  left: auto;
}
/* 修复操作按钮定位 */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions) {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* 允许穿透点击 */
}

/* 操作按钮样式修正 */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions .anticon) {
  pointer-events: auto; /* 恢复点击事件 */
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.2s;
}

/* 悬停效果增强 */
:deep(.ant-upload-list-picture-card .ant-upload-list-item-actions .anticon:hover) {
  transform: scale(1.2);
  color: #1890ff;
}
</style>