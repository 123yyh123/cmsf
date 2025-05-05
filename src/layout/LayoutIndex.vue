<template>
  <div class="app-wrapper">
    <el-container>
      <!-- 左侧侧边栏 -->
      <Sidebar :isCollapse="isCollapse" />
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
                >{{ item.meta.title }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 右侧主体 -->
        <el-main class="main" style="height:0;flex-grow:1;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Sidebar from "@/components/sidebar/SidebarIndex.vue";
import { getUserName } from "@/util/jwt";

export default {
  components: { Sidebar },
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    userName() {
      return getUserName() || "用户";
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      // 清除用户信息和token
      localStorage.removeItem("token");
      this.$router.push("/login"); // 跳转到登录页面
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

.sidebar-transition-enter, .sidebar-transition-leave-to /* .sidebar-transition-leave-active in <2.1.8 */ {
  transform: translateX(-100%); /* 假设侧边栏从左侧进入，折叠时移出 */
}

.el-main::-webkit-scrollbar{
  display: none;
}
</style>
