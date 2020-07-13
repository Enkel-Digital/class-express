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
      <UpcomingClass
        v-for="(upcomingClass, i) in upcomingClasses"
        :key="i"
        :upcomingClass="upcomingClass"
      />
    </v-responsive>

    <!-- @todo Add copywriting for users to join classes if they have no upcoming classes -->
    <v-responsive v-else>
      No Upcoming Classes.
    </v-responsive>
  </v-content>
</template>

<script>
import UpcomingClass from "@/components/UpcomingClass";
import unixseconds from "unixseconds";

export default {
  name: "upcoming",
  components: {
    UpcomingClass,
  },
  created() {
    this.$store.dispatch("classes/getUsersClasses");
  },
  computed: {
    // Generate array of upcoming class Object(s) from an array of userClasses objects
    upcomingClasses() {
      const state = this.$store.state.classes;

      const nowTS = unixseconds();
      const userClasses = state.userClasses;

      // Alternate method is to do the filtering at an individual component level
      // return userClasses;
      // Then use directive below to determine if we should display class or not.
      // v-if (class.time < nowTS)

      // Make a copy of the array with slice and reverse it as original array is ordered by descending startTime
      return (
        userClasses.filter(
          (userClass) =>
            // Show upcoming class until the end of the class
            userClass.startTime + state.classes[userClass.classID].length * 60 >
            nowTS
        ) || []
      )
        .slice()
        .reverse();
    },
  },
  watch: {
    // Watcher to load partner details of upcoming classes whenever upcomingClasses is loaded or updated
    upcomingClasses: {
      immediate: true,
      handler() {
        this.$store.dispatch(
          "classes/getPartner",
          this.upcomingClasses.map(
            (clas) => this.$store.state.classes.classes[clas.classID]?.partnerID
          )
          // this.upcomingClasses.map((clas) => clas.partnerID)
          // need to somehow get partnerID from classID
        );
      },
    },
  },
};
</script>
