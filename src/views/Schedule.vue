<template>
  <v-content class="ClassDetails">
    <!-- <v-app-bar app color="white" flat fixed> -->
    <v-app-bar app color="orange" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <!-- @todo Implement PWA sharing and web share target code  -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </v-app-bar>

    <v-tabs
      v-model="tab"
      background-color="orange"
      dark
      :icons-and-text="icons"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        Tab {{ i }}
        <v-icon v-if="icons">mdi-phone</v-icon>
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text>{{ text }}</v-card-text>
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
    this.$store.dispatch("classes/getSchedule", this.classID);
  },
  props: ["classID"],
  data() {
    // Classes is static via the data function as we do not want its reactivity
    // const clas = this.$store.state.classes.classes[this.classID];
    // return { clas };

    return {
      tab: null,
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore.",
      icons: false,
      tabs: 3
    };
  },
  computed: {},
  methods: {
    ...mapMutations("classes", ["selectSchedule"])
  }
};
</script>

<style scoped></style>
