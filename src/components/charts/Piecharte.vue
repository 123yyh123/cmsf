<template>
  <div class="pie-chart">
    <div ref="pieChart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PieChart',
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
      const chart = echarts.init(this.$refs.pieChart);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '角色分布',
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
.pie-chart {
  width: 100%;
  height: 300px;
}
</style>
