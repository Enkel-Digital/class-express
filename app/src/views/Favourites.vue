<template>
  <v-content class="favourite">
    <v-app-bar app color="orange lighten-1" flat dark>
      <v-toolbar-title>Favourite Classes</v-toolbar-title>
    </v-app-bar>

    <br />

    <v-responsive v-if="favouriteClasses.length">
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

    <!-- @todo Add copywriting for users to add classes if they have no favourite classes -->
    <v-responsive v-else>
      Add classes to your favourites now!
    </v-responsive>
  </v-content>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "favourites",
  computed: {
    ...mapGetters("classes", ["favouriteClasses"])
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
