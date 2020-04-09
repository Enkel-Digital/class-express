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
          <!-- @todo Display none if image cant be loaded -->
          <img alt="Avatar" :src="user.imageSrc" />
        </v-avatar>
      </v-list-item>
    </v-responsive>

    <PointsCard />
    <br />

    <v-divider></v-divider>
    <v-responsive class="mx-auto">
      <v-card :to="{ name: 'settings' }" ripple tile>
        <v-list-item>
          Settings
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'subscription' }" ripple tile>
        <v-list-item>
          Subscription Plan
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'favourites' }" ripple tile>
        <v-list-item>
          Favourite classes
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'PastClasses' }" ripple tile>
        <v-list-item>
          Past classes
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'faq' }" style="text-align: left;" ripple tile>
        <v-list-item>
          <v-list-item-content>
            <p class="overline">Want to learn more?</p>

            <v-list-item-subtitle>
              Checkout our F.A.Q page for more details!
            </v-list-item-subtitle>
          </v-list-item-content>
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
import PointsCard from "@/components/PointsCard";
import { mapState } from "vuex";

export default {
  name: "profile",
  components: {
    PointsCard
  },
  computed: mapState(["user"]),
  methods: {
    logout,
    refreshData() {
      // Rely on the store to update the data asynchronously in the background
      this.$store.dispatch("init");
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
</style>
