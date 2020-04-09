<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <!-- <h3 class="headline">{{ className }}</h3> -->
      <h3>{{ className }}</h3>

      <v-spacer></v-spacer>

      <!-- @todo Change this to show how many points you are left. Use a points icon component -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 

      always show loading icon the turning thing before we load the schedule in.
      Build something to load schedule like the getClass function.
      at the start load schedule for the first 3-5 days.
      then after that as user scrolls / swap tabs. We make sure that whatever tab number the user is on, 
      we have a buffer, of schedules about 3 days surrounding the original tab.

      so if user is on tab 1, we need to buffer to day 5 schedule.
      e.g.  if user is on tab 5, we need to at least have schedules of day "2 to 4" + 5 + "6 to 8"

     -->

    <v-tabs v-model="dateTab" background-color="white" :icons-and-text="icons">
      <v-tabs-slider color="black"></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        Tab {{ i }}
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text
            >{{ i }}
            <br />
            <!-- {{ text }} -->
            testing

            {{
              moment
                .utc()
                .startOf("day")
                .unix()
            }}
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-content>
</template>

<script>
import { mapMutations } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "ClassDetails",
  components: {
    BackBtn
  },
  created() {
    // Call action to fetch schedule of this class
    this.$store.dispatch("classes/getSchedule", { classID: this.classID });
  },
  props: ["classID"],
  data() {
    // Classes is static via the data function as we do not want its reactivity
    // const clas = this.$store.state.classes.classes[this.classID];
    // return { clas };

    return {
      dateTab: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore.",
      icons: false,
      tabs: 3
    };
  },
  computed: {
    className() {
      return this.$store.state.classes.classes[this.classID].name;
    },
    schedule() {
      return this.$store.state.classes.schedule[this.classID];
    }
  },
  watch() {
    // Load schedule as user scrolls/swipes to view more
  },
  methods: {
    ...mapMutations("classes", ["selectSchedule"])
  }
};
</script>

<style scoped></style>
