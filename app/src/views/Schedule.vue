<template>
  <v-content class="ClassDetails">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer></v-spacer>

      <!-- <h3 class="headline">{{ "clas.name" }}</h3> -->
      <h3>{{ "clas.name" }}</h3>

      <v-spacer></v-spacer>

      <!-- @todo Change this to show how many points you are left. Use a points icon component -->
      <v-btn icon>
        <v-icon>mdi-share</v-icon>
      </v-btn>
    </v-app-bar>

    <v-tabs v-model="tab" background-color="white" :icons-and-text="icons">
      <v-tabs-slider color="black"></v-tabs-slider>

      <v-tab v-for="i in tabs" :key="i" :href="`#tab-${i}`">
        Tab {{ i }}
      </v-tab>

      <v-tab-item v-for="i in tabs" :key="i" :value="'tab-' + i">
        <v-card flat tile>
          <v-card-text
            >{{ i }}
            <br />
            {{ text }}
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
