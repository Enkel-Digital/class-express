<template>
  <v-content class="ClassDetails">
    <v-card outlined>
      <v-responsive id="class-image" size="125" tile>
        <v-img :src="clas.pictureSrc"></v-img>
      </v-responsive>

      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title class="headline" v-text="clas.name"></v-card-title>

          <v-card-subtitle v-text="clas.provider.name"></v-card-subtitle>

          <v-card-text v-text="clas.location"></v-card-text>
        </div>
      </div>
    </v-card>

    <!-- Replace the card with the section thing -->
    <v-card id="reviews-card" class="mx-auto" max-width="344">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Reviews</p>

          <v-list-item-subtitle>
            <!-- Points period ends on: {{ periodEndDate }} -->
            <!-- Do the star icon thing for the reviews -->
            {{ clas.reviews.points }} / 5 from
            {{ clas.reviews.numberOfReviews }} reviews
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn text small color="primary">Read them!</v-btn>
      </v-list-item>
    </v-card>

    <!-- Embedded Maps  -->

    <!-- how to get there -> Descriptions provided by the partner -->

    <!-- Perhaps have a similiar partners thing? -->
  </v-content>
</template>

<script>
/**
 * This screen can be for both Class Details screen for the class in general, or a particular class date.
 * 1 with and 1 without the date set.
 *
 * view timing bar vs reserve class bar.
 */

export default {
  name: "ClassDetails",
  components: {
    // BackBtn
  },
  data() {
    return {
      clas: {
        name: "advance guitar",
        ratings: 3.8, // Ratings out of 5 stars
        classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
        description: "Advance guitar lessons taught be the legendary Ichika Mo",
        reviews: {
          points: 4.8,
          numberOfReviews: 100
        },
        provider: {
          name: "Guitar Studio 2", // Name of the provider
          id: 123,
          description: "We offer world class guitar lessons for you!"
        },
        location: "Orchard road", // Location Coordinates so we can show on a Map insert
        pictureSrc:
          "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
      }
    };
  },
  methods: {}
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
