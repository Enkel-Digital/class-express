<template>
  <v-content class="favourite">
    <!-- <v-app-bar app color="orange lighten-1" flat dark> -->
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold;">
        Favourite Classes
      </v-toolbar-title>
    </v-app-bar>

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
            $router.push({ name: 'ClassDetails', params: { classID: clas.id } })
          "
        >
          <!-- @todo Change to a image carousel -->
          <v-img id="class-image" :src="clas.pictureSources[0]" />

          <v-list-item>
            <div style="text-align: left;">
              <v-card-title class="headline pl-0">
                {{ clas.name }}
              </v-card-title>
              <!-- @todo Add a points box beside the class name -->
              <!-- <p>7 points</p> -->

              <v-list-item-subtitle
                :set="(partner = getPartner(clas.partnerID))"
              >
                <div style="font-weight: bold;">
                  {{ partner.name }}
                </div>
                <div>
                  {{
                    clas.location
                      ? clas.location.address
                      : partner.location.address
                  }}
                </div>
              </v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-responsive>

        <v-card-actions>
          <v-spacer />

          <!-- Change this to a remove icon only. Cos dont need to toggle, here means confirm favourites already -->
          <v-btn icon @click="toggleFavourite(clas.id)">
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
  </v-content>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "favourites",
  computed: {
    ...mapGetters("classes", ["favouriteClasses"])
  },
  methods: {
    ...mapActions("classes", ["toggleFavourite"]),
    getPartner(partnerID) {
      return this.$store.state.classes.partners[partnerID];
    }
  }
};
</script>

<style scoped></style>
