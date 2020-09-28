<template>
  <v-main class="upcoming">
    <!-- <v-app-bar app color="orange lighten-1" flat dark> -->
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold">
        Upcoming Classes
      </v-toolbar-title>

      <v-spacer />
      <CameraBtn />
    </v-app-bar>

    <v-responsive v-if="upcomingClasses.length">
      <UpcomingClass
        v-for="(upcomingClass, i) in upcomingClasses"
        :key="i"
        :upcomingClass="upcomingClass"
      />
    </v-responsive>

    <!-- @todo Add copywriting for users to join classes if they have no upcoming classes -->
    <v-responsive v-else> No Upcoming Classes. </v-responsive>
  </v-main>
</template>

<script>
import UpcomingClass from "@/components/UpcomingClass";
import CameraBtn from "@/components/CameraBtn";
import unixseconds from "unixseconds";

export default {
  name: "upcoming",
  components: {
    UpcomingClass,
    CameraBtn,
  },
  created() {
    // @todo Might want to optimise this to not always get these values.
    this.$store.dispatch("classes/getUsersClasses");

    // getFavourites in case favourites.vue is not visited yet, to ensure we can correctly show if a upcoming class is favourited
    this.$store.dispatch("classes/getFavourites");
  },
  computed: {
    // Generate array of upcoming class Object(s) from an array of userClasses objects
    upcomingClasses() {
      const state = this.$store.state.classes;

      const nowTS = unixseconds();
      const userClasses = state.userClasses;
      // need to fix this, this runs the number of times the number of userClasses there are.... ridiculously stupid
      // Maybe is because the unixseconds value always changes?
      // console.log("running upcoming class agn", userClasses);

      // Filter for classes that have yet to start or are still running
      // Make a copy of the array with slice and reverse it as original array is ordered by descending startTime
      return (
        userClasses
          // optional chaining operator protects against undefined if clas object is not loaded yet.
          .filter((userClass) => state.classes[userClass.classID]?.length)
          .filter(
            (userClass) =>
              // Show upcoming class until the end of the class
              parseInt(userClass.startTime) +
                state.classes[userClass.classID].length * 60 >
              nowTS
          )
          .slice()
          .reverse()
      );
    },
  },
  watch: {
    // Watcher to load partner details of upcoming classes whenever upcomingClasses is loaded or updated
    upcomingClasses: {
      immediate: true,
      handler() {
        // console.log(
        //   "watcher",
        //   this.upcomingClasses.map(
        //     (clas) => this.$store.state.classes.classes[clas.classID]?.partnerID
        //   )
        // );

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
