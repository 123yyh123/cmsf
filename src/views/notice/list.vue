<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
    <el-card style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="padding: 5px 60px;">
              <div>{{ props.row.content }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"/>
        <el-table-column prop="createTime" label="发布时间"/>
        <el-table-column prop="realName" label="发布人"/>
        <el-table-column prop="coverImage" label="封面图片">
          <template slot-scope="scope">
            <el-image
                style="height: 50px"
                :src="scope.row.coverImage"
                fit="contain"
                :preview-src-list="[scope.row.coverImage]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pinned" label="置顶">
          <template slot-scope="scope">
            <el-tag :type="scope.row.pinned ? 'danger' : 'info'">
              {{ scope.row.pinned ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
          @current-change="fetchData"
      ></el-pagination>
    </el-card>
    <el-dialog title="编辑公告" :visible.sync="editInfo.editDialog" width="500px" center>
      <el-form ref="editForm" :model="editInfo.editForm" label-width="100px" :rules="editInfo.rules">
        <el-form-item label="标题" prop="title" ref="title">
          <el-input v-model="editInfo.editForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" ref="content">
          <el-input
              v-model="editInfo.editForm.content"
              type="textarea"
              placeholder="请输入内容"
              :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
              class="avatar-uploader"
              ref="upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImageChange">
            <img v-if="editInfo.editForm.coverImage" :src="editInfo.editForm.coverImage" class="avatar" alt="image"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="置顶状态" prop="pinned" ref="pinned">
          <el-select v-model="editInfo.editForm.pinned" placeholder="请选择" size="small">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" ref="status">
          <el-select v-model="editInfo.editForm.status" placeholder="请选择" size="small">
            <el-option label="已发布" :value="1"></el-option>
            <el-option label="草稿" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
        <el-button @click="editInfo.editDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getAnnouncementPage, updateAnnouncement, deleteAnnouncement} from "@/apis/announcement";

export default {
  data() {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      editInfo: {
        editDialog: false,
        editForm: {
          id: '',
          title: '',
          content: '',
          coverImage: '',
          pinned: 0,
          status: 0,
        },
        rules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur'}
          ],
          pinned: [
            {required: true, message: '请选择是否置顶', trigger: 'change'}
          ]
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleImageChange(file, fileList) {
      // 只允许一张，删除之前的
      if (fileList.length > 1) {
        fileList.shift();
      }
      console.log(file)
      const isImage = file.raw.type.startsWith('image/');
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isImage) {
        this.$message.error('只能上传图片文件');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB');
        return false;
      }

      const reader = new FileReader();
      reader.onload = e => {
        this.editInfo.editForm.coverImage = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateAnnouncement(this.editInfo.editForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success('编辑成功');
              this.editInfo.editDialog = false;
              this.fetchData();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
            console.error(err);
            this.$message.error('编辑失败');
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      getAnnouncementPage(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg || '加载失败');
        }
      }).catch(() => {
        this.$message.error('加载失败');
      })
    },
    edit(column) {
      this.editInfo.editDialog = true;
      this.editInfo.editForm = {
        ...column
      }
    },
    del(column) {
      this.$confirm('确定删除该公告吗？', () => {
        deleteAnnouncement({id: column.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功');
            this.fetchData();
          } else {
            this.$message.error(res.data.msg || '删除失败');
          }
        }).catch(() => {
          this.$message.error('删除失败');
        })
      })
    },
  }
}
</script>
<style scoped>
.con::-webkit-scrollbar {
  display: none;
}

.avatar-uploader {
  display: contents;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 100px;
  text-align: center;
}

.avatar {
  height: 100px;
  display: block;
  object-fit: contain;
}
</style>