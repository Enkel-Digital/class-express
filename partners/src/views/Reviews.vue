<template>
  <v-main class="reviews">
    <br />

    <h2 class="text-center">Reviews and Ratings of {{ className }} Class</h2>
    <v-row no-gutters>
      <v-col :cols="3">
        <v-responsive id="reviews-card">
          <v-list-item>
            <v-list-item-content>
              <p style="font-size: 20px">Overall Reviews</p>
              <v-list-item-content class="pa-0">
                <v-list-item style="min-height: 0" class="pa-0">
                  <v-rating
                    v-model="review.ratings"
                    half-increments
                    readonly
                    small
                    dense
                    color="amber"
                    style="opacity: 0.7"
                  />
                  <span v-text="`${review.ratings} out of 5`" class="caption" />
                </v-list-item>

                <v-list-item-subtitle>
                  across
                  {{ review.numberOfReviews }} reviews
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item v-for="i in 5" :key="i" class="pe-4 me-4" dense>
                <span v-text="10" class="pe-4" />

                <v-rating
                  :value="5 - (i - 1)"
                  half-increments
                  readonly
                  empty-icon
                  medium
                  dense
                  color="amber"
                  style="opacity: 0.7"
                  class="ma-0 pa-0"
                />
              </v-list-item>
            </v-list-item-content>
          </v-list-item>
        </v-responsive>
      </v-col>
      <v-col :cols="9">
        <div v-if="!review">
          Loading
          <!-- Show a loading screen while we load reviews from server -->
        </div>

        <!-- Show total / overall review -->

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
              empty-icon
              small
              dense
              color="amber"
              style="opacity: 0.7"
            />
            <v-list-item>{{ review.description }}</v-list-item>
          </v-card>
        </v-responsive>
      </v-col>
    </v-row>

    <!-- Change this to use a universal error overlay instead. Moved the logic into script instead of template too. -->
  </v-main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "reviews",
  components: {},
  props: ["classID"],
  created() {
    this.$store.dispatch("classes/getUserReview", this.classID);
  },
  destroyed() {
    // Although this would be unnecessary if we do not store reviews into persistence state
    // This can still help free up memory by removing userReviews.
    // Should we clear? Cos if they come right back in, the data is loaded again
    // this.$store.commit("classes/clearUserReview", this.classID);
  },
  data() {
    return { className: this.$store.state.classes.classes[this.classID].name };
  },
  computed: {
    ...mapState("classes", ["review"]),
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
