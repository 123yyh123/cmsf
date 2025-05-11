<template>
  <div class="line-chart">
    <div ref="lineChart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
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
      const chart = echarts.init(this.$refs.lineChart);
      const option = {
        xAxis: {
          type: 'category',
          data: this.data.map(item => item.date)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.data.map(item => item.count),
            type: 'line',
            smooth: true
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.line-chart {
  width: 100%;
  height: 300px;
}
</style>
