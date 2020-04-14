<template>
  <v-content class="reviews">
    <v-app-bar app color="orange lighten-1" flat dark fixed>
      <BackBtn />
      <v-toolbar-title>{{ clas.name }}</v-toolbar-title>
    </v-app-bar>

    <br />
    <br />
    <v-avatar size="90">
      <v-img id="class-image" :src="clas.pictureSources[0]" />
    </v-avatar>
    <hr style="height:15pt; visibility:hidden;" />
    <h2 style="color:#403D3D;">{{ clas.name }}</h2>

    <p style="font-size:75%; color:#625B5A;">How do you like the class?</p>

    <v-rating
      v-model="ratings"
      background-color="orange lighten-3"
      color="orange"
      size="30"
    />

    <v-textarea
      v-autofocus
      type="text"
      v-model="description"
      filled
      rows="2"
      placeholder="Tell us more!"
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
      outlined
      block
      color="#F6B44E"
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
