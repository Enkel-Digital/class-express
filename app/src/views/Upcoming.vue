<template>
  <v-content class="home">
    <v-card v-for="clas in upcomingClasses" :key="clas.className">
      <!-- Log out the data first, to build the UI using vuetify to represent the data. -->
      <!-- {{ JSON.stringify(clas) }} -->
      <v-img
        class="white--text align-end"
        height="200px"
         src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>{{clas.className}}</v-card-title>
      </v-img>
      <v-card-subtitle class="pb-0">{{clas.time}} to {{clas.time + clas.classLength}}</v-card-subtitle>
      <v-card-text class="text--primary">
      <div>{{clas.classProvider.name}}</div>

      <div>{{clas.location}}</div>
      </v-card-text>

      <v-card-actions>
      <v-btn
        color="orange"
        text
      >
        Class Details
      </v-btn>
      <!-- TODO: LINK SOMEWHERE  -->
      <v-btn
        color="orange"
        text
      >
        Share
      </v-btn>
      <!-- TODO: LINK SOMEWHERE  -->

    </v-card-actions>
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
          location: "Guitar location" // Location Coordinates so we can show on a Map insert
        },
        {
          className: "advanced cooking",
          time: Date.now() + 1000000,
          classLength: "150", // Store classLength in minutes can show otherwise in hours as needed
          classProvider: {
            name: "Tampines CC", // Name of the provider
            id: 456
          },
          location: "cooking location" // Location Coordinates so we can show on a Map insert
        }
      ]
    };
  }
};

</script>

<style scoped></style>
