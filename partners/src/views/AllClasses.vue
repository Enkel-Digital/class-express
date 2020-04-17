<template>
  <v-content id="AllClasses">
    <v-card
      v-for="clas in classes"
      :key="clas.id"
      class="class-card"
      @click="$router.push({ name: 'class', params: { classID: clas.id } })"
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
export default {
  name: "AllClasses",
  beforeMount() {
    // Using beforeMount hook to ensure this is ran again even if component is cached when navigating
    // Request store to get and populate all classes of partner
    this.$store.dispatch("classes/getAllClasses");
  },
  computed: {
    classes() {
      return [
        {
          id: 0,
          name: "Basic guitar",
          pictureSources: [
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
          ]
        },
        {
          id: 1,
          name: "Intermediate guitar",
          pictureSources: [
            "https://tmw.com.sg/wp-content/uploads/2019/10/how-to-sharpen-your-guitar-skills-by-taking-classes-870x460.jpg"
          ]
        },
        {
          id: 2,
          name: "Advance guitar",
          pictureSources: [
            "https://pickupmusic.com/wp-content/uploads/2020/01/Ichka-web-3-1775x2048.jpg"
          ]
        }
      ];
    }
  }
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
