<template>
  <v-card
    v-if="clas"
    class="mx-auto mb-4"
    max-width="calc(100% - 1.6em)"
    outlined
    :ripple="false"
  >
    <MapImage :classID="clas.id" />

    <v-responsive
      @click="
        $router.push({
          name: 'ClassDetails',
          params: {
            classID: clas.id,
            selectedTime: upcomingClass.startTime,
          },
        })
      "
    >
      <v-list-item>
        <div style="text-align: left">
          <v-card-title class="headline pl-0">
            {{ clas.name }}
          </v-card-title>
          <!-- Only bold the time to make it more readable -->
          <v-list-item-subtitle style="font-weight: bold">
            <!--
            A few formats are used for showing the datetime of the class
            1) Today/Tomorrow + date + time
            1.1) Today/Tomorrow + date + year + time
            2) Day of the Week + date + time
            2.2) Day of the Week + date + year + time

            As seen above, since date and time are always shown,
            we spilt them out to reduce code duplication
            -->

            <!-- If class is today -->
            <span v-if="moment().isSame(dateObject, 'day')"> Today, </span>
            <!-- Else if class is tomorrow -->
            <span
              v-else-if="
                moment()
                  .add(moment.duration(1, 'd'))
                  .isSame(
                    dateObject.clone().add(moment.duration(1, 'd')),
                    'day'
                  )
              "
            >
              Tomorrow,
            </span>
            <!-- Else just show day of week -->
            <span v-else>
              {{ dateObject.format("dddd, ") }}
            </span>

            <!-- Date -->
            {{ dateObject.format("D MMM") }}

            <!-- Show year only if class is next year -->
            <span v-if="moment().year() !== dateObject.year()">
              {{ dateObject.format("YYYY") }}
            </span>

            <br />
            <!-- Time -->
            {{ dateObject.format("h:mm a") }} -
            {{
              moment
                .unix(upcomingClass.startTime)
                .add(clas.length, "minutes")
                .format("h:mm a")
            }}
          </v-list-item-subtitle>

          <br />

          <v-list-item-subtitle v-if="partner">
            <div style="font-weight: bold">
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
      <!-- @todo Extract out all share buttons to a common component -->
      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn icon @click="toggleFavouriteClass(clas.id)">
        <v-icon v-if="isFavourite" color="red"> mdi-heart </v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-calendar-today</v-icon>
      </v-btn>

      <!-- @todo Fix this UI, show it in a box or smth to indicate that this is points paid -->
      <div>{{ upcomingClass.points }}</div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
import MapImage from "@/components/MapImage";

export default {
  name: "upcoming",
  components: {
    MapImage,
  },
  props: ["upcomingClass"],
  computed: {
    dateObject() {
      return this.moment.unix(this.upcomingClass.startTime);
    },
    clas() {
      return this.$store.state.classes.classes[this.upcomingClass.classID];
    },
    partner() {
      // optional chaining operator to prevent failure when clas is still being loaded and is undefined
      return this.$store.state.classes.partners[this.clas?.partnerID];
    },
    isFavourite() {
      return this.$store.state.classes.favouriteClassesIDs.find(
        (classID) => classID === this.upcomingClass.classID
      );
    },
  },
  methods: {
    ...mapActions("classes", ["toggleFavouriteClass"]),
  },
};
</script>
