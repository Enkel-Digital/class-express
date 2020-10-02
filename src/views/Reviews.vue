<template>
  <v-main class="reviews">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>{{ name }}</v-toolbar-title>
    </v-app-bar>

    <!-- Change this to use a universal error overlay instead. Moved the logic into script instead of template too. -->
    <div v-if="!review">
      Loading

      <!-- Show a loading screen while we load reviews from server -->
    </div>

    <!-- Show total / overall review -->
    <v-responsive id="reviews-card" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Overall Reviews</p>

          <v-list-item v-for="i in 5" :key="i" class="ma-0 pa-0" dense>
            <span v-text="10" class="caption mr-1 ma-0 pa-0" />

            <v-rating
              :value="5 - (i - 1)"
              half-increments
              readonly
              empty-icon=""
              small
              dense
              color="orange"
              style="opacity: 0.7"
              class="ma-0 pa-0"
            />
          </v-list-item>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item style="min-height: 0" class="ma-0 pa-0">
            <span v-text="`${review.ratings} / 5`" class="caption ma-0 pa-0" />
            <v-rating
              v-model="review.ratings"
              half-increments
              readonly
              empty-icon=""
              small
              dense
              color="orange"
              style="opacity: 0.7"
            />
          </v-list-item>

          <v-list-item-subtitle>
            across {{ review.numberOfReviews }} reviews
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <br />
    <div style="color: rgba(0, 0, 0, 0.6); text-align: left">
      <!--
        Let user know how are the reviews sorted
        Members reviews can be sorted by
        - time
        - stars
      -->
      <i>Sorted by latest first</i>
    </div>
    <v-divider />

    <!-- @todo Do not display at once, load only when scrolled to. -->
    <!-- https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/ -->
    <v-responsive class="mx-auto">
      <v-card
        v-for="(review, i) in review.userReviews"
        :key="i"
        id="reviews-card"
        tile
      >
        <v-rating
          v-model="review.points"
          readonly
          empty-icon=""
          small
          dense
          color="orange"
          style="opacity: 0.7"
        />
        <v-list-item>{{ review.description }}</v-list-item>
      </v-card>
    </v-responsive>
  </v-main>
</template>

<script>
import BackBtn from "@/components/BackBtn";
import { mapState } from "vuex";

export default {
  name: "reviews",
  components: {
    BackBtn,
  },
  // Supports both types of reviews.
  props: ["classID", "partnerID"],
  created() {
    // @todo Update this to support getting reviews of partner
    this.$store.dispatch("classes/getUserReview", { classID: this.classID });
  },
  destroyed() {
    // Although this would be unnecessary if we do not store reviews into persistence state
    // This can still help free up memory by removing userReviews.
    // @todo Update this to support partner reviews
    // this.$store.commit("classes/clearUserReview", this.classID);
  },
  data() {
    return {
      // Name is either className or partnerName depending on which ID is available
      name: this.classID
        ? this.$store.state.classes.classes[this.classID].name
        : this.partnerID
        ? this.$store.state.classes.partners[this.partnerID].name
        : undefined,
    };
  },
  computed: {
    review() {
      return this.$store.state.classes[
        this.classID ? "classReview" : "partnerReview"
      ];
    },
  },
};
</script>

<style scoped>
#class-image {
  max-height: 70vh;
}

#reviews-card {
  text-align: left;
}
</style>
