<template>
  <div class="col-md-4 col-12">
    <!-- <v-card outlined :to="{name: 'bookings'}"> -->
    <v-card outlined text>
      <v-list-item>
        <v-avatar color="#0277BD">
          <v-icon color="white">
            mdi-currency-usd-circle-outline
          </v-icon>
        </v-avatar>

        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            {{ points }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ label }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "bookings-card",
  props: ["label", "points"],
};
</script>
