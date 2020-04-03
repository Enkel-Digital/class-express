/**
 * Vuex module for search result and the explore page
 */

import initialState from "./initialState";

// @todo Remove mock data
import mock from "../../mockData";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    /**
     * Clear search results
     * @function clearSearch
     */
    clearSearch({ state }) {
      delete state.searchResults;
    }
  },
  actions: {
    /**
     * Get list of categories
     * @function getCategories
     */
    async getCategories({ state }) {
      state.categories = mock.categories;
    },
    /**
     * Search function
     * @function searchClass
     */
    async searchClass({ state }) {
      // For this is ok to do this I guess?
      // Usually u need to use mutation, and the vuex-persist only works when you use mutations.
      // But for this, if the page reloads or app restarts, do I want the search result to be persisted?
      state.searchResults = mock.searchResults;
    }
  }
};
