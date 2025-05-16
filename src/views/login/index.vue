<template>
  <div class="body">
    <div class="container">
      <div class="drop">
        <div v-if="isCodeLogin" class="content">
          <h2>验证码登录</h2>
          <form @submit.prevent="submitFormByCode">
            <div class="inputBox">
              <input
                  type="text"
                  placeholder="请输入手机号或邮箱"
                  v-model.trim="loginForm.account"
              />
            </div>

            <div class="inputBox" style="position: relative;">
              <input
                  type="text"
                  placeholder="请输入验证码"
                  autocomplete="new-password"
                  v-model.trim="loginForm.code"
                  style="padding: 10px 115px 10px 15px"
              />
              <button
                  type="button"
                  class="sendCodeBtn"
                  :disabled="sending || countdown > 0"
                  @click="sendCode"
              >
                <span v-if="countdown === 0">发送验证码</span>
                <span v-else>{{ countdown }} 秒后重发</span>
              </button>
            </div>

            <div class="inputBox">
              <input type="submit" value="登录"/>
            </div>
          </form>
        </div>
        <div v-else class="content">
          <h2>登录</h2>
          <form @submit.prevent="submitFormByPassword">
            <div class="inputBox">
              <input
                  type="text"
                  placeholder="请输入用户名"
                  v-model="loginForm.username"
              />
            </div>
            <div class="inputBox">
              <input
                  type="password"
                  placeholder="请输入密码"
                  v-model="loginForm.password"
                  autocomplete="new-password"
              />
            </div>
            <el-select v-model="loginForm.role" placeholder="请选择角色" class="selectBox">
              <el-option label="管理员" value="admin"/>
              <el-option label="教师" value="teacher"/>
            </el-select>
            <div class="inputBox">
              <input type="submit" value="登录"/>
            </div>
          </form>
        </div>
      </div>
      <div @click="forgetDialogCon" class="btns">忘记密码？</div>
      <div @click="switchLogin" class="btns signup">切换登录方式</div>
    </div>
    <el-dialog
        title="找回密码"
        :visible.sync="forgetDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        style="background: transparent"
    >
      <div style="padding: 10px 20px;">
        <el-form :model="forgotForm" :rules="forgotRules" ref="forgotForm" label-width="80px">
          <el-form-item label="账户类型">
            <el-radio-group v-model="forgotForm.type" @change="forgotForm.account = ''">
              <el-radio label="phone">手机号</el-radio>
              <el-radio label="email">邮箱</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="forgotForm.type === 'phone' ? '手机号' : '邮箱'" prop="account" align="left">
            <el-input v-model="forgotForm.account" placeholder="请输入"
                      :style="{ width: '100%' }"/>
          </el-form-item>

          <el-form-item label="验证码" prop="code" align="left">
            <div style="display: flex;justify-content: flex-start">
              <el-input
                  v-model="forgotForm.code"
                  placeholder="请输入验证码"
                  autocomplete="off"
                  :style="{ width: '180px', marginRight: '10px' }"
              />
              <el-button
                  :disabled="forSending || forgotCountdown > 0"
                  @click="sendForgotCode"
                  type="primary"
                  size="mini"
              >
                {{ forgotCountdown > 0 ? forgotCountdown + 's后重发' : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="新密码" prop="password" align="left">
            <el-input
                v-model="forgotForm.password"
                type="password"
                placeholder="请输入新密码"
                autocomplete="new-password"
                show-password
            />
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="forgetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForgot">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {login, loginWithCode, forgetPassword} from "@/apis/auth"
import {sendVerificationCode} from "@/apis/common";
import {getUserRole} from "@/util/jwt";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        role: "",
        account: "", // 手机号或邮箱
        code: "", // 验证码
      },
      isCodeLogin: false,
      sending: false, // 是否正在发送验证码
      countdown: 0, // 倒计时秒数
      timer: null,
      forgetDialogVisible: false,
      forgotForm: {
        type: 'phone',
        account: '',
        code: '',
        password: ''
      },
      forgotRules: {
        account: [{required: true, message: '请输入手机号或邮箱', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        password: [{required: true, message: '请输入新密码', trigger: 'blur'}]
      },
      forgotCountdown: 0,
      forgotTimer: null,
      forSending: false,
    }
  },
  methods: {
    forgetDialogCon() {
      this.forgetDialogVisible = true
      this.forgotForm = {
        type: 'phone',
        account: '',
        code: '',
        password: ''
      }
      this.$refs.forgotForm.clearValidate()
    },
    sendForgotCode() {
      if (this.forgotForm.type === 'phone') {
        const reg = /^1[3-9]\d{9}$/
        if (!reg.test(this.forgotForm.account)) {
          this.$message.error('请输入正确的手机号码')
          return
        }
      }
      if (this.forgotForm.type === 'email') {
        const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(this.forgotForm.account)) {
          this.$message.error('请输入正确的邮箱')
          return
        }
      }
      this.forSending = true;
      sendVerificationCode({account: this.forgotForm.account})
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("验证码发送成功");
              this.startForCountdown();
            } else {
              this.$message.error(res.data.msg || "验证码发送失败");
            }
          })
          .catch(() => {
            this.$message.error("验证码发送失败，请稍后重试");
          }).finally(() => {
        this.forSending = false;
      })
    },
    submitForgot() {
      this.$refs.forgotForm.validate((valid) => {
        if (!valid) return;
        if (this.forgotForm.type === 'phone') {
          const reg = /^1[3-9]\d{9}$/
          if (!reg.test(this.forgotForm.account)) {
            this.$message.error('请输入正确的手机号码')
            return
          }
        }
        if (this.forgotForm.type === 'email') {
          const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!reg.test(this.forgotForm.account)) {
            this.$message.error('请输入正确的邮箱')
            return
          }
        }
        forgetPassword(this.forgotForm).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("修改成功，请重新登录");
            this.forgetDialogVisible = false;
          } else {
            this.$message.error(res.data.msg || "修改失败");
          }
        }).catch(() => {
          this.$message.error("修改失败");
        })
      });
    },
    switchLogin() {
      this.isCodeLogin = !this.isCodeLogin
      this.loginForm = {
        username: "",
        password: "",
        role: "",
        account: "",
        code: "",
      }
    },
    submitFormByPassword() {
      if (!this.loginForm.username || !this.loginForm.password) {
        this.$message.error("请输入用户名和密码")
        return
      }
      if (this.loginForm.role === "") {
        this.$message.error("请选择登录角色")
        return
      }
      login({
        username: this.loginForm.username,
        password: this.loginForm.password,
        role: this.loginForm.role,
      })
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("登录成功")
              const data = res.data.data
              localStorage.setItem("token", data.token || "")
              localStorage.setItem("avatar", data.avatar || "")
              localStorage.setItem("counselor", data.counselor || false)
              localStorage.setItem("username", data.username || "")
              const role = getUserRole()
              this.$router.replace({path: role  === 'admin' ? '/dashboard' : '/index'})
            } else {
              this.$message.error(res.data.msg || "登录失败")
            }
          })
          .catch((err) => {
            console.error(err)
            this.$message.error("登录失败，请稍后重试")
          })
    },
    validateAccount(account) {
      // 简单手机号或邮箱校验
      const phoneReg = /^1[3-9]\d{9}$/;
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return phoneReg.test(account) || emailReg.test(account);
    },
    sendCode() {
      if (!this.validateAccount(this.loginForm.account)) {
        this.$message.error("请输入有效的手机号或邮箱");
        return;
      }
      this.sending = true;
      sendVerificationCode({account: this.loginForm.account})
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("验证码发送成功");
              this.startCountdown();
            } else {
              this.$message.error(res.data.msg || "验证码发送失败");
            }
          })
          .catch(() => {
            this.$message.error("验证码发送失败，请稍后重试");
          }).finally(() => {
        this.sending = false;
      })
    },
    startCountdown() {
      this.countdown = 60;
      this.timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.sending = false;
        }
      }, 1000);
    },
    startForCountdown() {
      this.forgotCountdown = 60;
      this.forgotTimer = setInterval(() => {
        this.forgotCountdown--;
        if (this.forgotCountdown <= 0) {
          clearInterval(this.forgotTimer);
          this.forgotTimer = null;
          this.forSending = false;
        }
      }, 1000);
    },
    submitFormByCode() {
      if (!this.validateAccount(this.loginForm.account)) {
        this.$message.error("请输入有效的手机号或邮箱");
        return;
      }
      if (!this.loginForm.code) {
        this.$message.error("请输入验证码");
        return;
      }
      loginWithCode({
        account: this.loginForm.account,
        code: this.loginForm.code,
      })
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("登录成功");
              const data = res.data.data;
              localStorage.setItem("token", data.token || "");
              localStorage.setItem("avatar", data.avatar || "");
              localStorage.setItem("counselor", data.counselor || false)
              localStorage.setItem("username", data.username || "");
              const role = getUserRole()
              this.$router.replace({path: role  === 'admin' ? '/dashboard' : '/index'})
            } else {
              this.$message.error(res.data.msg || "登录失败");
            }
          })
          .catch(() => {
            this.$message.error("登录失败，请稍后重试");
          });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.forgotTimer) {
      clearInterval(this.forgotTimer);
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  position: relative;
  right: -180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container .drop {
  position: relative;
  width: 350px;
  height: 350px;
  box-shadow: inset 20px 20px 20px rgba(0, 0, 0, 0.05),
  25px 35px 20px rgba(0, 0, 0, 0.05),
  25px 30px 30px rgba(0, 0, 0, 0.05),
  inset -20px -20px 25px rgba(255, 255, 255, 0.9);
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50% 50% 30% 70% / 37% 45% 55% 63%;
}

.container .drop .content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 40px;
  gap: 15px;
}

.container .drop .content h2 {
  position: relative;
  color: #333;
  font-size: 1.5em;
}

.container .drop .content form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.container .drop .content form .inputBox {
  position: relative;
  width: 225px;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  inset -2px -5px 10px rgba(255, 255, 255, 1),
  15px 15px 10px rgba(0, 0, 0, 0.05),
  15px 10px 15px rgba(0, 0, 0, 0.025);
  border-radius: 25px;
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px transparent inset;
  -webkit-text-fill-color: #000000;
  transition: background-color 5000s ease-in-out 0s;
  color: #000000;
  -webkit-appearance: none;
  border-radius: 25px;
  border: none;
  padding: 10px 15px;
  background: transparent;
}


.container .drop .content form .inputBox input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 1em;
  padding: 10px 15px;
}

.container .drop .content form .inputBox input[type="submit"] {
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.container .drop .content form .inputBox:last-child {
  width: 120px;
  background: #ff0f5b;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  15px 15px 10px rgba(0, 0, 0, 0.05),
  15px 10px 15px rgba(0, 0, 0, 0.025);
  transition: 0.5s;
}

.container .drop .content form .inputBox:last-child:hover {
  width: 150px;
}

.container .drop .content form .inputBox:before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 65%;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
}

.container .drop:hover {
  border-radius: 50%;
}

.container .drop:before {
  content: '';
  position: absolute;
  top: 50px;
  left: 85px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.9;
}


.container .btns {
  position: absolute;
  right: -120px;
  bottom: 0;
  width: 120px;
  height: 120px;
  background: #c61dff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  line-height: 1.2em;
  letter-spacing: 0.1em;
  font-size: 0.8em;
  transition: 0.25s;
  text-align: center;
  box-shadow: inset 10px 10px 10px rgba(190, 1, 254, 0.05),
  15px 25px 10px rgba(190, 1, 254, 0.1),
  15px 20px 20px rgba(190, 1, 254, 0.1),
  inset -10px -10px 15px rgba(255, 255, 255, 0.5);
  border-radius: 28% 72% 66% 34% / 75% 48% 52% 25%;
}

.container .btns.signup {
  bottom: 150px;
  right: -200px;
  width: 80px;
  height: 80px;
  border-radius: 61% 39% 28% 72% / 47% 58% 42% 53%;
  background: #01b4ff;
  box-shadow: inset 10px 10px 10px rgba(1, 180, 255, 0.05),
  15px 25px 10px rgba(1, 180, 255, 0.1),
  15px 20px 20px rgba(1, 180, 255, 0.1),
  inset -10px -10px 15px rgba(255, 255, 255, 0.5);
}

.container .btns:hover {
  border-radius: 50%;
}

.container .btns:before {
  content: '';
  position: absolute;
  top: 15px;
  left: 30px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  opacity: 0.45;
}

.container .btns.signup:before {
  left: 20px;
  width: 15px;
  height: 15px;
}

/* 让 el-select 宽度与其他输入框统一 */
.selectBox {
  width: 225px;
}

/* 修改 el-select 输入框（input 区域） */
.selectBox .el-input__inner {
  border-radius: 25px !important;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  inset -2px -5px 10px rgba(255, 255, 255, 1),
  15px 15px 10px rgba(0, 0, 0, 0.05),
  15px 10px 15px rgba(0, 0, 0, 0.025);
  background: transparent;
  border: none;
  padding-left: 15px !important; /* 保证左边内边距 */
  font-family: 'Poppins', sans-serif;
  color: #333;
}

/* 悬浮和聚焦时的阴影变化 */
.selectBox .el-input__inner:hover,
.selectBox .el-input__inner:focus {
  box-shadow: inset 2px 5px 15px rgba(0, 0, 0, 0.15),
  inset -2px -5px 12px rgba(255, 255, 255, 0.9),
  15px 20px 15px rgba(0, 0, 0, 0.07);
  outline: none;
}

/* 去掉默认边框阴影 */
.selectBox .el-input__inner.is-focus {
  border-color: transparent !important;
}

/* 下拉面板圆角和阴影 */
.selectBox .el-select-dropdown {
  border-radius: 15px !important;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  color: #333;
}

/* 下拉项hover效果 */
.selectBox .el-select-dropdown__item:hover {
  background-color: #c6e2ff;
  color: #409EFF;
}

/* 选中项 */
.selectBox .el-select-dropdown__item.selected {
  background-color: #409EFF;
  color: white;
}

.sendCodeBtn {
  position: absolute;
  right: 10px;
  top: 50%;
  width: 100px;
  transform: translateY(-50%);
  background: #ff0f5b;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 5px 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1),
  15px 15px 10px rgba(0, 0, 0, 0.05),
  15px 10px 15px rgba(0, 0, 0, 0.025);
  transition: 0.3s;
  user-select: none;
}

.sendCodeBtn:disabled {
  background: #aaa;
  cursor: not-allowed;
  box-shadow: none;
}
</style>