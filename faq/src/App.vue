<template>
  <v-app>
    <v-card flat fixed>
      <v-toolbar color="primary" dark extended flat>
        <v-toolbar-title>Class Express FAQ</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn to="/login" text>
          <span class="mr-2">Login</span>
        </v-btn>-->
      </v-toolbar>
    </v-card>
    <router-view />
    <v-footer color="primary lighten-1" padless fixed>
      <v-row justify="center" no-gutters>
        <v-spacer></v-spacer>
        <!-- Button that allows for one to raise support tickets -->
        <ContactUs />
        <!-- Links to our main website/portal -->
        <v-btn
          href="https://class-express.com/"
          target="_blank"
          color="white"
          text
          rounded
          class="my-2"
        >
          Portal
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <!-- Gets current year for show: 2020 - Class Express -->
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Class Express</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
// @ is an alias to /src
import ContactUs from "@/components/ContactUs.vue";

export default {
  name: "App",
  components: {
    ContactUs
  },
  data: () => ({
    sheet: false
  })
};
</script>
