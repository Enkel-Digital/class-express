<template>
  <v-main class="home">
    <v-responsive>
      <!-- The carousel of images / latest news -->
      <!-- @todo https://vuetifyjs.com/en/components/aspect-ratios/ -->
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
          @click.prevent="true"
          @submit.prevent="true"
          contain
        >
          <!-- @click="viewBanner(item.link)"
              try wrapping item in empty div and assign this instead of on the carousel item -->
          <h1 style="position: absolute; bottom: 1em">
            {{ item.text }}
          </h1>
        </v-carousel-item>
      </v-carousel>
    </v-responsive>

    <v-divider />

    <v-sheet id="recommended-classes-sheet" class="mx-auto" elevation="3">
      Recommended classes
      <v-slide-group class="pa-4">
        <v-slide-item
          v-for="n in 5"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="'grey lighten-1'"
            class="ma-4"
            height="6em"
            width="6em"
            @click="toggle"
          >
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>

    <br />

    <v-sheet id="explore-classes-sheet" class="mx-auto" elevation="3">
      Explore classes
      <v-slide-group class="pa-4">
        <v-slide-item
          v-for="n in 5"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-card
            :color="'grey lighten-1'"
            class="ma-4"
            height="6em"
            width="6em"
            @click="toggle"
          >
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>

    <br />

    <p>Invite your friends to start learning new skills together!</p>
  </v-main>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "home",
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate list of news banners
    // @todo remove and call all init actions in main.js or perhaps after login/signup
    this.$store.dispatch("news/init");
  },
  computed: {
    ...mapState("news", ["newsBanners"]),
  },
  methods: {
    viewBanner(link) {
      if (!link) return;

      // // @todo Fix this hack that prevents double click
      // console.log("testing");
      // console.log("clcked", link);
      // if (this.lastViewdBanner_tmp === link) return;
      // this.lastViewdBanner_tmp = link;

      if (confirm("Checkout link?")) window.open(link);
    },
  },
};
</script>
