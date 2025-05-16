<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0; display: flex; flex-direction: column; overflow: auto;" class="con">
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-input v-model="filters.realName" placeholder="操作人" size="small" style="width: 150px; margin-right: 20px;"/>
        <el-select v-model="filters.operationType" placeholder="操作类型" size="small" style="width: 150px; margin-right: 20px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="登录" value="login"></el-option>
          <el-option label="登出" value="logout"></el-option>
          <el-option label="添加" value="insert"></el-option>
          <el-option label="修改" value="update"></el-option>
          <el-option label="删除" value="delete"></el-option>
          <el-option label="查询" value="select"></el-option>
          <el-option label="其他" value="other"></el-option>
        </el-select>
        <el-select v-model="filters.successFlag" placeholder="操作结果" size="small" style="width: 150px; margin-right: 20px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="0"></el-option>
        </el-select>
        <el-input v-model="filters.ip" placeholder="IP地址" size="small" style="width: 150px; margin-right: 20px;"/>
        <el-input v-model="filters.address" placeholder="归属地" size="small" style="width: 150px; margin-right: 20px;"/>
        <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 300px; margin-right: 20px;"
            :clearable="false"
            value-format="yyyy-MM-dd"
            size="small"
        />
        <el-button type="primary" icon="el-icon-search" size="small" @click="fetchList">查询</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilter">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="logList" border style="width: 100%; margin-top: 20px;"
                :default-sort="{prop: 'id', order: 'ascending'}"
                @sort-change="sortChange">
        <el-table-column prop="realName" label="操作人"/>
        <el-table-column prop="operationType" label="操作类型"/>
        <el-table-column prop="operationDesc" label="操作描述"/>
        <el-table-column prop="method" label="请求方法"/>
        <el-table-column prop="successFlag" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.successFlag === 1 ? 'success' : 'danger'">
              {{ scope.row.successFlag === 1 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="耗时(ms)"/>
        <el-table-column prop="ip" label="IP地址"/>
        <el-table-column prop="address" label="归属地"/>
        <el-table-column prop="createTime" label="操作时间" sortable="custom"
                         :sort-orders="['ascending', 'descending','null']"/>
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
          @current-change="getLogList"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getSystemLog} from '@/apis/common';
import {toLine} from "@/util/strUtils"; // 请根据你的项目路径修改

export default {
  data() {
    return {
      logList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      filters: {
        orderByField: '',
        orderByType: '',
        realName: '',
        operationType: '',
        successFlag: '',
        ip: '',
        address: '',
        dateRange: [],
      },
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    resetFilter(){
      this.filters = {
        orderByField: '',
        orderByType: '',
        realName: '',
        operationType: '',
        successFlag: '',
        ip: '',
        address: '',
        dateRange: [],
      };
      this.getLogList();
    },
    fetchList() {
      this.pageNum = 1;
      this.getLogList();
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
      this.getLogList();
    },
    getLogList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.filters,
        'createTimeRange.startDate': this.filters.dateRange[0] || '',
        'createTimeRange.endDate': this.filters.dateRange[1] || ''
      };
      delete params.dateRange;
      getSystemLog(params).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.logList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取日志列表失败');
        }
      }).catch((err) => {
        console.error(err);
        this.$message.error('接口请求失败');
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getLogList();
    },
  },
};
</script>

<style scoped>
.con::-webkit-scrollbar {
  display: none;
}
</style>
