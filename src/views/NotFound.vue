<template>
  <v-main>
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold">
        Page Not Found
      </v-toolbar-title>
    </v-app-bar>

    <br />

    You will be redirected back to the previous page in 5 seconds.
    <v-img src="@/assets/404.png" height="50%" :contain="true" />

    <v-row>
      <v-col>
        <v-btn :to="{ name: 'home' }">home</v-btn>
      </v-col>
      <v-col>
        <v-btn id="button" @click="$router.back()"> back </v-btn>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: "notFound",
  data() {
    return {
      // Timeout data object that can be referenced to clear if user navigates away before timeout
      timeout: setTimeout(
        (router) => {
          // Navigate back to last location if possible. 2 as user's default home page may not be a blank tab
          if (window.history.length > 2) router.back();
          // Else, redirect back home
          else router.replace({ name: "home" });
        },
        5000,
        this.$router
      ),
    };
  },
  beforeDestroy() {
    // Prevent the timeout from still routing to home if user already navigated away themselves
    clearTimeout(this.timeout);
  },
};
</script>
