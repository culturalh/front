<template>
  <a-card class="order-table-card" title="操作日志" bordered>
    <table class="order-table">
      <thead>
      <tr>
        <!-- 动态生成表头 -->
        <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in OperatorLog" :key="order.logId">
        <td>{{ order.logId }}</td>
        <td>{{ order.role }}</td>

        <td>{{ order.username }}</td>
        <td>{{ order.operationTime }}</td>
        <td>{{ order.OperationType }}</td>
<!--        <td>{{ order.merchantName }}</td>-->
<!--        <td>{{ order.endDate }}</td>-->
<!--        <td>{{ order.rentalPrice }}</td>-->
<!--        <td>{{ order.createTime }}</td>-->
<!--        <td>{{ order.description }}</td>-->
        <!--        <td>-->
        <!--          <a-space>-->
        <!--            <a-button type="primary" size="small" @click="onEdit(order)">编辑</a-button>-->
        <!--            <a-button type="danger" size="small" @click="onDelete(order)">删除</a-button>-->
        <!--          </a-space>-->
        <!--        </td>-->
      </tr>
      </tbody>
    </table>
  </a-card>
</template>

<script setup>
import {onMounted, reactive} from "vue";
// import { message } from "ant-design-vue";
import axios from 'axios';

// 定义表头列
const columns = reactive([
  { title: "日志编号", key: "logId" },
  { title: "角色", key: "role" },
  { title: "名称", key: "username" },
  { title: "操作时间", key: "operationTime" },
  { title: "操作类型", key: "OperationType" },
  // { title: "租赁开始日期", key: "startDate" },
  // { title: "租赁结束日期", key: "endDate" },
  // { title: "租赁价格", key: "rentalPrice" },
  // { title: "订单创建时间", key: "createTime" },
  // { title: "订单备注", key: "description" },
]);

// 表格数据
const OperatorLog = reactive([
  {
    logId: "123456",
    role: "789012",
    username: "张三家电",
    operationTime: "2024-10-10 10:00:00",
    OperationType: "用户操作"
  },
  {
    logId: "123456",
    role: "789012",
    username: "张三家电",
    operationTime: "2024-10-10 10:00:00",
    OperationType: "用户操作"
  },
]);

const getOperationLog = async () => {
  try {
    //传入用户id
    const response = await axios.get('/order/get', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success) {
      OperatorLog.value = response.data.content;
    } else {
      console.error('Failed to fetch OperatorLog');
    }
  } catch (error) {
    console.error('Error fetching OperatorLog:', error);
  }
};

onMounted(()=>{
  getOperationLog();
})
// // 编辑订单
// const onEdit = (order) => {
//   message.info(`编辑订单：${order.orderId}`);
// };
//
// // 删除订单
// const onDelete = (order) => {
//   message.info(`删除订单：${order.orderId}`);
// };
</script>

<style scoped>
/* 卡片样式 */
.order-table-card {
  margin: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 表格样式 */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.order-table th,
.order-table td {
  border: 1px solid #d9d9d9;
  padding: 12px;
  text-align: center;
}

.order-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.order-table td {
  background-color: #ffffff;
}

/* 操作按钮样式 */
.order-table .ant-btn {
  padding: 5px 10px;
  border-radius: 4px;
}

.order-table .ant-btn-primary {
  background-color: #1890ff;
  border-color: #1890ff;
}

.order-table .ant-btn-danger {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}
</style>