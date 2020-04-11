<template>
  <v-content class="reviews">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>{{ className }}</v-toolbar-title>
    </v-app-bar>

    <br />

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
          classID: classID,
          ratings: 4,
          description: description
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
    const className = this.$store.state.classes.classes[this.classID].name;
    return {
      className,
      description: ""
    };
  },
  methods: {
    ...mapActions("classes", ["saveNewReview"])
  }
};
</script>
