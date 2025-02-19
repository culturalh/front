<template>
  <a-layout class="admin-layout">
    <!-- 主内容区域 -->
    <a-layout-content class="admin-content">
      <a-row :gutter="16">
        <!-- 饼图 -->
        <a-col :span="12">
          <a-card title="设备类型租赁占比">
            <div ref="pieChart" style="width: 100%; height: 300px;"></div>
          </a-card>
        </a-col>

        <!-- 柱状图 -->
        <a-col :span="12">
          <a-card title="设备类型租赁数量对比">
            <div ref="barChart" style="width: 100%; height: 300px;"></div>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>

    <!-- 底部 -->
    <a-layout-footer class="admin-footer">
      Copyright © 2023 家电租赁管理系统
    </a-layout-footer>
  </a-layout>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      // 饼图数据
      pieData: [
        { value: 50, name: '空调' },
        { value: 30, name: '冰箱' },
        { value: 20, name: '洗衣机' },
      ],

      // 柱状图数据
      barCategories: ['空调', '冰箱', '洗衣机', '电视', '热水器'],
      barValues: [220, 182, 191, 234, 290],
    };
  },
  async created() {
    await this.fetchData();
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    // 获取数据
    async fetchData() {
      try {
        const response = await axios.get('https://api.example.com/statistics');
        const { pieData, barCategories, barValues } = response.data;

        // 更新数据
        this.pieData = pieData || this.pieData;
        this.barCategories = barCategories || this.barCategories;
        this.barValues = barValues || this.barValues;
      } catch (error) {
        console.error('获取数据失败，将使用初始数据:', error);
      }
    },
    // 初始化图表
    initCharts() {
      // 饼图
      const pieChart = echarts.init(this.$refs.pieChart);
      pieChart.setOption({
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: this.pieData,
          },
        ],
      });

      // 柱状图
      const barChart = echarts.init(this.$refs.barChart);
      barChart.setOption({
        xAxis: {
          type: 'category',
          data: this.barCategories,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.barValues,
            type: 'bar',
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.admin-content {
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 98px);
}

.admin-footer {
  text-align: center;
  background: #fff;
  padding: 10px 0;
}

.ant-card {
  border-radius: 8px;
}
</style>