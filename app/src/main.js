/* Imports for side effects */
import setupOutcome from "./setup/index"; // Returns either true or false
import "./registerServiceWorker";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "firebase/auth";

// Setup the error controller plugin
import errorController from "vue-error-controller";
import errorDialog from "./components/ErrorDialog.vue";
import postToErrorService from "./utils/postToErrorService";
Vue.use(errorController, { router, errorDialog, postToErrorService });

import loader from "vue-loader-controller";
import customLoader from "./components/Loader.vue";
Vue.use(loader, { customLoader });

import moment from "moment";
moment.locale("en"); // Ensure locale is always default "en" locale like the one in moment's documentation
Vue.prototype.moment = moment;

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
firebase.initializeApp({
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
const unsubscribe = firebase.auth().onAuthStateChanged(() => {
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
