<template>
  <div class="app-container" style="display: flex; flex-direction: column;overflow-y: auto">
    <div
        style="background: #ffffff; padding: 0 20px 0 10px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;margin-bottom: 20px;align-items: center;height: 40px">
      <el-icon class="el-icon-s-promotion" style="font-size: 20px; margin-right: 10px;"></el-icon>
      <HorizontalScroll v-if="announcementList[0].text" :text="announcementList[0].text" :speed="40"/>
    </div>
    <div style="flex: 1; height:0;display: flex; flex-direction: column; overflow: auto;" class="con">
      <div style="margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-evenly; gap: 20px;">
        <div v-if="stats"
             style="flex:1;background: #ffffff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;justify-content: space-between">
          <img src="../../assets/images/教室.png"
               style="width: 120px; height: 100%;object-fit: contain" alt=""/>
          <div style="display: flex; flex-direction: column;justify-content: center;margin-left: 10px">
            <div style="font-size: 24px; color: #333;">教室总数</div>
            <div style="font-size: 26px; font-weight: bold; color: #409EFF;">{{ stats.totalClassroom }}</div>
          </div>
        </div>
        <div v-if="stats"
             style="flex:1;background: #ffffff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;justify-content: space-between">
          <img src="../../assets/images/设备.png"
               style="width: 120px; height: 100%;object-fit: contain" alt=""/>
          <div style="display: flex; flex-direction: column;justify-content: center;margin-left: 10px">
            <div style="font-size: 24px; color: #333;">设备总数</div>
            <div style="font-size: 26px; font-weight: bold; color: #67C23A;">{{ stats.deviceTotal }}</div>
          </div>
        </div>
        <div v-if="stats"
             style="flex:1;background: #ffffff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;justify-content: space-between">
          <img src="../../assets/images/用户.png"
               style="width: 120px; height: 100%;object-fit: contain" alt=""/>
          <div style="display: flex; flex-direction: column;justify-content: center;margin-left: 10px">
            <div style="font-size: 24px; color: #333;">用户总数</div>
            <div style="font-size: 26px; font-weight: bold; color: #E6A23C;">{{ stats.totalPeople }}</div>
          </div>
        </div>
        <div v-if="stats"
             style="flex:1;background: #ffffff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;justify-content: space-between">
          <img src="../../assets/images/空闲.png"
               style="width: 120px; height: 100%;object-fit: contain" alt=""/>
          <div style="display: flex; flex-direction: column;justify-content: center;margin-left: 10px">
            <div style="font-size: 24px; color: #333;">当前空闲教室数量</div>
            <div style="font-size: 26px; font-weight: bold; color: #a93ac2;">{{ stats.idleClassroom }}</div>
          </div>
        </div>
      </div>
      <div style="border-radius: 4px">
        <div style="display: flex; justify-content: flex-start; flex-wrap: wrap;gap: 20px">
          <div ref="devicePieChart"
               style="width: 400px; height: 300px;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
          <div ref="userPieChart"
               style="width: 400px; height: 300px;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
          <div
              style="background: #fff; border-radius: 10px; height: 300px; flex: 1; padding: 10px 20px; display: flex; flex-direction: column;">
            <div style="display:flex;align-items: baseline;justify-content: space-between;">
              <div style="display: flex;gap:0 10px;text-align: center;align-items: baseline">
                <div style="margin-bottom: 10px; font-size: 16px;">教室预约情况</div>
                <el-button type="text" icon="el-icon-refresh" :size="20" :loading="loading"
                           @click="refreshData"></el-button>
              </div>
              <div style="font-size: 14px;color: #666;">
                <span>待审核预约：{{ stats.totalReview }}条</span>
              </div>
            </div>
            <div style="flex: 1; overflow-y: auto;" class="timeline-container">
              <div v-for="(item, index) in stats.recentlyVOS" :key="index"
                   style="display: flex; margin-bottom: 14px;">
                <!-- 时间点图标 -->
                <div
                    style="width: 12px; height: 12px; background-color: #409EFF; border-radius: 50%; text-align: center; color: white; line-height: 24px; font-size: 12px; margin-right: 10px;">
                  <i class="el-radio--mini"></i>
                </div>
                <!-- 内容卡片 -->
                <div style="
                box-shadow:6.3px 1.8px 2.9px rgba(0, 0, 0, 0.01),17.4px 5px 7.9px rgba(0, 0, 0, 0.015),41.9px 12.1px 19px rgba(0, 0, 0, 0.02),139px 40px 63px rgba(0, 0, 0, 0.03);
                background-color: #eae8e8;
                padding: 20px;
                border-radius: 10px;">
                  <div style="font-weight: bold; color: #333; font-size: 15px;">{{ item.applyTime }}</div>
                  <div style="margin-top: 4px; color: #666; font-size: 14px;">
                    <span style="color: #409EFF; font-weight: 500;">{{ item.applicantRole }}{{
                        item.applicantName
                      }}</span>
                    申请预约
                    <span style="color: #67C23A; font-weight: 500;">{{ item.classroomCode }}</span>
                    教室
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div style="margin-top: 20px;display: flex;gap: 20px">
          <div
              style="background: #fff; border-radius: 10px; height: 300px; flex: 1; padding: 10px; display: flex; flex-direction: column;">
            <div style="display:flex;align-items: baseline;justify-content: space-between;">
              <div style="display: flex;gap:0 10px;text-align: center;align-items: baseline">
                <div style="margin-bottom: 10px; font-size: 16px;">最近公告</div>
              </div>
            </div>
            <div style="flex: 1; overflow-y: auto;" class="timeline-container">
              <div v-for="(item, index) in announcementList" :key="index" style="display: flex; margin-bottom: 20px;">
                <!-- 时间点图标 -->
                <div
                    style="width: 16px; height: 16px; background-color: #409EFF; border-radius: 50%; margin-right: 16px; margin-top: 6px;"></div>
                <!-- 内容卡片 -->
                <div
                    style="flex: 1; border-radius: 10px;padding: 16px;display: flex;flex-direction: column;gap: 10px;background-image: radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%);
 background-blend-mode: screen;margin-right: 10px">
                  <!-- 标题和置顶标志 -->
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">{{ item.title }}</h3>
                    <span v-if="item.pinned" style="color: #f56c6c; font-size: 12px; font-weight: bold;">置顶</span>
                  </div>
                  <!-- 公告内容 -->
                  <div style="color: #666; font-size: 14px; line-height: 1.6;">
                    {{ item.content }}
                  </div>
                  <!-- 图片展示 -->
                  <div v-if="item.coverImage" style="margin-top: 8px;">
                    <img :src="item.coverImage" alt="封面图片" style="max-width: 100%;max-height: 100px; border-radius: 6px;"/>
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
          <div ref="reservationBarChart"
               style="height: 300px;flex: 1;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
          <div ref="classroomPieChart"
               style="width: 400px; height: 300px;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
        </div>
      </div>
      <div style="height: 20px"/>
    </div>
  </div>
</template>


<script>
import * as echarts from 'echarts'
import {getIndexInfo, getRecentlyApply} from '@/apis/common'
import {getRecentlyPublic} from "@/apis/announcement";
import HorizontalScroll from "@/components/HorizontalScroll.vue";

export default {
  components: {HorizontalScroll},
  data() {
    return {
      stats: null,
      loading: false,
      announcementList: [],
      isOverflowing: false,
    }
  },
  created() {
    this.loadStats();
    this.getAnnouncementList()
  },
  methods: {
    getAnnouncementList() {
      this.announcementList = []
      getRecentlyPublic({}).then(res => {
        if (res.data.code === 200) {
          this.announcementList = res.data.data
          this.announcementList.forEach(item => {
            item.text = item.title + ": " + item.content
          })
        } else {
          this.$message.error(res.data.msg || '获取公告列表失败')
        }
      }).catch(() => {
        this.$message.error('请求失败，请检查网络')
      })
    },
    refreshData() {
      this.loading = true
      getRecentlyApply().then(res => {
        if (res.data.code === 200) {
          this.stats.recentlyVOS = res.data.data
        } else {
          this.$message.error(res.data.msg || '获取最近预约列表失败')
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.$message.error('请求失败，请检查网络')
        this.loading = false
      })
    },
    loadStats() {
      getIndexInfo().then(res => {
        if (res.data.code === 200) {
          this.stats = res.data.data
          this.$nextTick(this.initCharts)
        } else {
          this.$message.error(res.data.msg || '获取统计数据失败')
        }
      }).catch(() => {
        this.$message.error('请求失败，请检查网络')
      })
    },
    initCharts() {
      if (!this.stats) return

      // 1. 设备状态饼图
      echarts.init(this.$refs.devicePieChart).setOption({
        title: {text: '设备状态分布', left: 'center'},
        tooltip: {trigger: 'item'},
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            {value: this.stats.deviceNormal, name: '正常'},
            {value: this.stats.deviceRepair, name: '维修'},
            {value: this.stats.deviceDamage, name: '损坏'},
            {value: this.stats.deviceScrap, name: '报废'}
          ]
        }]
      })

      // 2. 用户比例饼图
      echarts.init(this.$refs.userPieChart).setOption({
        title: {text: '用户组成比例', left: 'center'},
        tooltip: {trigger: 'item'},
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            {value: this.stats.studentTotal, name: '学生'},
            {value: this.stats.teacherTotal, name: '教师'}
          ]
        }]
      })

      // 3. 教室状态饼图
      echarts.init(this.$refs.classroomPieChart).setOption({
        title: {text: '教室状态分布', left: 'center'},
        tooltip: {trigger: 'item'},
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            {value: this.stats.usableClassroom, name: '可用'},
            {value: this.stats.repairClassroom, name: '维修'}
          ]
        }]
      })

      // 4. 一周预约柱状图
      const days = Object.keys(this.stats.pastWeekReservation)
      const values = Object.values(this.stats.pastWeekReservation)
      echarts.init(this.$refs.reservationBarChart).setOption({
        title: {text: '最近一周预约情况', left: 'center'},
        tooltip: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: days,
          axisTick: {alignWithLabel: true}
        },
        yAxis: {type: 'value'},
        series: [{
          name: '预约数',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            color: '#409EFF',
            borderRadius: [4, 4, 0, 0]
          },
          data: values
        }]
      })

      // 5. 预约趋势折线图
      echarts.init(this.$refs.reservationLineChart).setOption({
        title: {text: '预约趋势图', left: 'center'},
        xAxis: {type: 'category', data: days},
        yAxis: {type: 'value'},
        series: [{
          data: values,
          type: 'line',
          smooth: true,
          lineStyle: {color: '#67C23A'}
        }]
      })
    }
  }
}
</script>


<style scoped>
.con::-webkit-scrollbar {
  display: none;
}

.timeline-container {
  text-align: start;
}

.timeline-container::-webkit-scrollbar {
  width: 6px;
}

.timeline-container::-webkit-scrollbar-thumb {
  background-color: #d4d4d4;
  border-radius: 4px;
}

.timeline-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

</style>
