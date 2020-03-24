<template>
  <!-- Bottom navigation bar stays the same across the screens -->
  <v-bottom-navigation app height>
    <v-btn to="/">
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn to="/explore">
      <span>Explore</span>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn to="/favourites">
      <span>Favourites</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn to="/upcoming">
      <span>Upcoming</span>
      <v-icon>mdi-calendar-today</v-icon>
    </v-btn>

    <v-btn to="/profile">
      <span>Profile</span>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: "BottomNavBar"
};
</script>
