<template>
  <v-content>
    You will be redirected back to your previous page in 5 seconds
    <v-img
      src="https://www.artzstudio.com/wp-content/uploads/2020/05/404-error-not-found-page-lost.png"
    >
    </v-img>
    <v-row>
      <v-col>
        <v-btn :to="{ name: 'home' }">Home</v-btn>
        <br />
        Go home now?
      </v-col>
      <v-col>
        <v-btn id="button" @click="goBack">
          Back
        </v-btn>
        <br />
        Back to previous page
      </v-col>
    </v-row>
  </v-content>
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
          else router.push({ name: "home" });
        },
        5000,
        this.$router
      ),
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
  },
  beforeDestroy() {
    // Prevent the timeout from still routing to home if user already navigated away themselves
    clearTimeout(this.timeout);
  },
};
</script>

<style scoped>
#notFound {
  text-align: left;
  margin: 0;
  padding: 0;
}
</style>
