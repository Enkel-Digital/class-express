// Function to redirect user to the preferred domain instead of the default firebase hosting domains if they land there.
// IIFE to prevent polluting the global namespace accidentally
(function () {
  // Short circuiting undefined inputs
  const redirect = (URL) => URL && window.location.replace(URL);
  const location = window.location.hostname;

  console.log(`Window location: ${location}`);
  // Mapping of links to redirect
  redirect(
    {
      "ce-landing.web.app": "https://classexpress.enkeldigital.com/",
      "ce-landing.firebaseapp.com/": "https://classexpress.enkeldigital.com/",
    }[location]
  );
})();

import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  mounted() {
    // This is needed for "prerender-spa-plugin"'s renderAfterDocumentEvent to take snapshot of static content once everything is rendered.
    document.dispatchEvent(new Event("vue-render-complete"));
  },
}).$mount("#app");
