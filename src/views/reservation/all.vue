<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询条件 -->
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-input v-model="filters.realName" placeholder="申请人" style="width: 150px; margin-right: 20px;"
                  size="small"/>
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
            start-placeholder="审核日期"
            end-placeholder="审核日期"
            style="margin-right: 20px;"
            :clearable="false"
            value-format="yyyy-MM-dd"
            size="small"
        />
        <el-button type="primary" icon="el-icon-search" size="small" @click="fetchList">查询</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
      </div>

      <!-- 审核列表 -->
      <el-table :data="reservationList" border style="width: 100%;" :height="520"
                :default-sort="{prop: 'id', order: 'ascending'}" @sort-change="sortChange">
        <el-table-column prop="realName" label="申请人" width="100"/>
        <el-table-column prop="classroomCode" label="教室编号" width="100"/>
        <el-table-column prop="type" label="预约类型" width="100"/>
        <el-table-column label="预约时间段" width="300">
          <template slot-scope="scope">
            <div>{{ scope.row.startTime }} ~{{ scope.row.endTime }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="预约原因"/>
        <el-table-column prop="reviewer" label="审核人" width="100"/>
        <el-table-column prop="remark" label="审核备注"/>
        <el-table-column prop="status" label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'pending'" type="warning">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-else-if="scope.row.status === 'rejected'" type="danger">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewTime" label="审核时间" width="200" sortable="custom"
                         :sort-orders="['ascending', 'descending','null']"/>
        <el-table-column prop="createTime" label="申请时间" width="200" sortable="custom"
                         :sort-orders="['ascending', 'descending','null']"/>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)" style="color: #409eff;">查看详情</el-button>
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
    <el-dialog title="审核详情" :visible.sync="detailDialog" width="30%">
      <div style="position: relative; padding-left: 20px; border-left: 2px solid #e0e0e0; margin-top: 20px;">
        <div
            v-for="(item, index) in reviewHistory"
            :key="index"
            style="position: relative; margin-bottom: 30px; padding-left: 20px;"
        >
          <!-- 时间点 -->
          <div
              :style="getDotStyle(item.reviewStatus)"
              style="position: absolute; left: -11px; top: 5px; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 2px #e0e0e0;"
          ></div>

          <!-- 内容卡片 -->
          <div
              style="background: #fafafa; padding: 10px 15px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);text-align: start"
          >
            <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
              <span style="font-weight: bold; color: #333;">{{ item.reviewStatus }}</span>
            </div>
            <div style="font-size: 13px; color: #555;">
              <div v-if="item.reviewer"><strong>审核人：</strong>{{ item.reviewer }}</div>
              <div v-if="item.reviewTime"><strong>{{ item.reviewStatus === "待审核" ? "申请时间" : "审核时间" }}：</strong>{{ item.reviewTime }}
              </div>
              <div v-if="item.reviewComment"><strong>审核意见：</strong>{{ item.reviewComment }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getReservationRecordPageList, getReservationDetail} from '@/apis/reservation';
import {toLine} from "@/util/strUtils";

export default {
  data() {
    return {
      filters: {
        userId: '',
        classroomId: '',
        type: '',
        status: '',
        dateRange: []
      },
      reservationList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      detailDialog: false,
      reviewHistory: []
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    handleDetail(column) {
      this.detailDialog = true;
      getReservationDetail({id: column.id}).then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          this.reviewHistory = res.data.data;
        }
      })
    },
    getDotStyle(status) {
      let bgColor = '#ccc';
      if (status === '待审核') bgColor = '#e6a23c';
      else if (status === '辅导员通过') bgColor = '#2fc5af';
      else if (status === '审核通过') bgColor = '#67c23a';
      else if (status === '审核不通过') bgColor = '#f56c6c';
      return `background-color: ${bgColor};`;
    },
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
        status: ['approved', 'rejected'],
        'reviewTime.startDate': this.filters.dateRange[0] || '',
        'reviewTime.endDate': this.filters.dateRange[1] || ''
      };
      delete params.dateRange;
      getReservationRecordPageList(params).then(res => {
        if (res.data.code === 200) {
          this.reservationList = res.data.data.list;
          this.total = res.data.data.total;
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
        status: '',
        dateRange: []
      };
      this.pageNum = 1;
      this.fetchList();
    },
  }
};
</script>

<style scoped>
.con::-webkit-scrollbar {
  display: none;
}
</style>
