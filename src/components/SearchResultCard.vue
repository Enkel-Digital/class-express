<template>
  <!-- @todo Handle cases where sometimes classID sometimes partnerID -->
  <v-card
    v-if="item"
    class="mx-auto"
    width="calc(100% - 1.2em)"
    style="margin-bottom: 0.5em"
    outlined
    :ripple="false"
  >
    <v-row>
      <!-- Clicking on the image brings you to the details page -->
      <v-col class="pa-0 pl-3" @click="gotoDetails(item.classID)">
        <!-- Height set to 100% to scale the image to cover the entire column, regardless of how long the other column is! -->
        <v-img
          height="100%"
          aspect-ratio="1"
          :src="item.pictureSources"
          style="border-radius: 0.2em 0 0 0.2em"
        />
      </v-col>

      <v-col class="pr-6" style="text-align: left">
        <!-- Clicking on the section of words excluding the buttons section brings you to the details page -->
        <div @click="gotoDetails(item.classID)">
          <ais-highlight :hit="item" attribute="name" />
          <hr />

          <ais-highlight
            :hit="item"
            attribute="description"
            style="font-size: 0.9em"
          />
          <hr />

          <!-- @todo Maybe show the _tags? -->
          <!-- {{ item.provider?.name }} -->
          <!-- <hr /> -->

          <p style="font-size: 0.8em">At: {{ item.location_address }}</p>
        </div>

        <div class="float-right pb-0">
          <!-- @todo Must remember to load fav classes first -->
          <v-btn
            icon
            v-if="item.classID"
            @click="toggleFavouriteClass(item.classID)"
          >
            <v-icon v-if="isFavourite" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            v-else-if="item.partnerID"
            @click="toggleFavouritePartner(item.partnerID)"
          >
            <v-icon v-if="isFavourite" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>
          <!-- No v-else here, as it can be assumed that the search item will always either have a classID or partnerID -->

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
import { mapActions } from "vuex";
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
  methods: {
    ...mapActions("classes", [
      "toggleFavouriteClass",
      "toggleFavouritePartner",
    ]),
    // Accepts an ID that can either be a classID or partnerID, depending on whether this search result is a class or partner
    gotoDetails(id) {
      // Checking for classID first, as every class have a partnerID but no partner have a classID
      if (this.item.classID)
        this.$router.push({
          name: "ClassDetails",
          params: { classID: id },
        });
      else if (this.item.partnerID)
        this.$router.push({
          name: "partner",
          params: { partnerID: id },
        });
      else throw new Error("Search Item missing both classID and partnerID");
    },
  },
};
</script>
