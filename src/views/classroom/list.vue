<template>
  <div class="classroom-list">
    <el-row>
      <el-col :span="6">
        <el-input v-model="searchQuery" placeholder="搜索教室" @input="fetchData" />
      </el-col>
    </el-row>

    <el-table :data="classroomList" style="width: 100%">
      <el-table-column label="教室名称" prop="name" />
      <el-table-column label="容纳人数" prop="capacity" />
      <el-table-column label="状态" prop="status" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editClassroom(scope.row)" size="small">编辑</el-button>
          <el-button @click="deleteClassroom(scope.row)" size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      classroomList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
    }
  },
  methods: {
    // 模拟获取教室数据
    fetchData() {
      const mockData = [
        { name: '教室A', capacity: 30, status: '空闲' },
        { name: '教室B', capacity: 50, status: '占用' },
        { name: '教室C', capacity: 20, status: '空闲' },
        { name: '教室D', capacity: 40, status: '故障' },
        { name: '教室E', capacity: 30, status: '空闲' },
      ]

      // 模拟搜索功能
      this.classroomList = mockData.filter(classroom => classroom.name.includes(this.searchQuery));
      this.total = this.classroomList.length;
    },
    // 编辑教室
    editClassroom(row) {
      this.$message.info(`编辑教室：${row.name}`);
    },
    // 删除教室
    deleteClassroom(row) {
      this.$message.info(`删除教室：${row.name}`);
    }
  },
  created() {
    this.fetchData(); // 初始化加载数据
  }
}
</script>

<style scoped>
.classroom-list {
  padding: 20px;
}
</style>
