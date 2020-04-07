<template>
  <!-- <v-img :src="clas.locationImage" @click="openMaps" /> -->
  <v-img :src="src" @click="openMaps" />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

/**
 * @todo Optimize usage of props. Perhaps can do away with src and use classID to get src if not provided.
 * @todo Handle opening maps to native apps like Google Maps or Apple maps.
 */

export default {
  name: "map",
  props: ["src", "classID"],
  computed: {
    coordinates() {
      return this.$store.state.classes.classes[this.classID].location
        .coordinates;
    }
  },
  methods: {
    openMaps() {
      if (confirm("Open Maps?"))
        window.open(
          `https://www.google.com.sa/maps/search/${this.coordinates}?hl=en`,
          "_blank"
        );
    }
  }
};
</script>
