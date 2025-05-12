<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询条件 -->
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-date-picker
            v-model="filter.date"
            type="date"
            default-value=" "
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :clearable="false"
            size="small"
        />
        <el-select
            v-model="filter.building"
            placeholder="选择教学楼"
            style="width: 200px;"
            size="small"
        >
          <el-option
              v-for="item in buildings"
              :key="item.id"
              :label="item.buildingName"
              :value="item.id"
          />
        </el-select>
        <el-input v-model="filter.classroomCode" placeholder="教室编号" style="width: 200px;" size="small"/>
        <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="fetchData"
        >查询
        </el-button
        >
        <el-button
            icon="el-icon-refresh"
            size="small"
            @click="resetSearchFields()"
        >重置
        </el-button>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="roomName" label="教室" width="120"/>
        <el-table-column
            v-for="slot in timeSlots"
            :key="slot"
            :label="slot"
            :prop="slot"
        >
          <template v-slot="scope">
            <span
                @click="handleDetail(scope.row.classroomId, scope.row.roomName, scope.column.property,scope.row[scope.column.property])"
                :class="scope.row[scope.column.property] === '空闲' ? 'free' : 'occupied'">{{
                scope.row[scope.column.property]
              }}</span>
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
          @current-change="fetchData"
          style="margin-top: 20px; text-align: right;"
      />
    </el-card>
    <el-dialog title="申请预约" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="预约类型" prop="type" align="left">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="自习" value="自习"/>
            <el-option label="教学" value="教学"/>
            <el-option label="会议" value="会议"/>
            <el-option label="考试" value="考试"/>
          </el-select>
        </el-form-item>
        <el-form-item label="预约原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getTimeSlot} from "@/util/timeSlot";
import {getAllBuilding} from "@/apis/building";
import {getSchedule} from "@/apis/classroom";
import dayjs from "dayjs";
import {addReservation} from "@/apis/reservation";

export default {
  data() {
    return {
      filter: {
        date: dayjs().format("YYYY-MM-DD"),
        building: "",
        classroomCode: ""
      },
      buildings: [],
      timeSlots: [],
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dialogVisible: false,
      form: {
        classroomId: '',
        type: "教学",
        roomName: '',
        timeSlot: '',
        startTime: '',
        endTime: '',
        reason: '',
      },
      rules: {
        type: [
          {required: true, message: "请选择预约类型", trigger: "change"},
        ],
      }
    };
  },
  created() {
    getTimeSlot().then(res => {
      this.timeSlots = res;
    });
    this.getBuildings();
    this.fetchData();
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('您预约的教室为' + this.form.roomName + '，时间段为' + this.form.timeSlot + '，是否确认预约？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delete this.form.timeSlot;
            delete this.form.roomName;
            console.log(this.form)
            addReservation(this.form).then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '预约成功'
                });
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
              this.dialogVisible  = false;
            }).catch(() => {
              this.dialogVisible = false;
            });
          }).catch(() => {
          });
        }
      });
    },
    handleDetail(classroomId, roomName, timeSlot, status) {
      // 判断选择的日期是否晚于当前日期，只能预约之后的时间
      const startDate = this.filter.date + ' ' + timeSlot.split('-')[0];
      const endDate = this.filter.date + ' ' + timeSlot.split('-')[1];
      if (new Date(startDate) < new Date()) {
        this.$message.error('不能选择过去时间');
        return;
      }
      if (status !== '空闲') {
        this.$alert('当前教室该时间段已被预约', '提示', {
          confirmButtonText: '确定',
          type: 'info'
        });
        return;
      }
      this.form = {
        classroomId,
        timeSlot,
        roomName,
        startTime: startDate,
        endTime: endDate
      };
      this.dialogVisible = true;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.fetchList();
    },
    resetSearchFields() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.filter = {
        date: dayjs().format("YYYY-MM-DD"),
        building: "",
        classroomCode: ""
      }
      this.fetchData();
    },
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        scheduleDate: this.filter.date,
        buildingId: this.filter.building,
        classroomCode: this.filter.classroomCode
      };
      getSchedule(params).then(res => {
        if (res.data.code === 200) {
          const list = res.data.data.list;
          this.tableData = list.map(item => {
            const row = {
              roomName: item.classroomCode,
              classroomId: item.classroomId
            };
            const schedule = item.classroomSchedule || {};
            this.timeSlots.forEach(slot => {
              row[slot] = schedule[slot] || '空闲';
            });
            return row;
          });

          this.total = res.data.data.total;
        }
      });
    },
    getBuildings() {
      getAllBuilding().then(res => {
        if (res.data.code === 200) {
          this.buildings = res.data.data;
        }
      });
    }
  },
};
</script>

<style>
/* 状态颜色样式 */
.occupied {
  background-color: #3D90D7;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.occupied:hover {
  cursor: pointer;
  background-color: #f56c6c;
}

.free {
  background-color: #67c23a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.free:hover {
  cursor: pointer;
  background-color: #f56c6c;
}

.cell {
  text-align: center !important;
}

.con::-webkit-scrollbar {
  display: none;
}
</style>
