import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as echarts from "echarts";
import axios from "axios";
import "./assets/css/global.less";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://127.0.0.1:8888/api";

Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
