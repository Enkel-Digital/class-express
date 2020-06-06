<template>
  <v-content style="padding: 0;">
    <v-responsive v-if="favouritePartners.length">
      <v-card
        v-for="partner in favouritePartners"
        :key="partner.id"
        class="mx-auto mb-4"
        max-width="calc(100% - 1.6em)"
        outlined
        :ripple="false"
      >
        <v-responsive
          @click="
            $router.push({
              name: 'partner',
              params: { partnerID: partner.id },
            })
          "
        >
          <!-- @todo Change to a image carousel -->
          <v-img id="class-image" :src="partner.pictureSources[0]" />

          <v-list-item>
            <div style="text-align: left;">
              <v-card-title class="headline pl-0">
                {{ partner.name }}
              </v-card-title>

              <v-list-item-subtitle>
                {{ partner.location.address }}
              </v-list-item-subtitle>

              <!-- @todo Add list of categories of classes the partner offers. -->
            </div>
          </v-list-item>
        </v-responsive>

        <v-card-actions>
          <v-spacer />

          <!-- Change this to a remove icon only. Cos dont need to toggle, here means confirm favourites already -->
          <v-btn icon @click="toggleFavouritePartner(partner.id)">
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
    <v-responsive v-else>
      Add partners to your favourites now!
    </v-responsive>
  </v-content>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "favourite-partners",
  created() {
    this.$store.dispatch("classes/getFavouritePartners");
  },
  computed: {
    ...mapGetters("classes", ["favouritePartners"]),
  },
  methods: {
    ...mapActions("classes", ["toggleFavouritePartner"]),
    getPartner(partnerID) {
      return this.$store.state.classes.partners[partnerID];
    },
  },
};
</script>
