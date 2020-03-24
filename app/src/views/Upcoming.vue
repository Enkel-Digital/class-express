<template>
  <v-card max-width="400" class="mx-auto">
    <v-app-bar dark color="blue">
      <v-toolbar-title>My Upcoming Classes</v-toolbar-title>
    </v-app-bar>

    <v-container>
      <v-row dense>
        <v-col v-for="clas in upcomingClasses" :key="clas.className">
          <v-card>
            <v-avatar class="ma-3" size="300" tile>
              <!-- <img v-bind:src="clas.locationImage" /> -->
              <img v-bind:src="clas.locationImage" />
            </v-avatar>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline">{{clas.className}}</v-card-title>
                <v-card-subtitle>{{moment(clas.time).format('MMMM Do, h:mm')}} to {{moment((clas.time + Date.parse(clas.classLength))).format('MMMM Do, h:mm')}}</v-card-subtitle>

                <v-card-text class="text-left --primary">
                  <div>{{ clas.classProvider.name }}</div>
                  <div>{{ clas.location.address }}</div>
                </v-card-text>
              </div>
            </div>
            <v-card-actions>
              <v-btn color="orange" text>Class Details</v-btn>
              <!-- TODO: LINK SOMEWHERE  -->
              <v-btn color="orange" text>Share</v-btn>
              <!-- TODO: LINK SOMEWHERE  -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
let upcomingClasses = [
  {
    className: "Basic Guitar",
    time: Date.now(),
    classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
    classProvider: {
      name: "Guitar Studio 1", // Name of the provider
      id: 123
    },
    location: {
      coordinates: "1.300649, 103.855453",
      address: "249B Victoria St, Bugis Village"
    }
  },
  {
    className: "Advanced Cooking",
    time: Date.now() + 1000000,
    classLength: "150", // Store classLength in minutes can show otherwise in hours as needed
    classProvider: {
      name: "Tampines CC", // Name of the providerx
      id: 456
    },
    location: {
      coordinates: "1.302481, 103.855448",
      address: "117 Fidelio St"
    }
  }
];

const apiKey = "AIzaSyDLcotbAj1ymo_cxeuPXVpbE0M7GW1wedU";

const GmapsUrlConcat = (
  coordinates,
  key,
  baseGMapsURL = "https://maps.googleapis.com/maps/api/staticmap?"
) =>
  baseGMapsURL.concat(
    coordinates,
    "&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C",
    coordinates,
    "&key=",
    key
  );

export default {
  name: "upcoming",

  data() {
    upcomingClasses = upcomingClasses.map(clas => {
      clas.locationImage = GmapsUrlConcat(clas.location.coordinates, apiKey);
      return clas;
    });

    return {
      upcomingClasses
    };
  }
};
</script>

<style scoped></style>
