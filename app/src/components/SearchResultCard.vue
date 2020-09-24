<template>
  <!-- @todo Handle cases where sometimes classID sometimes partnerID -->
  <v-card
    v-if="item"
    @click="
      $router.push({
        name: 'ClassDetails',
        params: { classID: item.classID },
      })
    "
    class="mx-auto"
    width="calc(100% - 1.2em)"
    style="margin-bottom: 0.5em"
    outlined
    :ripple="false"
  >
    <v-row class="">
      <v-col class="pa-0 pl-3">
        <!-- Height set to 100% to scale the image to cover the entire column, regardless of how long the other column is! -->
        <v-img
          height="100%"
          aspect-ratio="1"
          :src="item.pictureSources"
          style="border-radius: 0.2em 0 0 0.2em"
        />
      </v-col>

      <v-col class="pr-6" style="text-align: left">
        <ais-highlight :hit="item" attribute="name" />
        <hr />

        <!-- @todo For the description might want to crop it here or the backend to limit the character length to
            prevent this from being too long and blocking everyone else out and over stretching the image-->
        <ais-highlight
          :hit="item"
          attribute="description"
          style="font-size: 0.9em"
        />
        <!-- <p><ais-highlight :hit="item" attribute="description" /></p> -->
        <hr />

        <!-- {{ item.provider?.name }} -->
        <!-- <hr /> -->

        <p style="font-size: 0.8em">At: {{ item.location_address }}</p>

        <div class="float-right pb-0">
          <!-- @todo what about partnerIDs? -->
          <!-- Must remember to load fav classes first -->
          <v-btn icon @click="toggleFavouriteClass(clas.id)">
            <v-icon v-if="isFavourite" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>

          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn small icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { AisHighlight } from "vue-instantsearch";

export default {
  name: "SearchResultCard",
  props: ["item"],
  components: {
    AisHighlight,
  },
  computed: {
    isFavourite() {
      return this.$store.state.classes.favouriteClassesIDs.find(
        // Using parseInt on classID as it is a URL param prop passed in as a string via vue router
        (classID) => classID === parseInt(this.item.classID)
      );
    },
  },
};
</script>
