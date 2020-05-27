<template>
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
  name: "gMap",
  props: ["src", "classID"],
  computed: {
    coordinates() {
      // If image src is specified, ignore coordinates calculation
      if (this.src) return;

      const clas = this.$store.state.classes.classes[this.classID];

      // Use the partner's location if there is no custom class location set
      return clas.location
        ? clas.location.coordinates
        : this.$store.state.classes.partners[clas.partnerID].location
            .coordinates;
    },
    locationImage() {
      // Only if src is not specified, create the image source link
      if (!this.src) {
        // Coordinates may not be calculated finish before this property is triggered
        if (!this.coordinates) return;
        else return createGMapsImg(this.coordinates);
      } else return this.src;
    },
  },
  methods: {
    openMaps() {
      if (confirm("Open Maps?"))
        window.open(
          `https://www.google.com/maps/search/${this.coordinates}?hl=en`,
          "_blank"
        );
    },
  },
};
</script>
