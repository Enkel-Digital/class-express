<template>
  <v-content class="reviews">
    <br />
    <v-row>
      <v-col cols="15" sm="6" md="4">
        <h2>Reviews and Ratings of {{ className }} Class</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="15" sm="6" md="4">
        <v-responsive id="reviews-card" class="mx-auto" max-width="400">
          <v-list-item>
            <v-list-item-content>
              <p style="font-size: 20px;">Overall Reviews</p>

              <v-list-item v-for="i in 5" :key="i" class="pe-4 me-4" dense>
                <span v-text="10" class="pe-4" />

                <v-rating
                  :value="5 - (i - 1)"
                  half-increments
                  readonly
                  empty-icon
                  medium
                  dense
                  color="#455A64"
                  style="opacity: 0.7;"
                  class="ma-0 pa-0"
                />
              </v-list-item>
            </v-list-item-content>

            <v-col cols="15" sm="6" md="6">
              <v-list-item-content>
                <v-list-item style="min-height: 0;" class="pe-0 me-0">
                  <span
                    v-text="`${review.ratings} / 5`"
                    class="caption pe-0 me-0"
                  />
                  <v-rating
                    v-model="review.ratings"
                    half-increments
                    readonly
                    empty-icon
                    small
                    dense
                    color="#455A64"
                    style="opacity: 0.7;"
                  />
                </v-list-item>

                <v-list-item-subtitle>
                  across
                  {{ review.numberOfReviews }} reviews
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-list-item>
        </v-responsive>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="15" sm="6" md="4">
        <div v-if="!review">
          Loading
          <!-- Show a loading screen while we load reviews from server -->
        </div>

        <!-- Show total / overall review -->

        <br />
        <div style="color: rgba(0, 0, 0, 0.6); text-align: left;">
          <!--
        Let user know how are the reviews sorted
        Members reviews can be sorted by
        - time
        - stars
          -->
          <i>Sorted by latest first</i>
        </div>
        <v-divider></v-divider>

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
              color="#455A64"
              style="opacity: 0.7;"
            />
            <v-list-item>{{ review.description }}</v-list-item>
          </v-card>
        </v-responsive>
      </v-col>
    </v-row>
    <!-- Change this to use a universal error overlay instead. Moved the logic into script instead of template too. -->
  </v-content>
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
    this.$store.commit("classes/clearUserReview", this.classID);
  },
  data() {
    const className = this.$store.state.classes.classes[this.classID].name;
    console.log("t", className);
    return { className };
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
