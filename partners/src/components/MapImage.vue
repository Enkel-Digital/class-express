<template>
  <!-- <v-img :src="clas.locationImage" @click="openMaps" /> -->
  <v-img :src="locationImage" @click="openMaps" />
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import createGMapsImg from "../store/module/classes/gMapsImage";

/**
 * @todo Optimize usage of props. Perhaps can do away with src and use classID to get src if not provided.
 * @todo Handle opening maps to native apps like Google Maps or Apple maps.
 */

export default {
  name: "map",
  props: ["src", "classID"],
  computed: {
    locationImage() {
      if (!this.src)
        return createGMapsImg(
          this.$store.state.classes.classes[this.classID].location.coordinates
        );
      else return this.src;
    },
    coordinates() {
      return this.$store.state.classes.classes[this.classID].location
        .coordinates;
    }
  },
  methods: {
    openMaps() {
      if (confirm("Open Maps?"))
        window.open(
          `https://www.google.com/maps/search/${this.coordinates}?hl=en`,
          "_blank"
        );
    }
  }
};
</script>
