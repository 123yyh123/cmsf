<template>
  <div class="app-container" style="padding: 20px;">
    <el-card v-for="item in announcements" :key="item.id" class="notice-card">
      <div class="notice-header">
        <h3 class="title">{{ item.title }}</h3>
        <span class="time">{{ formatTime(item.createTime) }}</span>
      </div>
      <div class="notice-body">
        <el-image
            v-if="item.coverImage"
            :src="item.coverImage"
            style="width: 120px; height: 80px; margin-right: 20px;"
            fit="cover"
            :preview-src-list="[item.coverImage]"
        />
        <div class="content-preview">
          <p class="ellipsis">{{ item.content }}</p>
          <el-button type="text" @click="showDetail(item)">查看详情</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="公告详情"
        :visible.sync="detailDialog"
        width="50%"
    >
      <h3>{{ detail.title }}</h3>
      <p style="color: #999; font-size: 12px;">发布时间：{{ formatTime(detail.createTime) }}</p>
      <el-image
          v-if="detail.coverImage"
          :src="detail.coverImage"
          style="margin: 20px 0;height: 400px;max-width: 100%"
          fit="contain"
          :preview-src-list="[detail.coverImage]"
      />
      <div style="white-space: pre-wrap;">{{ detail.content }}</div>
    </el-dialog>
  </div>
</template>

<script>
import { getAnnouncementPage } from "@/apis/announcement";

export default {
  data() {
    return {
      announcements: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      detailDialog: false,
      detail: {},
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: 1 // 只查已发布
      };
      getAnnouncementPage(params).then(res => {
        if (res.data.code === 200) {
          this.announcements = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg || "加载失败");
        }
      }).catch(() => {
        this.$message.error("加载失败");
      });
    },
    formatTime(time) {
      const d = new Date(time);
      return d.toLocaleString();
    },
    showDetail(item) {
      this.detail = item;
      this.detailDialog = true;
    }
  }
};
</script>

<style scoped>
.notice-card {
  margin-bottom: 20px;
  border-radius: 20px;
}
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}
.time {
  color: #999;
  font-size: 12px;
}
.notice-body {
  display: flex;
  margin-top: 15px;
}
.content-preview {
  flex: 1;
  min-width: 0;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
</style>
