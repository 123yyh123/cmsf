<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">欢迎登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="loginForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="老师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" class="login-button" round>登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { login } from '@/apis/auth'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        role: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          login(this.loginForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success('登录成功')
              // 将token存入localStorage
              localStorage.setItem('token', res.data.data)
              // 跳转到首页
              this.$router.push({ path: '/' })
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(err => {
            console.error(err)
            this.$message.error('登录失败，请稍后重试')
          })
        } else {
          this.$message.error('请完整填写登录信息')
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #74ebd5, #9face6);
}

.login-card {
  width: 400px;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.el-select {
  display: flex !important;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.login-button {
  width: 100%;
}
</style>
