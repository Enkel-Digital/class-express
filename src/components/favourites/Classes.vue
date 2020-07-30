<template>
  <v-main style="padding: 0;">
    <v-responsive v-if="favouriteClasses.length">
      <v-card
        v-for="clas in favouriteClasses"
        :key="clas.id"
        class="mx-auto mb-4"
        max-width="calc(100% - 1.6em)"
        outlined
        :ripple="false"
      >
        <v-responsive
          @click="
            $router.push({
              name: 'ClassDetails',
              params: { classID: clas.id },
            })
          "
        >
          <!-- @todo Update API to return an array from DB and Change to a image carousel -->
          <!-- <v-img id="class-image" :src="clas.pictureSources[0]" /> -->
          <v-img id="class-image" :src="clas.pictureSources" />

          <v-list-item>
            <div style="text-align: left;">
              <v-card-title class="headline pl-0">
                {{ clas.name }}
              </v-card-title>
              <!-- @todo Add a points box beside the class name -->
              <!-- <p>7 points</p> -->

              <!--
                v-if as render gaurd to ensure partner is loaded
                v-binded set attribute used to set partner into local template context to use directly
               -->
              <v-list-item-subtitle
                v-if="partners[clas.partnerID]"
                :set="(partner = partners[clas.partnerID])"
              >
                <div style="font-weight: bold;">
                  {{ partner.name }}
                </div>
                <div>
                  {{ clas.location_address || partner.location_address }}
                </div>
              </v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-responsive>

        <v-card-actions>
          <v-spacer />

          <!-- Change this to a remove icon only. Cos dont need to toggle, here means confirm favourites already -->
          <v-btn icon @click="toggleFavouriteClass(clas.id)">
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
      Add classes to your favourites now!
    </v-responsive>
  </v-main>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "favourite-classes",
  created() {
    this.$store.dispatch("classes/getFavourites");
  },
  computed: {
    ...mapGetters("classes", ["favouriteClasses"]),
    // @todo update this to do in computed as a standalone method
    ...mapState("classes", ["partners"]),
  },
  watch: {
    // Watcher to load partner details of favourited classes whenever favouriteClasses is loaded or updated
    favouriteClasses: {
      immediate: true,
      handler() {
        this.$store.dispatch(
          "classes/getPartner",
          this.favouriteClasses.map((clas) => clas.partnerID)
        );
      },
    },
  },
  methods: {
    ...mapActions("classes", ["toggleFavouriteClass"]),
  },
};
</script>
