<template>
  <div class="bar-chart">
    <div ref="barChart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
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
      const chart = echarts.init(this.$refs.barChart);
      const option = {
        xAxis: {
          type: 'category',
          data: this.data.map(item => item.building)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.data.map(item => item.count),
            type: 'bar'
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.bar-chart {
  width: 100%;
  height: 300px;
}
</style>
