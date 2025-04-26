<template>
  <div v-if="!item.hidden">
    <el-submenu v-if="hasChildren" :index="item.path">
      <template slot="title">
        <i :class="item.meta.icon" />
        <span v-if="!isCollapse" slot="title">{{ item.meta.title }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :isCollapse="isCollapse"
      />
    </el-submenu>
    <el-menu-item v-else :index="item.path" :route="item">
      <i :class="item.meta.icon" />
      <span v-if="!isCollapse" slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
  </div>
</template>
<script>
export default {
  name: "SidebarItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasChildren() {
      return this.item.children && this.item.children.length > 0;
    },
  },
  methods: {
  },
};
</script>

<style>
.el-menu--collapse .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}
/* 确保菜单图标和文字对齐 */
.menu-icon {
  font-size: 20px; /* 图标大小 */
  width: 30px; /* 设置图标宽度 */
  text-align: center; /* 图标居中 */
  display: inline-block;
}

.menu-text {
  font-size: 14px; /* 文字大小 */
  padding-left: 10px; /* 图标和文字之间的间距 */
  line-height: 40px; /* 文字垂直居中 */
  display: inline-block;
}

/* 菜单项和子菜单的对齐 */
.el-menu-item,
.el-submenu__title {
  display: flex;
  align-items: center; /* 确保图标和文字垂直居中 */
  padding-left: 15px; /* 给子菜单的每一项增加一些左侧内边距 */
}

.el-menu-item {
  height: 40px;
  padding-left: 20px; /* 确保菜单项的左侧和父菜单对齐 */
}

.el-submenu__title {
  font-size: 14px;
}

.el-menu {
  transition: all 0.3s;
}
</style>
