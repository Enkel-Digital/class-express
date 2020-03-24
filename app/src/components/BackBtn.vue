<template>
  <v-btn icon id="button" @click="goBack">
    <!-- <v-icon>mdi-keyboard-backspace</v-icon> -->
    <v-icon large>mdi-chevron-left</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "BackBtn",
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
#button {
  /* Make sure button always appear on top, used when overlaying on other items */
  /* z-index: 2; */

  /* Remove all positioning and spaces around it for the caller to set */
  margin: 0;
  padding: 0;
}
</style>
