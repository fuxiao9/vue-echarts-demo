<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  name: "Trend",
  data() {
    return {
      trendChart: null,
      timerId: null,
    };
  },
  methods: {
    initChart() {
      this.trendChart = this.$echarts.init(this.$refs.trendRef, "chalk");

      const initOption = {};
      this.trendChart.setOption(initOption);
    },

    async getData() {
      const res = await this.$axios.get("/trend")

      const dataOption = {};
      this.trendChart.setOption(dataOption);

      this.updateChart();
    },

    updateChart() {
      const updateOption = {};
      this.trendChart.setOption(updateOption);
    },

    screenAdapter() {},
  },

  mounted() {
    this.initChart();
    this.getData();
    this.screenAdapter();

    window.addEventListener("resize", () => {
      this.screenAdapter();
    });
  },

  beforeDestroy() {
    clearInterval(this.timerId);
    window.removeEventListener("resize", () => {
      this.screenAdapter();
    });
  },
};
</script>

<style>
</style>