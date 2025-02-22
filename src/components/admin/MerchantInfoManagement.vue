<template>
  <div class="table-container">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <a-input-search
          v-model:value="searchQuery"
          placeholder="请输入商家名称"
          enter-button="搜索"
          @search="matchSearch"
          style="width: 300px; margin-right: 16px;"
      />
<!--      <a-button type="primary" @click="showModal('add')">新增分类</a-button>-->
    </div>

    <!-- 数据表格 -->
    <div class="table">
      <table>
        <thead>
        <tr>
          <th v-for="column in columns" :key="column.dataIndex">{{ column.title }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index ) in dataSource" :key="item.id">
          <td>{{ index + 1 }}  </td>
          <td>{{ item.username }}</td>
          <td>
            <a-tag :color="item.isActived === '0' ? 'green' : 'red'">
              {{ item.isActived === '0' ? '已启用' : '已禁用' }}
            </a-tag>
          </td>
          <td> {{ item.name }}</td>
          <td>{{ item.phone }}</td>
          <td>
            <a-space>
              <a-button size="small" @click="showModal(item)">详情</a-button>
              <a-button
                  size="small"
                  :type="item.isActived === '0' ? 'danger' : 'primary'"
                  @click="toggleStatus(item)"
              >
                {{ item.isActived === '0' ? '禁用' : '启用' }}
              </a-button>
<!--              <a-popconfirm-->
<!--                  title="确认删除该分类吗？"-->
<!--                  @confirm="deleteItem(item.category_id)"-->
<!--              >-->
<!--                <a-button size="small" danger>删除</a-button>-->
<!--              </a-popconfirm>-->
            </a-space>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 编辑模态框 -->
    <a-modal
        v-model:visible="modalVisible"
        title="商家详细信息"
        @ok="handleSave"
        width="600px"
    >
      <a-form
          :model="formState"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="头像">
          <a-avatar
              :src="formState.avatar + '?t=' + Date.now()"
              :size="100"
              v-if="formState.avatar"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="formState.username"  disabled="true"/>
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model:value="formState.name" disabled="true" />
        </a-form-item>
        <!--      <a-form-item label="性别">-->
        <!--        <a-select v-model:value="formState.gender">-->
        <!--          <a-select-option value="0">女</a-select-option>-->
        <!--          <a-select-option value="1">男</a-select-option>-->
        <!--        </a-select>-->
        <!--      </a-form-item>-->
        <!--      <a-form-item label="年龄">-->
        <!--        <a-input-number-->
        <!--            v-model:value="formState.age"-->
        <!--            :min="0"-->
        <!--            style="width: 100%"-->
        <!--        />-->
        <!--      </a-form-item>-->
        <a-form-item label="电话">
          <a-input v-model:value="formState.phone" disabled="true" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="formState.email" disabled="true" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import { message } from 'ant-design-vue';
import axios from "axios";

// 初始模拟数据
const initData = [
  {
    id: 1,
    username: 'zhangsan',
    name: '张三',
    phone: '123456789',
    isActived: 1,
    // is_delete: '0'
  },
  {
    id: 1,
    username: 'wangwu',
    name: '王五',
    phone: '123456789',
    isActived: 0,
    // is_delete: '0'
  }
];

// 表格列配置
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    width: 120
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'isActive',
    // slots: { customRender: 'status' }
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: 120
  },
  {
    title: '操作',
    width: 220,
    slots: { customRender: 'action' }
  }
];

// 响应式数据
const dataSource = ref([...initData]);
const searchQuery = ref('');

// 过滤后的数据源
// const filteredDataSource = computed(() => {
//   return dataSource.value.filter(item =>
//       item.device_type.includes(searchQuery.value)
//   );
// });

const modalVisible = ref(false);
// const modalType = ref('add');
const formState = reactive({
  username:'',
  name:'',
  gender:'',
  age:'',
  phone:'',
  email:'',
  avatar:'',
});

// 显示模态框
const showModal = (record) => {
  // modalType.value = type;
  // if (type === 'edit') {
  //   Object.assign(formState, record);
  // } else {
  //   formState.device_type = '';
  // }
  modalVisible.value = true;
  getUserInfoById(record.id);

};


//点击ok，关闭模态框
const handleSave = () => {
  modalVisible.value = false;
};


// //查询
// const matchSearch = () => {
//   console.log('查询内容:', searchQuery.value);
//   // 在这里调用查询逻辑
//
// };


//查询所有（支持模糊查询）
const getUserInfo = async () => {
  try {
    //id测试，需要登录的时候保存在全局
    axios.get('/admin/merchantInfoManagement/get',
        {
          params:{
            searchQuery: searchQuery.value
          },
          headers: {
            'Content-Type': 'application/json'//设置请求头
          }
        }
    ).then(response => {
      console.log("response.data.content:",response.data.content);
      // Object.assign(dataSource, response.data.content);

      const responseData = response.data.content;
      dataSource.value = responseData;

    })
  }catch (error) {
    console.log('Error fetching user info:', error)
  }
}

//更新状态
const updateStatus = async (id,isActived) => {
  try {
    axios.post('/admin/merchantInfoManagement/update',
        {
          id: id,
          status: isActived,
        }
        ,{
          headers: {
            'Content-Type': 'application/json'//设置请求头
          }
        }).then(response => {
      console.log("response.data.success:",response.data.success);
      // Object.assign(userInfo, response.data.content);
      //重新刷新数据
      getUserInfo();
      message.success("修改成功");
    })
    message.success('信息更新成功');
  } catch (error) {
    message.error('保存失败，请重试');
  }
};

// 切换状态
const toggleStatus = (record) => {
  record.isActived = record.isActived === '1' ? '0' : '1';

  updateStatus(record.id,record.isActived);
};

//更具id查询，显示详细信息
const getUserInfoById = async (id) => {
  try {
    //id测试，需要登录的时候保存在全局
    axios.get(`/merchant/userInfo/getUserInfo/${id}`,
        {
          headers: {
            'Content-Type': 'application/json'//设置请求头
          }
        }
    ).then(response => {
      console.log("response.data.content:",response.data.content);
      formState.username = response.data.content.username;
      formState.name = response.data.content.name;
      formState.gender = response.data.content.gender;
      formState.age = response.data.content.age;
      formState.phone = response.data.content.phone;
      formState.email = response.data.content.email;
      formState.avatar = response.data.content.avatar;

      // Object.assign(userInfo, response.data.content);
    })
  }catch (error) {
    console.log('Error fetching user info:', error)
  }
}


onMounted(()=>{
  getUserInfo();
})

// 提交表单
// const handleSubmit = () => {
//   if (!formState.device_type) {
//     message.error('请填写分类名称');
//     return;
//   }
//
//   if (modalType.value === 'add') {
//     const newId = dataSource.value.length
//         ? Math.max(...dataSource.value.map(d => d.category_id)) + 1
//         : 1;
//
//     dataSource.value.push({
//       ...formState,
//       category_id: newId,
//       isActived: '1',
//       is_delete: '0',
//       created_time: new Date().toLocaleString()
//     });
//   } else {
//     const index = dataSource.value.findIndex(
//         d => d.category_id === formState.category_id
//     );
//     dataSource.value.splice(index, 1, formState);
//   }
//
//   modalVisible.value = false;
//   message.success('操作成功');
// };




// 搜索功能
const matchSearch = () => {
  // 搜索功能已经通过 computed 实现，无需额外操作
  getUserInfo();
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
}

.table {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: bold;
}

tr:hover {
  background-color: #f0f2f5;
}
</style>