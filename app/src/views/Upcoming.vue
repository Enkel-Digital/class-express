<template>
  <v-content class="home">
    <v-card v-for="clas in upcomingClasses" :key="clas.className">
      <!-- Log out the data first, to build the UI using vuetify to represent the data. -->
      {{ JSON.stringify(clas) }}
    </v-card>
  </v-content>
</template>

<script>
/**
 * @notice Cannot use the word class as it is a reserved keyword.
 * @notice "clas" is used instead of "class"
 */

export default {
  name: "upcoming",
  data() {
    return {
      // upcomingClasses is a list of classes object sorted by time (nearest lessons first)
      upcomingClasses: [
        {
          className: "basic guitar",
          time: Date.now(),
          classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
          classProvider: {
            name: "Guitar Studio 1", // Name of the provider
            id: 123
          },
          location: "" // Location Coordinates so we can show on a Map insert
        },
        {
          className: "advanced cooking",
          time: Date.now() + 1000000,
          classLength: "150", // Store classLength in minutes can show otherwise in hours as needed
          classProvider: {
            name: "Tampines CC", // Name of the provider
            id: 456
          },
          location: "" // Location Coordinates so we can show on a Map insert
        }
      ]
    };
  }
};
</script>

<style scoped></style>
