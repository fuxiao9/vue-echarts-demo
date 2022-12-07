<template>
  <div class="com-container">
    <div class="com-echarts" ref="sellerRef"></div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data() {
    return {
      sellerChart: null,
      allData: null,
    };
  },
  methods: {
    initChart() {
      this.sellerChart = this.$echarts.init(this.$refs.sellerRef);
    },
    async getData() {
      const res = await this.$axios.get("/seller");
      this.allData = res.data;

      this.updateChart();
    },
    updateChart() {
      const sellerNames = this.allData.map((item) => {
        return item.name;
      });
      const sellerValues = this.allData.map((item) => {
        return item.value;
      });

      console.log(sellerNames, sellerValues, "aaaaaa");
      let option = {
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: sellerNames,
        },
        series: [
          {
            type: "bar",
            data: sellerValues
          }
        ]
      };

      this.sellerChart.setOption(option)
    },
  },

  mounted() {
    this.initChart();
    this.getData();
  },
};
</script>

<style>
</style>