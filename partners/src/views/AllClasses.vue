<template>
  <v-content id="AllClasses">
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
            name: 'ClassDetails',
            params: { classID: clas.id },
          })
        "
        outlined
      >
        <v-img class="class-image" :src="clas.pictureSources" />

        <v-list-item one-line dense>
          <v-list-item-content>
            <div v-resize-text>{{ clas.name }}</div>
            <!-- <v-list-item-subtitle>{{ 7 }}</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </masonry>
  </v-content>
</template>

<script>
import api from "../store/utils/fetch";

export default {
  name: "AllClasses",
  data() {
    return {
      classes: [],
    };
  },
  directives: {
    ResizeText: () => import("vue-resize-text"),
  },
  props: {
    partnerID: {
      default: 1,
      type: Number,
    },
  },
  created() {
    this.getAllClasses();
  },
  methods: {
    async getAllClasses() {
      this.classes = (
        await api.get(`/class/details/of/${this.partnerID}`)
      ).class;
    },
  },
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
