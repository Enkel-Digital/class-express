<template>
  <v-responsive class="ma-0 pa-0">
    <v-btn icon @click="goBack">
      <v-icon>mdi-keyboard-backspace</v-icon>
    </v-btn>
  </v-responsive>
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
