<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <div style="margin-bottom: 20px;display:flex;text-align: start">
        <el-button type="primary" icon="el-icon-download" size="small" @click="download" style="margin-right: 20px;">
          下载模板
        </el-button>
        <el-upload
            class="upload-demo"
            :action="uploadTeacher"
            name="file"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            :on-progress="handleProgress"
            :headers="uploadHeaders"
            :data="{}"
            accept=".xls,.xlsx"
        >
          <el-button type="primary" size="small" icon="el-icon-upload2">导入数据</el-button>
          <el-progress :percentage="uploadProgress" v-if="uploadProgress > 0"/>
        </el-upload>
      </div>
      <!-- 查询条件 -->
      <div style="display: flex; flex-wrap: wrap; margin-bottom: 20px;gap: 15px 20px;flex-shrink: 0;">
        <el-input v-model="filters.username" placeholder="用户名" style="width: 150px; "
                  size="small"/>
        <el-input v-model="filters.teacherNo" placeholder="教工号" style="width: 150px; "
                  size="small"/>
        <el-input v-model="filters.title" placeholder="职称" style="width: 150px; " size="small"/>
        <el-input v-model="filters.department" placeholder="学院" style="width: 150px; "
                  size="small"/>
        <el-select v-model="filters.status" placeholder="状态" style="width: 120px; " size="small">
          <el-option label="启用" :value="1"/>
          <el-option label="禁用" :value="0"/>
        </el-select>
        <el-select v-model="filters.isCounselor" placeholder="辅导员" style="width: 120px; " size="small">
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 教师表格 -->
      <el-table
          :data="teacherList"
          border
          style="width: 100%;"
          :default-sort="{prop: 'id', order: 'ascending'}"
          @sort-change="sortChange"
      >
        <el-table-column prop="teacherNo" label="教工号" width="100"/>
        <el-table-column prop="username" label="用户名" width="120"/>
        <el-table-column prop="realName" label="姓名" width="120"/>
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === 'F' ? '女' : '男' }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="职称" width="80"/>
        <el-table-column prop="department" label="学院" width="100"/>
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
        <el-table-column prop="isCounselor" label="辅导员" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isCounselor? 'success' : 'info'" @click="changeCounselor(scope.row)"
                    class="counselor">
              {{ scope.row.isCounselor ? '是' : '否' }}
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
          style="margin-top: 20px; text-align: right;"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getTeacherList"
      />
    </el-card>
    <el-dialog title="编辑教师" :visible.sync="editDialog" width="500px" center>
      <el-form :model="editForm" label-width="80px" label-position="left" :rules="editRules" ref="editForm">
        <el-form-item label="教工号" prop="teacherNo" required>
          <el-input v-model="editForm.teacherNo" :disabled="true"/>
        </el-form-item>
        <el-form-item label="姓名" prop="realName" required>
          <el-input v-model="editForm.realName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="editForm.username"/>
        </el-form-item>
        <el-form-item label="职称" prop="title" required>
          <el-input v-model="editForm.title"/>
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
    <el-dialog title="辅导员详情" :visible.sync="counselorDetailDialog" width="500px" center>
      <el-form label-width="80px" label-position="left">
        <el-form-item label="教工号">
          {{ counselorDetail.teacherNo }}
        </el-form-item>
        <el-form-item label="辅导员">
          <el-select v-model="counselorDetail.isCounselor">
            <el-option label="是" :value="true"/>
            <el-option label="否" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理班级" v-if="counselorDetail.isCounselor">
          <el-select v-model="counselorDetail.className"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     placeholder="请输入管理班级">
            <el-option
                v-for="item in counselorDetail.className"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditCounselor">保存</el-button>
          <el-button @click="counselorDetailDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTeacherPageList,
  deleteTeacher,
  editTeacher,
  downloadTemplateTeacher,
  getManagerClass, updateManagerClassroom
} from '@/apis/user';
import {baseUrl} from "@/config"; // 注意替换成你的实际API路径

export default {
  data() {
    return {
      filters: {
        username: '',
        teacherNo: '',
        title: '',
        department: '',
        isCounselor: '',
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
        title: '',
        department: '',
        status: ''
      },
      editRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入职称', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '请输入学院', trigger: 'blur'},
          {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
        ],
      },
      teacherList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      uploadTeacher: baseUrl + '/user/upload/teacher',
      uploadHeaders: {
        token: localStorage.getItem("token") || "" // JWT 验证
      },
      uploadProgress: 0,
      counselorDetailDialog: false,
      counselorDetail: {
        id: '',
        teacherNo: '',
        isCounselor: false,
        className: []
      }
    };
  },
  created() {
    this.getTeacherList();
  },
  methods: {
    submitEditCounselor() {
      console.log(this.counselorDetail)
      this.$confirm('确定要修改吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateManagerClassroom({
          userId: this.counselorDetail.id,
          isCounselor: this.counselorDetail.isCounselor,
          className: this.counselorDetail.className
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功');
            this.counselorDetailDialog = false;
            this.getTeacherList();
          } else {
            this.$message.error(res.data.msg || '修改失败');
          }
        }).catch(() => {
          this.$message.error('修改失败');
        })
      });
    },
    changeCounselor(row) {
      this.counselorDetailDialog = true;
      this.counselorDetail = {
        id: row.id,
        teacherNo: row.teacherNo,
        isCounselor: row.isCounselor,
        className: []
      };
      if (row.isCounselor) {
        getManagerClass({
          userId: row.id
        }).then(res => {
          if (res.data.code === 200) {
            this.counselorDetail.className = res.data.data;
          }
        })
      }
    },
    download() {
      this.$confirm('确定要下载模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        downloadTemplateTeacher().then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', '教师导入模板.xlsx');
          document.body.appendChild(link);
          link.click();
        })
      }).catch(() => {
      });
    },
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        this.$message.error('只能上传 .xlsx 或.xls 文件');
        return false;
      }
      return true;
    },
    handleSuccess(response) {
      if (response.code === 200) {
        this.$message.success(response.msg || '上传成功');
        this.getTeacherList();
      } else {
        this.$message.error(response.msg || '上传失败');
      }
    },
    handleError() {
      this.$message.error('上传失败');
    },
    handleProgress(event) {
      this.uploadProgress = Math.round(event.percent);
      if (this.uploadProgress === 100) {
        setTimeout(() => {
          this.uploadProgress = 0;
        }, 500);
      }
    },
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
      this.getTeacherList();
    },
    getTeacherList() {
      const params = {
        ...this.filters,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getTeacherPageList(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.teacherList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取教师列表失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('请求失败');
      });
    },
    handleSearch() {
      this.pageNum = 1;
      this.getTeacherList();
    },
    handleReset() {
      this.filters = {
        username: '',
        teacherNo: '',
        title: '',
        department: '',
        status: ''
      };
      this.pageNum = 1;
      this.getTeacherList();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.getTeacherList();
    },
    handleEdit(row) {
      this.editForm = {...row}; // 再赋值
      this.editDialog = true; // 先打开弹窗
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate(); // 最后清除校验
      });
    },
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editTeacher(this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success('编辑成功');
              this.editDialog = false;
              this.getTeacherList();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
            console.error(err);
            this.$message.error('编辑失败');
          });
        } else {
          this.$message.warning('请填写完整信息');
        }
      });
    },
    handleDelete(row) {
      this.$confirm(`确认删除教师 ${row.realName} (${row.username}) 吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteTeacher({userId: row.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.getTeacherList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
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

.counselor:hover {
  cursor: pointer;
}
</style>
