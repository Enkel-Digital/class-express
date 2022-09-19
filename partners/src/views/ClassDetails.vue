<template>
  <v-main v-if="clas" class="ClassDetails">
    <v-container fluid>
      <v-row no-gutters>
        <!-- @todo Please label stuff like this. What is this for? -->
        <v-col />

        <!-- Main mobile view column -->
        <v-col>
          <v-card max width="450" elevation="0">
            <h3>*User's mobile app view for Class Details</h3>
          </v-card>

          <v-card max width="450">
            <!-- @todo Implement carousel to show all class images -->
            <!-- <v-carousel height="400">
              <v-carousel-item
                v-for="(pictureSrc, i) in classDetails.pictureSources"
                :key="i"
                :src="pictureSrc"
                reverse-transition="fade-transition"
                transition="fade-transition"
              />
            </v-carousel> -->
            <v-img :src="clas.pictureSources" />
          </v-card>

          <v-card max width="450" class="my-2">
            <v-responsive style="text-align: left" class="mx-4 pa-0">
              <v-row>
                <v-col>
                  <h3 class="headline" v-text="clas.name" />
                  <p>{{ clas.location_address }}</p>
                </v-col>
              </v-row>
            </v-responsive>

            <v-divider />

            <v-responsive v-if="review" id="reviews-card" class="mx-auto">
              <v-list-item>
                <v-list-item-content>
                  <p class="overline">
                    Reviews based on {{ review.numberOfReviews }} reviews
                  </p>

                  <v-list-item-subtitle v-if="review.numberOfReviews">
                    <!-- Do the star icon thing for the reviews -->
                    <v-rating
                      :value="4"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    />
                    {{ review.ratings }} / 5 based on
                    {{ review.numberOfReviews }} reviews
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-btn
                  :to="{
                    name: 'reviews',
                    params: { classID: this.classID },
                  }"
                  text
                  small
                  color="primary"
                >
                  Read them!
                </v-btn>
              </v-list-item>
            </v-responsive>

            <v-divider />

            <v-responsive id="reviews-card" class="mx-auto">
              <v-list-item>
                <v-list-item-content>
                  <p class="overline">Class Desciption</p>

                  <!-- Change to a more readable font -->
                  <span v-html="clas.description" />
                </v-list-item-content>
              </v-list-item>
            </v-responsive>
          </v-card>

          <v-card width="450">
            <h2
              style="color: rgba(0, 0, 0, 0.65); text-align: left"
              class="ma-2 mb-0"
            >
              Getting here
            </h2>

            <MapImage :classID="clas.id" />
            <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->
          </v-card>
        </v-col>

        <!-- Icon list column -->
        <v-col>
          <div class="text-left ma-2">
            <!-- Edit class -->
            <v-btn class="ma-2" small outlined fab color="success">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-spacer />

            <!-- @todo Is this for delete class? -->
            <v-btn class="ma-2" small outlined fab color="success">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>

            <v-spacer />

            <!-- @todo Copy class sharing link into clipboard  -->
            <v-btn class="ma-2" small outlined fab color="success">
              <v-icon>mdi-share</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import MapImage from "@/components/MapImage";
import api from "../store/utils/fetch";
import unixseconds from "unixseconds";
import { mapState, mapActions } from "vuex";

import getClassMixin from "../utils/getClassMixin";

/*
  @todo SHOULD THIS be an iframe instead?
  @todo Iframe with supporting controls/edit buttons at the side?
*/

export default {
  name: "ClassDetails",

  components: {
    MapImage,
  },

  mixins: [getClassMixin],

  created() {
    this.$store.dispatch("classes/getReview", this.classID);
  },

  props: ["classID", "selectedTime"],

  methods: {
    ...mapActions("classes", ["cancelClass"]),
  },

  computed: {
    ...mapState("partner", ["partner"]),
    ...mapState("classes", ["review"]),
    dateObject() {
      return this.selectedTime
        ? this.moment.unix(parseInt(this.selectedTime))
        : undefined;
    },
    clas() {
      return this.$store.state.classes.classes[this.classID];
    },
  },
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
