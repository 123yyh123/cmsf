<template>
  <div class="sidebar-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#ffffff"
          text-color="#303133"
          active-text-color="#409EFF"
          router
      >
        <div class="logo-item">
          <img v-if="!isCollapse" src="../../assets/images/智能化.png" class="logo" alt="logo"/>
          <img v-if="isCollapse" src="../../assets/images/智能化.png" class="logo-icon" alt="logo"/>
          <span v-if="!isCollapse" class="logo-text">教室可视化管理</span>
        </div>
        <template v-for="route in filteredRoutes">
          <SidebarItem :key="route.path" :item="route" :isCollapse="isCollapse"/>
        </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import {asyncRoutes} from '@/router/index.js'
import {getUserRole} from '@/util/jwt'

export default {
  components: {SidebarItem},
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    userRoles() {
      // 将getUserRole()转为数组
      return Array.isArray(getUserRole()) ? getUserRole() : [getUserRole()]
    },
    filteredRoutes() {
      // 过滤出当前用户有权限访问的路由
      const filterRoutes = (routes) => {
        const res = []
        routes.forEach(route => {
          const tmp = {...route}
          if (this.hasPermission(tmp)) {
            if (tmp.children) {
              tmp.children = filterRoutes(tmp.children)
            }
            res.push(tmp)
          }
        })
        return res
      }
      return filterRoutes(asyncRoutes)
    }
  },
  methods: {
    hasPermission(route) {
      if (route.meta && route.meta.roles) {
        return this.userRoles.some(role => route.meta.roles.includes(role))
      } else {
        return true // 默认不写 roles 的路由，所有人可以看
      }
    }
  }
}
</script>

<style>
.el-menu-vertical-demo {
  overflow-x: hidden;
}
.sidebar-container {
  height: 100vh; /* 确保侧边栏高度100% */
  display: flex;
  flex-direction: column;
}
.sidebar {
  background-color: #ffffff;
  height: 100%; /* 确保侧边栏高度100% */
  min-height: 100vh; /* 视口高度至少100% */
  display: flex;
  flex-direction: column;
}
.el-menu-vertical-demo::-webkit-scrollbar {
  display: none;
}
.logo-item {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin: 10px;
  box-sizing: border-box;
  color: #000000;
  background-color: #ffffff;
}

.logo {
  height: 100%;
  object-fit: contain;
  flex: 1;
}

.logo-icon {
  width: 50%;
  object-fit: contain;
}

.logo-text{
  font-size: 16px;
  white-space: nowrap;
}


.el-menu-vertical-demo {
  flex: 1;
  overflow-y: auto; /* 允许垂直滚动 */
  background-color: #001529;
}

</style>