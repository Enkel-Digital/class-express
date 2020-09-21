<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from "@/views/Main";

export default {
  name: "App",
  components: {
    Main,
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
