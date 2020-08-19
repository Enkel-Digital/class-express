<template>
  <div class="welcome">
    <img alt="Login image" src="../assets/logo.png" width="360" height="360" />

    <v-btn
      :to="{ name: 'CreateBusiness' }"
      width="30em"
      color="#60696c"
      outlined
      dark
    >
      Signup
    </v-btn>

    <br />

    <v-btn :to="{ name: 'login' }" width="30em" color="#60696c" outlined dark>
      Login
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "welcome",
};
</script>

<style scoped>
.welcome {
  display: flex;
  flex-direction: column;

  align-items: center;

  position: absolute;
  top: 10vh;
  left: 50%;
  right: 50%;
  bottom: 10vh;
}
</style>
