<template>
  <div class="timeline-container">
    <h3>📘 设备 {{ device.deviceCode }} 的绑定记录</h3>
    <ul v-if="bindStatusList.length > 0" class="timeline">
      <li v-for="(item, index) in bindStatusList" :key="index" class="timeline-item">
        <div class="timeline-dot" :class="item.bindStatus === '已绑定' ? 'bind' : 'unbind'"></div>
        <div class="timeline-content">
          <p class="status">
            <strong>{{ item.bindStatus }}</strong> - 教室 {{ item.classroomCode }}
          </p>
          <p class="meta">
            操作人：{{ item.operatorRealName }} <br />
            时间：{{ formatTime(item.operatorTime) }}
          </p>
        </div>
      </li>
    </ul>
    <div v-else>
      <div class="no-data">
        <img src="@/assets/images/空空如也.png" alt="No Data" />
        <p>这里空空如也</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BindTimeline',
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  computed: {
    bindStatusList() {
      return this.device.bindStatusTrace || []
    }
  },
  methods: {
    formatTime(time) {
      const date = new Date(time)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.timeline-container {
  max-width: 600px;
  margin: 20px auto;
  font-family: "Helvetica Neue", sans-serif;
}

.timeline {
  list-style: none;
  padding-left: 20px;
  border-left: 2px solid #e0e0e0;
  position: relative;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  padding-left: 20px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  left: -7px;
  top: 4px;
  background-color: #999;
}

.timeline-dot.bind {
  background-color: #67c23a;
}

.timeline-dot.unbind {
  background-color: #f56c6c;
}

.timeline-content {
  padding-left: 8px;
}

.status {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.meta {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
.no-data {
  text-align: center;
  margin-top: 50px;
  color: #999;
  img {
    width: 200px;
    height: 200px;
  }
  p {
    margin-top: 10px;
  }
}
</style>
