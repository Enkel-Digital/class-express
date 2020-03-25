<template>
  <v-content class="favourite">
    <v-app-bar app color="orange lighten-1" flat dark>
      <v-toolbar-title>Favourite Classes</v-toolbar-title>
    </v-app-bar>

    <br />

    <v-responsive>
      <v-card
        v-for="clas in favouriteClasses"
        :key="clas.className"
        class="mx-auto mb-4"
        max-width="400"
        outlined
        @click="showClass(clas.id)"
      >
        <v-responsive>
          <!-- @todo Change this image to the actual pictures of the classes like those in classDetails instead of the map -->
          <v-img id="class-image" :src="clas.locationImage" />
        </v-responsive>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="headline">{{ clas.className }}</v-card-title>
            <v-card-subtitle>
              {{ moment(clas.time).format("MMMM Do, h:mm") }} to
              {{
                moment(clas.time + Date.parse(clas.classLength)).format(
                  "MMMM Do, h:mm"
                )
              }}
            </v-card-subtitle>

            <v-card-text class="text-left --primary">
              <div>{{ clas.classProvider.name }}</div>
              <div>{{ clas.location.address }}</div>
            </v-card-text>
          </div>
        </div>

        <v-card-actions>
          <!-- @todo Remove this button -->
          <v-btn color="orange" text>Class Details</v-btn>
          <!-- @todo Extract out all share buttons to a common component -->
          <v-btn color="orange" text>Share</v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>
  </v-content>
</template>

<script>
let favouriteClasses = [
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
  name: "favourite",
  data() {
    return {
      favouriteClasses: favouriteClasses.map(clas => {
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
