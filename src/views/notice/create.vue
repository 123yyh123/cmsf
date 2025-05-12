<template>
  <div class="app-container enhanced-form">
    <el-card shadow="hover" class="publish-card">
      <div slot="header" class="header">
        <i class="el-icon-edit-outline" style="margin-right: 8px;"></i>
        <span>发布公告</span>
      </div>

      <el-form ref="publishForm" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="置顶状态" prop="pinned">
              <el-select v-model="form.pinned" placeholder="请选择">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="5"
              maxlength="1000"
              show-word-limit
              placeholder="请输入公告内容"
          ></el-input>
        </el-form-item>

        <el-form-item label="封面图片" align="left">
          <el-upload
              class="avatar-uploader"
              ref="upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleImageChange">
            <div class="image-wrapper" v-if="form.coverImage">
              <img :src="form.coverImage" class="avatar" alt="image"/>
              <i class="el-icon-close delete-icon" @click.stop="removeImage"></i>
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item class="form-buttons">
          <el-button type="primary" icon="el-icon-check" @click="submit(1)">发布</el-button>
          <el-button type="warning" icon="el-icon-document" @click="submit(0)">存为草稿</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addAnnouncement } from "@/apis/announcement";

export default {
  data() {
    return {
      form: {
        title: '',
        content: '',
        coverImage: '',
        pinned: 0,
        status: 1,
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
        ],
        pinned: [
          { required: true, message: '请选择置顶状态', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    removeImage() {
      this.form.coverImage = '';
    },
    handleImageChange(file, fileList) {
      if (fileList.length > 1) fileList.shift();
      const isImage = file.raw.type.startsWith('image/');
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isImage) return this.$message.error('只能上传图片文件');
      if (!isLt2M) return this.$message.error('图片大小不能超过 2MB');
      const reader = new FileReader();
      reader.onload = e => {
        this.form.coverImage = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    submit(status) {
      this.$refs.publishForm.validate(valid => {
        if (valid) {
          const payload = {
            ...this.form,
            status // 使用传入的状态
          };
          addAnnouncement(payload).then(res => {
            if (res.data.code === 200) {
              this.$message.success(status === 1 ? '发布成功' : '草稿保存成功');
              this.reset();
            } else {
              this.$message.error(res.data.msg || '操作失败');
            }
          }).catch(() => {
            this.$message.error('请求失败');
          });
        }
      });
    },
    reset() {
      this.$refs.publishForm.resetFields();
      this.form.coverImage = '';
    }
  }
}
</script>

<style scoped>
.enhanced-form {
  padding: 20px;
}
.publish-card {
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}
.header {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  color: #409EFF;
}
.image-wrapper {
  position: relative;
  width: 150px;
  height: 100px;
}
.avatar {
  max-width: 100%;
  max-height: 100px;
  object-fit: fill;
}
.upload-placeholder i {
  font-size: 28px;
}
.form-buttons {
  text-align: right;
  margin-top: 20px;
}
.delete-icon {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  color: #f56c6c;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  z-index: 10;
}
.avatar-uploader {
  display: inline-block;
  position: relative;
  width: 150px;
  height: 100px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  line-height: 100px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
