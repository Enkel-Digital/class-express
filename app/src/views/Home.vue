<template>
  <v-content class="home">
    <v-responsive>
      <!-- The carousel of images / latest news -->
      <v-carousel
        cycle
        continuous
        height="400"
        hide-delimiter-background
        :show-arrows="false"
      >
        <v-carousel-item
          :ripple="false"
          v-for="(item, i) in newsBanners"
          :key="i"
          :src="item.src"
          @click="viewBanner(item.link)"
          contain
        >
          <h1 style="position:absolute;bottom:1em;">
            {{ item.text }}
          </h1>
        </v-carousel-item>
      </v-carousel>
    </v-responsive>

    <v-divider></v-divider>

    <v-sheet
      id="recommended-classes-sheet"
      class="mx-auto"
      elevation="8"
      max-width="800"
    >
      Recommended classes
      <v-slide-group v-model="model" class="pa-4">
        <v-slide-item
          v-for="n in 5"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="'grey lighten-1'"
            class="ma-4"
            height="100"
            width="100"
            @click="toggle"
          >
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>

    <br />

    <v-sheet
      id="explore-classes-sheet"
      class="mx-auto"
      elevation="8"
      max-width="800"
    >
      Explore classes
      <v-slide-group v-model="model" class="pa-4">
        <v-slide-item
          v-for="n in 5"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="'grey lighten-1'"
            class="ma-4"
            height="100"
            width="100"
            @click="toggle"
          >
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>

    <br />

    <p>Invite your friends to start learning new skills together!</p>
  </v-content>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      lastViewdBanner_tmp: undefined,
      model: null
    };
  },
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate list of news banners
    // @todo remove and call all init actions in main.js or perhaps after login/signup
    this.$store.dispatch("news/init");
  },
  computed: {
    ...mapState("news", ["newsBanners"])
  },
  methods: {
    viewBanner(link) {
      if (!link) return;

      // @todo Fix this hack that prevents double click
      console.log("clcked", link);
      if (this.lastViewdBanner_tmp === link) return;
      this.lastViewdBanner_tmp = link;

      if (confirm("Checkout link?")) window.open(link);
    }
  }
};
</script>
