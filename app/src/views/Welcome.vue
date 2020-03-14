<template>
  <div class="welcome">
    <img alt="Login image" src="../assets/logo.png" width="360" height="370" />
    <router-link class="button" to="/signup">Sign Up</router-link>
    <router-link class="button" to="/login">Login</router-link>
  </div>
</template>

<script>
export default {
  name: "welcome"
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

.button {
  background-color: white;

  max-width: 10em;
  min-width: 8em;
  padding: 0.6em;
  margin-bottom: 1em;

  font-size: 2em;

  text-decoration: none;
  color: black;

  border-style: solid;
  border-width: 1px;
  border-radius: 4em;
}
</style>
