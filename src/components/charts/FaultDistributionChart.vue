<template>
  <div class="fault-distribution-chart">
    <div ref="faultChart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'FaultDistributionChart',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.faultChart);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '设备故障',
            type: 'pie',
            radius: '55%',
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.fault-distribution-chart {
  width: 100%;
  height: 300px;
}
</style>
