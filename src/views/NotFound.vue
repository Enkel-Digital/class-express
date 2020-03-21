<template>
  <v-content>
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>Page Not Found</v-toolbar-title>
    </v-app-bar>

    <div id="notFound">
      <br />
      <p>Oops we are really sorry but the page is not found...</p>
      <p>You will be redirected back in 3 seconds...</p>

      <br />
      Go home now?
      <v-btn :to="{ name: 'home' }">Home</v-btn>
    </div>
  </v-content>
</template>

<script>
import BackBtn from "@/components/BackBtn";

export default {
  name: "notFound",
  data() {
    return {
      // Timeout data object that can be referenced to clear if user navigates away before timeout
      timeout: setTimeout(
        router => {
          // Navigate back to last location if possible. 2 as user's default home page may not be a blank tab
          if (window.history.length > 2) router.back();
          // Else, redirect back home
          else router.push({ name: "home" });
        },
        3000,
        this.$router
      )
    };
  },
  components: {
    BackBtn
  },
  beforeDestroy() {
    // Prevent the timeout from still routing to home if user already navigated away themselves
    clearTimeout(this.timeout);
  }
};
</script>

<style scoped>
#notFound {
  margin: 1em;
  text-align: left;
}
</style>
