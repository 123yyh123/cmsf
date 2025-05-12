<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询区域 -->
      <div style="display: flex; margin-bottom: 20px; gap: 20px; flex-wrap: wrap;">
        <el-input v-model="filters.deviceCode" placeholder="设备编号" style="width: 150px;" size="small"/>
        <el-input v-model="filters.deviceName" placeholder="设备名称" style="width: 150px;" size="small"/>
        <el-select v-model="filters.status" placeholder="处理状态" style="width: 150px;" size="small">
          <el-option label="待处理" value="待处理"/>
          <el-option label="处理中" value="处理中"/>
          <el-option label="已完成" value="已完成"/>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetFilters">重置</el-button>
      </div>

      <!-- 表格展示 -->
      <el-table :data="repairList" border style="width: 100%;">
        <el-table-column prop="deviceCode" label="设备编号" width="120"/>
        <el-table-column prop="deviceName" label="设备名称"/>
        <el-table-column prop="createdByName" label="报修人" width="100"/>
        <el-table-column prop="description" label="故障描述"/>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag @click="updateDeviceStatus(scope.row)" class="bindStatus"
                    :type="scope.row.status === '已完成' ? 'success' :
                      scope.row.status === '处理中' ? 'warning' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="报修时间" width="160"/>
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
    <el-dialog title="修改报修状态" :visible.sync="editStatusDialog" width="500px" center>
      <el-form :model="editStatusForm" label-width="80px">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="editStatusForm.deviceCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editStatusForm.status" placeholder="请选择状态">
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditStatusForm">提交</el-button>
          <el-button @click="editStatusDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getDeviceRepairPage, updateDeviceRepairStatus} from "@/apis/device";

export default {
  data() {
    return {
      filters: {
        deviceCode: '',
        deviceName: '',
        createdByName: '',
        status: ''
      },
      repairList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      editStatusDialog: false,
      editStatusForm: {
        id: '',
        status: '',
        deviceCode: '',
      },
      editStatusRules: {
        status: [
          {required: true, message: '请选择设备状态', trigger: 'change'}
        ]
      },
      statusOptions: [
        {
          label: '待处理',
          value: '待处理'
        },
        {
          label: '处理中',
          value: '处理中'
        }, {
          label: '已完成',
          value: '已完成'
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    submitEditStatusForm() {
      updateDeviceRepairStatus(this.editStatusForm)
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.editStatusDialog = false;
              this.getList();
            }
          }).catch(() => {
        this.$message({
          type: 'error',
          message: '修改失败'
        });
      });
    },
    updateDeviceStatus(column) {
      this.editStatusForm.id = column.id;
      this.editStatusForm.status = column.status;
      this.editStatusForm.deviceCode = column.deviceCode;
      this.editStatusDialog = true;
    },
    getList() {
      const params = {
        ...this.filters,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getDeviceRepairPage(params).then(res => {
        if (res.data.code === 200) {
          this.repairList = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg || '获取失败');
        }
      });
    },
    resetFilters() {
      this.filters = {
        deviceCode: '',
        deviceName: '',
        createdByName: '',
        status: ''
      };
      this.pageNum = 1;
      this.getList();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
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

.bindStatus:hover {
  cursor: pointer;
}
</style>
