import errorControllerFF from "./errorControllerFF";

// Plugin object with only the required install method.
const ErrorPlugin = {
  // The install method will be called with the Vue constructor as the first argument, along with possible options
  install(Vue, options = {}) {
    /**
     * Add a component to the plugin, to get it installed globally in vue app
     * Default error component is only loaded and used if custom error component is not defined
     */
    Vue.component(options.componentName || "ErrorDialog", options.errorDialog);

    const errorController = errorControllerFF(
      Vue,
      options.router,
      options.postToErrorService
    );

    // Attach errorController to Vue class/module for vuex and other "non vue component" modules
    Vue.$error = errorController;
    // Attach errorController to Vue prototype for use in Vue components with "this.$error"
    Vue.prototype.$error = errorController;
  },
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== "undefined" && window.Vue) window.Vue.use(ErrorPlugin);

// Export plugin object as default export
export default ErrorPlugin;

// Export ERROR and createError functions from error.js
export * from "./error";
