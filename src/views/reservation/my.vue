<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <div style="display: flex;margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;justify-content: space-between">
        <div style="display: flex;flex-wrap: wrap;gap: 15px 20px">
          <el-select v-model="filters.status" placeholder="请选择审核状态">
            <el-option
                v-for="item in reservationStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset" size="mini">重置</el-button>
        </div>
      </div>
      <!-- 表格展示 -->
      <el-table :data="reservationList" border stripe style="width: 100%;">
        <el-table-column prop="classroomCode" label="教室编号" width="120"/>
        <el-table-column prop="type" label="预约类型" width="100"/>
        <el-table-column prop="reason" label="预约原因" show-overflow-tooltip/>
        <el-table-column prop="date" label="预约日期" width="160"/>
        <el-table-column prop="timeSlot" label="时间段" width="120"/>
        <el-table-column prop="status" label="审核状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'pending'" type="info">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 'approved'" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 'rejected'" type="danger">审核未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewer" label="审核人" width="100"/>
        <el-table-column prop="reviewTime" label="审核时间" width="160"/>
        <el-table-column prop="remark" label="审核备注" show-overflow-tooltip/>
        <el-table-column prop="createTime" label="提交时间" width="160"/>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          style="margin-top: 20px; text-align: right;"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getList"
      />
    </el-card>
  </div>
</template>

<script>
import {getSelfReservation} from '@/apis/reservation';
import {padZero} from "@/util/timeSlot"; // 替换为实际路径

export default {
  data() {
    return {
      filters: {
        status: '',
      },
      reservationList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      reservationStatus: [
        {
          label: '待审核',
          value: 'pending'
        },
        {
          label: '审核通过',
          value: 'approved'
        },
        {
          label: '审核不通过',
          value: 'rejected'
        }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearch() {
      this.getList();
    },
    handleReset() {
      this.filters = {
        status: '',
      }
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    getList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.filters.status,
      };
      getSelfReservation(params).then(res => {
        if (res.data.code === 200) {
          this.reservationList = res.data.data.list;
          this.reservationList.forEach(item => {
            const dateStart = new Date(item.startTime);
            const dateEnd = new Date(item.endTime);
            item.date = dateStart.getFullYear() + '-' + padZero(dateStart.getMonth() + 1) + '-' + padZero(dateStart.getDate());
            item.timeSlot =
                padZero(dateStart.getHours()) + ':' + padZero(dateStart.getMinutes()) +
                '~' +
                padZero(dateEnd.getHours()) + ':' + padZero(dateEnd.getMinutes());
          })
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg || '获取预约信息失败');
        }
      });
    },
    resetFilters() {
      this.filters = {
        classroomCode: '',
        status: '',
        dateRange: []
      };
      this.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getList();
    }
  }
};
</script>

<style scoped>
.con::-webkit-scrollbar {
  display: none;
}
</style>
