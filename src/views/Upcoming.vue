<template>
  <v-content class="upcoming">
    <!-- <v-app-bar app color="orange lighten-1" flat dark> -->
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold;">
        Upcoming Classes
      </v-toolbar-title>

      <v-spacer />

      <!-- @todo Icon to trigger attendance QR code scanner -->
      <v-btn icon>
        <v-icon>mdi-camera</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive v-if="upcomingClasses.length">
      <v-card
        v-for="clas in upcomingClasses"
        :key="clas.id"
        class="mx-auto mb-4"
        max-width="calc(100% - 1.6em)"
        outlined
        :ripple="false"
      >
        <MapImage :classID="clas.id" />

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

              <!-- Only bold the time to make it more readable -->
              <v-list-item-subtitle style="font-weight: bold;">
                <!--
                  A few formats are used for showing the datetime of the class
                  1) Today/Tomorrow + date + time
                  1.1) Today/Tomorrow + date + year + time
                  2) Day of the Week + date + time
                  2.2) Day of the Week + date + year + time

                  As seen above, since date and time are always shown,
                  we spilt them out to reduce code duplication
                -->

                <!-- If the class is today -->
                <span v-if="moment().isSame(moment(clas.time), 'day')">
                  Today,
                </span>
                <!-- Else, if the class is tomorrow -->
                <span
                  v-else-if="
                    moment()
                      .add(moment.duration(1, 'd'))
                      .isSame(
                        moment(clas.time).add(moment.duration(1, 'd')),
                        'day'
                      )
                  "
                >
                  Tomorrow,
                </span>
                <!-- Else just show day of the week -->
                <span v-else>
                  {{ moment(clas.time).format("dddd, ") }}
                </span>

                <!-- Date -->
                {{ moment(clas.time).format("D MMM") }}

                <!-- Show year only if class is next year -->
                <span v-if="moment().year() !== moment(clas.time).year()">
                  {{ moment(clas.time).format("YYYY") }}
                </span>

                <br />
                <!-- Time -->
                {{ moment(clas.time).format("h:mm a") }} -
                {{
                  moment(clas.time + Date.parse(clas.length)).format("h:mm a")
                }}
              </v-list-item-subtitle>

              <br />

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
          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>

          <v-spacer />

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
    ...mapActions("classes", ["toggleFavourite"]),
    getPartner(partnerID) {
      return this.$store.state.classes.partners[partnerID];
    }
  }
};
</script>

<style scoped></style>
