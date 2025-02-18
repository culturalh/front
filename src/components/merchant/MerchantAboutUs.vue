<template>
  <a-layout class="about-us">
    <a-layout-content class="about-content">
      <div class="about-header">
        <h1>关于我们</h1>
      </div>
      <div class="about-body">
        <div class="section about-intro">
          <h2 class="section-title">公司简介</h2>
          <p>
            欢迎访问我们的家电租赁管理系统！我们是一家专注于提供高品质家电租赁服务的公司，致力于为用户提供便捷、高效、可靠的租赁体验。我们的系统旨在帮助用户轻松管理家电租赁业务，从设备管理、订单处理到客户服务，我们提供一站式解决方案。
          </p>
        </div>
        <div class="section about-team">
          <h2 class="section-title">我们的团队</h2>
          <p>
            我们的团队由一群经验丰富、充满激情的专业人士组成。我们拥有专业的技术团队，致力于开发和维护最先进的家电租赁管理系统；我们的客户服务团队随时准备为用户提供支持和帮助；我们的运营团队确保系统高效运行，满足用户的需求。
          </p>
        </div>
        <div class="section about-mission">
          <h2 class="section-title">我们的使命</h2>
          <p>
            我们的使命是通过创新的技术和优质的服务，为用户提供最便捷的家电租赁体验。我们致力于打造一个高效、可靠的家电租赁平台，帮助用户轻松管理租赁业务，提升生活质量。
          </p>
        </div>
        <div class="section about-contact">
          <h2 class="section-title">联系我们</h2>
          <p>
            如果您有任何问题或建议，欢迎随时联系我们。我们的客服团队将竭诚为您服务。
          </p>
          <p>
            <strong>联系电话：</strong>xxxxxx
          </p>
          <p>
            <strong>电子邮箱：</strong>xxxxxx
          </p>
          <p>
            <strong>感谢您的关注！</strong>
          </p>
        </div>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  name: 'MerchantAboutUs',
};
</script>

<style scoped>
.about-us {
  min-height: 100vh;
  background: #f5f5f5;
}

.about-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.about-header {
  text-align: center;
  margin-bottom: 48px;
}

.about-header h1 {
  font-size: 3rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.about-body {
  background: #fff;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 48px;
}

.section {
  margin-bottom: 48px;
  padding: 24px;
  border-radius: 12px;
  background: #f8f9fa;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 12px;
}

p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

strong {
  color: #333;
  font-weight: bold;
}

/* 为设备介绍部分添加背景图片 */
.device-section {
  background: url('https://via.placeholder.com/1200x400') no-repeat center center;
  background-size: cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.device-section h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.device-section p {
  font-size: 1.2rem;
  max-width: 800px;
}

/* 联系方式图标 */
.about-contact p {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.about-contact i {
  font-size: 1.2rem;
  color: #333;
  margin-right: 8px;
}
</style>