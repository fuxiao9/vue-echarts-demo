import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as echarts from "echarts";
import "/public/static/theme/chalk";  // echarts 主题
import axios from "axios";
// 引入字体图标库
import "./assets/font/iconfont.css"
// 引入全局css样式
import "@/assets/css/global.less";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://127.0.0.1:8888/api";

Vue.prototype.$echarts = echarts;
// Vue.prototype.$chalk = chalk;
Vue.prototype.$axios = axios;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
