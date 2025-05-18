<template>
  <el-card class="form-card">
    <div slot="header" class="form-header">
      <span>编辑个人信息</span>
    </div>
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
    >
      <!-- 头像上传 -->
      <el-form-item label="头像" align="left">
        <el-upload
            class="avatar-uploader"
            action="#"
            ref="upload"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :auto-upload="false"
        >
          <img
              v-if="form.avatar"
              :src="form.avatar"
              class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" disabled/>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别" prop="gender" align="left">
        <el-radio-group v-model="form.gender">
          <el-radio label="M">男</el-radio>
          <el-radio label="F">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号"/>
        <div class="verify-container">
          <el-input
              size="small"
              v-model="form.phoneCode"
              placeholder="请输入验证码"
              class="verify-input"
          />
          <el-button
              type="primary"
              size="mini"
              @click="sendPhoneCode"
              :disabled="phoneCodeTimer > 0"
          >
            {{ phoneCodeTimer > 0 ? `${phoneCodeTimer}秒后重试` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"/>
        <div class="verify-container">
          <el-input
              size="mini"
              v-model="form.emailCode"
              placeholder="请输入验证码"
              class="verify-input"
          />
          <el-button
              type="primary"
              size="mini"
              @click="sendEmailCode"
              :disabled="emailCodeTimer > 0"
          >
            {{ emailCodeTimer > 0 ? `${emailCodeTimer}秒后重试` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item align="left">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {getUserInfo, updateUserInfo} from "@/apis/user";
import {getEmailCode, getPhoneCode} from "@/apis/common";

export default {
  data() {
    return {
      form: {
        id: '',
        username: '',
        realName: '',
        gender: '',
        phone: '',
        email: '',
        phoneCode: '',
        emailCode: '',
        avatar: ''
      },
      userInfo: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        realName: [
          {required: true, message: '请输入真实姓名', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        phone: [
          {pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
        ],
      },
      phoneCodeTimer: 0,
      emailCodeTimer: 0,
      isPhoneCodeSent: false,
      isEmailCodeSent: false,
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      getUserInfo().then(res => {
        if (res.data.code === 200) {
          this.form = {...res.data.data};
          this.userInfo = {...res.data.data};
          localStorage.setItem('avatar', this.userInfo.avatar);
          localStorage.setItem('username', this.userInfo.username);
        }
      });
    },
    handleAvatarChange(file, fileList) {
      if (fileList.length > 1) fileList.shift();
      const isImage = file.raw.type.startsWith('image/');
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isImage) return this.$message.error('只能上传图片文件');
      if (!isLt2M) return this.$message.error('图片大小不能超过 2MB');
      const reader = new FileReader();
      reader.onload = e => {
        this.form.avatar = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    sendPhoneCode() {
      if (this.phoneCodeTimer > 0) return;
      getPhoneCode({phone: this.form.phone}).then(res => {
        if (res.data.code === 200) {
          this.startPhoneCodeTimer();
          this.$message({
            type: 'success',
            message: '验证码已发送'
          });
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          });
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '验证码发送失败，请稍后重试'
        })
      });
    },
    sendEmailCode() {
      if (this.emailCodeTimer > 0) return;
      getEmailCode({email: this.form.email}).then(res => {
        if (res.data.code === 200) {
          this.startEmailCodeTimer();
          this.$message({
            type: 'success',
            message: '验证码已发送'
          });
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          });
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '验证码发送失败，请稍后重试'
        })
      });
    },
    startPhoneCodeTimer() {
      this.isPhoneCodeSent = true;
      this.phoneCodeTimer = 60;
      const interval = setInterval(() => {
        if (this.phoneCodeTimer <= 0) {
          clearInterval(interval);
          this.isPhoneCodeSent = false;
        } else {
          this.phoneCodeTimer--;
        }
      }, 1000);
    },
    startEmailCodeTimer() {
      this.isEmailCodeSent = true;
      this.emailCodeTimer = 60;
      const interval = setInterval(() => {
        if (this.emailCodeTimer <= 0) {
          clearInterval(interval);
          this.isEmailCodeSent = false;
        } else {
          this.emailCodeTimer--;
        }
      }, 1000);
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const param = {...this.form}
        if (this.form.username === this.userInfo.username) {
          delete param.username
        }
        if (this.form.phone != null && this.form.phone !== '') {
          // 必须输入验证码
          if ((this.form.phone !== this.userInfo.phone) && (this.form.phoneCode == null || this.form.phoneCode === '')) {
            this.$message.error('请输入验证码');
            return;
          } else if (this.form.phone === this.userInfo.phone) {
            delete param.phone;
          }
        }
        if (this.form.email != null && this.form.email !== '') {
          if ((this.form.email !== this.userInfo.email) && (this.form.emailCode == null || this.form.emailCode === '')) {
            this.$message.error('请输入验证码');
            return;
          } else if (this.form.email === this.userInfo.email) {
            delete param.email;
          }
        }
        updateUserInfo(param)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success("修改成功");
                this.getUserInfo();
              } else {
                this.$message.error(res.data.msg || '修改失败')
              }
            }).catch((err) => {
          this.$message.error('修改失败')
        })
      });
    },
  }
};
</script>

<style scoped>
.form-card {
  max-width: 600px;
  margin: 30px auto;
}

.form-header {
  font-size: 16px;
  font-weight: bold;
}

.avatar-uploader {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
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
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  display: block;
}

.verify-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.verify-input {
  width: 120px;
  margin-right: 20px;
}
</style>
