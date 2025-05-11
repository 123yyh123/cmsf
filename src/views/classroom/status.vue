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
            <span @click="handleDetail(scope.row.classroomId, scope.column.property)"
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
    <el-dialog
        :title="'教室使用详情：' + detailDialog.roomName"
        :visible.sync="detailDialog.visible"
        width="500px"
    >
      <el-card>
        <el-descriptions :column="1" border size="small" v-if="detailDialog.data">
          <el-descriptions-item label="教室编号">{{ detailDialog.data.classroomCode }}</el-descriptions-item>
          <el-descriptions-item label="日期">{{ detailDialog.data.date }}</el-descriptions-item>
          <el-descriptions-item label="时间段">{{ detailDialog.data.timeSlot }}</el-descriptions-item>
          <el-descriptions-item label="使用类型">{{ detailDialog.data.type }}</el-descriptions-item>
          <el-descriptions-item v-if="detailDialog.data.type==='教学'" label="课程名称">{{
              detailDialog.data.courseName
            }}
          </el-descriptions-item>
          <el-descriptions-item label="使用人">{{
              detailDialog.data.realName || ('ID:' + detailDialog.data.userId)
            }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag
                :type="detailDialog.data.status==='待使用' ? 'success' :detailDialog.data.status==='使用中' ? 'warning' :'info'">
              {{ detailDialog.data.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{ detailDialog.data.remark || '--' }}</el-descriptions-item>
        </el-descriptions>
        <template #footer>
          <el-button @click="detailDialog.visible = false">关闭</el-button>
        </template>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {getTimeSlot} from "@/util/timeSlot";
import {getAllBuilding} from "@/apis/building";
import {getSchedule, getScheduleDetail} from "@/apis/classroom";
import dayjs from "dayjs";

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
      detailDialog: {
        visible: false,
        roomName: '',
        data: null
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
    handleDetail(classroomId, timeSlot) {
      console.log(classroomId, timeSlot)
      getScheduleDetail({
        classroomId,
        timeSlot,
        scheduleDate: this.filter.date
      }).then((res) => {
        if (res.data.code === 200) {
          this.detailDialog = {
            visible: true,
            roomName: res.data.data.classroomCode,
            data: res.data.data
          };
        } else if (res.data.code === 500) {
          this.$alert('该时间段暂无预约，教室空闲。', '提示', {
            confirmButtonText: '确定',
            type: 'info'
          });
        }
      });
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
