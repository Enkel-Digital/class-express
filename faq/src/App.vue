  <template>
  <v-app>
    <v-card flat>
      <v-toolbar color="primary" dark extended flat>
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        <v-toolbar-title>Class Express FAQ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn to="/login" text>
          <span class="mr-2">Login</span>
        </v-btn>

        <v-btn href="https://class-express.com/" target="_blank" text>
          <span class="mr-2">Class Express</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
