<template>
  <v-main id="partner" v-if="partner">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>

      <v-btn icon @click="toggleFavouritePartner(partner.id)">
        <v-icon v-if="isFavourite" color="red">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive id="class-image-container">
      <!-- @todo Update API to return an array from DB and Change to a image carousel -->
      <!-- <v-img id="class-image" :src="partner.pictureSources[0]" /> -->
      <v-img id="class-image" :src="partner.pictureSources" />
    </v-responsive>

    <v-responsive style="margin: 1em">
      <h3 class="headline" v-text="partner.name" />
      <p class="ma-0 pa-0">{{ partner.location_address }}</p>
    </v-responsive>

    <v-divider />

    <v-responsive class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Reviews</p>

          <v-list-item-subtitle v-if="review">
            <div v-if="review.ratings">
              <!-- @todo Do the star icon thing for the reviews -->
              {{ review.ratings }} / 5 based on
              {{ review.numberOfReviews }} reviews
            </div>

            <!-- If no review, like no attendance, show no review -->
            <div v-else>No reviews yet!</div>
          </v-list-item-subtitle>

          <v-list-item-subtitle v-else> Loading... </v-list-item-subtitle>
        </v-list-item-content>

        <!-- Only show btn if reviews loaded and there are reviews -->
        <v-btn
          v-if="review && review.ratings"
          :to="{ name: 'reviews-partner', params: { partnerID: partner.id } }"
          text
          small
          color="primary"
        >
          Read them!
        </v-btn>
      </v-list-item>
    </v-responsive>

    <v-divider />

    <!-- @todo Show a list of categories that this class operates in -->

    <v-responsive class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">About Us</p>

          <!-- @todo Change to a more readable font -->
          <span v-html="partner.description" />
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <h2 style="color: rgba(0, 0, 0, 0.65)" class="ma-2 mb-0">Getting here</h2>
    <MapImage :partnerID="partner.id" />
    <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->

    <v-divider />

    <!-- @todo Change this into a bottom toolbar and make it sticky -->
    <v-container>
      <!-- Both buttons have the same width and same margin to make them align on the sides -->
      <!-- <v-btn
        :to="{ name: 'schedule-partner', params: { partnerID: partner.id } }"
        color="primary"
        width="calc(50% - 1em)"
        style="margin: 0.5em"
      > -->
      <!-- @todo Fix partner schedule and set the button right -->
      <v-btn
        @click="
          alert(
            'This feature is still not available yet, check back in our Beta Launch!'
          )
        "
        color="primary"
        width="calc(50% - 1em)"
        style="margin: 0.5em"
      >
        view schedule
      </v-btn>

      <v-btn
        :to="{ name: 'partner-classes', params: { partnerID: partner.id } }"
        color="primary"
        width="calc(50% - 1em)"
        style="margin: 0.5em"
      >
        <!-- Show the number of classes this partner have too -->
        classes ({{ partner.classes.length }})
      </v-btn>
    </v-container>

    <!-- @todo Perhaps have a similiar classes/partners thing? -->
  </v-main>
</template>

<script>
import { mapActions } from "vuex";
import BackBtn from "@/components/BackBtn";
import MapImage from "@/components/MapImage";

import getClassAndPartnerMixin from "../utils/getClassAndPartnerMixin";

export default {
  name: "partner",
  components: {
    BackBtn,
    MapImage,
  },
  mixins: [getClassAndPartnerMixin],
  created() {
    // Call action to fetch review for this partner
    this.$store.dispatch("classes/getReview", { partnerID: this.partnerID });
  },
  // @todo Remove after Partner schedule button is implemented
  data() {
    return { alert: (msg) => window.alert(msg) };
  },
  props: ["partnerID"],
  computed: {
    partner() {
      return this.$store.state.classes.partners[this.partnerID];
    },
    isFavourite() {
      return this.$store.state.classes.favouritePartnersIDs.find(
        // Using parseInt on partnerID as it is a URL param prop passed in as a string via vue router
        (partnerID) => partnerID === parseInt(this.partnerID)
      );
    },
    review() {
      return this.$store.state.classes.partnerReview;
    },
  },
  methods: mapActions("classes", ["toggleFavouritePartner"]),
};
</script>

<style scoped>
#partner {
  text-align: left;
}

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
</style>
