<template>
  <div id="app">
    <Main v-if="routePath === '/'" />
    <Partner v-else-if="routePath === '/partner'" />
    <!-- Show 404 route for not found -->
  </div>
</template>

<script>
import Main from "@/views/Main";

export default {
  name: "App",
  components: {
    Main,
    Partner: () => import("@/views/Partner"), // Lazy load this view
  },
  computed: {
    // Pseudo router
    // @todo Not great as the routes are not lazy loaded, or are they? Since the components are lazy loaded
    routePath() {
      return window.location.pathname;
    },
  },
};
</script>

// Load the bulma styles in the top level component
<style lang="sass" src="bulma" />

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
