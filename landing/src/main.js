import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

// @todo Does not use the router by default
// import router from "./router";

Vue.config.productionTip = false;

new Vue({
  // router,
  render: (h) => h(App),
}).$mount("#app");
