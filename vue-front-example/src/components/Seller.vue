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
      allData: null, // 当前显示的页数
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null, // 接收定时器
    };
  },
  methods: {
    initChart() {
      this.sellerChart = this.$echarts.init(this.$refs.sellerRef, "chalk");

      // 和分辨率大小相关的配置
      let initOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              type: "solid",
              width: 66,
              color: "#2d3443",
            },
          },
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true, // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  /* 百分之0状态下的颜色值 */
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  /* 百分之100状态下的颜色值 */
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };
      this.sellerChart.setOption(initOption);

      // 鼠标移入移出图表
      this.sellerChart.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.sellerChart.on("mouseout", () => {
        this.startInterval();
      });
    },

    // 获取数据设置到图表中
    async getData() {
      const res = await this.$axios.get("/seller");
      this.allData = res.data;
      // 对数据排序
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });

      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : Math.ceil(this.allData.length / 5);

      this.updateChart();
      // 开启定时器，改变图表页数
      this.startInterval();
    },

    // 图表切换页数
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);

      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValues = showData.map((item) => {
        return item.value;
      });

      let dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };

      this.sellerChart.setOption(dataOption);
    },

    // 定时器
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }

      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },

    // 当浏览器大小发生改变时候，会调用的方法，来完成屏幕的适配
    screenAdapter() {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };

      this.sellerChart.setOption(adapterOption);
      this.sellerChart.resize();
    },
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