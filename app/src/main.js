import "./setup/attachErrorHandler"; // Import for its side effects
import setupOutcome from "./setup/index"; // Returns either true or false

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import { initializeApp, auth } from "firebase";

import moment from "moment";
Vue.prototype.moment = moment;
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
  appId: "1:385087995070:web:7204f5d15cb9004c3072ef",
});

// App variable to store reference to the vue App object
let app;

/**
 * @notice Why new vue is wrapped in this.
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 */
const unsubscribe = auth().onAuthStateChanged(() => {
  // Prevent app initialization from running more than once
  if (!app)
    // Create new vue app
    app = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");

  // Use the firebase.Unsubscribe function returned from adding auth state change listner to unsubscribe
  // To prevent new Vue from running more than once
  unsubscribe();
});
