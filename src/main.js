import setupOutcome from "./setup"; // Returns either true or false

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import { initializeApp, auth } from "firebase";

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
initializeApp({
  apiKey: "AIzaSyAXQkdXjxHpZbEYNTXoyfyBXfWVEbm-tCA",
  authDomain: "classes-ekd.firebaseapp.com",
  databaseURL: "https://classes-ekd.firebaseio.com",
  projectId: "classes-ekd",
  storageBucket: "classes-ekd.appspot.com",
  messagingSenderId: "385087995070",
  appId: "1:385087995070:web:7204f5d15cb9004c3072ef"
});

// Wait for firebase to finish initialization before creating the app.
// So that the router navigation wont break due to invalid auth
auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount("#app");
});