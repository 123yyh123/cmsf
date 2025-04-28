<template>
  <div class="app-container">
    <el-card>
      <el-table :data="statusList" border style="width: 100%;">
        <el-table-column prop="classroom_code" label="教室编号" />
        <el-table-column prop="classroom_name" label="教室名称" />
        <el-table-column prop="old_status" label="原状态" />
        <el-table-column prop="new_status" label="新状态" />
        <el-table-column prop="change_time" label="变更时间" />
        <el-table-column prop="operator" label="操作者" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      statusList: [
        {
          classroom_code: 'A101',
          classroom_name: '一号楼101教室',
          old_status: '空闲',
          new_status: '使用中',
          change_time: '2024-04-28 08:00',
          operator: '系统自动'
        },
        {
          classroom_code: 'B101',
          classroom_name: '二号楼101教室',
          old_status: '空闲',
          new_status: '维修中',
          change_time: '2024-04-27 14:30',
          operator: '管理员张三'
        }
      ]
    }
  }
}
</script>
