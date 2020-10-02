<template>
  <!-- @todo Change clas && partner v-if gaurd -->
  <!-- @todo show loading action either with something on v-else or with loader -->
  <v-main v-if="clas && partner" id="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>

      <v-btn icon @click="toggleFavouriteClass(clas.id)">
        <v-icon v-if="isFavourite" color="red">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive id="class-image-container">
      <!-- @todo Update API to return an array from DB and Change to a image carousel -->
      <!-- <v-img id="class-image" :src="clas.pictureSources[0]" /> -->
      <v-img id="class-image" :src="clas.pictureSources" />
    </v-responsive>

    <v-responsive style="margin: 1em">
      <h3 class="headline" v-text="clas.name" />

      <v-row v-if="selectedTime">
        <v-col class="col-auto" style="font-weight: bold">
          <!-- date of class -->
          <v-list-item-subtitle>
            <!-- Show year only if class is next year. -->
            <span v-if="moment().year() === dateObject.year()">
              {{ dateObject.format("dddd, MMM D") }}
            </span>
            <span v-else>
              {{ dateObject.format("dddd, MMM D YYYY") }}
            </span>
          </v-list-item-subtitle>

          <!-- time of class -->
          <v-list-item-subtitle>
            {{ dateObject.format("h:mm a") }} -
            {{
              dateObject.clone().add(clas.length, "minutes").format("h:mm a")
            }}
          </v-list-item-subtitle>

          <!-- Instructor name if any -->
          <span v-if="clas.instructorName">{{ clas.instructorName }} </span>
        </v-col>

        <v-spacer />

        <v-col class="col-auto mt-2">
          <!-- @todo Implement add to calendar feature -->
          <v-btn icon>
            <v-icon large>mdi-calendar-today</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>

    <v-divider />

    <v-list-item
      :to="{ name: 'partner', params: { partnerID: clas.partnerID } }"
    >
      <v-list-item-content>
        <p class="ma-0 mb-2 pa-0" style="font-weight: bold">
          {{ partner.name }}
        </p>
        <p class="ma-0 pa-0">
          {{ clas.location_address || partner.location_address }}
        </p>
      </v-list-item-content>

      <v-icon x-large>mdi-chevron-right</v-icon>
    </v-list-item>

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
          :to="{ name: 'reviews-class', params: { classID: clas.id } }"
          text
          small
          color="primary"
        >
          Read them!
        </v-btn>
      </v-list-item>
    </v-responsive>

    <v-divider />

    <v-responsive class="mx-auto">
      <v-list-item>
        <v-list-item-content class="mb-0 pb-0">
          <p class="overline">about this class</p>

          <br />

          <!-- @todo Change to a more readable font -->
          <span v-html="clas.description" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-divider />
      </v-list-item>

      <v-list-item>
        <v-list-item-content class="mt-0 pt-0">
          <p class="overline">about our partner</p>

          <br />

          <!-- @todo Change to a more readable font -->
          <span v-html="partner.description" />
        </v-list-item-content>
      </v-list-item>
    </v-responsive>

    <h2 style="color: rgba(0, 0, 0, 0.65)" class="ma-2 mb-0">Getting here</h2>
    <MapImage :classID="clas.id" />
    <!-- @todo put how to get there right below Embedded maps, in the same block -> Descriptions provided by the partner -->

    <v-divider />

    <!-- @todo Change this into a bottom toolbar and make it sticky -->
    <v-container v-if="selectedTime" style="text-align: center">
      <v-row>
        <v-col>
          <h2 style="color: grey">{{ clas.points }} points</h2>
        </v-col>

        <v-col>
          <!-- @todo Update cancelClass action and update how it is called to pass in the selected time too -->
          <v-btn
            v-if="isReserved"
            @click="cancelClass({ classID: clas.id, selectedTime })"
            color="error"
          >
            cancel
          </v-btn>
          <v-btn
            v-else
            @click="reserveClass({ classID: clas.id, selectedTime })"
            color="primary"
          >
            reserve
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else style="text-align: center">
      <v-btn
        :to="{ name: 'schedule-class', params: { classID: clas.id } }"
        color="primary"
        block
      >
        view schedule
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
  name: "ClassDetails",
  components: {
    BackBtn,
    MapImage,
  },
  mixins: [getClassAndPartnerMixin],
  created() {
    // Call action to fetch review of this class
    this.$store.dispatch("classes/getReview", { classID: this.classID });
  },
  /*
    @todo Run prop validation against data/server to ensure selected time is valid.
    kick off an async check, can run it in created or mounted hook too then if async check failed and the selected time for lesson is wrong
    throw an error that shows on either error dialog or notification to say that this does not exist and redirect user away from that.
  */
  props: ["classID", "selectedTime"],
  // @todo Generate calendar invite link for add to calendar button
  computed: {
    dateObject() {
      // Using parseInt for the prop that is received via the router, as they will always be of type string
      return this.selectedTime
        ? this.moment.unix(parseInt(this.selectedTime))
        : undefined;
    },
    clas() {
      return this.$store.state.classes.classes[this.classID];
    },
    partnerID() {
      // Null coalescing to prevent failure when clas is still being loaded and is undefined
      return this.clas?.partnerID;
    },
    partner() {
      return this.$store.state.classes.partners[this.partnerID];
    },
    isFavourite() {
      return this.$store.state.classes.favouriteClassesIDs.find(
        // Using parseInt on classID as it is a URL param prop passed in as a string via vue router
        (classID) => classID === parseInt(this.classID)
      );
    },
    // @todo Possible to make a new API to get what is the reserved class if any of this classID and userID
    // Add a check to see if selected time is a valid time for the class
    isReserved() {
      // Cannot determine if there is a reserved class if no selectedTime is passed in
      // Cannot determine time if class object is not loaded yet as we need length of class
      if (!this.selectedTime || !this.clas) return false;

      // Return userClass object if there is any that matches the classID and selectedTime props
      return this.$store.state.classes.userClasses.find(
        (userClass) =>
          // Using parseInt on classID and selectedTime as they are URL param props passed in as strings via vue router
          // Using parseInt on userClass.startTime, because this data is stored as a BigInt type on the DB which is a string on read
          userClass.classID === parseInt(this.classID) &&
          parseInt(userClass.startTime) === parseInt(this.selectedTime)
      );
    },
    review() {
      return this.$store.state.classes.classReview;
    },
  },
  methods: {
    ...mapActions("classes", [
      "toggleFavouriteClass",
      "reserveClass",
      "cancelClass",
    ]),
  },
};
</script>

<style scoped>
#ClassDetails {
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
