<template>
  <div class="login-container">
    <div class="login-background"></div>
    <a-card class="login-card" :bordered="false">
      <h2 class="login-title">家电租赁系统</h2>
<!--      表单提交成功执行onFinish事件中的方法    -->
      <a-form
          :model="loginForm"
          :rules="rules"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item name="username">
          <a-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
              size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password">
          <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入密码"
              size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="role">
          <a-select
              v-model:value="loginForm.role"
              placeholder="请选择登录角色"
              size="large"
          >
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="merchant">商家</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
          >
            登录
          </a-button>
        </a-form-item>

        <div class="register-link">
          <span>没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()

export default {
  name: 'LoginView',
  setup() {
    const loading = ref(false);
    const router = useRouter();

    const loginForm = reactive({
      username: '',
      password: '',
      role: undefined, // 默认角色为空
    });

    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
      ],
      role: [
        { required: true, message: '请选择登录角色', trigger: 'change' },
      ],
    };

    const onFinish = (loginForm) => {
      loading.value = true;
      //发送axios请求，进行登录验证
      axios.post('/login', {
        username: loginForm.username,
        password: loginForm.password,
        role: loginForm.role,
      })
          .then(response => {
            //停止加载状态
            loading.value = false;
            let isSuccess = response.data.success;
            let returnData = response.data.content;
            if (isSuccess) {

              //保存全局身份信息
              store.login({
                id: returnData.id,
                username: returnData.username,
                role: returnData.role,
                token: returnData.token
              })
              localStorage.setItem("token", returnData.token)
              if (returnData.role === '管理员') {
                router.push('/adminMain')
              } else if (returnData.role === '商家') {
                router.push('/merchantMain')
              } else if (returnData.role == '普通用户') {
                router.push('/userMain')
              } else {
                message.error('登录失败，请检查用户名、密码是否正确！');
              }

              message.success('登录成功！');
              // router.push('/');//跳转到首页
            } else {
              console.log(response)
              message.error(response.data.msg);
            }

          })
          .catch(error => {
            loading.value = false;
            console.log("错误信息:", error)
            message.error('登录失败，请检查用户名、密码是否正确！');
          });
    }
      // 模拟登录请求
      // setTimeout(() => {
      //   loading.value = false;
      //   message.success(`登录成功！角色：${values.role}`);
      //   console.log('登录数据:', values);
      //   router.push('/dashboard'); // 登录成功后跳转到仪表盘页面
      // }, 1500);
    // };


    const onFinishFailed = (errors) => {
      console.log('验证失败:', errors);
    };

    return {
      loginForm,
      rules,
      loading,
      onFinish,
      onFinishFailed,
    };
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../images/login-bg.jpg'); /* 替换为你的背景图片路径 */
  background-size: cover;
  background-position: center;
  filter: brightness(0.6); /* 降低背景图片亮度，使内容更突出 */
  z-index: -1;
}

.login-card {
  width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9); /* 半透明背景，使卡片内容更清晰 */
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  color: #1890ff;
}

.register-link {
  text-align: center;
  margin-top: 16px;
}

.register-link span {
  margin-right: 8px;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>