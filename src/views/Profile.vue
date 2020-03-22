<template>
  <v-content class="profile">
    <v-app-bar app color="orange lighten-1" flat dark>
      <v-toolbar-title>Profile</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="refreshData">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-app-bar>

    <v-responsive>
      <v-list-item id="user-details-card">
        <v-list-item-content>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
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

    <v-card id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Points</p>

          <v-list-item-subtitle>
            Period ends on: {{ points.pointsPeriod.end }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ points.left }} / {{ points.total }} points left
          </v-list-item-title>
        </v-list-item-content>

        <v-btn :to="{ name: 'topup' }" color="primary">Add!</v-btn>
      </v-list-item>
    </v-card>

    <br />

    <v-divider></v-divider>
    <v-responsive class="mx-auto">
      <v-card :to="'/settings'" ripple tile>
        <v-list-item>
          Settings
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'subscription' }" ripple tile>
        <v-list-item>
          Subscription Plan
        </v-list-item>
      </v-card>

      <v-card :to="'/favourite-classes'" ripple tile>
        <v-list-item>
          Favourite classes
        </v-list-item>
      </v-card>

      <v-card :to="'/past-classes'" ripple tile>
        <v-list-item>
          Past classes
        </v-list-item>
      </v-card>

      <v-card ripple tile>
        <v-list-item @click="logout" style="background-color: #ededed;">
          Logout
        </v-list-item>
      </v-card>
    </v-responsive>
  </v-content>
</template>

<script>
import logout from "@/controllers/logout";
import { mapState } from "vuex";

export default {
  name: "profile",
  computed: mapState(["user", "points"]),
  methods: {
    logout,
    refreshData() {
      // Rely on the store to update the data asynchronously in the background
      this.$store.dispatch("getUserDetails");
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
