<template>
  <!-- The carousel of images / latest news -->
  <!--
    Height auto as different devices will have different width,
    which will mess up the aspect ratio if using fixed height.
    
    However the pictures are resized to the same height and aspect ratio to prevent
    bottom content from going up and down when scrolling through the carousel.
    
    height="auto"
  -->
  <v-carousel
    height="35vh"
    cycle
    continuous
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
</template>

<script>
export default {
  name: "NewsBanners",

  // @todo Can this be, beforeCreate?
  created() {
    this.loadNewsBanners();
  },

  data() {
    return { newsBanners: [] };
  },

  methods: {
    loadNewsBanners() {
      // @todo Replace this mock data with API integration
      this.newsBanners = [
        {
          src:
            "https://firebasestorage.googleapis.com/v0/b/classes-ekd.appspot.com/o/LEARN%20CODING.jpg?alt=media&token=a42abd4e-14a7-48f6-9057-ba1c78bca9f1",
          text: "Learn coding now",
          link: "http://enkeldigital.com/",
        },
        {
          src:
            "https://firebasestorage.googleapis.com/v0/b/classes-ekd.appspot.com/o/Red%20Motivational%20Blog%20img.jpg?alt=media&token=383669cf-b96b-43f7-8773-535552666e8a",
          text: "Learn Guitar",
          link: "",
        },
        {
          src: "https://enkeldigital.com/images/hero.jpg",
          text: "Checkout our sponsors", // Optional text
          link: "http://enkeldigital.com/",
        },
        {
          src: "https://miro.medium.com/max/968/1*BWh2pt4DkcFUMznsWHBn0A.png",
          text: "Read our latest articles!",
          link: "https://medium.com/enkel-digital",
        },
      ];
    },

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
