<template>
  <v-main class="favourite">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold">Favourites</v-toolbar-title>

      <v-spacer />

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->

      <!-- Use slot to place tabs on the next line -->
      <template v-slot:extension>
        <!--
          Does not require an active item. Using v-tab with router navigation
          Using replace attribute to use vue router replace when switching between tabs
        -->
        <v-tabs v-model="tab" centered grow>
          <v-tab replace append>Partners</v-tab>
          <v-tab replace append>Classes</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <br />

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <FavouritePartners />
      </v-tab-item>

      <v-tab-item>
        <FavouriteClasses />
      </v-tab-item>
    </v-tabs-items>
  </v-main>
</template>

<script>
import FavouriteClasses from "@/components/favourites/Classes.vue";
import FavouritePartners from "@/components/favourites/Partners.vue";

export default {
  name: "favourites",
  components: {
    FavouriteClasses,
    FavouritePartners,
  },
  data() {
    return {
      // By default show the classes tab on the left
      tab: 1,
    };
  },
};
</script>
