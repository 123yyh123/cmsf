<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询条件 -->
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-input v-model="filters.realName" placeholder="申请人" style="width: 150px; margin-right: 20px;"
                  size="small"/>
        <el-select v-if="getUserRole() === 'admin'" v-model="filters.role" placeholder="申请人角色" style="width: 150px; margin-right: 20px;" size="small">
          <el-option label="学生" value="student"/>
          <el-option label="教师" value="teacher"/>
        </el-select>
        <el-input v-model="filters.classroomCode" placeholder="教室编号" style="width: 150px; margin-right: 20px;"
                  size="small"/>
        <el-select v-model="filters.type" placeholder="预约类型" style="width: 150px; margin-right: 20px;" size="small">
          <el-option label="自习" value="自习"/>
          <el-option label="教学" value="教学"/>
          <el-option label="会议" value="会议"/>
          <el-option label="考试" value="考试"/>
        </el-select>
        <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="预约日期"
            end-placeholder="预约日期"
            style="margin-right: 20px;"
            :clearable="false"
            value-format="yyyy-MM-dd"
            size="small"
        />
        <el-button type="primary" icon="el-icon-search" size="small" @click="fetchList">查询</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
      </div>

      <!-- 审核列表 -->
      <el-table :data="reservationList" border style="width: 100%;"
                :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="sortChange">
        <el-table-column prop="realName" label="申请人" width="100"/>
        <el-table-column prop="role" label="申请人角色" width="100"/>
        <el-table-column prop="classroomCode" label="教室编号" width="100"/>
        <el-table-column prop="type" label="预约类型" width="100"/>
        <el-table-column label="预约时间段" width="300">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }} ~{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="预约原因" width="200"/>
        <el-table-column prop="createTime" label="申请时间" width="200" sortable="custom"
                         :sort-orders="['ascending', 'descending','null']"/>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="success"
                @click="handleAudit(scope.row, getUserRole()==='admin'?'approved':'counselor_approved')"
            >通过
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleAudit(scope.row, 'rejected')"
            >拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :page-sizes="[10, 20, 50]"
          @size-change="handleSizeChange"
          @current-change="fetchList"
          style="margin-top: 20px; text-align: right;"
      />
    </el-card>
  </div>
</template>

<script>
import {getReservationPageList, reviewReservation} from '@/apis/reservation';
import {toLine} from "@/util/strUtils";
import {getUserRole} from "@/util/jwt";

export default {
  data() {
    return {
      filters: {
        userId: '',
        role: '',
        classroomId: '',
        type: '',
        dateRange: []
      },
      reservationList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      isFirstLoad: true,
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    getUserRole,
    sortChange(column) {
      console.log(column);
      if (column.order !== 'null') {
        const orderByField = toLine(column.prop);
        const orderByType = column.order === 'ascending' ? 'asc' : 'desc';
        this.filters.orderByField = orderByField;
        this.filters.orderByType = orderByType;
      } else {
        this.filters.orderByField = '';
        this.filters.orderByType = '';
      }
      this.pageNum = 1;
      this.fetchList();
    },
    fetchList() {
      const params = {
        ...this.filters,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        'reservationTime.startDate' : this.filters.dateRange[0] || '',
        'reservationTime.endDate' : this.filters.dateRange[1] || ''
      };
      delete params.dateRange;
      getReservationPageList(params).then(res => {
        if (res.data.code === 200) {
          this.reservationList = res.data.data.list;
          this.total = res.data.data.total;
          if (this.isFirstLoad && this.total > 0) {
            this.$message({
              showClose: true,
              type: 'warning',
              message: "当前您待审核的预约共有"+this.total+"条，请及时处理！",
              duration: 5000
            });
            this.isFirstLoad = false;
          }
        } else {
          this.$message.error(res.data.msg || '加载失败');
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchList();
    },
    resetFilter() {
      this.filters = {
        userId: '',
        classroomId: '',
        type: '',
        dateRange: []
      };
      this.pageNum = 1;
      this.fetchList();
    },
    handleAudit(row, result) {
      this.$prompt('请输入审核备注', '审核确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{0,255}/,
        inputErrorMessage: '备注过长'
      }).then(({value}) => {
        const payload = {
          id: row.id,
          status: result,
          remark: value
        };
        reviewReservation(payload).then(res => {
          if (res.data.code === 200) {
            this.$message.success('审核成功');
            this.fetchList();
          } else {
            this.$message.error(res.data.msg || '审核失败');
          }
        });
      }).catch(() => {
      });
    },
  }
};
</script>

<style scoped>
.con::-webkit-scrollbar {
  display: none;
}
</style>
