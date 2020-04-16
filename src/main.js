import setupOutcome from "./setup"; // Returns either true or false

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
  appId: "1:385087995070:web:7204f5d15cb9004c3072ef"
});

/**
 * User --> Null
 * - When page first loads
 * - When user logs out
 *
 * User --> User object
 * - When user logs in
 * - When user first signs up
 *
 * @notice Why new vue is wrapped in this.
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 *
 * @todo Will this impact performance of waking up from freeze state when switching between apps?
 */
auth().onAuthStateChanged(user => {
  console.log("Auth state changed", user);

  if (user)
    store.commit(
      "setEmailVerificationStatus",
      auth().currentUser.emailVerified
    );
  else {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});
