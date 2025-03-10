<template>
  <div class="minimal-container">
    <!-- 轮播图模块 -->
    <a-carousel autoplay effect="fade" class="elegant-carousel">
      <div
          v-for="(item, index) in carouselItems"
          :key="index"
          class="carousel-item"
      >
        <div
            class="carousel-bg"
            :style="{ backgroundImage: `url(${item.image})` }"
        />
<!--        <div class="carousel-caption">-->
<!--          <h1 class="carousel-heading">{{ item.title }}</h1>-->
<!--          <p class="carousel-text">{{ item.description }}</p>-->
<!--        </div>-->
      </div>
    </a-carousel>

    <!-- 系统描述模块 -->
    <div class="system-description">
      <div class="description-content">
        <h2 class="description-title">家电租赁服务</h2>
        <div class="description-body">
          <p class="highlight-text">
            我们提供全品类家电租赁，满足您的多样化家电产品租赁服务。
          </p>
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>
                <h3>智能化</h3>
                <p>实现线上租赁服务，省时省力，省心省力</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>
                <h3>优质服务</h3>
                <p>提供优质租赁服务</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">✓</div>
              <div>
                <h3>节约成本</h3>
                <p>降低用户成本，提升用户满意度</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const carouselItems = ref([
  {
    image: 'http://localhost:8090/file/5ea0b03d951c4-picture.jfif',
    // title: '智能生活触手可及',
    // description: '每日最低9.9元起，享受高端家电体验'
  },
  {
    image: 'http://localhost:8090/file/264050b167cd4-picture.jfif',
    // title: '免押金信用租赁',
    // description: '芝麻信用650分即可享受零押金服务'
  }
]);
</script>

<style scoped>
.minimal-container {
  max-width: 1440px;
  margin: 0 auto;
}

/* 极简轮播图样式 */
.elegant-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  position: relative;
  height: 500px;
}

.carousel-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.9);
}

.carousel-caption {
  position: relative;
  padding: 80px 10%;
  color: white;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.carousel-heading {
  font-size: 2.8rem;
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.carousel-text {
  font-size: 1.4rem;
  max-width: 600px;
  opacity: 0;
  animation: fadeInUp 0.8s ease 0.2s forwards;
}

/* 系统描述模块 */
.system-description {
  padding: 60px 10%;
}

.description-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.description-title {
  text-align: center;
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 30px;
}

.highlight-text {
  font-size: 1.2rem;
  color: #444;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.8;
}

.feature-list {
  display: grid;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9ff;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateX(10px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.feature-item h3 {
  color: #1a1a1a;
  margin-bottom: 6px;
}

.feature-item p {
  color: #666;
  font-size: 0.95rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .carousel-heading {
    font-size: 2rem;
  }

  .carousel-text {
    font-size: 1.1rem;
  }

  .system-description {
    padding: 40px 20px;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>