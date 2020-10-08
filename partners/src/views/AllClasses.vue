<template>
  <v-main id="AllClasses">
    <masonry
      :cols="{ default: 5, 1000: 3, 700: 2, 400: 1 }"
      :gutter="{ default: '0.5em', 700: '0.25em' }"
    >
      <v-card
        v-for="clas in classes"
        :key="clas.id"
        class="class-card"
        @click="
          $router.push({
            name: routeName,
            params: { classID: clas.id },
          })
        "
        outlined
      >
        <v-img class="class-image" :src="clas.pictureSources" />

        <v-list-item one-line dense>
          <v-list-item-content>
            <div>{{ clas.name }}</div>
            <!-- <v-list-item-subtitle>{{ 7 }}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </masonry>
  </v-main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "AllClasses",
  props: {
    routeName: {
      default: "ClassDetails",
    },
  },
  created() {
    this.$store.dispatch("classes/getPartnerClasses");
  },
  computed: mapState("classes", ["classes"]),
};
</script>

<style scoped>
#AllClasses {
  margin: 2em;
  margin-top: 2em;
}

.class-card {
  display: inline-block;
  margin-bottom: 0.5em;
}

.class-image {
  max-width: 20em;
  max-height: 17em;
}
</style>
