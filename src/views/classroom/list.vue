<template>
  <div class="app-container">
    <el-card>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input placeholder="请输入教室名称" style="width: 200px; margin-right: 20px;" size="small"></el-input>
          <!--        筛选楼栋-->
          <el-select placeholder="选择楼栋" style="width: 200px; margin-right: 20px;" size="small">
            <el-option label="一号楼" value="building1"></el-option>
            <el-option label="二号楼" value="building2"></el-option>
            <el-option label="三号楼" value="building3"></el-option>
          </el-select>
          <!--        状态 空闲/使用中/预约中/维修中-->
          <el-select placeholder="选择状态" style="width: 200px; margin-right: 20px;" size="small">
            <el-option label="空闲" value="free"></el-option>
            <el-option label="使用中" value="in_use"></el-option>
            <el-option label="预约中" value="reserved"></el-option>
            <el-option label="维修中" value="under_maintenance"></el-option>
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addClassroomDialog = true">新增教室</el-button>
      </div>
      <el-table :data="classroomList" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="classroom_code" label="教室编号" width="120"/>
        <el-table-column prop="classroom_name" label="教室名称"/>
        <el-table-column prop="building" label="楼栋"/>
        <el-table-column prop="floor" label="楼层"/>
        <el-table-column prop="capacity" label="容量"/>
        <el-table-column prop="type" label="用途"/>
        <el-table-column prop="status" label="状态"/>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增教室" :visible.sync="addClassroomDialog" width="500px" center>
        <el-form
            ref="form"
            :model="newClassroom"
            label-width="100px"
            label-position="left"
            style="padding: 20px;"
        >
          <el-form-item label="教室编号">
            <el-input v-model="newClassroom.classroom_code" style="width: 100%;" placeholder="请输入教室编号"></el-input>
          </el-form-item>
          <el-form-item label="教室名称">
            <el-input v-model="newClassroom.classroom_name" style="width: 100%;" placeholder="请输入教室名称"></el-input>
          </el-form-item>
          <el-form-item label="楼栋">
            <el-select v-model="newClassroom.building" placeholder="请选择楼栋" style="width: 100%;">
              <el-option label="一号楼" value="building1"></el-option>
              <el-option label="二号楼" value="building2"></el-option>
              <el-option label="三号楼" value="building3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼层">
            <el-input v-model.number="newClassroom.floor" style="width: 100%;" placeholder="请输入楼层"></el-input>
          </el-form-item>
          <el-form-item label="容量">
            <el-input v-model.number="newClassroom.capacity" style="width: 100%;" placeholder="请输入容量"></el-input>
          </el-form-item>
          <el-form-item label="用途">
            <el-select v-model="newClassroom.type" placeholder="请选择用途" style="width: 100%;">
              <el-option label="教学" value="teaching"></el-option>
              <el-option label="会议" value="meeting"></el-option>
              <el-option label="实验" value="experiment"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="$refs.form.resetFields()">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addClassroomDialog: false,
      classroomList: [
        {
          classroom_code: 'A101',
          classroom_name: '一号楼101教室',
          building: '一号楼',
          floor: 1,
          capacity: 60,
          type: '教学',
          status: '空闲'
        },
        {
          classroom_code: 'B101',
          classroom_name: '二号楼101教室',
          building: '二号楼',
          floor: 1,
          capacity: 100,
          type: '会议',
          status: '维修中'
        }
      ],
      newClassroom: {
        classroom_code: '',
        classroom_name: '',
        building: '',
        floor: null,
        capacity: null,
        type: ''
      }
    }
  },
  // 根据教室编号自动生成教室名称，楼层 A101 -> 一号楼1层 B101 -> 二号楼1层 根据英文字母顺序，自动生成楼栋
  watch: {
    'newClassroom.classroom_code': function (newVal) {
      if (newVal) {
      }
    }
  },
  methods: {
    handleEdit(row) {
      this.$message(`编辑：${row.classroom_name}`);
    },
    handleDelete(row) {
      this.$confirm(`确认删除教室 ${row.classroom_name} 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功（假动作）');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
}
</script>
