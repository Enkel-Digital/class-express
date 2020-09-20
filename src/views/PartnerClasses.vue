<template>
  <v-main style="padding: 0">
    <v-app-bar app color="white" flat fixed>
      <BackBtn />

      <v-spacer />

      <h3>{{ name }}</h3>
      <v-spacer />
      <v-spacer />
    </v-app-bar>

    <!-- @todo Remove and somehow fix the missing margin issue with app bars -->
    <br />
    <br />
    <br />

    <v-responsive v-if="classIDs.length">
      <v-card
        v-for="classID in classIDs"
        :key="classID"
        class="mx-auto mb-4"
        max-width="calc(100% - 1.6em)"
        outlined
        :ripple="false"
      >
        <div
          v-if="classes[classID]"
          :set="(clas = classes[classID])"
          @click="
            $router.push({
              name: 'ClassDetails',
              params: { classID: classID },
            })
          "
        >
          <!-- @todo Update API to return an array from DB and Change to a image carousel -->
          <!-- <v-img id="class-image" :src="clas.pictureSources[0]" /> -->
          <v-img id="class-image" :src="clas.pictureSources" />

          <v-list-item>
            <div style="text-align: left">
              <v-card-title class="headline pl-0">
                {{ clas.name }}
              </v-card-title>
              <!-- @todo Add a points box beside the class name -->
              <!-- <p>7 points</p> -->

              <div>
                <!-- Show either the custom location of the class or the default location which is the partner's location-->
                {{ clas.location_address || partnerAddress }}
              </div>
            </div>
          </v-list-item>
        </div>

        <v-card-actions>
          <v-spacer />

          <!-- Using classID instead of clas.id because this is outside of the div where "clas" property is set -->
          <v-btn icon @click="toggleFavouriteClass(classID)">
            <v-icon v-if="isFavourite(classID)" color="red">mdi-heart</v-icon>
            <v-icon v-else>mdi-heart-outline</v-icon>
          </v-btn>

          <!-- @todo Extract out all share buttons to a common component -->
          <!-- @todo Implement PWA sharing and web share target code  -->
          <v-btn icon>
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-responsive>

    <!-- @todo Add copywriting for partners that have no public classes yet -->
    <v-responsive v-else>
      Partner does not have any classes currently.
    </v-responsive>

    <!-- @todo Remove and somehow fix the missing margin issue with bottom navigation bars -->
    <br />
    <br />
  </v-main>
</template>

<script>
/*
  - Allow users to filter by tags
*/

import { mapState, mapActions } from "vuex";
import BackBtn from "@/components/BackBtn";

export default {
  name: "partner-classes",
  components: {
    BackBtn,
  },

  props: ["partnerID"],
  created() {
    // Use getClass to load class details for all the classes of this partner
    this.$store.dispatch("classes/getClass", this.classIDs);
  },
  data() {
    return {
      name: this.$store.state.classes.partners[this.partnerID].name,
      partnerAddress: this.$store.state.classes.partners[this.partnerID]
        .location_address,
    };
  },
  computed: {
    // Return the array of classIDs of the partner
    classIDs() {
      return this.$store.state.classes.partners[this.partnerID].classes;
    },
    ...mapState("classes", ["classes"]),
  },
  methods: {
    ...mapActions("classes", ["toggleFavouriteClass"]),
    // @todo Optimize this, as this is ran for every single class in the array when any one of the value is clicked/changed
    isFavourite(classIdToCheck) {
      console.log("check running gor", classIdToCheck);
      return this.$store.state.classes.favouriteClassesIDs.find(
        (classID) => classID === classIdToCheck
      );
    },
  },
};
</script>
