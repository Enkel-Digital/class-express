<template>
  <v-main style="padding: 0">
    <v-responsive v-if="favouritePartnersIDs.length">
      <v-card
        v-for="favouritePartnersID in favouritePartnersIDs"
        :key="favouritePartnersID"
        class="mx-auto mb-4"
        max-width="calc(100% - 1.6em)"
        outlined
        :ripple="false"
      >
        <div
          v-if="partners[favouritePartnersID]"
          :set="(partner = partners[favouritePartnersID])"
          @click="
            $router.push({
              name: 'partner',
              params: { partnerID: favouritePartnersID },
            })
          "
        >
          <!-- @todo Update API to return an array from DB and Change to a image carousel -->
          <!-- <v-img id="class-image" :src="partner.pictureSources[0]" /> -->
          <v-img id="class-image" :src="partner.pictureSources" />

          <v-list-item>
            <div style="text-align: left">
              <v-card-title class="headline pl-0">
                {{ partner.name }}
              </v-card-title>

              <v-list-item-subtitle>
                {{ partner.location_address }}
              </v-list-item-subtitle>

              <!-- @todo Add list of categories of classes the partner offers. -->
            </div>
          </v-list-item>
        </div>

        <v-card-actions>
          <v-spacer />

          <!-- Using favouritePartnersID instead of partner.id because this is outside of the div where "partner" property is set -->
          <v-btn icon @click="toggleFavouritePartner(favouritePartnersID)">
            <v-icon color="red">mdi-heart</v-icon>
          </v-btn>

          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>

    <!-- @todo Add copywriting for users to add classes if they have no favourite classes -->
    <v-responsive v-else> Add partners to your favourites now! </v-responsive>
  </v-main>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "favourite-partners",
  created() {
    this.$store.dispatch("classes/getFavourites");
  },
  computed: {
    ...mapState("classes", ["favouritePartnersIDs"]),
    ...mapState("classes", ["partners"]),
  },
  methods: {
    ...mapActions("classes", ["toggleFavouritePartner"]),
  },
};
</script>
