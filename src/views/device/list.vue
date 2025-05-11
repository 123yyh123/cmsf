<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询条件 -->
      <div style="display: flex;margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;justify-content: space-between">
        <!-- 查询条件 -->
        <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px">
          <el-input v-model="filters.deviceCode" placeholder="设备编号" style="width: 150px;" size="small"/>
          <el-input v-model="filters.deviceName" placeholder="设备名称" style="width: 150px;" size="small"/>
          <el-input v-model="filters.type" placeholder="设备类型" style="width: 150px;" size="small"/>
          <el-input v-model="filters.manufacturer" placeholder="制造商" style="width: 150px;" size="small"/>
          <el-date-picker
              v-model="filters.purchaseDate"
              type="daterange"
              range-separator="至"
              start-placeholder="购入开始日期"
              end-placeholder="购入结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="false"
              size="small"
              style="width: 240px;"
          />
          <el-select v-model:size="filters.bindingStatus" placeholder="绑定状态" style="width: 120px;" size="small">
            <el-option label="已绑定" value="已绑定"/>
            <el-option label="未绑定" value="未绑定"/>
          </el-select>
          <el-select v-model="filters.status" placeholder="状态" style="width: 120px;" size="small">
            <el-option label="正常" value="正常"/>
            <el-option label="损坏" value="损坏"/>
            <el-option label="维修中" value="维修中"/>
            <el-option label="报废" value="报废"/>
          </el-select>
          <div>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="handleReset">重置</el-button>
          </div>
        </div>
        <div style="margin-bottom: 20px">
          <el-button type="danger" size="small" @click="batchDelete">批量删除</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
          :data="deviceList"
          border
          style="width: 100%;"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @sort-change="sortChange"
          @select="handleSelect"
          @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="deviceCode" label="设备编号" width="150"/>
        <el-table-column prop="deviceName" label="设备名称"/>
        <el-table-column prop="type" label="设备类型" width="120"/>
        <el-table-column prop="model" label="型号" width="150"/>
        <el-table-column prop="manufacturer" label="制造商"/>
        <el-table-column prop="purchaseDate" label="购入日期" width="120"/>
        <el-table-column prop="warrantyUntil" label="保修到期" width="120"/>
        <el-table-column prop="bindingStatus" label="绑定状态" width="100">
          <template slot-scope="scope">
            <el-tag
                :type="scope.row.bindingStatus === '已绑定' ? 'success' :
                      scope.row.bindingStatus === '未绑定' ? 'info' : 'warning'"
            >
              {{ scope.row.bindingStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag @click="updateDeviceStatus(scope.row)" class="bindStatus"
                    :type="scope.row.status === '正常' ? 'success' :
                      scope.row.status === '维修中' ? 'warning' :
                      scope.row.status === '损坏' ? 'danger' : 'info'"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <div style="text-align: center">
              <el-button size="mini" type="text" @click="handleBindDetail(scope.row)" style="color: #409eff">绑定详情
              </el-button>
              <el-button size="mini" type="text" @click="handleEdit(scope.row)" style="color: #f4b03e">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
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
          @current-change="getDeviceList"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑设备" :visible.sync="editDialog" width="500px" center>
      <el-form :model="editForm" label-width="100px" :rules="editRules" ref="editForm">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="editForm.deviceCode" disabled/>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="editForm.deviceName"/>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input v-model="editForm.type"/>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="editForm.model"/>
        </el-form-item>
        <el-form-item label="制造商" prop="manufacturer">
          <el-input v-model="editForm.manufacturer"/>
        </el-form-item>
        <el-form-item label="购入日期" prop="purchaseDate">
          <el-date-picker v-model="editForm.purchaseDate" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <el-form-item label="保修到期" prop="warrantyUntil">
          <el-date-picker v-model="editForm.warrantyUntil" type="date" placeholder="选择日期" style="width: 100%;"/>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="submitEditForm">保存</el-button>
          <el-button @click="editDialog = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog title="绑定详情" :visible.sync="bindDetailDialog" width="500px" center>
      <BindTimeline v-if="deviceData" :device="deviceData"/>
    </el-dialog>
    <el-dialog title="修改设备状态" :visible.sync="editStatusDialog" width="500px" center>
      <el-form :model="editStatusForm" label-width="100px" ref="editStatusForm">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="editStatusForm.deviceCode" disabled/>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="editStatusForm.deviceName" disabled/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editStatusForm.status" placeholder="请选择">
            <el-option label="正常" value="正常"/>
            <el-option label="损坏" value="损坏"/>
            <el-option label="维修中" value="维修中"/>
            <el-option label="报废" value="报废"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitEditStatusForm">保存</el-button>
        <el-button @click="editStatusDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDevicePageList,
  deleteDevice,
  editDevice,
  getDeviceBindTrace,
  updateDeviceBindStatus,
  deleteDeviceBatch
} from '@/apis/device';
import BindTimeline from "@/components/BindTimeline.vue";

export default {
  components: {BindTimeline},
  data() {
    return {
      pickerOptions: {
        // 不能选择未来日期
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      selectedIds: [],
      filters: {
        deviceCode: '',
        deviceName: '',
        type: '',
        bindingStatus: '',
        purchaseDate: '',
        status: '',
        manufacturer: '',
        orderByField: '',
        orderByType: ''
      },
      deviceList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      editDialog: false,
      bindDetailDialog: false,
      editStatusDialog: false,
      editForm: {
        id: '',
        deviceCode: '',
        deviceName: '',
        type: '',
        model: '',
        manufacturer: '',
        purchaseDate: '',
        warrantyUntil: '',
        status: ''
      },
      editRules: {
        deviceName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
        type: [{required: true, message: '请输入设备类型', trigger: 'blur'}],
      },
      deviceData: {},
      editStatusForm: {
        id: '',
        status: '',
        deviceCode: '',
        deviceName: ''
      },
    };
  },
  created() {
    this.getDeviceList();
  },
  methods: {
    handleSelect(selection) {
      console.log(selection);
      this.selectedIds = selection.map((item) => item.id);
    },
    handleSelectAll(selection) {
      if (selection.length === this.classroomList.length) {
        this.selectedIds = this.classroomList.map((item) => item.id);
      } else {
        this.selectedIds = [];
      }
    },
    batchDelete() {
      if (this.selectedIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的设备'
        });
        return;
      }
      this.$confirm("确认删除选中的设备吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteDeviceBatch({ids: this.selectedIds}).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("删除成功");
                this.getDeviceList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
          });
    },
    updateDeviceStatus(column) {
      this.editStatusForm.id = column.id;
      this.editStatusForm.status = column.status;
      this.editStatusForm.deviceCode = column.deviceCode;
      this.editStatusForm.deviceName = column.deviceName;
      this.editStatusDialog = true;
    },
    submitEditStatusForm() {
      updateDeviceBindStatus(this.editStatusForm)
          .then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              this.editStatusDialog = false;
              this.getDeviceList();
            }
          });
    },
    handleBindDetail(column) {
      getDeviceBindTrace({deviceId: column.id}).then(res => {
        if (res.data.code === 200) {
          this.bindDetailDialog = true;
          this.deviceData = res.data.data;
        }
      });
    },
    sortChange(column) {
      if (column.order !== 'null') {
        this.filters.orderByField = column.prop;
        this.filters.orderByType = column.order === 'ascending' ? 'asc' : 'desc';
      } else {
        this.filters.orderByField = '';
        this.filters.orderByType = '';
      }
      this.pageNum = 1;
      this.getDeviceList();
    },
    getDeviceList() {
      const params = {
        ...this.filters,
        'purchaseDate.startDate': this.filters.purchaseDate === '' ? '' : this.filters.purchaseDate[0],
        'purchaseDate.endDate': this.filters.purchaseDate === '' ? '' : this.filters.purchaseDate[1],
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      delete params.purchaseDate;
      getDevicePageList(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.deviceList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取设备列表失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('请求失败');
      });
    },
    handleSearch() {
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleReset() {
      this.filters = {
        deviceCode: '',
        deviceName: '',
        type: '',
        bindingStatus: '',
        purchaseDate: '',
        status: '',
        manufacturer: '',
        orderByField: '',
        orderByType: ''
      };
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.getDeviceList();
    },
    handleEdit(row) {
      this.editForm = {...row};
      this.editDialog = true;
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate();
      });
    },
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editDevice(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success('编辑成功');
              this.editDialog = false;
              this.getDeviceList();
            } else {
              this.$message.error(res.data.msg || '编辑失败');
            }
          }).catch(err => {
            console.error(err);
            this.$message.error('请求失败');
          });
        } else {
          this.$message.warning('请填写完整信息');
        }
      });
    },
    handleDelete(row) {
      this.$confirm(`确认删除设备 ${row.deviceName} (${row.deviceCode}) 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteDevice({id: row.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.getDeviceList();
          } else {
            this.$message.error(res.data.msg || '删除失败');
          }
        }).catch(err => {
          console.error(err);
        })
      }).catch(() => {
      });
    }
  }
};
</script>

<style scoped>
.bindStatus:hover{
  cursor: pointer;
}
.con::-webkit-scrollbar {
  display: none;
}
</style>
