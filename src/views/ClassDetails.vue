<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>

      <v-btn icon @click="toggleFavourite(clas.id)">
        <v-icon v-if="favouritedClass" color="red">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive id="class-image-container">
      <!-- @todo Change to a image carousel -->
      <v-img id="class-image" :src="clas.pictureSources[0]" />
    </v-responsive>

    <v-responsive style="text-align: left;">
      <h3 class="headline" v-text="clas.name"></h3>
      <p class="ma-0 pa-0">{{ clas.provider.name }}</p>
      <p class="ma-0 pa-0">{{ clas.location.address }}</p>
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

          <v-list-item-subtitle v-else>
            Loading...
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn
          :to="{ name: 'reviews', params: { classID: clas.id } }"
          text
          small
          color="primary"
        >
          Read them!
        </v-btn>
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

    <h2 style="color: rgba(0, 0, 0, 0.65); text-align: left;" class="ma-2 mb-0">
      Getting here
    </h2>
    <MapImage :classID="clas.id" />
    <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->

    <v-divider></v-divider>

    <!-- @todo Add the schdule button to choose / pick a time -->

    <v-divider></v-divider>

    <!-- @todo Change this into a bottom toolbar and make it sticky -->
    <v-container>
      <v-row>
        <v-col>
          <h2 style="color: grey;">{{ clas.points }} points</h2>
        </v-col>

        <v-col>
          <v-btn v-if="isReserved" @click="cancelClass(clas.id)" color="error">
            cancel
          </v-btn>
          <v-btn v-else @click="reserveClass(clas.id)" color="primary">
            reserve
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Perhaps have a similiar classes/partners thing? -->
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
import BackBtn from "@/components/BackBtn";
import MapImage from "@/components/MapImage";

export default {
  name: "ClassDetails",
  components: {
    BackBtn,
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
    return { clas };
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
  },
  methods: {
    ...mapActions("classes", ["toggleFavourite", "reserveClass", "cancelClass"])
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
  max-height: 80vh;
  min-height: 68vh;
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
