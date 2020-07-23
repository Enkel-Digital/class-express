<template>
  <div>
    {{ partner }}
  </div>
</template>

<script>
import MapImage from "@/components/MapImage";
import api from "../store/utils/fetch";

export default {
  name: "PartnerProfile",
  components: {
    // MapImage,
  },
  props: ["partnerID"],
  data() {
    return { partner: undefined };
  },
  created() {
    this.getPartner();
  },
  methods: {
    async getPartner() {
      this.partner = (
        await api.get(`/partner/details/${this.partnerID}`)
      ).partner;
    },
  },
};
</script>

<style scoped>
#class-image-container {
  /*
    General height guidelines for the image loaded
    Max height is used to prevent the image being used to be too big
    Min height ensures image will not collapse on itself into the height of the back button
  */
  /* max-height: 80vh; */
  min-height: 100%;
}

/* Move image up to upper corners of screen, so back button is overlayed on top */
#class-image {
  display: block;
  position: absolute;
  top: 0vh;
  right: 0vw;

  /* Map image to height of entire parent div container */
  height: 100%;
}

#reviews-card {
  text-align: left;
}
</style>
