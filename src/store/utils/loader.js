/**
 * Simple wrapper over actions from the loader module
 */

import store from "@/store";

export default {
  async new(loaderRequest) {
    return store.dispatch("loader/new", loaderRequest, {
      root: true,
    });
  },
  async clear(loaderRequestID) {
    store.dispatch("loader/clear", loaderRequestID, { root: true });
  },
};
