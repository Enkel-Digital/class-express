<template>
  <v-content class="home">
    <v-responsive>
      <!-- The carousel of images / latest news -->
      <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in bannerImages"
          :key="i"
          :src="item.src"
        >
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-1">{{ item.text }}</div>
            <!-- Perhaps move the text to the delimiter -->
          </v-row>
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
      <v-slide-group v-model="model" class="pa-4" :show-arrows="true">
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
      <v-slide-group v-model="model" class="pa-4" :show-arrows="true">
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
export default {
  name: "home",
  data() {
    return {
      model: null,
      bannerImages: [
        {
          src: "https://enkeldigital.com/images/hero.jpg",
          text: "Checkout our company", // Optional text
          link: "http://enkeldigital.com/"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
          text: "Our latest articles",
          link: "http://enkeldigital.com/"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
