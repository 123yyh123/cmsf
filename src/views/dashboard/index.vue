<template>
  <div class="app-container" style="display: flex; flex-direction: column; height: 100%;">
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
                    <span style="color: #409EFF; font-weight: 500;">{{item.applicantRole}}{{ item.applicantName }}</span>
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
          <div ref="reservationBarChart"
               style="height: 300px;flex: 1;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
          <div ref="classroomPieChart"
               style="width: 400px; height: 300px;background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;display: flex;padding-top: 20px"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import * as echarts from 'echarts'
import {getIndexInfo,getRecentlyApply} from '@/apis/common'

export default {
  data() {
    return {
      stats: null,
      loading: false
    }
  },
  computed: {
    overviewList() {
      if (!this.stats) return []
      return [
        {title: '教室总数', value: this.stats.totalClassroom},
        {title: '可用教室', value: this.stats.usableClassroom},
        {title: '维修教室', value: this.stats.repairClassroom},
        {title: '设备总数', value: this.stats.deviceTotal},
        {title: '正常设备', value: this.stats.deviceNormal}
      ]
    }
  },
  mounted() {
    this.loadStats()
  },
  methods: {
    refreshData() {
      this.loading = true
      getRecentlyApply().then(res => {
        if (res.data.code === 200){
          this.stats.recentlyVOS = res.data.data
        }else {
          this.$message.error('获取失败')
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
      }).catch(() => {
        this.$message.error('请求失败，请检查网络')
        this.loading = false
      })
    },
    getStatusColor(status) {
      switch (status) {
        case '审核中':
          return '#E6A23C';
        case '已通过':
          return '#67C23A';
        case '已拒绝':
          return '#F56C6C';
        default:
          return '#909399';
      }
    },
    loadStats() {
      getIndexInfo().then(res => {
        if (res.data.code === 200) {
          this.stats = res.data.data
          this.$nextTick(this.initCharts)
        } else {
          this.$message.error('首页数据获取失败')
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
.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f5f7fa;
}

/* 顶部概览卡片 */
.overview {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.overview-card {
  flex: 1;
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.overview-card .number {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
}

.overview-card .label {
  font-size: 14px;
  margin-top: 8px;
  color: #666;
}

/* 中部图表区域 */
.main-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: span 1;
  gap: 20px;
}

.chart-card {
  height: 300px;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
}

/* 右侧栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.info-card ul {
  padding-left: 16px;
}

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
