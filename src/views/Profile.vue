<template>
  <v-main id="profile">
    <v-app-bar app flat color="white">
      <v-toolbar-title style="font-weight: bold; color: orange">
        <!-- <v-toolbar-title style="font-weight: bold; color: grey;"> -->
        Profile
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon @click="refreshData">
        <v-icon>mdi-reload</v-icon>
      </v-btn>

      <!-- @todo Icon to trigger user QR code for attendance taking -->
      <!-- <v-btn icon>
        <v-icon>mdi-qrcode</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-responsive>
      <v-list-item id="user-details-card">
        <v-list-item-content>
          <h3>{{ user.firstName }}</h3>
          <p>{{ user.email }}</p>
        </v-list-item-content>

        <v-avatar v-if="user.imageSrc">
          <!-- Profile pic here. Load image asynchronously from server during login -->
          <!-- @todo Display none if image cant be loaded -->
          <!-- If there is no image, like if is a new user, show a clickable button to upload a profile picture. -->
          <img alt="Avatar" :src="user.imageSrc" />

          <!-- <v-file-input
            :rules="avatarRules"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            style="opacity: 0;"
          /> -->
        </v-avatar>

        <v-avatar v-else color="primary">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
      </v-list-item>
    </v-responsive>

    <PointsCard />
    <br />

    <v-divider />
    <v-responsive class="mx-auto">
      <v-card :to="{ name: 'settings' }" ripple tile>
        <v-list-item> Settings </v-list-item>
      </v-card>

      <v-card :to="{ name: 'subscription' }" ripple tile>
        <v-list-item> Subscription Plan </v-list-item>
      </v-card>

      <v-card :to="{ name: 'favourites' }" ripple tile>
        <v-list-item> Favourites </v-list-item>
      </v-card>

      <!-- @todo Complete pastClasses view -->
      <!-- <v-card :to="{ name: 'PastClasses' }" ripple tile> -->
      <v-card @click="workInProgressAlert" ripple tile>
        <v-list-item> Past classes </v-list-item>
      </v-card>

      <!-- @todo Add link once faq is completed -->
      <!-- <v-card :to="{ name: 'faq' }" ripple tile> -->
      <v-card @click="workInProgressAlert" ripple tile>
        <v-list-item>
          <v-list-item-content>
            <p class="overline">Want to learn more?</p>

            <v-list-item-subtitle>
              Checkout our F.A.Q page for more details!
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card :to="{ name: 'about' }" ripple tile>
        <v-list-item>
          <v-list-item-subtitle> About us </v-list-item-subtitle>
        </v-list-item>
      </v-card>

      <v-card ripple tile>
        <v-list-item @click="logout" style="background-color: #ededed">
          Logout
        </v-list-item>
      </v-card>
    </v-responsive>
  </v-main>
</template>

<script>
import logout from "@/controllers/logout";
import PointsCard from "@/components/PointsCard";
import { mapState } from "vuex";

export default {
  name: "profile",
  components: {
    PointsCard,
  },
  computed: mapState(["user"]),
  data() {
    return {
      // Rules for the avatar image upload
      avatarRules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
    };
  },
  methods: {
    logout,
    // @todo Remove before beta
    refreshData() {
      // Clear storage mediums used for data storage by "vuex-persistedstate" plugin
      // for debugging only
      localStorage.clear();
      sessionStorage.clear();

      // Rely on the store to update the data asynchronously in the background
      this.$store.dispatch("init");
    },
    workInProgressAlert() {
      alert("Feature in progress! Check back in beta maybe?");
    },
  },
};
</script>

<style scoped>
#profile {
  text-align: left;
}

#user-details-card {
  margin: 1em;
  margin-top: 0em;
}
</style>
