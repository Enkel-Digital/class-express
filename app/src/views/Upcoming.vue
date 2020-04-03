<template>
  <v-content class="upcoming">
    <v-app-bar app color="orange lighten-1" flat dark>
      <v-toolbar-title>Upcoming Classes</v-toolbar-title>
    </v-app-bar>

    <br />

    <v-responsive>
      <v-card
        v-for="clas in upcomingClasses"
        :key="clas.className"
        class="mx-auto mb-4"
        max-width="400"
        outlined
        :ripple="false"
      >
        <v-responsive @click="showClass(clas.id)">
          <v-img id="class-image" :src="clas.locationImage" />

          <v-list-item>
            <div style="text-align: left;">
              <v-card-title class="headline pl-0">
                {{ clas.className }}
              </v-card-title>
              <!-- @todo Add a points box beside the class name -->
              <!-- <p>7 points</p> -->

              <v-list-item-subtitle style="font-weight: bold;">
                {{ moment(clas.time).format("MMMM Do, h:mm") }} to
                {{
                  moment(clas.time + Date.parse(clas.classLength)).format(
                    "MMMM Do, h:mm"
                  )
                }}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <div>{{ clas.classProvider.name }}</div>
                <div>{{ clas.location.address }}</div>
              </v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-responsive>

        <v-card-actions>
          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn icon @click="toggleFavourite(clas.id)">
            <v-icon v-if="clas.favouritedClass" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-calendar-today</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>
  </v-content>
</template>

<script>
let upcomingClasses = [
  {
    id: 0,
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
    id: 1,
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
    "&zoom=17&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C",
    coordinates,
    "&key=",
    key
  );

export default {
  name: "upcoming",
  data() {
    return {
      upcomingClasses: upcomingClasses.map(clas => {
        clas.locationImage = GmapsUrlConcat(clas.location.coordinates, apiKey);
        return clas;
      })
    };
  },
  methods: {
    // @todo Redirect to class details page?
    showClass(classID) {
      console.log("requested to show class: ", classID);
    }
  }
};
</script>

<style scoped></style>
