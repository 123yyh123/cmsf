<template>
  <div class="app-wrapper">
    <el-container>
      <!-- 左侧侧边栏 -->
      <Sidebar :isCollapse="isCollapse"/>
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-button @click="toggleCollapse" icon="el-icon-s-fold" type="text" style="margin: 10px"/>
            <div style="width: 20px"/>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                  v-for="(item, index) in $route.matched"
                  :key="index"
              >{{ item.meta.title }}
              </el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-avatar shape="circle" fit="contain" :size="30"
                       :src="avatar"></el-avatar>
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout"
                >退出登录
                </el-dropdown-item
                >
                <el-dropdown-item @click.native="edit"
                >修改密码
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 右侧主体 -->
        <el-main class="main" style="height:0;flex-grow:1;">
          <router-view/>
        </el-main>
      </el-container>
      <el-dialog title="修改密码" :visible.sync="editPasswordDialog" width="500px" center>
        <el-form :model="editPasswordForm" :rules="editPasswordRules" ref="editPasswordForm" label-width="80px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="editPasswordForm.oldPassword" placeholder="请输入旧密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="editPasswordForm.newPassword" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="editPasswordForm.confirmPassword" placeholder="请再次输入新密码"
                      show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditPasswordForm">提交</el-button>
            <el-button @click="editPasswordDialog=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar/SidebarIndex.vue";
import {updatePassword} from "@/apis/user";
import {logout} from "@/apis/auth";

export default {
  components: {Sidebar},
  data() {
    return {
      isCollapse: false,
      username: "用户",
      avatar: "https://xiaofanshu.oss-cn-hangzhou.aliyuncs.com/2023/12/23/%E5%A4%B4%E5%83%8F/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240625153028.jpg",
      editPasswordDialog: false,
      editPasswordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      editPasswordRules: {
        oldPassword: [
          {required: true, message: "请输入旧密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "请输入新密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, message: "请输入确认密码", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ]
      }
    };
  },
  mounted() {
    this.username = localStorage.getItem('username') ? localStorage.getItem('username') : ''
    this.avatar = localStorage.getItem('avatar') ? localStorage.getItem('avatar') : 'https://xiaofanshu.oss-cn-hangzhou.aliyuncs.com/2023/12/23/%E5%A4%B4%E5%83%8F/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240625153028.jpg'
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      // 清除用户信息和token
      localStorage.removeItem("avatar");
      localStorage.removeItem("username");
      localStorage.removeItem("counselor")
      logout().then(res => {
        if (res.data.code === 200) {
          this.$message.success('退出成功')
          localStorage.removeItem("token");
          this.$router.push("/login"); // 跳转到登录页面
        } else {
          localStorage.removeItem("token");
          this.$router.push("/login"); // 跳转到登录页面
        }
      }).catch(err => {
        localStorage.removeItem("token");
        this.$router.push("/login"); // 跳转到登录页面
      })
    },
    edit() {
      this.editPasswordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.editPasswordDialog = true;
    },
    submitEditPasswordForm () {
      if (this.editPasswordForm.newPassword !== this.editPasswordForm.confirmPassword){
        this.$message.error('两次输入的密码不一致');
        return;
      }
      const param = {
        oldPassword: this.editPasswordForm.oldPassword,
        newPassword: this.editPasswordForm.newPassword
      }
      updatePassword(param).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功');
          this.editPasswordDialog = false;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(err => {
        this.$message.error('修改失败');
      })
    },
  },
};
</script>

<style scoped>
.app-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.system-name {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.header-right {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 0 10px;
}

.main {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  overflow: auto;
}

/* 定义侧边栏折叠的过渡动画 */
.sidebar-transition-enter-active,
.sidebar-transition-leave-active {
  transition: transform 0.3s ease; /* 控制过渡动画的时长和类型 */
}

.sidebar-transition-enter, .sidebar-transition-leave-to /* .sidebar-transition-leave-active in <2.1.8 */
{
  transform: translateX(-100%); /* 假设侧边栏从左侧进入，折叠时移出 */
}

.el-main::-webkit-scrollbar {
  display: none;
}
</style>
