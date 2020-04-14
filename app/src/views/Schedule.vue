<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <h3>{{ className }}</h3>

      <v-spacer></v-spacer>

      <!-- @todo Change this to show how many points you are left. Use a points icon component -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </v-app-bar>

    <v-tabs v-model="dateTab" background-color="white">
      <v-tabs-slider color="black"></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        {{
          moment
            .utc()
            .add(i - 1, "days")
            .startOf("day")
            .format("ddd") +
            " " +
            moment
              .utc()
              .add(i - 1, "days")
              .startOf("day")
              .format("D")
        }}
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text>
            {{ i }}
            <br />
            <!-- {{
              moment
                .utc()
                .startOf("day")
                .format("L")
            }} -->

            {{
              moment
                .utc()
                .add(i - 1, "days")
                .startOf("day")
                .format("ddd") +
                " " +
                moment
                  .utc()
                  .add(i - 1, "days")
                  .startOf("day")
                  .format("D")
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
    return {
      // Classes is static via the data function as we do not want its reactivity
      className: this.$store.state.classes.classes[this.classID].name,
      dateTab: null,
      tabs: 3
    };
  },
  computed: {
    schedule() {
      return this.$store.state.classes.schedule[this.classID];
    }
  },
  watch: {
    // Load schedule as user scrolls/swipes to view more
    dateCursor() {
      this.tabs.push(
        this.moment
          .utc()
          .add(1, "days")
          .startOf("day")
          .format("ddd") +
          " " +
          this.moment
            .utc()
            .add(1, "days")
            .startOf("day")
            .format("D")
      );
    }
  },
  methods: {
    ...mapMutations("classes", ["selectSchedule"])
  }
};
</script>

<style scoped></style>
