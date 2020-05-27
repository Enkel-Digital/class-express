<template>
  <!-- This is also a nice icon -->
  <!-- <v-icon>mdi-keyboard-backspace</v-icon> -->
  <span id="button">
    <v-btn v-if="to" :to="to" icon>
      <v-icon large>mdi-chevron-left</v-icon>
    </v-btn>

    <v-btn v-else @click="goBack" icon>
      <v-icon large>mdi-chevron-left</v-icon>
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "BackBtn",
  props: ["to"],
  methods: {
    goBack() {
      this.$router.back();
    },
  },
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
