<template>
  <v-content id="AllClasses">
    <v-card
      v-for="clas in classes"
      :key="clas.id"
      class="class-card"
      @click="$router.push({ name: 'reviews', params: { classID: clas.id } })"
    >
      <v-img height="20em" class="class-image" :src="clas.pictureSources[0]" />

      <v-card-title class="title">
        {{ clas.name }}
        <v-spacer />

        <!-- @todo Put the points number here -->
        7
      </v-card-title>
    </v-card>
  </v-content>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AllClasses",
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all classes of partner
    this.$store.dispatch("classes/getAllClasses");
  },
  computed: {
    ...mapState("classes", ["classes"]),
  },
};
</script>

<style scoped>
#AllClasses {
  margin: 4em;
  margin-top: 2em;

  text-align: left;
}

.class-card {
  display: inline-block;

  margin-right: 4em;
}

.class-image {
  max-width: 26em;
}
</style>
