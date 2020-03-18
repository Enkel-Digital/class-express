<template>
  <v-content class="ClassDetails">
    <v-responsive id="class-image-container">
      <div style="text-align: left;">
        <BackBtn class="ma-3" />
      </div>

      <v-img id="class-image" :src="clas.pictureSrc" />
    </v-responsive>

    <v-responsive style="text-align: left;">
      <h3 class="headline" v-text="clas.name"></h3>
      <p class="ma-0 pa-0">{{ clas.provider.name }}</p>
      <p class="ma-0 pa-0">{{ clas.location }}</p>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive id="reviews-card" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Reviews</p>

          <v-list-item-subtitle>
            <!-- Do the star icon thing for the reviews -->
            {{ clas.reviews.points }} / 5 from
            {{ clas.reviews.numberOfReviews }} reviews
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-btn text small color="primary">Read them!</v-btn>
      </v-list-item>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive id="reviews-card" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Class Desciption</p>

          <!-- Change to a more readable font -->
          <p>{{ clas.description }}</p>
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <v-divider></v-divider>

    <!-- Embedded Maps  -->

    <!-- put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->

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
import BackBtn from "@/components/BackBtn";

export default {
  name: "ClassDetails",
  components: {
    BackBtn
  },
  data() {
    return {
      clas: {
        id: 12345,
        name: "advance guitar",
        ratings: 3.8, // Ratings out of 5 stars
        classLength: "60", // Store classLength in minutes can show otherwise in hours as needed
        description:
          "Advance guitar lessons taught be the legendary Ichika Mo. Will be going through advanced music scores and includes 1 on 1 trainings for the students, alongside a chance to practice in front of a live audience",
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
