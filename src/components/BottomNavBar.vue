<template>
  <!-- Bottom navigation bar stays the same across the screens -->
  <v-bottom-navigation app height>
    <v-btn :to="{ name: 'home' }">
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'explore' }">
      <span>Explore</span>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'favourites' }">
      <span>Favourites</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'upcoming' }">
      <span>Upcoming</span>
      <v-icon>mdi-calendar-today</v-icon>
    </v-btn>

    <v-btn :to="{ name: 'profile' }">
      <span>Profile</span>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNavBar",
};
</script>
