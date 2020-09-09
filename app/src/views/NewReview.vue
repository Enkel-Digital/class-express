<template>
  <v-main class="reviews">
    <!-- Allow user to skip review with exit to Home -->
    <v-row class="mt-2">
      <v-col cols="1">
        <v-btn :to="{ name: 'home' }" text x-small>
          <v-icon large color="#625B5A">mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <br />

    <v-avatar size="90">
      <v-img id="class-image" :src="clas.pictureSources[0]" />
    </v-avatar>

    <hr style="height: 15pt; visibility: hidden" />
    <h2 style="color: #403d3d">{{ clas.name }}</h2>
    <p style="font-size: 75%; color: #625b5a">How do you like the class?</p>

    <v-rating
      v-model="ratings"
      background-color="orange lighten-3"
      color="orange"
      large
    />

    <v-textarea
      v-autofocus
      type="text"
      v-model="description"
      filled
      rows="4"
      placeholder="Tell us more!"
      no-resize
    />

    <v-btn
      @click="
        saveNewReview({
          classID,
          ratings,
          description,
        })
      "
      outlined
      color="#F6B44E"
      block
    >
      submit
    </v-btn>
  </v-main>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "reviews",
  props: ["classID"],
  data() {
    const clas = this.$store.state.classes.classes[this.classID];

    return {
      clas,
      ratings: undefined,
      description: "",
    };
  },
  methods: {
    saveNewReview() {
      this.$store.dispatch("classes/saveNewReview", ...arguments);
      this.$router.push({ name: "home" });
    },
  },
};
</script>
