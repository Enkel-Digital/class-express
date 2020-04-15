<template>
  <div class="col-md-4 col-12">
    <!-- <v-card outlined :to="{name: 'bookings'}"> -->
    <v-card outlined text>
      <v-list-item>
        <v-avatar color="indigo">
          <v-icon color="white">
            mdi-view-dashboard
          </v-icon>
        </v-avatar>

        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            {{ "2069" }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ "Points Earned This Week" }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "bookings-card"
};
</script>
