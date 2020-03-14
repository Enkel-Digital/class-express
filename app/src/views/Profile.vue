<template>
  <v-content class="profile">
    <v-responsive>
      <v-list-item id="user-details-card">
        <v-list-item-content>
          <p>{{ name }}</p>
          <p>{{ email }}</p>
        </v-list-item-content>

        <v-avatar>
          <!-- Profile pic here. Load image asynchronously from server during login -->
          <img
            alt="Avatar"
            src="https://avatars2.githubusercontent.com/u/44993072?s=460"
          />
        </v-avatar>
      </v-list-item>
    </v-responsive>

    <v-divider></v-divider>

    <v-responsive class="ma-4">
      <v-btn class="ma-4">Settings</v-btn>

      <v-btn class="ma-4">Subscription Plan</v-btn>
    </v-responsive>

    <v-divider></v-divider>

    <v-card id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Points</p>

          <v-list-item-subtitle>
            Points period ends on: {{ periodEndDate }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ pointsLeft }} / {{ totalPoints }} points left
          </v-list-item-title>
        </v-list-item-content>

        <v-btn>Add!</v-btn>
      </v-list-item>
    </v-card>

    <v-divider></v-divider>

    <v-btn @click="logout">Logout</v-btn>
  </v-content>
</template>

<script>
import firebase from "firebase";

export default {
  name: "profile",
  data() {
    return {
      name: "JJ",
      email: "JJ@enkeldigital.com",
      periodEndDate: "20 / 4 / 2020",
      pointsLeft: 20,
      totalPoints: 45
    };
  },
  methods: {
    logout() {
      alert("You have now been logged out");

      // Signout current user and redirect to welcome page afterwards.
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.push({ name: "welcome" }));
    }
  }
};
</script>

<style scoped>
#user-details-card {
  text-align: left;
  margin: 1em;
  margin-top: 2em;
}

#points-card {
  text-align: left;
}
</style>
