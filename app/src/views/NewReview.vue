<template>
  <v-content class="reviews">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>{{ clas.name }}</v-toolbar-title>
    </v-app-bar>

    <br />
    <v-avatar size="100">
      <v-img id="class-image" :src="clas.pictureSources[0]" />
    </v-avatar>

    <v-rating
      v-model="ratings"
      background-color="orange lighten-3"
      color="orange"
      medium
    />

    <v-textarea
      solo
      v-autofocus
      type="text"
      v-model="description"
      placeholder="How was the class?"
      required
    />

    <v-btn
      @click="
        saveNewReview({
          classID,
          ratings,
          description
        })
      "
      color="primary"
      >submit</v-btn
    >
  </v-content>
</template>

<script>
import BackBtn from "@/components/BackBtn";
import { mapActions } from "vuex";

export default {
  name: "reviews",
  components: {
    BackBtn
  },
  props: ["classID"],
  data() {
    const clas = this.$store.state.classes.classes[this.classID];

    return {
      clas,
      ratings: undefined,
      description: ""
    };
  },
  methods: {
    ...mapActions("classes", ["saveNewReview"])
  }
};
</script>
