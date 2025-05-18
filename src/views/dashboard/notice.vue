<template>
  <div class="notice-container">
    <div class="right-panel">
      <div class="schedule-title">我的日程</div>
      <div class="schedule-container">
        <!-- 表头 -->
        <div class="grid-row header-row">
          <div class="grid-cell time-cell"></div>
          <div class="grid-cell" v-for="day in days" :key="day">{{ day }}</div>
        </div>
        <!-- 时间行 -->
        <div v-for="(slot, idx) in timeSlots" :key="idx" class="grid-row">
          <div class="grid-cell time-cell">{{ slot }}</div>
          <div
              class="grid-cell"
              v-for="day in days"
              :key="day + slot"
          >
            <div
                v-for="item in findSchedule(day, slot)"
                :key="item.id"
                class="booking-block"
            >
              <div class="course-name">{{ item.courseName }}</div>
              <div class="room-name">{{ item.classroomCode }}教室</div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="left-panel">
      <div class="ann"
           style="background: #fff; border-radius: 10px; height: 300px; flex: 1; padding: 10px; display: flex; flex-direction: column;">
        <div style="display:flex;align-items: baseline;justify-content: space-between;">
          <div style="display: flex;gap:0 10px;text-align: center;align-items: baseline">
            <div style="margin-bottom: 10px; font-size: 16px;">最近公告</div>
          </div>
        </div>
        <div style="flex: 1; overflow-y: auto;" class="timeline-container">
          <div v-for="(item, index) in announcements" :key="index" style="display: flex; margin-bottom: 20px;">
            <!-- 时间点图标 -->
            <div
                style="width: 16px; height: 16px; background-color: #409EFF; border-radius: 50%; margin-right: 16px; margin-top: 6px;"></div>
            <!-- 内容卡片 -->
            <div @click="showDetail(item)" class="notice-card"
                 style="flex: 1; border-radius: 10px;padding: 16px;display: flex;flex-direction: column;gap: 10px;background-image: radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%);
 background-blend-mode: screen;margin-right: 10px">
              <!-- 标题和置顶标志 -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">{{ item.title }}</h3>
                <span v-if="item.pinned" style="color: #f56c6c; font-size: 12px; font-weight: bold;">📌置顶</span>
              </div>
              <!-- 公告内容 -->
              <div style="color: #666; font-size: 14px; line-height: 1.6;" class="preview">
                {{ item.content }}
              </div>
              <!-- 图片展示 -->
              <div v-if="item.coverImage" style="margin-top: 8px;">
                <img :src="item.coverImage" alt="封面图片"
                     style="max-width: 100%;max-height: 100px; border-radius: 6px;"/>
              </div>
              <!-- 底部信息 -->
              <div
                  style="display: flex; justify-content: space-between; font-size: 12px; color: #999; margin-top: 6px;">
                <span>发布人：{{ item.realName }}</span>
                <span>{{ item.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <div class="modal-mask" v-if="detailDialog" @click.self="detailDialog = false">
      <div class="modal-container">
        <h2>{{ detail.title }}</h2>
        <p class="meta">发布时间：{{ formatTime(detail.createTime) }}</p>
        <img v-if="detail.coverImage" :src="detail.coverImage" class="detail-image"/>
        <div class="content">{{ detail.content }}</div>
        <button class="close-btn" @click="detailDialog = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import {getAnnouncementPage} from "@/apis/announcement";
import {getTimeSlotList} from "@/apis/classroom"
import {getMySchedule} from "@/apis/reservation";

export default {
  data() {
    return {
      announcements: [],
      detail: {},
      detailDialog: false,
      days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      timeSlots: [],
      schedule: [],
    };
  },
  created() {
    this.fetchData();
    this.getTimeSlotList();
    this.getMySchedule();
  },
  methods: {
    getTimeSlotList() {
      getTimeSlotList().then((res) => {
        if (res.data.code === 200) {
          this.timeSlots = res.data.data;
        } else {
          this.$message.error(res.data.msg || "加载失败");
        }
      }).catch(() => {
        this.$message.error("加载失败");
      });
    },
    getMySchedule() {
      getMySchedule().then((res) => {
        if (res.data.code === 200) {
          this.schedule = res.data.data;
        } else {
          this.$message.error(res.data.msg || "加载失败");
        }
      }).catch(() => {
        this.$message.error("加载失败");
      });
    },
    fetchData() {
      getAnnouncementPage({pageNum: 1, pageSize: 10, status: 1}).then((res) => {
        if (res.data.code === 200) {
          this.announcements = res.data.data.list;
        } else {
          this.$message.error(res.data.msg || "加载失败");
        }
      }).catch(() => {
        this.$message.error("加载失败");
      });
    },
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    showDetail(item) {
      this.detail = item;
      this.detailDialog = true;
    },
    findSchedule(day, time) {
      return this.schedule.filter(s => s.weekDay === day && s.timeSlot === time);
    },
  }
};
</script>

<style scoped>
.notice-container {
  display: flex;
  gap: 24px;
  height: 100%; /* 视口高度，保证满屏 */
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* 避免整个页面出现滚动条 */
}

.left-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 100%; /* 限制高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  padding-right: 8px; /* 右内边距避免滚动条遮挡内容 */
  box-sizing: content-box;
}

.left-panel::-webkit-scrollbar {
  display: none; /* 滚动条宽度 */
}

.right-panel {
  flex: 3;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.right-panel::-webkit-scrollbar {
  display: none;
}

.timeline-container::-webkit-scrollbar {
  display: none;
}

.schedule-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #ccc;
  padding-bottom: 16px;
}

.grid-row {
  display: flex;
  width: 100%;
}

/* 单元格通用 */
.grid-cell {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  min-height: 60px;
  font-size: 14px;
  color: #333;
}

/* 时间列 */
.time-cell {
  width: 90px;
  flex: 0 0 90px;
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
}

/* 表头样式 */
.header-row {
  background-color: #f0f8ff;
  font-weight: bold;
  color: #333;
}

/* 课程格子 */
.booking-block {
  background-color: #e6f7ff;
  border-radius: 6px;
  padding: 4px 6px;
  text-align: center;
  color: #007acc;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
}

.schedule-container {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  background: #fff;
  font-family: 'Segoe UI', sans-serif;
}


.course-name {
  font-weight: 600;
}

.room-name {
  font-size: 11px;
  opacity: 0.8;
}


.booking-block:hover {
  color: #FFFFFF;
  background-color: #007acc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* 公告卡片样式 */
.notice-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notice-card:hover {
  transform: translateY(-2px);
}

.card-left img {
  width: 160px;
  height: 100%;
  object-fit: cover;
  border-radius: 12px 0 0 12px;
}

.card-right {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-right h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-right .meta {
  color: #888;
  font-size: 12px;
  margin-bottom: 10px;
}

.preview {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-right .view-more {
  margin-top: 12px;
  font-size: 13px;
  color: #007bff;
}

/* 公告样式保留 */
.notice-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.notice-card:hover {
  transform: translateY(-2px);
}

.card-left img {
  width: 160px;
  height: 100%;
  object-fit: cover;
  border-radius: 12px 0 0 12px;
}

.card-right h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: bold;
}

.card-right .meta {
  color: #888;
  font-size: 12px;
  margin-bottom: 10px;
}

.card-right .preview {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 模态框样式同原来 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-container {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.modal-container::-webkit-scrollbar {
  display: none;
}

.modal-container h2 {
  margin: 0 0 10px;
}

.modal-container .meta {
  font-size: 12px;
  color: #888;
  margin-bottom: 16px;
}

.modal-container .detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 20px;
}

.modal-container .content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #333;
}

.close-btn {
  margin-top: 20px;
  background: #007bff;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn:hover {
  background: #0056b3;
}
</style>
