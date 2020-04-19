<template>
  <v-content class="ClassDetails">
    <v-responsive id="class-image-container">
      <!-- @todo Change to a image carousel -->
      <v-img id="class-image" :src="clas.pictureSources[0]" />
    </v-responsive>
    <p>test</p>
    <v-responsive style="text-align: left;">
      <v-row>
        <v-col>
          <h3 class="headline" v-text="clas.name"></h3>
          <p class="ma-0 pa-0">{{ clas.provider.name }}</p>
          <p class="ma-0 pa-0">{{ clas.location.address }}</p>
        </v-col>

        <v-spacer />

        <v-col>
          <!-- @todo Implement sharing dialog popup  -->
          <v-btn icon>
            <v-icon>mdi-share</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive id="reviews-card" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Reviews</p>

          <v-list-item-subtitle v-if="review">
            <!-- Do the star icon thing for the reviews -->
            {{ review.ratings }} / 5 based on
            {{ review.numberOfReviews }} reviews
          </v-list-item-subtitle>

          <v-list-item-subtitle v-else>Loading...</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn
          :to="{ name: 'reviews', params: { classID: clas.id } }"
          text
          small
          color="primary"
        >Read them!</v-btn>
      </v-list-item>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive id="reviews-card" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Class Desciption</p>

          <!-- Change to a more readable font -->
          <span v-html="clas.description"></span>
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <h2 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ma-2 mb-0">Getting here</h2>
    <MapImage :classID="clas.id" />
    <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->
  </v-content>
</template>

<script>
/**
 * This screen can be for both Class Details screen for the class in general, or a particular class date.
 * 1 with and 1 without the date set.
 *
 * view timing bar vs reserve class bar.
 */
import { mapActions } from "vuex";
import MapImage from "@/components/MapImage";

export default {
  name: "ClassDetails",
  components: {
    MapImage
  },
  created() {
    // Call action to fetch review of this class
    this.$store.dispatch("classes/getReview", this.classID);
  },
  props: ["classID"],
  data() {
    // Classes is static via the data function as we do not want its reactivity
    const clas = this.$store.state.classes.classes[this.classID];
    return { clas, classTimeSelected: true };
  },
  computed: {
    favouritedClass() {
      if (this.$store.state.classes.favouriteClassesID[this.classID])
        return true;
      else return false;
    },
    isReserved() {
      const upcomingClass = this.$store.state.classes.upcomingClassesID[
        this.classID
      ];

      // If there is a booking for this class, check if there is a booking for this timeslot
      if (upcomingClass) {
        // @todo Check for timeslot. Right now, assumes that there is only 1 session for the class thus return true

        return true;
      } else return false;
    },
    review() {
      return this.$store.state.classes.review;
    }
  }
};
</script>

<style scoped>
#class-image-container {
  /*
    General height guidelines for the image loaded
    Max height is used to prevent the image being used to be too big
    Min height ensures image will not collapse on itself into the height of the back button
  */
  /* max-height: 80vh; */
  min-height: 100%;
}

/* Move image up to upper corners of screen, so back button is overlayed on top */
#class-image {
  display: block;
  position: absolute;
  top: 0vh;
  right: 0vw;

  /* Map image to height of entire parent div container */
  height: 100%;
}

#reviews-card {
  text-align: left;
}
</style>
