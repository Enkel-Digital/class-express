<template>
  <v-content class="profile">
    <v-toolbar color="orange lighten-1" flat dark>
      <v-toolbar-title>Profile</v-toolbar-title>
    </v-toolbar>

    <v-responsive>
      <v-list-item id="user-details-card">
        <v-list-item-content>
          <h3>{{ name }}</h3>
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

    <v-card id="points-card" class="mx-auto" max-width="344" outlined>
      <v-list-item>
        <v-list-item-content>
          <p class="overline">Points</p>

          <v-list-item-subtitle>
            Period ends on: {{ periodEndDate }}
          </v-list-item-subtitle>

          <v-list-item-title class="headline mb-1">
            {{ pointsLeft }} / {{ totalPoints }} points left
          </v-list-item-title>
        </v-list-item-content>

        <v-btn color="primary">Add!</v-btn>
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

      <v-card :to="'/subscription'" ripple tile>
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

export default {
  name: "profile",
  data() {
    return {
      name: "JJ Lee",
      email: "JJ@enkeldigital.com",
      periodEndDate: "20 / 4 / 2020",
      pointsLeft: 20,
      totalPoints: 45
    };
  },
  methods: {
    logout
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
