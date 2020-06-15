<template>
  <v-content
    id="partner"
    v-if="partner"
    v-touch="{ right: () => $router.back() }"
  >
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>

      <!-- @todo Update to use toggleFavouritePartner -->
      <v-btn icon @click="toggleFavouritePartner(partner.id)">
        <v-icon v-if="favourited" color="red">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive id="class-image-container">
      <!-- @todo Change to a image carousel -->
      <v-img id="class-image" :src="partner.pictureSources[0]" />
    </v-responsive>

    <v-responsive style="margin: 1em;">
      <h3 class="headline" v-text="partner.name" />
      <p class="ma-0 pa-0">{{ partner.location.address }}</p>
    </v-responsive>

    <v-divider />

    <v-responsive class="mx-auto">
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

        <!-- @todo Temporarily hidden till implemented -->
        <v-btn
          v-if="false"
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

    <h2 style="color: rgba(0, 0, 0, 0.65);" class="ma-2 mb-0">
      Getting here
    </h2>
    <MapImage :partnerID="partner.id" />
    <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->

    <v-divider />

    <!-- @todo Change this into a bottom toolbar and make it sticky -->
    <v-container>
      <!-- Change this to the button that goes to the partners schedule instead of just that of a class -->
      <v-btn
        :to="{ name: 'schedule-partner', params: { partnerID: partner.id } }"
        color="primary"
        block
      >
        view schedule
      </v-btn>
    </v-container>

    <!-- Perhaps have a similiar classes/partners thing? -->
  </v-content>
</template>

<script>
import { Touch } from "vuetify/lib/directives";
import { mapActions } from "vuex";
import BackBtn from "@/components/BackBtn";
import MapImage from "@/components/MapImage";

import getClassAndPartnerMixin from "../utils/getClassAndPartnerMixin";

export default {
  name: "partner",
  directives: {
    Touch,
  },
  components: {
    BackBtn,
    MapImage,
  },
  mixins: [getClassAndPartnerMixin],
  created() {
    // @todo Implement this to stop using getReview as that is for the classes' reviews
    // Call action to fetch review for this partner
    // this.$store.dispatch("classes/getReview", this.partnerID);
  },
  props: ["partnerID"],
  computed: {
    partner() {
      return this.$store.state.classes.partners[this.partnerID];
    },
    favourited() {
      if (this.$store.state.classes.favouritePartners[this.partnerID])
        return true;
      else return false;
    },
    review() {
      return false;

      // @todo Change this to be partner reviews.
      // return this.$store.state.classes.review;
    },
  },
  methods: {
    ...mapActions("classes", ["toggleFavouritePartner"]),
  },
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
