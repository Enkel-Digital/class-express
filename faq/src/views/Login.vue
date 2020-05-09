<template>
  <v-content>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Admin Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <!-- TODO: Make legit the login -->
              <v-form>
                <v-text-field label="Login" name="login" prepend-icon="mdi-account" type="text" />
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "login",
  props: {
    source: String
  }
};
</script>