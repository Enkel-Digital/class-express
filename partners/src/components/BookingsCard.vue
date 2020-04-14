<template>
  <div class="col-md-4 col-12">
    <!-- <v-card outlined :to="{name: 'bookings'}"> -->
    <v-card outlined text>
      <v-list-item>
        <v-icon color="red">
          mdi-heart
        </v-icon>

        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            {{ "18" }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ "Bookings Confirmed" }}
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
