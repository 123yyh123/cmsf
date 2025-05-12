<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 查询条件 -->
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-input v-model="filters.username" placeholder="用户名" style="width: 120px;"
                  size="small"/>
        <el-input v-model="filters.studentNo" placeholder="学号" style="width: 120px;"
                  size="small"/>
        <el-input v-model="filters.realName" placeholder="姓名" style="width: 120px;" size="small"/>
        <el-input v-model="filters.department" placeholder="学院" style="width: 120px;"
                  size="small"/>
        <el-input v-model="filters.major" placeholder="专业" style="width: 150px;" size="small"/>
        <el-input v-model="filters.className" placeholder="班级" style="width: 120px;"
                  size="small"/>
        <el-select v-model="filters.status" placeholder="状态" style="width: 120px;" size="small">
          <el-option label="启用" :value="1"/>
          <el-option label="禁用" :value="0"/>
        </el-select>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 学生表格 -->
      <el-table
          :data="studentList"
          border
          style="width: 100%;"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @sort-change="sortChange"
      >
        <el-table-column prop="studentNo" label="学号" width="120"/>
        <el-table-column prop="username" label="用户名" width="120"/>
        <el-table-column prop="realName" label="姓名" width="100"/>
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === 'F' ? '女' : '男' }}
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="80"/>
        <el-table-column prop="className" label="班级" width="100"/>
        <el-table-column prop="major" label="专业" width="100"/>
        <el-table-column prop="department" label="学院" width="120"/>
        <el-table-column prop="phone" label="手机号" width="110"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column prop="createTime" label="创建时间" width="120" sortable="custom"
                         :sort-orders="['ascending', 'descending','null']"/>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          style="margin-top: 20px; text-align: right;flex-shrink: 0;"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getStudentList"
      />
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑学生" :visible.sync="editDialog" width="500px" center>
      <el-form :model="editForm" label-width="80px" label-position="left" :rules="editRules" ref="editForm">
        <el-form-item label="学号" prop="studentNo">
          <el-input v-model="editForm.studentNo" :disabled="true"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="editForm.realName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="editForm.username"/>
        </el-form-item>
        <el-form-item label="年级" prop="grade" required>
          <el-input v-model="editForm.grade"/>
        </el-form-item>
        <el-form-item label="班级" prop="className" required>
          <el-input v-model="editForm.className"/>
        </el-form-item>
        <el-form-item label="专业" prop="major" required>
          <el-input v-model="editForm.major"/>
        </el-form-item>
        <el-form-item label="学院" prop="department" required>
          <el-input v-model="editForm.department"/>
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="启用" :value="1"/>
            <el-option label="禁用" :value="0"/>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="submitEditForm">保存</el-button>
        <el-button @click="editDialog = false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getStudentPageList, deleteStudent, editStudent} from '@/apis/user';

export default {
  data() {
    return {
      filters: {
        username: '',
        studentNo: '',
        realName: '',
        gender: '',
        department: '',
        major: '',
        className: '',
        status: '',
        orderByField: '',
        orderByType: ''
      },
      editDialog: false,
      editForm: {
        id: '',
        username: '',
        realName: '',
        gender: '',
        studentNo: '',
        grade: '',
        className: '',
        major: '',
        department: '',
        status: ''
      },
      editRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        grade: [{required: true, message: '请输入年级', trigger: 'blur'}],
        className: [{required: true, message: '请输入班级', trigger: 'blur'}],
        major: [{required: true, message: '请输入专业', trigger: 'blur'}],
        department: [{required: true, message: '请输入学院', trigger: 'blur'}],
      },
      studentList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getStudentList();
  },
  methods: {
    sortChange(column) {
      console.log(column);
      if (column.order !== 'null') {
        const orderByField = column.prop;
        const orderByType = column.order === 'ascending' ? 'asc' : 'desc';
        this.filters.orderByField = orderByField;
        this.filters.orderByType = orderByType;
      } else {
        this.filters.orderByField = '';
        this.filters.orderByType = '';
      }
      this.pageNum = 1;
      this.getStudentList();
    },
    getStudentList() {
      const params = {
        ...this.filters,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getStudentPageList(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.studentList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取学生列表失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('请求失败');
      });
    },
    handleSearch() {
      this.pageNum = 1;
      this.getStudentList();
    },
    handleReset() {
      this.filters = {
        username: '',
        studentNo: '',
        realName: '',
        gender: '',
        department: '',
        major: '',
        status: ''
      };
      this.pageNum = 1;
      this.getStudentList();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.getStudentList();
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
          editStudent(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success('编辑成功');
              this.editDialog = false;
              this.getStudentList();
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
      this.$confirm(`确认删除学生 ${row.realName} (${row.username}) 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteStudent({userId: row.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.getStudentList();
          } else {
            this.$message.error(res.data.msg || '删除失败');
          }
        });
      }).catch(() => {
      });
    }
  }
};
</script>

<style scoped>
.con::-webkit-scrollbar {
  display: none;
}
</style>
