<template>
  <v-content class="reviews">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>{{ clas.name }}</v-toolbar-title>
    </v-app-bar>

    <!-- Change this to use a universal error overlay instead. Moved the logic into script instead of template too. -->
    <div v-if="!reviewsCorrectlyLoaded">
      Error! Reviews is not correctly loaded
    </div>

    <!-- Show total / overall review -->
    <v-responsive id="reviews-card" class="mx-auto" max-width="400">
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
              style="opacity: 0.7;"
              class="ma-0 pa-0"
            />
          </v-list-item>
        </v-list-item-content>

        <v-list-item-content>
          <v-list-item style="min-height: 0;" class="ma-0 pa-0">
            <span
              v-text="`${clas.review.ratings} / 5`"
              class="caption ma-0 pa-0"
            />
            <v-rating
              v-model="clas.review.ratings"
              half-increments
              readonly
              empty-icon=""
              small
              dense
              color="orange"
              style="opacity: 0.7;"
            />
          </v-list-item>

          <v-list-item-subtitle>
            across {{ clas.review.numberOfReviews }} reviews
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

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

    <!-- @todo Do not display at once, load only when scrolled to. Look at v-img load on scroll for inspiration -->
    <v-responsive class="mx-auto">
      <v-card
        v-for="(review, i) in reviews.memberReviews"
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
          style="opacity: 0.7;"
        />
        <v-list-item>{{ review.description }}</v-list-item>
      </v-card>
    </v-responsive>
  </v-content>
</template>

<script>
import BackBtn from "@/components/BackBtn";

export default {
  name: "reviews",
  components: {
    BackBtn
  },
  data() {
    return {
      clas: {
        id: 12345,
        name: "advance guitar",
        review: {
          ratings: 4.8, // Ratings out of 5 stars
          numberOfReviews: 100
        }
      },
      reviews: {
        id: 12345,
        memberReviews: [
          {
            points: 5,
            description: "Was really fun!"
          },
          {
            points: 5,
            description: "Ichika is a great teacher!"
          },
          {
            points: 4,
            description: "Love the open classroom environment"
          },
          {
            points: 5,
            description: "Was really fun!"
          },
          {
            points: 5,
            description: "Ichika is a great teacher!"
          },
          {
            points: 4,
            description: "Love the open classroom environment"
          },
          {
            points: 5,
            description: "Was really fun!"
          },
          {
            points: 5,
            description: "Ichika is a great teacher!"
          },
          {
            points: 4,
            description: "Love the open classroom environment"
          }
        ]
      }
    };
  },
  computed: {
    reviewsCorrectlyLoaded() {
      return this.clas.id === this.reviews.id;
    }
  }
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
