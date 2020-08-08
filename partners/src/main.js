/* Import for side effects only */
import setupOutcome from "./setup"; // Returns either true or false
import "./registerServiceWorker";
import "./plugins/vue-masonry";
import "./plugins/vue-sanitize";

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
Vue.prototype.moment = moment;

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
firebase.initializeApp({
  apiKey: "AIzaSyA6WspXWorAK_1HiwLAVht7-ujoUDdWsAs",
  authDomain: "class-express-partners.firebaseapp.com",
  projectId: "class-express-partners",
  storageBucket: "class-express-partners.appspot.com",
  appId: "1:671101516105:web:272b2cd00047f3eb36c298",
});

// Wait for firebase to finish initialization before creating the app.
// So that the router navigation wont break due to invalid auth
firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
