<template>
  <v-content id="AllClasses">
    <v-row>
      <v-col>
        <v-card
          v-for="clas in classes"
          :key="clas.id"
          class="class-card"
          @click="
            $router.push({
              name: 'ClassDetails',
              params: { classID: clas.id },
            })
          "
        >
          <v-img
            max-height="120"
            class="class-image"
            :src="clas.pictureSources[0]"
          />

          <v-card-title class="title pa-2">
            {{ clas.name }}

            <v-spacer />

            <!-- @todo Put the points number here -->
            7
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
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
  margin: 2em;
  margin-top: 2em;

  text-align: left;
}

.class-card {
  display: inline-block;
  margin-right: 2em;
  margin-bottom: 2em;
}

.class-image {
  max-width: 17em;
}
</style>
