<template>
  <div class="page-403">
    <h1>403</h1>
    <p>无权限访问此页面。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: "Page403",
};
</script>

<style scoped>
.page-403 {
  text-align: center;
  margin-top: 50px;
}
.page-403 h1 {
  font-size: 100px;
  color: #ff4d4f;
}
.page-403 p {
  font-size: 20px;
  margin: 20px 0;
}
.page-403 a {
  color: #1890ff;
  text-decoration: none;
}
.page-403 a:hover {
  text-decoration: underline;
}
</style>
