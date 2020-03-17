<template>
  <v-btn icon class="ma-0 pa-0" @click="goBack">
    <v-icon>mdi-keyboard-backspace</v-icon>
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
