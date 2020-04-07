<template>
  <v-content class="upcoming">
    <v-app-bar app color="orange lighten-1" flat dark>
      <v-toolbar-title>Upcoming Classes</v-toolbar-title>
    </v-app-bar>

    <br />

    <v-responsive v-if="upcomingClasses.length">
      <v-card
        v-for="clas in upcomingClasses"
        :key="clas.id"
        class="mx-auto mb-4"
        max-width="400"
        outlined
        :ripple="false"
      >
        <MapImage :src="clas.locationImage" :classID="clas.id" />

        <v-responsive
          @click="
            $router.push({ name: 'ClassDetails', params: { classID: clas.id } })
          "
        >
          <v-list-item>
            <div style="text-align: left;">
              <v-card-title class="headline pl-0">
                {{ clas.name }}
              </v-card-title>
              <!-- @todo Add a points box beside the class name -->
              <!-- <p>7 points</p> -->

              <v-list-item-subtitle style="font-weight: bold;">
                {{ moment(clas.time).format("MMMM Do, h:mm") }} to
                {{
                  moment(clas.time + Date.parse(clas.length)).format(
                    "MMMM Do, h:mm"
                  )
                }}
              </v-list-item-subtitle>

              <v-list-item-subtitle>
                <div>{{ clas.provider.name }}</div>
                <div>{{ clas.location.address }}</div>
              </v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-responsive>

        <v-card-actions>
          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn icon @click="toggleFavourite(clas.id)">
            <v-icon v-if="clas.favourite" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>mdi-calendar-today</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>

    <!-- @todo Add copywriting for users to join classes if they have no upcoming classes -->
    <v-responsive v-else>
      No Upcoming Classes.
    </v-responsive>
  </v-content>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MapImage from "@/components/MapImage";

export default {
  name: "upcoming",
  components: {
    MapImage
  },
  computed: {
    ...mapGetters("classes", ["upcomingClasses"])
  },
  methods: {
    ...mapActions("classes", ["toggleFavourite"])
  }
};
</script>

<style scoped></style>
