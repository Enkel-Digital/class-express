import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import initialState from "./initialState";

Vue.use(Vuex);

export default new Vuex.Store({
  state: initialState(),
  mutations: {},
  actions: {},
  plugins: [createPersistedState()]
});
