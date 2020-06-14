<template>
  <!--
    Temporarily hiding all the words for the icons to make it more usable on smaller devices
  -->

  <v-bottom-navigation app height grow color="orange darken-3">
    <v-btn :to="{ name: 'home' }">
      <!-- <span>Home</span> -->
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'explore' }">
      <!-- <span>Explore</span> -->
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'favourites' }">
      <!-- <span>Favourites</span> -->
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'upcoming' }">
      <!-- <span>Upcoming</span> -->
      <v-icon>mdi-calendar-today</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'profile' }">
      <!-- <span>Profile</span> -->
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNavBar",
};
</script>
