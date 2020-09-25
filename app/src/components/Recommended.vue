<template>
  <v-sheet class="mx-auto" elevation="3">
    <h3 class="slider-title">Recommended classes</h3>
    <v-slide-group class="pa-4">
      <v-slide-item v-for="classID in recommendedClasses" :key="classID">
        <!-- v-slot:default="{ active, toggle }" -->
        <!-- @todo Take the first pic of the array 
            @todo Perhaps allow partners to have a seperate "thumbnail" picture
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
import { mapState } from "vuex";
import apiError from "@/store/utils/apiError";

export default {
  name: "Recommended-Classes",

  created() {
    this.loadRecommended();
  },

  data() {
    return {
      //   recommendedClasses: [],
      //   recommendedPartners: [],
      recommendedClasses: 5,
      recommendedPartners: 5,
    };
  },

  computed: {
    ...mapState("classes", ["classes", "partners"]),
  },

  methods: {
    loadRecommended() {
      //   const response = api.get(`/recommended/${this.$store.state.user.id}`);
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
          this.loadRecommended,
          "Failed to load recommended classes and partners."
        );

      this.$store.dispatch("classes/getClass", response.classes);
      this.$store.dispatch("classes/getPartner", response.partners);

      this.recommendedClasses = response.classes;
      this.recommendedPartners = response.partners;
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
