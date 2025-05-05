<template>
  <div class="app-container">
    <el-card>
      <div style="display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <el-input v-model="filters.classroomName" placeholder="请输入教室名称"
                    style="width: 200px;margin-right:20px"/>
          <el-input v-model="filters.deviceName" placeholder="请输入设备名称" style="width: 200px;margin-right:20px"/>
          <el-input v-model="filters.deviceType" placeholder="请输入设备类型" style="width: 200px;margin-right:20px"/>
          <el-date-picker
              v-model="filters.bindingRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="false"
              style="width: 240px;margin-right:20px"
          />
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </div>
        <!-- 操作按钮 -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleBind">绑定设备</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="deviceList" border style="width: 100%; margin-top: 20px;">
        <el-table-column prop="classroomName" label="教室名称"/>
        <el-table-column prop="deviceName" label="设备名称"/>
        <el-table-column prop="deviceType" label="设备类型"/>
        <el-table-column label="绑定时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.bindingTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUnbind(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          style="margin-top: 20px; float: right; margin-bottom: 20px"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getDeviceList"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getClassroomBindDevice, unbindClassroomBindDevice} from '@/apis/classroom';

export default {
  data() {
    return {
      filters: {
        classroomName: '',
        deviceName: '',
        deviceType: '',
        bindingRange: [],
        status: ''
      },
      pickerOptions: {
        // 不能选择未来日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      deviceList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getDeviceList();
  },
  methods: {
    getDeviceList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        classroomName: this.filters.classroomName,
        deviceName: this.filters.deviceName,
        deviceType: this.filters.deviceType,
        bindingStartTime: this.filters.bindingRange[0] || '',
        bindingEndTime: this.filters.bindingRange[1] || '',
        status: this.filters.status
      };
      getClassroomBindDevice(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.deviceList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取设备列表失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('接口请求失败');
      });
    },
    handleSearch() {
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleReset() {
      this.filters = {
        classroomName: '',
        deviceName: '',
        deviceType: '',
        bindingRange: [],
        status: ''
      };
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleBind() {
    },
    handleUnbind(row) {
      this.$confirm(`确认解绑教室 ${row.classroomName} 的设备 ${row.deviceName} 吗？`, "提示", {
        type: "warning",
      })
          .then(() => {
            unbindClassroomBindDevice({
              classroomId: row.classroomId,
              deviceId: row.deviceId
            }).then(res => {
              if (res.data.code === 200) {
                this.$message.success('解绑成功');
                this.getDeviceList();
              }
            })
          }).catch(() => {
      })
    },
    formatTime(datetime) {
      if (!datetime) return '--';
      const date = new Date(datetime);
      return date.toLocaleString();
    }
  }
};
</script>

<style scoped>
</style>
