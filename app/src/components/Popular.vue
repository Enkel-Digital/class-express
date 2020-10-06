<template>
  <v-sheet class="mx-auto" elevation="3">
    <h3 class="slider-title">Popular classes</h3>
    <v-slide-group class="pa-4">
      <v-slide-item v-for="classID in popularClasses" :key="classID">
        <!--
            Need an additional div to wrap around it to prevent the v-if from being false.
            Which is evaluated as not enough items in the slot, which causes the default slot not found issue.
            thus the div is always here, but the image will only be shown once the classes is loaded for the picture source.
         -->
        <div>
          <!--@todo
            Take the first pic of the array.
            Perhaps allow partners to have a seperate "thumbnail" picture
            something that is smaller in size, lower res, and square
          -->
          <v-img
            v-if="classes[classID]"
            :src="classes[classID].pictureSources"
            @click="
              $router.push({
                name: 'ClassDetails',
                params: { classID },
              })
            "
            height="24vw"
            width="24vw"
            style="margin: 0 2vw; border-radius: 0.3em"
          />
        </div>
      </v-slide-item>

      <!-- @todo Use a v-else, to only show when no classes are available -->
      <!-- <v-slide-item>
        <v-card
          v-for="n in 5"
          :key="n"
          :color="'grey lighten-1'"
          class="ma-4"
          height="6em"
          width="6em"
        />
      </v-slide-item> -->
    </v-slide-group>
  </v-sheet>
</template>

<script>
// @todo Support partners too

import { mapState } from "vuex";
import apiError from "@/store/utils/apiError";

export default {
  name: "Popular-Classes",

  created() {
    this.loadPopular();
  },

  data() {
    return {
      //   popularClasses: [],
      //   popularPartners: [],
      popularClasses: 5,
      popularPartners: 5,
    };
  },

  computed: {
    ...mapState("classes", ["classes", "partners"]),
  },

  methods: {
    loadPopular() {
      //   const response = api.get(`/popular/${this.$store.state.user.id}`);
      // @todo Remove this mock data and integrate with API
      const response = {
        success: true,
        classes: [1, 2, 3, 4],
        // classes: [], // For testing empty arrays
        partners: [1, 2, 3],
      };

      if (!response.success)
        return apiError(
          response,
          this.loadPopular,
          "Failed to load popular classes and partners."
        );

      this.$store.dispatch("classes/getClass", response.classes);
      this.$store.dispatch("classes/getPartner", response.partners);

      this.popularClasses = response.classes;
      this.popularPartners = response.partners;
    },
  },
};
</script>

<style scoped>
.slider-title {
  margin: 0.3em;
  margin-bottom: 0em;
  /* Somehow this margin is the sheet margin from the image carousel */
  margin-top: 1em;

  font-size: 1.3em;
  font-weight: bold;
}
</style>
