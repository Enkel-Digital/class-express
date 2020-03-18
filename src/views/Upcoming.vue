<template>
  <v-content class="home">
    <v-card v-for="clas in upcomingClasses" :key="clas.className">
      <!-- Log out the data first, to build the UI using vuetify to represent the data. -->
      <!-- {{ JSON.stringify(clas) }} -->
      <img v-bind:src="clas.locationImage" />
      <v-card-title>{{ clas.className }}</v-card-title>

      <v-card-subtitle class="pb-0">{{ clas.time }} to {{ clas.time + clas.classLength }}</v-card-subtitle>
      <v-card-text class="text--primary">
        <div>{{ clas.classProvider.name }}</div>

        <div>{{ clas.location }}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="orange" text>Class Details</v-btn>
        <!-- TODO: LINK SOMEWHERE  -->
        <v-btn color="orange" text>Share</v-btn>
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

const GmapsUrlConcat = (
  coordinates,
  baseGMapsURL = "https://maps.googleapis.com/maps/api/staticmap?"
) =>
  baseGMapsURL.concat(
    coordinates,
    "&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C",
    coordinates,
    "&key=AIzaSyDLcotbAj1ymo_cxeuPXVpbE0M7GW1wedU"
  );

export default {
  name: "upcoming",
  data() {
    // Mock data
    let upcomingClasses = [
      {
        className: "basic guitar",
        time: Date.now(),
        classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
        classProvider: {
          name: "Guitar Studio 1", // Name of the provider
          id: 123
        },
        location: { coordinates: "40.714728,-73.998672" }
      },
      {
        className: "advanced cooking",
        time: Date.now() + 1000000,
        classLength: "150", // Store classLength in minutes can show otherwise in hours as needed
        classProvider: {
          name: "Tampines CC", // Name of the providerx
          id: 456
        },
        location: { coordinates: "40.714728,-73.998672" }
      }
    ];

    upcomingClasses = upcomingClasses.map(clas => {
      clas.locationImage = GmapsUrlConcat(clas.location.coordinates);
      return clas;
    });

    return {
      apiKey: "AIzaSyDLcotbAj1ymo_cxeuPXVpbE0M7GW1wedU",
      // upcomingClasses is a list of classes object sorted by time (nearest lessons first)
      upcomingClasses
    };
  }
};
</script>

<style scoped></style>