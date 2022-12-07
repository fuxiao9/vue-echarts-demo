<template>
  <div class="com-container">
    <div class="select_title" :style="comStyle">
      <span @click="showChoice = !showChoice">{{ "▎" + showTitle }}</span>
      <span
        class="iconfont title_icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select_box" v-show="showChoice" :style="marginStyle">
        <div
          class="select_item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-echarts" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  name: "Trend",
  data() {
    return {
      trendChart: null,
      allData: null,
      timerId: null,
      showChoice: false, // 是否显示可选项
      choiceType: "map",
      titleFontSize: null, // 指明标题的字体大小
    };
  },
  computed: {
    selectTypes() {
      return this.allData
        ? this.allData.type.filter((item) => {
            return item.key !== this.choiceType;
          })
        : [];
    },
    showTitle() {
      return this.allData ? this.allData[this.choiceType].title : [];
    },

    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize / 1.6 + "px",
      };
    },
  },
  methods: {
    initChart() {
      this.trendChart = this.$echarts.init(this.$refs.trendRef, "chalk");

      const initOption = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "12%",
          icon: "circle",
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.trendChart.setOption(initOption);
    },

    async getData() {
      const res = await this.$axios.get("/trend");
      this.allData = res.data;

      this.updateChart();
    },

    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];

      // 类目轴的数据
      const timeArr = this.allData.common.month;
      // y轴的数据 series下的数据
      const seriesArr = this.allData[this.choiceType].data.map(
        (item, index) => {
          return {
            type: "line",
            name: item.name,
            data: item.data,
            stack: this.choiceType,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colorArr1[index],
                },
                {
                  offset: 1,
                  color: colorArr2[index],
                },
              ]),
            },
          };
        }
      );
      // 图例的数据
      const legendArr = this.allData[this.choiceType].data.map((item) => {
        return item.name;
      });

      const dataOption = {
        legend: {
          data: legendArr,
        },
        xAxis: {
          data: timeArr,
        },
        series: seriesArr,
      };
      this.trendChart.setOption(dataOption);
    },

    screenAdapter() {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 4,
          },
        },
      };

      this.trendChart.setOption(adapterOption);
      this.trendChart.resize();
    },

    // 切换当前图表数据
    handleSelect(currentType) {
      this.choiceType = currentType;

      this.updateChart();

      // 隐藏select下拉
      this.showChoice = false;
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

<style lang="less" scoped>
.select_title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;

  .title_icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select_box {
    background-color: #222733;
  }
}
</style>