<template>
  <div>
    <v-app-bar app color="orange lighten-1" flat dark>
      <BackBtn />
      <v-toolbar-title>Page Not Found</v-toolbar-title>
    </v-app-bar>

    <div id="notFound">
      <br />
      <p>Oops we are really sorry but the page is not found...</p>
      <p>You will be redirected home in 3 seconds...</p>

      <br />
      Go home now?
      <v-btn :to="{ name: 'home' }">Home</v-btn>
    </div>
  </div>
</template>

<script>
import BackBtn from "@/components/BackBtn";

export default {
  name: "notFound",
  components: {
    BackBtn
  },
  mounted() {
    setTimeout(
      router => {
        // Redirect back home
        router.push({ name: "home" });
      },
      3000,
      this.$router
    );
  }
};
</script>

<style scoped>
#notFound {
  margin: 1em;
  text-align: left;
}
</style>
