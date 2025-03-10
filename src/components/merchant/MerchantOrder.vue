<template>
  <!-- 操作工具栏 -->
  <div class="toolbar">
    <a-input-search
        v-model:value="searchQuery"
        placeholder="请输入订单号"
        enter-button="搜索"
        @search="matchSearch"
        style="width: 300px; margin-right: 16px;"
    />
    <!--      <a-button type="primary" @click="showModal('add')">新增分类</a-button>-->
  </div>

  <a-card class="order-table-card" bordered>
    <table class="order-table">
      <thead>
      <tr>
        <!-- 动态生成表头 -->
        <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(order,index) in orders" :key="order.orderId">
        <td>{{ index + 1 }}</td>
        <td>{{ order.usersName }}</td>
<!--        <td>{{ order.merchantsName }}</td>-->
        <td>{{ order.orderedNo }}</td>
        <td>{{ order.applianceName }}</td>
        <td>{{ order.startTime }}</td>
        <td>{{ order.endTime }}</td>
        <td>{{ order.rentalPrice }}</td>
        <td>{{ order.createTime }}</td>
        <td>{{ order.orderRemark }}</td>
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
import { ref,onMounted, reactive } from "vue";
// import { message } from "ant-design-vue";
import axios from 'axios'
import { useUserStore} from "@/stores/userStore";
const userStore = useUserStore();
const searchQuery = ref('');
// 定义表头列
const columns = reactive([
  { title: "订单编号", key: "orderId" },
  { title: "租赁用户", key: "usersName" },
  // { title: "商家名称", key: "merchantsName" },
  { title: "订单号", key: "orderedNo" },
  { title: "设备名称", key: "applianceName" },
  { title: "租赁开始日期", key: "startTime" },
  { title: "租赁结束日期", key: "endTime" },
  { title: "租赁总价格", key: "rentalPrice" },
  { title: "订单创建时间", key: "createTime" },
  { title: "订单备注", key: "orderRemark" },
]);

// 表格数据
const orders = reactive([
  {
    orderId: "123456",
    usersName: "789012",
    merchantsName: "张三家电",
    orderedNo: "20241010001",
    applianceName: "冰箱",
    startTime: "2024-10-01",
    endTime: "2024-10-31",
    rentalPrice: "500.00",
    createTime: "2024-10-10 10:00:00",
    orderRemark: "无",
  },
  {
    orderId: "654321",
    usersName: "210987",
    merchantsName: "李四家电",
    orderedNo: "20241010002",
    applianceName: "洗衣机",
    startTime: "2024-10-05",
    endTime: "2024-11-05",
    rentalPrice: "300.00",
    createTime: "2024-10-12 15:30:00",
    orderRemark: "无",
  },
]);
const matchSearch = () => {
  getOrders();
};

const getOrders = async () => {
  try {
    //传入用户id
    const response = await axios.get('/merchant/order/get', {
      params: {
        //商家id
        id: userStore.userInfo.id,
        searchQuery: searchQuery.value
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.success) {
      orders.splice(0, orders.length, ...response.data.content);
    } else {
      console.error('Failed to fetch orders');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

onMounted(()=>{
  getOrders();
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