<template>
  <div class="app-container">
    <el-card>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="handleBind">绑定设备</el-button>
      <el-table :data="deviceList" border style="width: 100%; margin-top: 20px;">
        <el-table-column prop="classroom_name" label="教室名称" />
        <el-table-column prop="device_name" label="设备名称" />
        <el-table-column prop="type" label="设备类型" />
        <el-table-column prop="bind_time" label="绑定时间" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUnbind(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceList: [
        {
          classroom_name: '一号楼101教室',
          device_name: '爱普生投影仪',
          type: '投影仪',
          bind_time: '2024-04-25 10:00'
        },
        {
          classroom_name: '二号楼101教室',
          device_name: 'BOSE音响',
          type: '音响',
          bind_time: '2024-04-20 09:00'
        }
      ]
    }
  },
  methods: {
    handleBind() {
      this.$message('点击了绑定设备');
    },
    handleUnbind(row) {
      this.$confirm(`确认解绑设备 ${row.device_name}？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('解绑成功（假动作）');
      });
    }
  }
}
</script>
